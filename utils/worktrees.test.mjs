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

// The cases review round 01 of PR #36 found: each is a file or a state that
// `git worktree remove` would throw away, and each must keep the worktree,
// with --clean given, so the proof is that it survives.
describe("what removal would lose keeps a worktree", () => {
  // One repository, a detached idle worktree set up by `setup`, and a --clean.
  function kept(setup) {
    const s = scratch();
    try {
      const main = repo(s.dir);
      const wt = addWorktree(main, path.join(s.dir, "wt"), "--detach", "HEAD");
      const check = setup(main, wt);
      age(wt, 48);
      const r = worktreeAt(report(["--clean", main]), wt);
      assert.equal(r.verdict, "keep", r.reason);
      assert.ok(existsSync(wt), "the worktree was removed");
      check(r);
    } finally {
      s.done();
    }
  }

  test("an untracked file, under status.showUntrackedFiles=no", () =>
    kept((main, wt) => {
      git(main, "config", "status.showUntrackedFiles", "no");
      writeFileSync(path.join(wt, "notes.txt"), "the only copy\n");
      return (r) => {
        assert.equal(r.dirty, 1);
        assert.match(r.reason, /dirty \(1 entry, untracked included\)/);
        assert.equal(readFileSync(path.join(wt, "notes.txt"), "utf8"), "the only copy\n");
      };
    }));

  test("an ignored file, such as a local .env", () =>
    kept((main, wt) => {
      commit(main, ".gitignore", ".env\n");
      git(wt, "checkout", "-q", "--detach", "main");
      writeFileSync(path.join(wt, ".env"), "SECRET=only-here\n");
      return (r) => {
        assert.equal(r.dirty, 0);
        assert.deepEqual(r.ignored, [".env"]);
        assert.match(
          r.reason,
          /1 ignored entry not on the rebuildable list, which removal would delete \(\.env\)/,
        );
        assert.ok(existsSync(path.join(wt, ".env")));
      };
    }));

  test("a rebase in progress", () =>
    kept((main, wt) => {
      git(wt, "switch", "-q", "-c", "feature");
      commit(wt, "g.txt", "feature\n");
      // Stops after the first pick, detached and clean, with rebase-merge/
      // in the admin dir; the branch still holds every commit.
      spawnSync("git", ["-C", wt, "rebase", "-q", "--exec", "false", "main"], { stdio: "ignore" });
      assert.ok(existsSync(path.join(git(wt, "rev-parse", "--absolute-git-dir"), "rebase-merge")));
      return (r) => {
        assert.equal(r.detached, true);
        assert.equal(r.unique, 0);
        assert.deepEqual(r.inProgress, ["a rebase"]);
        assert.match(r.reason, /a rebase in progress/);
      };
    }));

  test("a status git cannot read, and commits it cannot count", () =>
    kept((main, wt) => {
      // A HEAD naming an object that does not exist: status and rev-list fail.
      writeFileSync(path.join(git(wt, "rev-parse", "--absolute-git-dir"), "HEAD"), `${"1".repeat(40)}\n`);
      return (r) => {
        assert.equal(r.dirty, null);
        assert.equal(r.unique, null);
        assert.match(r.reason, /its status could not be read/);
        assert.match(r.reason, /its commits on no ref could not be counted/);
      };
    }));

  test("a missing worktree whose commits cannot be counted keeps the prune", () => {
    const s = scratch();
    try {
      const main = repo(s.dir);
      const safe = addWorktree(main, path.join(s.dir, "gone-safe"), "--detach", "HEAD");
      const bad = addWorktree(main, path.join(s.dir, "gone-bad"), "--detach", "HEAD");
      writeFileSync(path.join(git(bad, "rev-parse", "--absolute-git-dir"), "HEAD"), `${"1".repeat(40)}\n`);
      rmSync(safe, { recursive: true, force: true });
      rmSync(bad, { recursive: true, force: true });
      const rep = report(["--clean", main]);
      assert.equal(worktreeAt(rep, bad).unique, null);
      assert.match(worktreeAt(rep, bad).reason, /could not be counted/);
      assert.match(worktreeAt(rep, safe).reason, /git worktree prune would also drop/);
      assert.deepEqual(rep.repositories[0].commands, []);
      assert.equal(listed(main).length, 3);
    } finally {
      s.done();
    }
  });
});

// The owner's decision on ignored files (BACKLOG.md, Notes): regenerated
// output on the REBUILDABLE list does not keep a worktree; the dry run names
// it; any other ignored file still does.
describe("rebuildable ignored output", () => {
  // A repository ignoring `ignore`, and an idle detached worktree at its
  // head with `files` written into it; the dry run's and --clean's verdicts.
  function run(ignore, files) {
    const s = scratch();
    try {
      const main = repo(s.dir);
      commit(main, ".gitignore", ignore);
      const wt = addWorktree(main, path.join(s.dir, "wt"), "--detach", "HEAD");
      for (const [f, text] of Object.entries(files)) {
        mkdirSync(path.dirname(path.join(wt, f)), { recursive: true });
        writeFileSync(path.join(wt, f), text);
      }
      age(wt, 48);
      const dry = worktreeAt(report([main]), wt);
      const clean = worktreeAt(report(["--clean", main]), wt);
      return { dry, clean, removed: !existsSync(wt) };
    } finally {
      s.done();
    }
  }

  test("only node_modules/, at the top and nested, is removed, and the dry run says so", () => {
    const r = run("node_modules/\n", {
      "node_modules/x/index.js": "installed\n",
      "pkg/node_modules/y/index.js": "installed\n",
    });
    assert.deepEqual(r.dry.ignored, []);
    assert.deepEqual(r.dry.rebuildable, ["node_modules/", "pkg/node_modules/"]);
    assert.equal(r.dry.verdict, "remove", r.dry.reason);
    assert.match(r.dry.reason, /deletes rebuildable: node_modules\/, pkg\/node_modules\/$/);
    assert.equal(r.clean.verdict, "remove");
    assert.ok(r.removed, "--clean left it");
  });

  test("node_modules/ with a .env is kept, and the reason names the .env", () => {
    const r = run("node_modules/\n.env\n", {
      "node_modules/x/index.js": "installed\n",
      ".env": "SECRET=only-here\n",
    });
    assert.deepEqual(r.dry.ignored, [".env"]);
    assert.deepEqual(r.dry.rebuildable, ["node_modules/"]);
    assert.equal(r.dry.verdict, "keep");
    assert.match(r.dry.reason, /1 ignored entry not on the rebuildable list, which removal would delete \(\.env\)/);
    assert.doesNotMatch(r.dry.reason, /node_modules/);
    assert.ok(!r.removed, "--clean removed it");
  });

  test("the name decides, not the content: an ignored build/ holding a hand-made file is removed", () => {
    const r = run("build/\n", { "build/notes.txt": "written by hand\n" });
    assert.deepEqual(r.dry.rebuildable, ["build/"]);
    assert.equal(r.dry.verdict, "remove", r.dry.reason);
    assert.match(r.dry.reason, /deletes rebuildable: build\//);
    assert.ok(r.removed);
  });

  test("an ambiguous name, such as bin/, is not on the list and keeps the worktree", () => {
    const r = run("bin/\n", { "bin/tool": "local\n" });
    assert.deepEqual(r.dry.ignored, ["bin/"]);
    assert.equal(r.dry.verdict, "keep");
    assert.ok(!r.removed);
  });

  test("--help names the list", () => {
    const help = tool(["--help"]).stdout;
    for (const n of ["node_modules", ".godot", "target", "__pycache__", "coverage"])
      assert.ok(help.includes(` ${n}`), n);
    assert.ok(help.split(/\r?\n/).every((l) => l.length <= 79), "a --help line is over 79 columns");
  });
});

test("--clean reports a failed command, runs the rest, and exits 1", () => {
  const s = scratch();
  try {
    const lib = repo(s.dir, "lib");
    const main = repo(s.dir);
    const file = ["-c", "protocol.file.allow=always"];
    execFileSync("git", ["-C", main, ...file, "submodule", "add", "-q", lib, "lib"], { stdio: "ignore" });
    git(main, "commit", "-q", "-m", "a submodule");
    git(main, "push", "-q", "origin", "main");
    // Git refuses to remove a worktree with an initialised submodule: two of
    // them, so whatever order the commands run in, one fails before another.
    const wts = ["a-sub", "b-plain", "c-sub"].map((n) =>
      addWorktree(main, path.join(s.dir, n), "--detach", "HEAD"),
    );
    for (const wt of [wts[0], wts[2]])
      execFileSync("git", ["-C", wt, ...file, "submodule", "update", "-q", "--init"], { stdio: "ignore" });
    for (const wt of wts) age(wt, 48);
    const r = tool(["--clean", "--json", main]);
    assert.equal(r.status, 1, r.stderr);
    const cmds = JSON.parse(r.stdout).repositories[0].commands;
    assert.equal(cmds.length, 3);
    assert.ok(cmds.every((c) => c.ran), "a command after the failure did not run");
    const outcome = Object.fromEntries(cmds.map((c) => [key(c.args[5]), c.ok]));
    assert.deepEqual(outcome, { [key(wts[0])]: false, [key(wts[1])]: true, [key(wts[2])]: false });
    for (const c of cmds.filter((c) => !c.ok)) assert.match(c.error, /submodule/);
    assert.ok(!existsSync(wts[1]) && existsSync(wts[0]) && existsSync(wts[2]));
    const text = tool(["--clean", main]);
    assert.equal(text.status, 1);
    assert.equal((text.stdout.match(/^ {2}FAILED git -C \S+ worktree remove \S+$/gm) || []).length, 2);
  } finally {
    s.done();
  }
});

test("a folder inside a repository lists its child repositories, not the outer one", () => {
  const s = scratch();
  try {
    const outer = repo(s.dir, "outer");
    commit(outer, ".gitignore", "clones/\nnested/\n");
    mkdirSync(path.join(outer, "docs"));
    commit(outer, "docs/a.txt", "tracked\n");
    const nested = repo(outer, "nested", s.dir);
    const alpha = repo(path.join(outer, "clones"), "alpha", s.dir);
    const alphaWt = addWorktree(alpha, path.join(outer, "clones", "alpha-review"), "--detach", "HEAD");
    const common = (rep) => rep.repositories.map((x) => key(x.commonDir)).sort();
    const r1 = tool(["--json", path.join(outer, "clones")]);
    assert.equal(r1.status, 0, r1.stderr);
    const rep1 = JSON.parse(r1.stdout);
    assert.deepEqual(common(rep1), [key(path.join(alpha, ".git"))]);
    assert.equal(worktreeAt(rep1, alphaWt).kind, "linked");
    assert.ok(rep1.warnings.some((m) => /inside the repository/.test(m)), rep1.warnings);
    // A repository's top that holds a clone as a direct child: both.
    const rep2 = report([outer]);
    assert.deepEqual(common(rep2), [path.join(nested, ".git"), path.join(outer, ".git")].map(key).sort());
    // A folder inside a repository that holds none: that repository, said so.
    const rep3 = report([path.join(outer, "docs")]);
    assert.deepEqual(common(rep3), [key(path.join(outer, ".git"))]);
    assert.ok(rep3.warnings.some((m) => /taken as the repository it is in/.test(m)), rep3.warnings);
  } finally {
    s.done();
  }
});

test("a detached main checkout is not reattached while its default is checked out elsewhere", () => {
  const s = scratch();
  try {
    const main = repo(s.dir);
    git(main, "switch", "-q", "--detach", "HEAD");
    const other = addWorktree(main, path.join(s.dir, "on-main"), "main");
    const rep = report(["--reattach", "--clean", main]);
    const wt = worktreeAt(rep, main);
    assert.equal(wt.verdict, "main detached");
    assert.match(wt.reason, /main is checked out in \S+\/on-main\b/);
    assert.equal(worktreeAt(rep, other).branch, "main");
    assert.deepEqual(rep.repositories[0].commands, []);
    assert.notEqual(
      spawnSync("git", ["-C", main, "symbolic-ref", "-q", "HEAD"], { stdio: "ignore" }).status,
      0,
    );
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
