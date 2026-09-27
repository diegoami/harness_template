#!/usr/bin/env node
// worktrees.mjs — find detached, leftover and missing git worktrees, and
// remove only the ones it can prove are safe.
//
//   node utils/worktrees.mjs                     # this repository, dry run
//   node utils/worktrees.mjs ../ ../../clones    # folders of repositories
//   node utils/worktrees.mjs --clean ../         # run what the dry run showed
//
// Harness-only: no preset ships it and adoption does not write it (BACKLOG.md,
// C14). Each path is a repository (the top of any of its worktrees), a folder
// whose direct children are repositories, or both. Repositories are grouped
// by their common git dir, and every worktree git knows for each is listed,
// so a worktree outside every given path is still found.
//
// A dry run unless --clean is given: it prints the commands it would run and
// changes nothing, not even `git worktree prune`. It never passes --force,
// never deletes a branch or a file itself, never touches a worktree it keeps,
// and never fetches: origin/<default> is as last fetched. Git removes a
// worktree only through `git worktree remove`, which refuses a dirty or locked
// one on its own as well, but deletes ignored files: so an ignored file keeps
// a worktree here, unless it is regenerated output on the REBUILDABLE list
// (node_modules/, build/ and the like), which the dry run names instead.

import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, realpathSync, statSync } from "node:fs";
import path from "node:path";

// The caller's variables that locate a repository or inject configuration,
// the same list as tools/scaffold.mjs (BACKLOG.md, C13). A git hook exports
// them, and they override -C and the working directory, so every git this
// tool starts runs without them. Every other variable passes through. On
// Windows, where a variable's name has no case, the match ignores case.
const CALLER_GIT =
  /^GIT_(DIR|WORK_TREE|INDEX_FILE|COMMON_DIR|OBJECT_DIRECTORY|ALTERNATE_OBJECT_DIRECTORIES|PREFIX|CONFIG_PARAMETERS|CONFIG_COUNT|CONFIG_KEY_\d+|CONFIG_VALUE_\d+)$/;
const WIN = process.platform === "win32";
const CHILD_ENV = Object.fromEntries(
  Object.entries(process.env).filter(
    ([key]) => !CALLER_GIT.test(WIN ? key.toUpperCase() : key),
  ),
);

const VERDICTS = ["prune", "remove", "merged", "reattach", "main detached", "keep"];

// Names, indented, wrapped at 79 columns.
function wrapNames(names) {
  const lines = [];
  let line = " ";
  for (const n of names) {
    if (line.length + n.length + 1 > 79) {
      lines.push(line);
      line = " ";
    }
    line += ` ${n}`;
  }
  return [...lines, line].join("\n");
}

function printHelp() {
  console.log(`usage: node utils/worktrees.mjs [--clean] [--merged] [--reattach]
                                [--min-age <hours>] [--json] [<path>...]

Lists every worktree of the given repositories, with a verdict and its reason.
Each <path> is a repository (the top of any of its worktrees), a folder whose
direct children are repositories, or both; with none, the repository of the
current directory.

verdicts:
  prune          a missing worktree (its directory is gone): git worktree prune
  remove         a linked, detached, unlocked worktree with no change, no
                 untracked file, no ignored file off the rebuildable list
                 (below), no rebase, merge, cherry-pick, revert or bisect in
                 progress, no commit on no branch, tag or remote-tracking
                 ref, idle >= --min-age: git worktree remove <path>
  merged         the same on a branch merged into origin/<default>; removed
                 only with --merged, and the branch is kept
  reattach       a detached main checkout, clean, with nothing in progress,
                 whose HEAD is an ancestor of origin/<default>:
                 git switch <default>, only with --reattach
  main detached  a detached main checkout that is left, with the reason
  keep           everything else, with the reasons

options:
  --clean          run the commands; without it, a dry run that changes nothing
  --merged         also remove the worktrees of merged branches
  --reattach       also reattach a detached main checkout
  --min-age <h>    hours a worktree must be idle before removal (default 24)
  --json           print the same data as JSON
  -h, --help       this text

Rebuildable: an ignored entry with a path component named
${wrapNames([...REBUILDABLE])}
is regenerated output. Removal deletes it with the worktree, and the dry run
says so ("deletes rebuildable: ..."). The name decides, not the content. Any
other ignored file, such as a .env or a key, keeps the worktree.

It never fetches (origin/<default> is as last fetched), never passes --force,
and never deletes a branch or a file itself. Run the dry run first.`);
}

class UsageError extends Error {}

function usage(message) {
  throw new UsageError(message);
}

function parseArgs(argv) {
  const opts = {
    help: false,
    clean: false,
    merged: false,
    reattach: false,
    minAge: 24,
    json: false,
    paths: [],
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "-h" || a === "--help") opts.help = true;
    else if (a === "--clean") opts.clean = true;
    else if (a === "--merged") opts.merged = true;
    else if (a === "--reattach") opts.reattach = true;
    else if (a === "--json") opts.json = true;
    else if (a === "--min-age" || a.startsWith("--min-age=")) {
      const v = a === "--min-age" ? argv[++i] : a.slice("--min-age=".length);
      const n = Number(v);
      if (v === undefined || v === "" || !Number.isFinite(n) || n < 0)
        usage(`--min-age takes a number of hours, 0 or more (got ${v ?? "nothing"})`);
      opts.minAge = n;
    } else if (a.startsWith("-")) usage(`unknown option ${a}`);
    else opts.paths.push(a);
  }
  return opts;
}

// One git run, with the caller's git environment removed. --no-optional-locks
// keeps `git status` from refreshing the index, so a dry run writes nothing
// and does not reset the idle time it measures.
function git(cwd, args) {
  const r = spawnSync("git", ["--no-optional-locks", "-C", cwd, ...args], {
    encoding: "utf8",
    env: CHILD_ENV,
    maxBuffer: 64 * 1024 * 1024,
    windowsHide: true,
  });
  return {
    ok: r.status === 0,
    status: r.status,
    out: (r.stdout || "").replace(/\r?\n$/, ""),
    err: (r.stderr || (r.error ? String(r.error.message) : "")).trim(),
  };
}

// Git prints forward slashes, and on Windows a path's case does not matter.
function slash(p) {
  return path.resolve(p).replace(/\\/g, "/");
}
function key(p) {
  const s = slash(p).replace(/\/+$/, "");
  return WIN ? s.toLowerCase() : s;
}

function isDir(p) {
  try {
    return statSync(p).isDirectory();
  } catch {
    return false;
  }
}

// A child git cannot read that still looks like a repository or worktree is
// reported, never touched: for example a worktree whose repository is gone.
function unreadable(dir) {
  const dotgit = path.join(dir, ".git");
  if (existsSync(dotgit)) {
    let target = "";
    try {
      if (!isDir(dotgit)) target = readFileSync(dotgit, "utf8").trim();
    } catch {}
    return target
      ? `${slash(dir)}: its .git file says "${target}", which git cannot read (a worktree whose repository is gone?); left as is`
      : `${slash(dir)}: has a .git that git cannot read; left as is`;
  }
  return null;
}

// The repository at `dir`: its common dir, and whether `dir` is the top of
// one of its work trees or a git dir itself (`top`). Any directory inside a
// work tree resolves to that repository, so `top` tells a repository from a
// folder that merely sits in one. null when git finds no repository.
function repoAt(dir) {
  const r = git(dir, [
    "rev-parse",
    "--path-format=absolute",
    "--git-common-dir",
    "--is-inside-git-dir",
    "--is-bare-repository",
  ]);
  if (!r.ok) return null;
  const [commonDir, inGitDir, bare] = r.out.split(/\r?\n/).map((s) => s.trim());
  if (!commonDir) return null;
  if (inGitDir === "true" || bare === "true") return { commonDir, top: true, toplevel: commonDir };
  const t = git(dir, ["rev-parse", "--show-toplevel"]);
  const toplevel = t.ok ? t.out.trim() : "";
  let real = dir;
  try {
    real = realpathSync.native(dir);
  } catch {}
  const top = !!toplevel && [dir, real].some((d) => key(d) === key(toplevel));
  return { commonDir, top, toplevel };
}

// A child worth asking git about: one with a .git (a checkout, a linked
// worktree or a nested repository), or one that looks like a bare repository.
function candidate(dir) {
  return (
    existsSync(path.join(dir, ".git")) ||
    (existsSync(path.join(dir, "HEAD")) && isDir(path.join(dir, "objects")))
  );
}

// Each path is a repository, a folder whose direct children are
// repositories, or both (a checkout that holds other clones). With no path,
// the repository of the current directory, wherever in it that is.
function discover(paths, warn) {
  const repos = new Map();
  const add = (commonDir, at) => {
    const k = key(commonDir);
    if (!repos.has(k)) repos.set(k, { commonDir: slash(commonDir), at: slash(at) });
  };
  if (!paths.length) {
    const r = repoAt(process.cwd());
    if (r) add(r.commonDir, process.cwd());
    return [...repos.values()];
  }
  for (const p of paths) {
    const abs = path.resolve(p);
    if (!isDir(abs)) {
      warn(`${p}: not a directory`);
      continue;
    }
    const self = repoAt(abs);
    if (self?.top) add(self.commonDir, abs);
    let found = 0;
    let children = [];
    try {
      children = readdirSync(abs, { withFileTypes: true });
    } catch (e) {
      warn(`${p}: cannot list: ${e.message}`);
    }
    for (const ent of children) {
      if (!ent.isDirectory()) continue;
      const child = path.join(abs, ent.name);
      if (!candidate(child)) continue;
      const r = repoAt(child);
      if (r?.top) {
        add(r.commonDir, child);
        found++;
      } else if (!r) {
        const why = unreadable(child);
        if (why) warn(why);
      }
    }
    if (self && !self.top) {
      if (found)
        warn(`${p}: inside the repository ${self.toplevel}, which is not listed; its child repositories are`);
      else {
        warn(`${p}: not a repository's top, and holds none; taken as the repository it is in, ${self.toplevel}`);
        add(self.commonDir, abs);
      }
    } else if (!self && !found) warn(`${p}: no repository at or directly under it`);
  }
  return [...repos.values()];
}

// `git worktree list --porcelain -z`: one NUL-terminated field per line, and
// an empty field between worktrees.
function parseList(text) {
  const out = [];
  let cur = null;
  for (const field of text.split("\0")) {
    if (field === "") {
      if (cur) out.push(cur);
      cur = null;
      continue;
    }
    const sp = field.indexOf(" ");
    const k = sp < 0 ? field : field.slice(0, sp);
    const v = sp < 0 ? "" : field.slice(sp + 1);
    if (k === "worktree") {
      if (cur) out.push(cur);
      cur = {
        path: v,
        head: null,
        branch: null,
        detached: false,
        bare: false,
        locked: false,
        lockReason: "",
        prunable: false,
        prunableReason: "",
      };
    } else if (!cur) continue;
    else if (k === "HEAD") cur.head = v;
    else if (k === "branch") cur.branch = v.replace(/^refs\/heads\//, "");
    else if (k === "detached") cur.detached = true;
    else if (k === "bare") cur.bare = true;
    else if (k === "locked") {
      cur.locked = true;
      cur.lockReason = v;
    } else if (k === "prunable") {
      cur.prunable = true;
      cur.prunableReason = v;
    }
  }
  if (cur) out.push(cur);
  return out;
}

// Each linked worktree's admin dir, <common>/worktrees/<name>, by the
// worktree path its gitdir file names (relative to the admin dir when
// worktree.useRelativePaths wrote it). Read from disk, so a missing worktree
// has one too.
function adminDirs(commonDir) {
  const map = new Map();
  const base = path.join(commonDir, "worktrees");
  let names = [];
  try {
    names = readdirSync(base);
  } catch {
    return map;
  }
  for (const name of names) {
    const admin = path.join(base, name);
    try {
      let g = readFileSync(path.join(admin, "gitdir"), "utf8").trim();
      if (!path.isAbsolute(g)) g = path.resolve(admin, g);
      map.set(key(path.dirname(g)), slash(admin));
    } catch {}
  }
  return map;
}

// Idle time: hours since the newest mtime among the admin dir's index and
// HEAD (for the main checkout, the common dir's). Git writes them on a
// commit, a checkout, an add and on most `git status` runs.
function idleHours(adminDir, now) {
  if (!adminDir) return null;
  let newest = 0;
  for (const f of ["index", "HEAD"]) {
    try {
      newest = Math.max(newest, statSync(path.join(adminDir, f)).mtimeMs);
    } catch {}
  }
  return newest ? Math.max(0, (now - newest) / 3600000) : null;
}

function defaultBranch(at) {
  const r = git(at, ["symbolic-ref", "--quiet", "refs/remotes/origin/HEAD"]);
  const prefix = "refs/remotes/origin/";
  if (r.ok && r.out.startsWith(prefix)) {
    const name = r.out.slice(prefix.length);
    if (git(at, ["rev-parse", "--verify", "--quiet", `${prefix}${name}`]).ok) return name;
  }
  for (const b of ["main", "master"])
    if (git(at, ["rev-parse", "--verify", "--quiet", `${prefix}${b}`]).ok) return b;
  return null;
}

const NULL_SHA = /^0+$/;

// Commits reachable from `sha` and from no branch, tag or remote-tracking
// ref: the work that dropping this HEAD would orphan.
function uniqueCount(at, sha) {
  if (!sha || NULL_SHA.test(sha)) return 0;
  const r = git(at, ["rev-list", "--count", sha, "--not", "--branches", "--tags", "--remotes"]);
  return r.ok ? Number(r.out.trim()) : null;
}

// true, false, or null when git could not tell.
function isAncestor(at, a, b) {
  const r = git(at, ["merge-base", "--is-ancestor", a, b]);
  return r.status === 0 ? true : r.status === 1 ? false : null;
}

// Directory names that are regenerated output and nothing else: package
// installs, build and cache folders that the project's own tools write again
// (BACKLOG.md, C14, and the owner's decision on ignored files). An ignored
// entry is rebuildable when one of its path components is one of these, at
// any depth (node_modules/, app/node_modules/, build/x.o). The name decides,
// not the content: a hand-made file inside an ignored build/ goes with it.
// Ambiguous names, where a local file can be the only copy, are left out on
// purpose: bin, out, tmp, temp, data, cache, gen, www, logs.
const REBUILDABLE = new Set([
  "node_modules",
  ".godot",
  ".import",
  "build",
  "dist",
  "target",
  ".venv",
  "venv",
  "__pycache__",
  ".pytest_cache",
  ".mypy_cache",
  ".ruff_cache",
  ".svelte-kit",
  ".next",
  ".nuxt",
  ".turbo",
  ".parcel-cache",
  ".gradle",
  "obj",
  "coverage",
]);
function isRebuildable(entry) {
  // Porcelain quotes a path with unusual characters; the name test needs none.
  const p = entry.startsWith('"') ? entry.slice(1, -1) : entry;
  return p.split("/").some((c) => REBUILDABLE.has(c));
}

// The worktree's status, named in full so the repository's config cannot
// narrow it: --untracked-files=all counts every untracked file whatever
// status.showUntrackedFiles says, and --ignored=matching lists each ignored
// file or directory once (a whole node_modules/ is one entry). `git worktree
// remove` deletes ignored files without a word. A rebuildable one is only
// reported; any other, which can be the only copy of something (a local .env,
// a key, a local config), keeps the worktree. null when git cannot read the
// status.
function statusOf(dir) {
  const r = git(dir, [
    "status",
    "--porcelain",
    "--untracked-files=all",
    "--ignored=matching",
  ]);
  if (!r.ok) return null;
  const lines = r.out ? r.out.split(/\r?\n/) : [];
  const all = lines.filter((l) => l.startsWith("!! ")).map((l) => l.slice(3));
  return {
    dirty: lines.length - all.length,
    ignored: all.filter((e) => !isRebuildable(e)),
    rebuildable: all.filter(isRebuildable),
  };
}

// An operation git has stopped in the middle of, by the files it keeps in
// the worktree's admin dir: removing the worktree would throw its state away.
const IN_PROGRESS = [
  ["rebase-merge", "a rebase"],
  ["rebase-apply", "a rebase or git am"],
  ["MERGE_HEAD", "a merge"],
  ["CHERRY_PICK_HEAD", "a cherry-pick"],
  ["REVERT_HEAD", "a revert"],
  ["sequencer", "a cherry-pick or revert sequence"],
  ["BISECT_LOG", "a bisect"],
];
function inProgress(adminDir) {
  if (!adminDir) return [];
  return IN_PROGRESS.filter(([f]) => existsSync(path.join(adminDir, f))).map(([, what]) => what);
}

function hours(h) {
  if (h === null || h === undefined) return "?";
  return h < 48 ? `${h.toFixed(1)}h` : `${(h / 24).toFixed(1)}d`;
}

function plural(n, word) {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

function inspect(repo, now) {
  const listed = git(repo.at, ["worktree", "list", "--porcelain", "-z"]);
  if (!listed.ok) return { ...repo, error: listed.err || "git worktree list failed", worktrees: [] };
  const entries = parseList(listed.out);
  const main = entries[0];
  // The place repository-wide commands run from: the main checkout where it
  // is still there, otherwise where the repository was found.
  const at = main && isDir(main.path) ? main.path : repo.at;
  const def = defaultBranch(at);
  const originRef = def ? `refs/remotes/origin/${def}` : null;
  const admins = adminDirs(repo.commonDir);
  const worktrees = entries.map((e, i) => {
    const kind = i === 0 ? "main" : "linked";
    const exists = isDir(e.path);
    const missing = kind === "linked" && (!exists || e.prunable);
    let admin = kind === "main" ? repo.commonDir : admins.get(key(e.path)) || null;
    if (!admin && exists) {
      const r = git(e.path, ["rev-parse", "--absolute-git-dir"]);
      if (r.ok) admin = r.out.trim();
    }
    const wt = {
      path: e.path,
      kind,
      bare: e.bare,
      head: e.head,
      branch: e.branch,
      detached: e.detached,
      locked: e.locked,
      lockReason: e.lockReason,
      missing,
      missingReason: missing ? (!exists ? "its directory is gone" : `git reports it prunable: ${e.prunableReason}`) : "",
      // Measured before `git status` runs in it, although that status writes
      // nothing (--no-optional-locks).
      idleHours: idleHours(admin, now),
      dirty: null,
      ignored: null,
      rebuildable: null,
      inProgress: missing ? [] : inProgress(admin),
      unique: null,
      merged: null,
      ancestor: null,
    };
    if (e.bare) return wt;
    if (!missing && exists) {
      const st = statusOf(e.path);
      if (st) [wt.dirty, wt.ignored, wt.rebuildable] = [st.dirty, st.ignored, st.rebuildable];
    }
    wt.unique = uniqueCount(at, e.head);
    if (e.branch && originRef && !NULL_SHA.test(e.head || "0"))
      wt.merged = isAncestor(at, `refs/heads/${e.branch}`, originRef);
    if (kind === "main" && e.detached && originRef && e.head)
      wt.ancestor = isAncestor(at, e.head, originRef);
    return wt;
  });
  return {
    commonDir: repo.commonDir,
    at: slash(at),
    defaultBranch: def,
    localDefault: def ? git(at, ["rev-parse", "--verify", "--quiet", `refs/heads/${def}`]).ok : false,
    worktrees,
  };
}

function judge(wt, repo, opts) {
  const def = repo.defaultBranch;
  if (wt.bare) return ["keep", "the bare repository"];
  if (wt.kind === "main") {
    if (!isDir(wt.path)) return ["keep", "the main checkout (its directory is gone)"];
    if (!wt.detached) return ["keep", "the main checkout"];
    const why = [];
    if (wt.dirty === null) why.push("its status could not be read");
    else if (wt.dirty > 0) why.push(`dirty (${wt.dirty} ${wt.dirty === 1 ? "entry" : "entries"})`);
    if (wt.inProgress.length) why.push(`${wt.inProgress.join(" and ")} in progress`);
    if (!def) why.push("no origin/main or origin/master to compare HEAD with");
    else {
      if (wt.ancestor === null) why.push(`could not tell whether HEAD is an ancestor of origin/${def}`);
      else if (!wt.ancestor) why.push(`HEAD is not an ancestor of origin/${def}`);
      if (!repo.localDefault) why.push(`no local branch ${def} to switch to`);
      const other = repo.worktrees.find((w) => w.branch === def);
      if (other) why.push(`${def} is checked out in ${other.path}`);
    }
    if (why.length) return ["main detached", `left detached: ${why.join("; ")}`];
    if (!opts.reattach)
      return ["main detached", `clean, HEAD an ancestor of origin/${def}: reattachable with --reattach`];
    return ["reattach", `clean, HEAD an ancestor of origin/${def}`];
  }
  if (wt.missing) {
    if (wt.locked) return ["keep", `missing but locked (git worktree prune skips a locked worktree)`];
    if (wt.unique === null) return ["keep", "missing, and the commits its HEAD holds could not be counted"];
    if (wt.unique > 0)
      return [
        "keep",
        `missing, but its HEAD holds ${plural(wt.unique, "commit")} on no branch, tag or remote-tracking ref, which pruning would orphan (git branch <name> ${wt.head} keeps them)`,
      ];
    return ["prune", wt.missingReason];
  }
  const why = [];
  if (wt.locked) why.push(wt.lockReason ? `locked: ${wt.lockReason}` : "locked");
  if (wt.dirty === null) why.push("its status could not be read");
  else if (wt.dirty > 0) why.push(`dirty (${wt.dirty} ${wt.dirty === 1 ? "entry" : "entries"}, untracked included)`);
  if (wt.ignored && wt.ignored.length) {
    const shown = wt.ignored.slice(0, 3).join(", ") + (wt.ignored.length > 3 ? ", …" : "");
    const n = wt.ignored.length;
    why.push(
      `${n} ignored ${n === 1 ? "entry" : "entries"} not on the rebuildable list, which removal would delete (${shown})`,
    );
  }
  if (wt.inProgress.length) why.push(`${wt.inProgress.join(" and ")} in progress`);
  if (wt.unique === null) why.push("its commits on no ref could not be counted");
  else if (wt.unique > 0) why.push(`${plural(wt.unique, "commit")} on no branch, tag or remote-tracking ref`);
  if (wt.idleHours === null) why.push("its idle time is unknown");
  else if (wt.idleHours < opts.minAge) why.push(`recent (idle ${hours(wt.idleHours)} < --min-age ${opts.minAge}h)`);
  if (!wt.detached) {
    if (!def) why.push(`branch ${wt.branch}, and no origin/main or origin/master to compare it with`);
    else if (wt.merged === null) why.push(`could not tell whether ${wt.branch} is merged into origin/${def}`);
    else if (!wt.merged) why.push(`branch ${wt.branch} is not merged into origin/${def}`);
  }
  if (why.length) return ["keep", why.join("; ")];
  // What removal deletes besides tracked files, so it is seen before --clean.
  const r = wt.rebuildable || [];
  const deletes = r.length
    ? `; deletes rebuildable: ${r.slice(0, 3).join(", ")}${r.length > 3 ? `, … (${r.length} in all)` : ""}`
    : "";
  const idle = `idle ${hours(wt.idleHours)}`;
  if (wt.detached) return ["remove", `detached, clean, no commit on no ref, ${idle}${deletes}`];
  if (opts.merged)
    return ["remove", `branch ${wt.branch} merged into origin/${def}, clean, ${idle}; the branch is kept${deletes}`];
  return ["merged", `branch ${wt.branch} merged into origin/${def}, clean, ${idle}: removable with --merged${deletes}`];
}

function plan(repo, opts) {
  for (const wt of repo.worktrees) [wt.verdict, wt.reason] = judge(wt, repo, opts);
  // `git worktree prune` takes every missing, unlocked worktree of the
  // repository at once, so one that holds commits on no ref keeps the rest.
  const blocker = repo.worktrees.find(
    (w) => w.kind === "linked" && w.missing && !w.locked && w.unique !== 0,
  );
  if (blocker)
    for (const wt of repo.worktrees)
      if (wt.verdict === "prune") {
        wt.verdict = "keep";
        wt.reason = `${wt.missingReason}, but git worktree prune would also drop ${blocker.path}, which holds commits on no ref`;
      }
  const commands = [];
  const pruned = repo.worktrees.filter((w) => w.verdict === "prune");
  if (pruned.length)
    commands.push({ args: ["-C", repo.at, "worktree", "prune"], for: pruned.map((w) => w.path) });
  for (const wt of repo.worktrees)
    if (wt.verdict === "remove")
      commands.push({ args: ["-C", repo.at, "worktree", "remove", wt.path], for: [wt.path] });
  for (const wt of repo.worktrees)
    if (wt.verdict === "reattach")
      commands.push({ args: ["-C", wt.path, "switch", repo.defaultBranch], for: [wt.path] });
  repo.commands = commands;
}

function shellWord(s) {
  return /^[A-Za-z0-9_\/:.@%+=,-]+$/.test(s) ? s : `"${s.replace(/(["\\$`])/g, "\\$1")}"`;
}
function commandText(c) {
  return ["git", ...c.args].map(shellWord).join(" ");
}

function run(c) {
  const r = spawnSync("git", c.args, {
    encoding: "utf8",
    env: CHILD_ENV,
    windowsHide: true,
  });
  c.ran = true;
  c.ok = r.status === 0;
  if (!c.ok)
    c.error = ((r.stderr || "") + (r.error ? r.error.message : "")).trim().split(/\r?\n/)[0] || `exit ${r.status}`;
}

function stateText(wt) {
  if (wt.bare) return "bare";
  const s = [];
  if (wt.missing) s.push("missing");
  if (wt.locked) s.push("locked");
  if (wt.dirty > 0) s.push(`dirty ${wt.dirty}`);
  if (wt.ignored && wt.ignored.length) s.push(`${wt.ignored.length} ignored`);
  if (wt.rebuildable && wt.rebuildable.length) s.push(`${wt.rebuildable.length} rebuildable`);
  if (wt.inProgress && wt.inProgress.length) s.push("in progress");
  if (wt.unique > 0) s.push(`${wt.unique} on no ref`);
  if (wt.branch && wt.merged === true) s.push("merged");
  if (wt.branch && wt.merged === false) s.push("unmerged");
  if (!wt.missing && !wt.dirty && wt.dirty !== null) s.unshift("clean");
  return s.join(",") || "-";
}

function table(rows) {
  const widths = rows[0].map((_, i) => Math.max(...rows.map((r) => r[i].length)));
  return rows.map((r) => r.map((c, i) => (i === r.length - 1 ? c : c.padEnd(widths[i]))).join("  "));
}

function printText(repos, warnings, opts, counts) {
  for (const repo of repos) {
    console.log(`\n${repo.at}`);
    console.log(`  common dir ${repo.commonDir}`);
    if (repo.error) {
      console.log(`  could not list its worktrees: ${repo.error}`);
      continue;
    }
    console.log(
      repo.defaultBranch
        ? `  default origin/${repo.defaultBranch}, as last fetched (this tool never fetches)`
        : "  no origin/<default>: nothing counts as merged",
    );
    const rows = [["VERDICT", "KIND", "HEAD", "BRANCH", "STATE", "IDLE", "PATH"]];
    for (const wt of repo.worktrees)
      rows.push([
        wt.verdict,
        wt.kind,
        wt.head ? wt.head.slice(0, 9) : "-",
        wt.bare ? "-" : wt.detached ? "detached" : wt.branch || "-",
        stateText(wt),
        hours(wt.idleHours),
        wt.path,
      ]);
    const lines = table(rows);
    console.log(`  ${lines[0]}`);
    repo.worktrees.forEach((wt, i) => {
      console.log(`  ${lines[i + 1]}`);
      console.log(`      ${wt.reason}`);
    });
  }
  const total = repos.reduce((n, r) => n + r.worktrees.length, 0);
  const nrepos = `${repos.length} ${repos.length === 1 ? "repository" : "repositories"}`;
  console.log(
    `\nsummary: ${nrepos}, ${plural(total, "worktree")}: ` +
      VERDICTS.map((v) => `${counts[v]} ${v}`).join(", "),
  );
  const commands = repos.flatMap((r) => r.commands || []);
  if (!commands.length) console.log("nothing to run.");
  else if (!opts.clean) {
    console.log("dry run: nothing was changed. With --clean these would run:");
    for (const c of commands) console.log(`  ${commandText(c)}`);
  } else {
    console.log("ran:");
    for (const c of commands)
      console.log(`  ${c.ok ? "ok    " : "FAILED"} ${commandText(c)}${c.ok ? "" : `\n         ${c.error}`}`);
  }
  for (const w of warnings) console.error(`worktrees: ${w}`);
}

// Returns the exit code: 0, 1 when a command --clean ran failed, 2 for a
// usage error or no repository. No process.exit, so a piped stdout is
// flushed in full.
function main() {
  let opts;
  try {
    opts = parseArgs(process.argv.slice(2));
  } catch (e) {
    if (!(e instanceof UsageError)) throw e;
    console.error(`worktrees: ${e.message}\n(node utils/worktrees.mjs --help)`);
    return 2;
  }
  if (opts.help) {
    printHelp();
    return 0;
  }
  const warnings = [];
  const repos = discover(opts.paths.length ? opts.paths : [process.cwd()], (m) =>
    warnings.push(m),
  );
  if (!repos.length) {
    for (const w of warnings) console.error(`worktrees: ${w}`);
    console.error(
      opts.paths.length
        ? "worktrees: no repository found"
        : "worktrees: not in a git repository; give a path",
    );
    return 2;
  }
  const now = Date.now();
  const inspected = repos.map((r) => inspect(r, now));
  for (const repo of inspected) {
    if (repo.error) repo.commands = [];
    else plan(repo, opts);
  }
  if (opts.clean) for (const repo of inspected) for (const c of repo.commands) run(c);
  const counts = Object.fromEntries(VERDICTS.map((v) => [v, 0]));
  for (const repo of inspected) for (const wt of repo.worktrees) counts[wt.verdict]++;
  const failed = inspected.flatMap((r) => r.commands).filter((c) => c.ran && !c.ok).length;
  if (!opts.json) {
    printText(inspected, warnings, opts, counts);
    return failed ? 1 : 0;
  }
  const commandJson = (c) => ({
    command: commandText(c),
    args: ["git", ...c.args],
    for: c.for,
    ran: !!c.ran,
    ok: c.ran ? c.ok : null,
    error: c.error || null,
  });
  const report = {
    dryRun: !opts.clean,
    options: { minAgeHours: opts.minAge, merged: opts.merged, reattach: opts.reattach },
    repositories: inspected.map((r) => ({ ...r, commands: r.commands.map(commandJson) })),
    summary: {
      repositories: inspected.length,
      worktrees: inspected.reduce((n, r) => n + r.worktrees.length, 0),
      ...counts,
      failed,
    },
    warnings,
  };
  console.log(JSON.stringify(report, null, 2));
  for (const w of warnings) console.error(`worktrees: ${w}`);
  return failed ? 1 : 0;
}

process.exitCode = main();
