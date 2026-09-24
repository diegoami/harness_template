// post-record.test.mjs — node --test tools/post-record.test.mjs
//
// The tests never run `gh`. Dry runs use a runner that throws if called; the
// --confirm cases use FakeGitHub, which keeps issues and comments by id like
// GitHub does, reads each body from the file the command names, and returns
// only what was stored under the id asked for. One test runs `git` in a
// throwaway repository under the temp directory, to check the committed check.

import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync, rmSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  plan,
  run,
  splitDesign,
  sameBody,
  defaultCommitted,
  repoPath,
  shellQuote,
} from "./post-record.mjs";

const NEVER = () => {
  throw new Error("gh was called");
};
const COMMITTED = () => true;

function scratch() {
  const dir = mkdtempSync(path.join(tmpdir(), "post-record-"));
  return { dir, done: () => rmSync(dir, { recursive: true, force: true }) };
}

function write(dir, name, content) {
  const f = path.join(dir, name);
  writeFileSync(f, content, typeof content === "string" ? "utf8" : undefined);
  return f;
}

// Text that PowerShell and cp850 used to mangle, plus a placeholder.
const TRICKY = "# Review — r5 · C1…C11\n\nRange `<previous tag>..<candidate>`.\n";

const DESIGN = [
  "# 010 — A record\n\n**Status:** proposed\n\n## Problem\n\nText — with a dash.\n",
  "\n```text\nnot a verdict:\n\n---\n\n## Review — inside a fence\n```\n",
  "\n---\n\n## Review plan\n\nnot a verdict either\n",
  "\n---\n\n## Review — design stage\n\nBLOCK\n",
  "\n---\n\n## Review — design stage (revision 2, abc1234)\n\nAGREE\n",
].join("");

// A GitHub that stores what it is sent and serves it back by id. `mangle`
// lets a test corrupt what is stored, to prove the read-back notices.
class FakeGitHub {
  constructor({ mangle = (s) => s } = {}) {
    this.mangle = mangle;
    this.issues = new Map(); // number -> { title, body, comments: [id] }
    // PR 15's head: the files it holds (repo-relative) and their content.
    this.prs = new Map([["15", { comments: [], head: "c0ffee1", tree: new Map() }]]);
    this.comments = new Map(); // id -> { thread, body }
    this.next = { issue: 70, comment: 900 };
    this.calls = [];
    this.top = null; // the fake checkout's top-level directory
  }
  // Make PR 15's head hold `file` as it is now, in a checkout rooted at its dir.
  holds(file, content = readFileSync(file, "utf8")) {
    this.top = path.dirname(file);
    this.prs.get("15").tree.set(path.basename(file), content);
    return this;
  }
  git = (dir, args) => {
    if (args[0] === "rev-parse") return this.top + "\n";
    if (args[0] === "show") {
      const [oid, rel] = args[1].split(":");
      const pr = [...this.prs.values()].find((p) => p.head === oid);
      if (!pr || !pr.tree.has(rel)) throw new Error(`fatal: invalid object ${args[1]}`);
      return pr.tree.get(rel);
    }
    throw new Error("unexpected git " + args.join(" "));
  };
  thread(where, n) {
    return where === "pr" ? this.prs.get(n) : this.issues.get(n);
  }
  bodyFrom(args) {
    const i = args.indexOf("--body-file");
    assert.ok(i > 0, `gh ${args.join(" ")} did not use --body-file`);
    assert.ok(!args.includes("--body"), "gh was given --body text");
    return this.mangle(readFileSync(args[i + 1], "utf8"));
  }
  gh = (args) => {
    this.calls.push(args);
    const [a, b, n] = args;
    if (a === "issue" && b === "create") {
      const num = String(this.next.issue++);
      this.issues.set(num, {
        title: args[args.indexOf("--title") + 1],
        body: this.bodyFrom(args),
        comments: [],
      });
      return `https://github.com/o/r/issues/${num}\n`;
    }
    if ((a === "issue" || a === "pr") && b === "view") {
      const t = this.thread(a, n);
      if (!t) throw new Error(`no ${a} #${n}`);
      if (args.includes("body")) return JSON.stringify({ body: t.body });
      if (args.includes("headRefOid,files"))
        return JSON.stringify({
          headRefOid: t.head,
          files: [...t.tree.keys()].map((p) => ({ path: p })),
        });
      return JSON.stringify({
        comments: t.comments.map((id) => ({ body: this.comments.get(id).body })),
      });
    }
    if ((a === "issue" || a === "pr") && b === "comment") {
      const t = this.thread(a, n);
      if (!t) throw new Error(`no ${a} #${n}`);
      const id = String(this.next.comment++);
      this.comments.set(id, { thread: `${a}#${n}`, body: this.bodyFrom(args) });
      t.comments.push(id);
      return `https://github.com/o/r/${a === "pr" ? "pull" : "issues"}/${n}#issuecomment-${id}\n`;
    }
    if (a === "api") {
      const id = /issues\/comments\/([0-9]+)$/.exec(b)[1];
      return JSON.stringify({ body: this.comments.get(id).body });
    }
    throw new Error("unexpected gh " + args.join(" "));
  };
  posts() {
    return this.calls.filter((c) => c[1] === "create" || c[1] === "comment");
  }
}

// `fake` is a FakeGitHub (its gh and git are used) or a bare gh function.
function confirm(argv, fake, extra = {}) {
  const gh = typeof fake === "function" ? fake : fake.gh;
  const git = typeof fake === "function" ? NEVER : fake.git;
  run([...argv, "--confirm"], { gh, git, log: () => {}, committed: COMMITTED, ...extra });
}

// --- plans and body files -------------------------------------------------

test("a review body file is byte-identical to its source", () => {
  const s = scratch();
  try {
    const src = write(s.dir, "r.md", TRICKY);
    const p = plan(["review", src, "--pr", "15", "--out", s.dir]);
    assert.equal(p.actions.length, 1);
    const body = readFileSync(p.actions[0].bodyFile);
    assert.ok(body.equals(readFileSync(src)), "body bytes differ from source");
    assert.deepEqual(p.actions[0].gh.slice(0, 3), ["pr", "comment", "15"]);
  } finally {
    s.done();
  }
});

test("CRLF line endings survive untouched", () => {
  const s = scratch();
  try {
    const src = write(s.dir, "r.md", TRICKY.replace(/\n/g, "\r\n"));
    const p = plan(["reply", src, "--issue", "10", "--out", s.dir]);
    assert.ok(readFileSync(p.actions[0].bodyFile).equals(readFileSync(src)));
    assert.deepEqual(p.actions[0].gh.slice(0, 3), ["issue", "comment", "10"]);
  } finally {
    s.done();
  }
});

test("design body files, rejoined, are the record byte for byte (LF and CRLF)", () => {
  for (const text of [DESIGN, DESIGN.replace(/\n/g, "\r\n")]) {
    const s = scratch();
    try {
      const src = write(s.dir, "010-a-record.md", text);
      const p = plan(["design", src, "--out", s.dir]);
      const parts = splitDesign(text);
      const files = p.actions.map((a) => readFileSync(a.bodyFile));
      const rebuilt = Buffer.concat([
        files[0],
        ...files.slice(1).flatMap((f, i) => [Buffer.from(parts.separators[i], "utf8"), f]),
      ]);
      assert.ok(rebuilt.equals(readFileSync(src)), "design pieces do not rebuild the file");
      for (const f of files) assert.notEqual(f[0], 0xef, "a body file starts with a BOM");
    } finally {
      s.done();
    }
  }
});

test("a source with a byte-order mark is refused", () => {
  const s = scratch();
  try {
    const src = write(s.dir, "bom.md", "﻿" + TRICKY);
    assert.throws(() => plan(["review", src, "--pr", "15", "--out", s.dir]), /byte-order mark/);
  } finally {
    s.done();
  }
});

test("a source that is not valid UTF-8 is refused", () => {
  const s = scratch();
  try {
    const src = write(s.dir, "bad.md", Buffer.from([0x23, 0x20, 0xc3, 0x28, 0x0a]));
    assert.throws(() => plan(["review", src, "--pr", "15", "--out", s.dir]), /UTF-8/);
  } finally {
    s.done();
  }
});

test("only verdicts split a design record, not fences or other headings", () => {
  const parts = splitDesign(DESIGN);
  assert.equal(parts.verdicts.length, 2);
  assert.ok(parts.body.includes("## Review — inside a fence"));
  assert.ok(parts.body.includes("## Review plan"));
  assert.ok(parts.verdicts[0].startsWith("## Review — design stage\n"));
  assert.ok(parts.verdicts[1].includes("AGREE"));
});

test("fences follow CommonMark: matching closers, indentation, a rule after a fence", () => {
  const v = "\n---\n\n## Review — design stage\n\nAGREE\n";
  // A ~~~ line inside a ``` block does not close it.
  assert.equal(splitDesign("# R\n\n```\n~~~\n```\n" + v).verdicts.length, 1);
  // A verdict right after a closing fence is still a verdict (LF and CRLF).
  assert.equal(splitDesign("# R\n\n```\ncode\n```" + v).verdicts.length, 1);
  assert.equal(splitDesign(("# R\n\n```\ncode\n```" + v).replace(/\n/g, "\r\n")).verdicts.length, 1);
  // A fence indented up to 3 spaces hides what it holds.
  assert.equal(splitDesign("# R\n\n   ```\n" + v + "   ```\n").verdicts.length, 0);
  // A shorter closer does not close a longer fence.
  assert.equal(splitDesign("# R\n\n````\n```\n" + v + "````\n").verdicts.length, 0);
});

test("a design record checked out with CRLF line endings still splits", () => {
  const crlf = DESIGN.replace(/\n/g, "\r\n");
  const parts = splitDesign(crlf);
  assert.equal(parts.verdicts.length, 2, "verdicts lost on a CRLF checkout");
  assert.ok(parts.verdicts[0].startsWith("## Review — design stage\r\n"));
  assert.equal(
    parts.body + parts.verdicts.map((v, i) => parts.separators[i] + v).join(""),
    crlf,
  );
});

test("the title is the first heading outside a fence", () => {
  const s = scratch();
  try {
    const src = write(s.dir, "m.md", "```\n# not this\n```\n\n# r5 — the review loop\n\nBody.\n");
    const p = plan(["milestone", src, "--out", s.dir]);
    assert.equal(p.actions[0].title, "r5 — the review loop");
    const t = plan(["milestone", src, "--title", "Milestone: r5", "--out", s.dir]);
    assert.equal(t.actions[0].title, "Milestone: r5", "--title was ignored");
    const d = write(s.dir, "010-a-record.md", DESIGN);
    const td = plan(["design", d, "--title", "010: given", "--out", s.dir]);
    assert.equal(td.actions[0].title, "010: given", "--title was ignored");
  } finally {
    s.done();
  }
});

test("an option the kind does not take is an error, not ignored", () => {
  const s = scratch();
  try {
    const src = write(s.dir, "010-a-record.md", DESIGN);
    assert.throws(() => plan(["design", src, "--pr", "16", "--out", s.dir]), /does not take --pr/);
    assert.throws(() => plan(["review", src, "--issue", "16", "--out", s.dir]), /does not take --issue/);
    assert.throws(() => plan(["reply", src, "--pr", "1", "--issue", "2", "--out", s.dir]), /exactly one/);
    assert.throws(() => plan(["review", src, "--pr", "x", "--out", s.dir]), /must be a number/);
  } finally {
    s.done();
  }
});

// --- dry runs -------------------------------------------------------------

test("without --confirm nothing is posted, for every kind", () => {
  const s = scratch();
  try {
    const r = write(s.dir, "r.md", TRICKY);
    const d = write(s.dir, "010-a-record.md", DESIGN);
    for (const argv of [
      ["review", r, "--pr", "15"],
      ["reply", r, "--issue", "10"],
      ["milestone", r],
      ["design", d],
      ["design", d, "--issue", "70"],
    ]) {
      const lines = [];
      run([...argv, "--out", s.dir], { gh: NEVER, committed: NEVER, log: (l) => lines.push(l) });
      assert.ok(lines[0].startsWith("dry run"), argv.join(" "));
      assert.ok(lines.slice(1).every((l) => l.includes("--body-file")));
    }
    // A printed path with a space, or a Windows path, is quoted for bash.
    const out = path.join(s.dir, "with space");
    const lines = [];
    run(["review", r, "--pr", "15", "--out", out], { gh: NEVER, log: (l) => lines.push(l) });
    assert.ok(lines[1].includes(`--body-file '${out}`), lines[1]);
  } finally {
    s.done();
  }
});

// --- posting ----------------------------------------------------------------

test("--confirm: a review is posted to the PR and read back by its own id", () => {
  const s = scratch();
  try {
    const src = write(s.dir, "r.md", TRICKY);
    const gh = new FakeGitHub().holds(src);
    gh.prs.get("15").comments.push("1");
    gh.comments.set("1", { thread: "pr#15", body: "an older comment" });
    confirm(["review", src, "--pr", "15", "--out", s.dir], gh);
    assert.equal(gh.posts().length, 1);
    const id = gh.prs.get("15").comments.at(-1);
    assert.ok(sameBody(gh.comments.get(id).body, TRICKY));
    assert.ok(gh.calls.some((c) => c[0] === "api" && c[1].endsWith(`/comments/${id}`)));
  } finally {
    s.done();
  }
});

test("--confirm: a design record becomes an issue with its verdicts on that issue", () => {
  const s = scratch();
  try {
    const src = write(s.dir, "010-a-record.md", DESIGN.replace(/\n/g, "\r\n"));
    const gh = new FakeGitHub();
    gh.issues.set("69", { body: "someone else's issue", comments: [] });
    confirm(["design", src, "--out", s.dir], gh.gh);
    const issue = gh.issues.get("70");
    const parts = splitDesign(DESIGN);
    assert.equal(issue.title, "010 — A record");
    assert.ok(sameBody(issue.body, parts.body));
    assert.deepEqual(
      issue.comments.map((id) => gh.comments.get(id).body.replace(/\r\n/g, "\n")),
      parts.verdicts,
    );
    assert.equal(gh.issues.get("69").comments.length, 0, "a verdict went to the wrong issue");
    assert.ok(gh.calls.some((c) => c[0] === "issue" && c[1] === "view" && c[2] === "70" && c.includes("body")));
  } finally {
    s.done();
  }
});

test("--confirm with --issue posts only the verdicts the issue lacks", () => {
  const s = scratch();
  try {
    const src = write(s.dir, "010-a-record.md", DESIGN);
    const parts = splitDesign(DESIGN);
    const gh = new FakeGitHub();
    gh.issues.set("70", { body: parts.body, comments: ["1"] });
    gh.comments.set("1", { thread: "issue#70", body: parts.verdicts[0].replace(/\n/g, "\r\n") });
    confirm(["design", src, "--issue", "70", "--out", s.dir], gh.gh);
    assert.equal(gh.posts().length, 1);
    assert.ok(!gh.posts().some((c) => c[1] === "create"), "created a new issue");
    assert.equal(gh.comments.get(gh.issues.get("70").comments[1]).body, parts.verdicts[1]);
  } finally {
    s.done();
  }
});

test("--confirm: a milestone issue and a reply on an issue", () => {
  const s = scratch();
  try {
    const m = write(s.dir, "m.md", "# r5 — milestone\n\nCandidate `abc`.\n");
    const r = write(s.dir, "reply.md", TRICKY);
    const gh = new FakeGitHub();
    confirm(["milestone", m, "--out", s.dir], gh.gh);
    assert.equal(gh.issues.get("70").title, "r5 — milestone");
    confirm(["reply", r, "--issue", "70", "--out", s.dir], gh.gh);
    const id = gh.issues.get("70").comments[0];
    assert.ok(sameBody(gh.comments.get(id).body, TRICKY));
  } finally {
    s.done();
  }
});

test("--confirm fails loudly when what GitHub holds differs from the file", () => {
  const s = scratch();
  try {
    const r = write(s.dir, "r.md", TRICKY);
    const d = write(s.dir, "010-a-record.md", DESIGN);
    const mangle = (t) => t.replace("—", "ÔÇö");
    assert.throws(
      () => confirm(["review", r, "--pr", "15", "--out", s.dir], new FakeGitHub({ mangle }).holds(r)),
      /does not match/,
    );
    assert.throws(
      () => confirm(["design", d, "--out", s.dir], new FakeGitHub({ mangle }).gh),
      /issue #70 body does not match.*--issue 70/,
    );
  } finally {
    s.done();
  }
});

test("once an issue exists, any later failure says to rerun with --issue", () => {
  const s = scratch();
  try {
    const d = write(s.dir, "010-a-record.md", DESIGN);
    const gh = new FakeGitHub();
    const failVerdict = (args) => {
      if (args[0] === "issue" && args[1] === "comment") throw new Error("HTTP 502");
      return gh.gh(args);
    };
    assert.throws(
      () => confirm(["design", d, "--out", s.dir], failVerdict),
      /HTTP 502; issue #70 exists, so rerun with --issue 70/,
    );
  } finally {
    s.done();
  }
});

test("--confirm stops when gh prints an unexpected URL", () => {
  const s = scratch();
  try {
    const m = write(s.dir, "m.md", "# r5 — milestone\n\nBody.\n");
    const r = write(s.dir, "r.md", TRICKY);
    // An issue create that prints no issue URL: nothing to read back.
    const noUrl = new FakeGitHub();
    const quiet = (args) => (args[1] === "create" ? "Creating issue…\n" : noUrl.gh(args));
    assert.throws(() => confirm(["milestone", m, "--out", s.dir], quiet), /no issue URL/);
    // A comment URL on another thread: the comment did not land where asked.
    const other = new FakeGitHub().holds(r);
    const elsewhere = (args) => {
      const out = other.gh(args);
      return args[1] === "comment" ? out.replace("/pull/15#", "/pull/16#") : out;
    };
    assert.throws(
      () => confirm(["review", r, "--pr", "15", "--out", s.dir], elsewhere, { git: other.git }),
      /no comment URL for #15/,
    );
  } finally {
    s.done();
  }
});

test("a body already on the thread is not posted twice", () => {
  const s = scratch();
  try {
    const src = write(s.dir, "r.md", TRICKY);
    const gh = new FakeGitHub().holds(src);
    confirm(["review", src, "--pr", "15", "--out", s.dir], gh);
    confirm(["review", src, "--pr", "15", "--out", s.dir], gh);
    assert.equal(gh.posts().length, 1);
  } finally {
    s.done();
  }
});

test("--confirm posts a review only if the PR holds it at its head", () => {
  const s = scratch();
  try {
    const src = write(s.dir, "r.md", TRICKY);
    const other = write(s.dir, "README.md", "# harness\n");
    // Not one of the PR's files: the README.md slip on PR #15.
    const notInPr = new FakeGitHub().holds(src);
    assert.throws(
      () => confirm(["review", other, "--pr", "15", "--out", s.dir], notInPr),
      /not one of PR #15's files/,
    );
    // In the PR, but the local file differs from the PR's head (not pushed).
    const stale = new FakeGitHub().holds(src, "an older version\n");
    assert.throws(
      () => confirm(["review", src, "--pr", "15", "--out", s.dir], stale),
      /differs from PR #15's head/,
    );
    // The PR's head is not in this clone.
    const unfetched = new FakeGitHub().holds(src);
    const noObject = (d, a) => (a[0] === "show" ? NEVER() : unfetched.git(d, a));
    assert.throws(
      () => confirm(["review", src, "--pr", "15", "--out", s.dir], unfetched.gh, { git: noObject }),
      /not in this clone; git fetch/,
    );
    for (const f of [notInPr, stale, unfetched]) assert.equal(f.posts().length, 0);
    // The same text with other line endings is the same file.
    const crlf = new FakeGitHub().holds(src, TRICKY.replace(/\n/g, "\r\n"));
    confirm(["review", src, "--pr", "15", "--out", s.dir], crlf);
    assert.equal(crlf.posts().length, 1);
  } finally {
    s.done();
  }
});

test("--confirm refuses a design record that is not committed as it is", () => {
  const s = scratch();
  try {
    const src = write(s.dir, "r.md", TRICKY);
    const d = write(s.dir, "010-a-record.md", DESIGN);
    assert.throws(
      () => confirm(["design", d, "--out", s.dir], NEVER, { committed: () => false }),
      /not committed/,
    );
    // A reply or a milestone issue is not a repository record: no such check.
    const gh = new FakeGitHub();
    confirm(["milestone", write(s.dir, "m.md", "# M\n"), "--out", s.dir], gh.gh, { committed: NEVER });
    confirm(["reply", src, "--issue", "70", "--out", s.dir], gh.gh, { committed: NEVER });
    assert.equal(gh.posts().length, 2);
  } finally {
    s.done();
  }
});

test("the committed check: tracked and unmodified only (a local scratch repo)", () => {
  const s = scratch();
  try {
    const git = (...a) => execFileSync("git", ["-C", s.dir, ...a], { stdio: "ignore" });
    git("init", "-q");
    git("config", "user.email", "t@example.com");
    git("config", "user.name", "t");
    const tracked = write(s.dir, "tracked.md", TRICKY);
    git("add", "tracked.md");
    git("commit", "-q", "-m", "t");
    assert.equal(defaultCommitted(tracked), true);
    writeFileSync(tracked, TRICKY + "edited\n");
    assert.equal(defaultCommitted(tracked), false, "a modified file passed");
    git("add", "tracked.md");
    assert.equal(defaultCommitted(tracked), false, "a staged, uncommitted edit passed");
    assert.equal(defaultCommitted(write(s.dir, "new.md", TRICKY)), false, "an untracked file passed");
  } finally {
    s.done();
  }
});

// --- the gaps PR #15's review round 03 left (C2, extended) ----------------

test("a file in a subdirectory gets a forward-slash repository path, on any platform", () => {
  // Windows and POSIX rules explicitly, so the conversion is tested everywhere.
  assert.equal(
    repoPath("C:\\repo", "C:\\repo\\reviews\\010-x-impl-01.md", path.win32),
    "reviews/010-x-impl-01.md",
  );
  assert.equal(
    repoPath("/repo", "/repo/reviews/010-x-impl-01.md", path.posix),
    "reviews/010-x-impl-01.md",
  );
});

test("--confirm posts a review from a subdirectory the PR holds", () => {
  const s = scratch();
  try {
    mkdirSync(path.join(s.dir, "reviews"));
    const src = write(path.join(s.dir, "reviews"), "010-x-impl-01.md", TRICKY);
    const gh = new FakeGitHub();
    gh.top = s.dir;
    gh.prs.get("15").tree.set("reviews/010-x-impl-01.md", TRICKY);
    confirm(["review", src, "--pr", "15", "--out", s.dir], gh);
    assert.equal(gh.posts().length, 1);
    // The same name at the top level is not the file the PR holds.
    const gh2 = new FakeGitHub();
    gh2.top = s.dir;
    gh2.prs.get("15").tree.set("010-x-impl-01.md", TRICKY);
    assert.throws(
      () => confirm(["review", src, "--pr", "15", "--out", s.dir], gh2),
      /not one of PR #15's files/,
    );
  } finally {
    s.done();
  }
});

test("the PR check asks about the PR it was given, not a fixed one", () => {
  const s = scratch();
  try {
    const src = write(s.dir, "r.md", TRICKY);
    const gh = new FakeGitHub();
    gh.top = s.dir;
    gh.prs.set("23", { comments: [], head: "abc2323", tree: new Map([["r.md", TRICKY]]) });
    confirm(["review", src, "--pr", "23", "--out", s.dir], gh);
    assert.equal(gh.prs.get("23").comments.length, 1);
    assert.equal(gh.prs.get("15").comments.length, 0);
  } finally {
    s.done();
  }
});

test("shellQuote quotes a Windows path even without a space", () => {
  assert.equal(shellQuote("C:\\Users\\x\\r.body.md"), "'C:\\Users\\x\\r.body.md'");
  assert.equal(shellQuote("it's"), `'it'\\''s'`);
  assert.equal(shellQuote("reviews/r.md"), "reviews/r.md");
});

test("a closing-fence line with an info string does not close the fence", () => {
  const v = "\n---\n\n## Review — design stage\n\nAGREE\n";
  assert.equal(splitDesign("# R\n\n```\n```js\n" + v + "```\n").verdicts.length, 0);
});

test("run through a directory link, the tool still runs as a program", () => {
  const s = scratch();
  try {
    const tools = path.dirname(fileURLToPath(import.meta.url));
    const link = path.join(s.dir, "linked-tools");
    // A junction on Windows (no admin rights needed), a symlink elsewhere.
    symlinkSync(tools, link, "junction");
    const r = spawnSync(process.execPath, [path.join(link, "post-record.mjs"), "--help"], {
      encoding: "utf8",
    });
    assert.equal(r.status, 0, r.stderr);
    assert.match(r.stdout, /post-record — post a record/);
  } finally {
    s.done();
  }
});

test("sameBody ignores only line endings and trailing newlines", () => {
  assert.ok(sameBody("a\r\nb\n\n", "a\nb"));
  assert.ok(!sameBody("a — b\n", "a ÔÇö b\n"));
  assert.ok(!sameBody("a\n", " a\n"));
  assert.ok(!sameBody("a \nb\n", "a\nb\n"), "trailing spaces are content");
});
