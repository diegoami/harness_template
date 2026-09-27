// worktrees.test.mjs — node --test utils/worktrees.test.mjs
//
// Runs the real utils/worktrees.mjs against throwaway repositories under the
// temp directory, each with a local bare repository as its origin: nothing
// outside the temp directory is read or changed, and --clean runs only
// there. Idle times are set with utimesSync on each worktree's admin files,
// not waited for.

import { after, before, describe, test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  realpathSync,
  rmSync,
  statSync,
  utimesSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const TOOL = path.join(path.dirname(fileURLToPath(import.meta.url)), "worktrees.mjs");

// Every throwaway repository here, and every tool run, is cut off from the
// caller's git environment (PRINCIPLES.md, Creation paths): a git hook exports
// GIT_DIR and its kin, and they override -C and the working directory. Then a
// fixed identity, so the gate does not depend on the machine's git config.
for (const key of Object.keys(process.env))
  if (/^GIT_/i.test(key)) delete process.env[key];
Object.assign(process.env, {
  GIT_AUTHOR_NAME: "Harness Test",
  GIT_AUTHOR_EMAIL: "test@example.com",
  GIT_COMMITTER_NAME: "Harness Test",
  GIT_COMMITTER_EMAIL: "test@example.com",
  // Git looks for a repository no higher than the temp directory, so a
  // repository above it, if the machine has one, is never found. The tool
  // passes this variable through.
  GIT_CEILING_DIRECTORIES: realpathSync.native(tmpdir()),
});

const WIN = process.platform === "win32";
// Git prints forward slashes; on Windows a path's case does not matter.
const key = (p) => {
  const s = path.resolve(p).replace(/\\/g, "/").replace(/\/+$/, "");
  return WIN ? s.toLowerCase() : s;
};

function git(cwd, ...args) {
  return execFileSync("git", ["-C", cwd, ...args], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function scratch() {
  const dir = realpathSync.native(mkdtempSync(path.join(tmpdir(), "worktrees-test-")));
  return { dir, done: () => rmSync(dir, { recursive: true, force: true }) };
}

function tool(args, { cwd, env } = {}) {
  return spawnSync(process.execPath, [TOOL, ...args], { encoding: "utf8", cwd, env });
}

function report(args, opts) {
  const r = tool([...args, "--json"], opts);
  assert.equal(r.status, 0, `exit ${r.status}\n${r.stderr}`);
  return JSON.parse(r.stdout);
}

function worktreeAt(rep, p) {
  const all = rep.repositories.flatMap((r) => r.worktrees);
  const wt = all.find((w) => key(w.path) === key(p));
  assert.ok(wt, `no worktree ${p} in the report`);
  return wt;
}

// A repository `name` in `dir`: one commit on main, pushed to a bare
// `<name>-origin.git` in `originDir`, with origin/HEAD set as a clone would
// have it.
function repo(dir, name = "repo", originDir = dir) {
  const main = path.join(dir, name);
  const origin = path.join(originDir, `${name}-origin.git`);
  execFileSync("git", ["init", "-q", "--bare", "-b", "main", origin], { stdio: "ignore" });
  mkdirSync(main, { recursive: true });
  git(main, "init", "-q", "-b", "main");
  git(main, "config", "core.autocrlf", "false");
  writeFileSync(path.join(main, "f.txt"), "one\n");
  git(main, "add", "f.txt");
  git(main, "commit", "-q", "-m", "one");
  git(main, "remote", "add", "origin", origin);
  git(main, "push", "-q", "origin", "main");
  git(main, "remote", "set-head", "origin", "main");
  return main;
}

function commit(cwd, file, text) {
  writeFileSync(path.join(cwd, file), text);
  git(cwd, "add", file);
  git(cwd, "commit", "-q", "-m", file);
}

function addWorktree(main, wt, ...args) {
  git(main, "worktree", "add", "-q", ...args.slice(0, -1), wt, args.at(-1));
  return wt;
}

// Makes a worktree look idle for `hours`: its admin dir's index and HEAD (for
// the main checkout, the common dir's) get that old an mtime.
function age(wt, hours) {
  const admin = git(wt, "rev-parse", "--absolute-git-dir");
  const t = Date.now() / 1000 - hours * 3600;
  for (const f of ["index", "HEAD"]) {
    const file = path.join(admin, f);
    if (existsSync(file)) utimesSync(file, t, t);
  }
}

// One repository with a worktree in every state the verdicts tell apart.
function fixture(dir) {
  const main = repo(dir);
  const at = (name) => path.join(dir, name);
  const w = {
    main,
    gone: addWorktree(main, at("gone"), "--detach", "HEAD"),
    goneLocked: addWorktree(main, at("gone-locked"), "--detach", "HEAD"),
    idle: addWorktree(main, at("idle"), "--detach", "HEAD"),
    tagged: addWorktree(main, at("tagged"), "--detach", "HEAD"),
    orphan: addWorktree(main, at("orphan"), "--detach", "HEAD"),
    dirty: addWorktree(main, at("dirty"), "--detach", "HEAD"),
    untracked: addWorktree(main, at("untracked"), "--detach", "HEAD"),
    recent: addWorktree(main, at("recent"), "--detach", "HEAD"),
    locked: addWorktree(main, at("locked"), "--detach", "HEAD"),
    merged: addWorktree(main, at("merged"), "-b", "feature-merged", "main"),
    unmerged: addWorktree(main, at("unmerged"), "-b", "feature-open", "main"),
  };
  commit(w.tagged, "t.txt", "tagged\n");
  git(w.tagged, "tag", "kept-by-a-tag");
  commit(w.orphan, "o.txt", "on no ref\n");
  commit(w.unmerged, "u.txt", "not on origin\n");
  writeFileSync(path.join(w.dirty, "f.txt"), "changed\n");
  writeFileSync(path.join(w.untracked, "new.txt"), "untracked\n");
  git(main, "worktree", "lock", "--reason", "test lock", w.locked);
  git(main, "worktree", "lock", "--reason", "test lock", w.goneLocked);
  for (const [name, p] of Object.entries(w)) if (name !== "recent") age(p, 48);
  rmSync(w.gone, { recursive: true, force: true });
  rmSync(w.goneLocked, { recursive: true, force: true });
  return w;
}

// What a dry run must leave alone: the worktree list, the refs, the main
// checkout's HEAD and index, and every file of every admin dir, with its
// mtime (the idle time) and content.
function snapshot(main) {
  const common = path.join(main, ".git");
  const digest = (f) => createHash("sha256").update(readFileSync(f)).digest("hex");
  const files = [];
  const walk = (d) => {
    for (const ent of readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, ent.name);
      if (ent.isDirectory()) walk(p);
      else files.push([path.relative(common, p), statSync(p).mtimeMs, digest(p)]);
    }
  };
  walk(path.join(common, "worktrees"));
  return {
    list: git(main, "worktree", "list", "--porcelain"),
    refs: git(main, "for-each-ref", "--format=%(refname) %(objectname)"),
    head: readFileSync(path.join(common, "HEAD"), "utf8"),
    index: [statSync(path.join(common, "index")).mtimeMs, digest(path.join(common, "index"))],
    admin: files.sort(),
  };
}

const listed = (main) =>
  git(main, "worktree", "list", "--porcelain")
    .split(/\r?\n/)
    .filter((l) => l.startsWith("worktree "))
    .map((l) => key(l.slice("worktree ".length)));

describe("verdicts, in a dry run", () => {
  let s, w, rep;
  before(() => {
    s = scratch();
    w = fixture(s.dir);
    rep = report([w.main]);
  });
  after(() => s.done());

  test("the main checkout is kept", () => {
    const wt = worktreeAt(rep, w.main);
    assert.equal(wt.kind, "main");
    assert.equal(wt.verdict, "keep");
    assert.match(wt.reason, /the main checkout/);
  });

  test("a missing worktree is pruned, and a missing locked one kept", () => {
    const gone = worktreeAt(rep, w.gone);
    assert.equal(gone.missing, true);
    assert.equal(gone.verdict, "prune");
    const locked = worktreeAt(rep, w.goneLocked);
    assert.equal(locked.missing, true);
    assert.equal(locked.verdict, "keep");
    assert.match(locked.reason, /locked/);
  });

  test("a clean, detached, idle worktree is removed; a tag counts as a ref", () => {
    for (const p of [w.idle, w.tagged]) {
      const wt = worktreeAt(rep, p);
      assert.equal(wt.detached, true);
      assert.equal(wt.dirty, 0);
      assert.equal(wt.unique, 0);
      assert.equal(wt.verdict, "remove", `${p}: ${wt.reason}`);
    }
  });

  test("a detached worktree holding a commit on no ref is kept", () => {
    const wt = worktreeAt(rep, w.orphan);
    assert.equal(wt.unique, 1);
    assert.equal(
      git(w.orphan, "rev-list", "--count", "HEAD", "--not", "--branches", "--tags", "--remotes"),
      "1",
    );
    assert.equal(wt.verdict, "keep");
    assert.match(wt.reason, /1 commit on no branch, tag or remote-tracking ref/);
  });

  test("a dirty worktree, and one with only an untracked file, are kept", () => {
    for (const p of [w.dirty, w.untracked]) {
      const wt = worktreeAt(rep, p);
      assert.equal(wt.dirty, 1, p);
      assert.equal(wt.verdict, "keep");
      assert.match(wt.reason, /dirty \(1 entry/);
    }
  });

  test("a recent worktree is kept, and removable with --min-age 0", () => {
    const wt = worktreeAt(rep, w.recent);
    assert.equal(wt.verdict, "keep");
    assert.match(wt.reason, /recent \(idle .* < --min-age 24h\)/);
    assert.ok(wt.idleHours < 1);
    assert.equal(worktreeAt(report(["--min-age", "0", w.main]), w.recent).verdict, "remove");
  });

  test("a locked worktree is kept", () => {
    const wt = worktreeAt(rep, w.locked);
    assert.equal(wt.locked, true);
    assert.equal(wt.verdict, "keep");
    assert.match(wt.reason, /locked: test lock/);
  });

  test("a merged branch's worktree is reported, and removed only with --merged", () => {
    const wt = worktreeAt(rep, w.merged);
    assert.equal(wt.merged, true);
    assert.equal(wt.verdict, "merged");
    assert.match(wt.reason, /removable with --merged/);
    assert.equal(worktreeAt(report(["--merged", w.main]), w.merged).verdict, "remove");
    const open = worktreeAt(rep, w.unmerged);
    assert.equal(open.merged, false);
    assert.equal(open.verdict, "keep");
    assert.match(open.reason, /feature-open is not merged into origin\/main/);
  });

  test("the plan: one prune and the two removes, nothing else", () => {
    const [r] = rep.repositories;
    assert.equal(rep.dryRun, true);
    assert.equal(r.defaultBranch, "main");
    assert.equal(key(r.at), key(w.main));
    assert.deepEqual(
      r.commands.map((c) => c.args.slice(3, 5)),
      [["worktree", "prune"], ["worktree", "remove"], ["worktree", "remove"]],
    );
    assert.deepEqual(r.commands[0].for.map(key), [key(w.gone)]);
    assert.deepEqual(
      r.commands.slice(1).map((c) => key(c.args[5])).sort(),
      [w.idle, w.tagged].map(key).sort(),
    );
    assert.ok(r.commands.every((c) => !c.ran && !c.args.includes("--force")));
    const { repositories, worktrees, ...counts } = rep.summary;
    assert.deepEqual([repositories, worktrees], [1, 12]);
    assert.deepEqual(
      counts,
      {
        prune: 1,
        remove: 2,
        merged: 1,
        reattach: 0,
        "main detached": 0,
        keep: 8,
        failed: 0,
      },
    );
  });

  test("the text output prints the commands and says nothing was changed", () => {
    const r = tool([w.main]);
    assert.equal(r.status, 0, r.stderr);
    assert.match(r.stdout, /dry run: nothing was changed/);
    assert.match(r.stdout, /^ {2}git -C \S+ worktree prune$/m);
    assert.equal((r.stdout.match(/^ {2}git -C \S+ worktree remove \S+$/gm) || []).length, 2);
    assert.match(r.stdout, /summary: 1 repository, 12 worktrees: 1 prune, 2 remove, 1 merged/);
  });
});

test("a dry run changes nothing, whatever else it is asked", () => {
  const s = scratch();
  try {
    const w = fixture(s.dir);
    const before = snapshot(w.main);
    for (const args of [[], ["--json"], ["--merged", "--reattach", "--min-age", "0"]]) {
      const r = tool([...args, w.main]);
      assert.equal(r.status, 0, r.stderr);
    }
    assert.deepEqual(snapshot(w.main), before);
    for (const p of [w.idle, w.tagged, w.merged, w.recent]) assert.ok(existsSync(p), p);
  } finally {
    s.done();
  }
});

test("--clean removes exactly the safe set, and --merged adds merged branches, keeping them", () => {
  const s = scratch();
  try {
    const w = fixture(s.dir);
    const refs = git(w.main, "for-each-ref", "--format=%(refname) %(objectname)");
    const all = listed(w.main);
    const rep = report(["--clean", w.main]);
    assert.equal(rep.dryRun, false);
    const cmds = rep.repositories[0].commands;
    assert.ok(cmds.length === 3 && cmds.every((c) => c.ran && c.ok), JSON.stringify(cmds));
    const safe = [w.gone, w.idle, w.tagged].map(key);
    assert.deepEqual(listed(w.main), all.filter((p) => !safe.includes(p)));
    assert.ok(!existsSync(w.idle) && !existsSync(w.tagged));
    for (const p of [w.orphan, w.dirty, w.untracked, w.recent, w.locked, w.merged, w.unmerged])
      assert.ok(existsSync(p), p);
    assert.equal(readFileSync(path.join(w.dirty, "f.txt"), "utf8"), "changed\n");
    assert.equal(git(w.main, "for-each-ref", "--format=%(refname) %(objectname)"), refs);

    const again = report(["--clean", "--merged", w.main]);
    assert.deepEqual(
      again.repositories[0].commands.map((c) => [key(c.args[5]), c.ok]),
      [[key(w.merged), true]],
    );
    assert.ok(!existsSync(w.merged));
    assert.equal(git(w.main, "for-each-ref", "--format=%(refname) %(objectname)"), refs);

    const r = tool(["--clean", "--merged", w.main]);
    assert.equal(r.status, 0, r.stderr);
    assert.match(r.stdout, /nothing to run\./);
  } finally {
    s.done();
  }
});

test("a missing worktree holding a commit on no ref is kept, and keeps the rest from being pruned", () => {
  const s = scratch();
  try {
    const main = repo(s.dir);
    const safe = addWorktree(main, path.join(s.dir, "gone-safe"), "--detach", "HEAD");
    const holds = addWorktree(main, path.join(s.dir, "gone-holds"), "--detach", "HEAD");
    commit(holds, "x.txt", "only here\n");
    rmSync(safe, { recursive: true, force: true });
    rmSync(holds, { recursive: true, force: true });
    const rep = report(["--clean", main]);
    const h = worktreeAt(rep, holds);
    assert.equal(h.unique, 1);
    assert.equal(h.verdict, "keep");
    assert.match(h.reason, /which pruning would orphan/);
    const k = worktreeAt(rep, safe);
    assert.equal(k.verdict, "keep");
    assert.match(k.reason, /git worktree prune would also drop/);
    assert.deepEqual(rep.repositories[0].commands, []);
    assert.equal(listed(main).length, 3);
  } finally {
    s.done();
  }
});

describe("a detached main checkout", () => {
  const detached = (main) =>
    spawnSync("git", ["-C", main, "symbolic-ref", "-q", "HEAD"], { stdio: "ignore" }).status !== 0;

  test("is reattached only with --reattach and --clean, when clean and an ancestor", () => {
    const s = scratch();
    try {
      const main = repo(s.dir);
      git(main, "switch", "-q", "--detach", "HEAD");
      let wt = worktreeAt(report([main]), main);
      assert.equal(wt.verdict, "main detached");
      assert.match(wt.reason, /reattachable with --reattach/);
      report(["--clean", main]);
      assert.ok(detached(main), "--clean alone reattached it");
      const rep = report(["--reattach", main]);
      assert.equal(worktreeAt(rep, main).verdict, "reattach");
      assert.deepEqual(rep.repositories[0].commands[0].args.slice(3), ["switch", "main"]);
      assert.ok(detached(main), "a dry run reattached it");
      report(["--reattach", "--clean", main]);
      assert.equal(git(main, "symbolic-ref", "HEAD"), "refs/heads/main");
    } finally {
      s.done();
    }
  });

  for (const [what, setup, reason] of [
    ["dirty", (main) => writeFileSync(path.join(main, "f.txt"), "changed\n"), /dirty/],
    [
      "not an ancestor of origin/main",
      (main) => commit(main, "g.txt", "ahead\n"),
      /HEAD is not an ancestor of origin\/main/,
    ],
    ["without a local main", (main) => git(main, "branch", "-q", "-D", "main"), /no local branch main/],
  ])
    test(`is never reattached when ${what}`, () => {
      const s = scratch();
      try {
        const main = repo(s.dir);
        git(main, "switch", "-q", "--detach", "HEAD");
        setup(main);
        const rep = report(["--reattach", "--clean", main]);
        const wt = worktreeAt(rep, main);
        assert.equal(wt.verdict, "main detached");
        assert.match(wt.reason, reason);
        assert.deepEqual(rep.repositories[0].commands, []);
        assert.ok(detached(main));
      } finally {
        s.done();
      }
    });
});

test("a folder of repositories: scanned, deduplicated by common dir, a worktree outside it found", () => {
  const s = scratch();
  try {
    const folder = path.join(s.dir, "clones");
    const alpha = repo(folder, "alpha", s.dir);
    const beta = repo(folder, "beta", s.dir);
    const alphaWt = addWorktree(alpha, path.join(folder, "alpha-review"), "--detach", "HEAD");
    const betaWt = addWorktree(beta, path.join(s.dir, "elsewhere", "beta-wt"), "--detach", "HEAD");
    mkdirSync(path.join(folder, "notes"));
    writeFileSync(path.join(folder, "readme.txt"), "not a repository\n");
    // A worktree whose repository is gone: reported, never touched.
    mkdirSync(path.join(folder, "stray"));
    writeFileSync(path.join(folder, "stray", ".git"), `gitdir: ${path.join(s.dir, "nowhere")}\n`);
    for (const args of [[folder], [folder, alphaWt, alpha]]) {
      const r = tool(["--json", ...args]);
      assert.equal(r.status, 0, r.stderr);
      const rep = JSON.parse(r.stdout);
      assert.deepEqual(
        rep.repositories.map((x) => key(x.commonDir)).sort(),
        [path.join(alpha, ".git"), path.join(beta, ".git")].map(key).sort(),
      );
      const a = rep.repositories.find((x) => key(x.commonDir) === key(path.join(alpha, ".git")));
      assert.deepEqual(a.worktrees.map((x) => key(x.path)), [alpha, alphaWt].map(key));
      assert.equal(worktreeAt(rep, betaWt).kind, "linked");
      assert.ok(rep.warnings.some((m) => /stray/.test(m) && /left as is/.test(m)), rep.warnings);
      assert.match(r.stderr, /stray/);
    }
    assert.ok(existsSync(path.join(folder, "stray", ".git")));
  } finally {
    s.done();
  }
});

test("the caller's GIT_DIR and GIT_CONFIG_* reach no git it runs", () => {
  const s = scratch();
  try {
    const target = repo(s.dir, "target");
    const safe = addWorktree(target, path.join(s.dir, "target-idle"), "--detach", "HEAD");
    age(safe, 48);
    // A decoy with a worktree that would be removed too, were git run there.
    const decoy = repo(s.dir, "decoy");
    const bait = addWorktree(decoy, path.join(s.dir, "decoy-idle"), "--detach", "HEAD");
    age(bait, 48);
    const gitdir = git(bait, "rev-parse", "--absolute-git-dir");
    const common = path.join(decoy, ".git");
    const before = snapshot(decoy);
    const config = readFileSync(path.join(common, "config"), "utf8");
    const env = {
      ...process.env,
      // What a hook run from the decoy's worktree exports, and injected
      // configuration that breaks any git that sees it.
      GIT_DIR: gitdir,
      GIT_WORK_TREE: bait,
      GIT_INDEX_FILE: path.join(gitdir, "index"),
      GIT_COMMON_DIR: common,
      GIT_OBJECT_DIRECTORY: path.join(common, "objects"),
      GIT_ALTERNATE_OBJECT_DIRECTORIES: path.join(common, "objects"),
      GIT_PREFIX: "sub/",
      // Windows reads a variable's name in any case, so there this one is
      // given in mixed case, and must be cut off all the same.
      [WIN ? "Git_Config_Parameters" : "GIT_CONFIG_PARAMETERS"]: "'core.bare'='true'",
      GIT_CONFIG_COUNT: "1",
      GIT_CONFIG_KEY_0: "core.bare",
      GIT_CONFIG_VALUE_0: "true",
    };
    const rep = report(["--clean", target], { env });
    assert.deepEqual(rep.repositories.map((r) => key(r.commonDir)), [key(path.join(target, ".git"))]);
    assert.deepEqual(
      rep.repositories[0].commands.map((c) => [c.args.slice(3, 5).join(" "), key(c.args[5]), c.ok]),
      [["worktree remove", key(safe), true]],
    );
    assert.ok(!existsSync(safe));
    assert.ok(existsSync(bait));
    assert.deepEqual(snapshot(decoy), before);
    assert.equal(readFileSync(path.join(common, "config"), "utf8"), config);
  } finally {
    s.done();
  }
});

test("--help, bad arguments, and no repository", () => {
  const help = tool(["--help"]);
  assert.equal(help.status, 0);
  assert.match(help.stdout, /^usage: node utils\/worktrees\.mjs/);
  for (const bad of [["--min-age", "-1"], ["--min-age"], ["--bogus"]]) {
    const r = tool(bad);
    assert.equal(r.status, 2, bad.join(" "));
    assert.match(r.stderr, /worktrees: /);
  }
  const s = scratch();
  try {
    const none = tool([], { cwd: s.dir });
    assert.equal(none.status, 2);
    assert.match(none.stderr, /not in a git repository/);
    const empty = tool([s.dir]);
    assert.equal(empty.status, 2);
    assert.match(empty.stderr, /no repository found/);
  } finally {
    s.done();
  }
});
