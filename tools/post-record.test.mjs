// post-record.test.mjs — node --test tools/post-record.test.mjs
//
// The tests never run `gh`: every case uses a runner that throws if called,
// except the confirm cases, which use a fake runner that records calls and
// answers like `gh` would.

import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { plan, run, splitDesign, sameBody } from "./post-record.mjs";

const NEVER = () => {
  throw new Error("gh was called");
};

function scratch() {
  const dir = mkdtempSync(path.join(tmpdir(), "post-record-"));
  return { dir, done: () => rmSync(dir, { recursive: true, force: true }) };
}

// Text that PowerShell and cp850 used to mangle, plus a placeholder.
const TRICKY = "# Review — r5 · C1…C11\n\nRange `<previous tag>..<candidate>`.\n";

const DESIGN = [
  "# 010 — A record\n\n**Status:** proposed\n\n## Problem\n\nText — with a dash.\n",
  "\n---\n\n## Review — design stage\n\nBLOCK\n",
  "\n---\n\n## Review — design stage (revision 2, abc1234)\n\nAGREE\n",
].join("");

test("a review body file is byte-identical to its source", () => {
  const s = scratch();
  try {
    const src = path.join(s.dir, "r.md");
    writeFileSync(src, TRICKY, "utf8");
    const p = plan(["review", src, "--pr", "9", "--out", s.dir]);
    assert.equal(p.actions.length, 1);
    const body = readFileSync(p.actions[0].bodyFile);
    assert.ok(body.equals(readFileSync(src)), "body bytes differ from source");
    assert.notEqual(body[0], 0xef, "body starts with a byte-order mark");
    assert.deepEqual(p.actions[0].gh.slice(0, 3), ["pr", "comment", "9"]);
    assert.ok(p.actions[0].gh.includes("--body-file"));
  } finally {
    s.done();
  }
});

test("CRLF line endings survive untouched", () => {
  const s = scratch();
  try {
    const src = path.join(s.dir, "r.md");
    writeFileSync(src, TRICKY.replace(/\n/g, "\r\n"), "utf8");
    const p = plan(["reply", src, "--issue", "10", "--out", s.dir]);
    assert.ok(readFileSync(p.actions[0].bodyFile).equals(readFileSync(src)));
    assert.deepEqual(p.actions[0].gh.slice(0, 3), ["issue", "comment", "10"]);
  } finally {
    s.done();
  }
});

test("a source with a byte-order mark is refused", () => {
  const s = scratch();
  try {
    const src = path.join(s.dir, "bom.md");
    writeFileSync(src, "﻿" + TRICKY, "utf8");
    assert.throws(
      () => plan(["review", src, "--pr", "9", "--out", s.dir]),
      /byte-order mark/,
    );
  } finally {
    s.done();
  }
});

test("a source that is not valid UTF-8 is refused", () => {
  const s = scratch();
  try {
    const src = path.join(s.dir, "bad.md");
    writeFileSync(src, Buffer.from([0x23, 0x20, 0xc3, 0x28, 0x0a]));
    assert.throws(
      () => plan(["review", src, "--pr", "9", "--out", s.dir]),
      /UTF-8/,
    );
  } finally {
    s.done();
  }
});

test("a design record splits into the issue body and one comment per verdict", () => {
  const parts = splitDesign(DESIGN);
  assert.equal(parts.verdicts.length, 2);
  assert.ok(parts.body.startsWith("# 010 — A record"));
  assert.ok(!parts.body.includes("## Review"));
  assert.ok(parts.verdicts[0].startsWith("## Review — design stage\n"));
  assert.ok(parts.verdicts[1].includes("AGREE"));
  // Nothing is lost or invented: the pieces rebuild the record exactly.
  assert.equal(
    parts.body + parts.verdicts.map((v) => "\n---\n\n" + v).join(""),
    DESIGN,
  );
});

test("a design record checked out with CRLF line endings still splits", () => {
  const crlf = DESIGN.replace(/\n/g, "\r\n");
  const parts = splitDesign(crlf);
  assert.equal(parts.verdicts.length, 2, "verdicts lost on a CRLF checkout");
  assert.ok(parts.verdicts[0].startsWith("## Review — design stage\r\n"));
  assert.equal(parts.body + parts.verdicts.map((v, i) => parts.separators[i] + v).join(""), crlf);
});

test("a new design record plans one issue, then its verdicts on that issue", () => {
  const s = scratch();
  try {
    const src = path.join(s.dir, "010-a-record.md");
    writeFileSync(src, DESIGN, "utf8");
    const p = plan(["design", src, "--out", s.dir]);
    assert.deepEqual(
      p.actions.map((a) => a.kind),
      ["issue", "comment", "comment"],
    );
    assert.equal(p.actions[0].title, "010 — A record");
    assert.deepEqual(p.actions[1].gh.slice(0, 3), ["issue", "comment", "{issue}"]);
  } finally {
    s.done();
  }
});

test("a milestone issue takes its title from its first heading", () => {
  const s = scratch();
  try {
    const src = path.join(s.dir, "m.md");
    writeFileSync(src, "# r5 — the review loop on GitHub\n\nBody.\n", "utf8");
    const p = plan(["milestone", src, "--out", s.dir]);
    assert.equal(p.actions[0].title, "r5 — the review loop on GitHub");
    assert.deepEqual(p.actions[0].gh.slice(0, 2), ["issue", "create"]);
  } finally {
    s.done();
  }
});

test("without --confirm nothing is posted", () => {
  const s = scratch();
  try {
    const src = path.join(s.dir, "r.md");
    writeFileSync(src, TRICKY, "utf8");
    const lines = [];
    run(["review", src, "--pr", "9", "--out", s.dir], {
      gh: NEVER,
      log: (l) => lines.push(l),
    });
    assert.ok(lines.some((l) => /dry run/.test(l)));
    assert.ok(lines.some((l) => l.includes("gh pr comment 9 --body-file")));
  } finally {
    s.done();
  }
});

test("--confirm posts, reads the comment back, and fails on a mismatch", () => {
  const s = scratch();
  try {
    const src = path.join(s.dir, "r.md");
    writeFileSync(src, TRICKY, "utf8");
    const calls = [];
    const fakeGh = (stored) => (args) => {
      calls.push(args);
      if (args[0] === "pr" && args[1] === "view") return JSON.stringify({ comments: [] });
      if (args[0] === "pr" && args[1] === "comment")
        return "https://github.com/o/r/pull/9#issuecomment-42\n";
      if (args[0] === "api") return JSON.stringify({ body: stored });
      throw new Error("unexpected gh " + args.join(" "));
    };
    // GitHub stores CRLF and drops the final newline: still the same body.
    run(["review", src, "--pr", "9", "--out", s.dir, "--confirm"], {
      gh: fakeGh(TRICKY.replace(/\n/g, "\r\n").trimEnd()),
      log: () => {},
    });
    assert.ok(calls.some((c) => c[0] === "api"), "no read-back");
    // A mangled body must fail loudly.
    assert.throws(
      () =>
        run(["review", src, "--pr", "9", "--out", s.dir, "--confirm"], {
          gh: fakeGh(TRICKY.replace("—", "ÔÇö")),
          log: () => {},
        }),
      /does not match/,
    );
  } finally {
    s.done();
  }
});

test("a body already on the thread is not posted twice", () => {
  const s = scratch();
  try {
    const src = path.join(s.dir, "r.md");
    writeFileSync(src, TRICKY, "utf8");
    const calls = [];
    run(["review", src, "--pr", "9", "--out", s.dir, "--confirm"], {
      gh: (args) => {
        calls.push(args);
        if (args[0] === "pr" && args[1] === "view")
          return JSON.stringify({ comments: [{ body: TRICKY.trimEnd() }] });
        throw new Error("posted a duplicate: gh " + args.join(" "));
      },
      log: () => {},
    });
    assert.ok(!calls.some((c) => c[1] === "comment"));
  } finally {
    s.done();
  }
});

test("sameBody ignores only line endings and trailing newlines", () => {
  assert.ok(sameBody("a\r\nb\n\n", "a\nb"));
  assert.ok(!sameBody("a — b\n", "a ÔÇö b\n"));
  assert.ok(!sameBody("a\n", " a\n"));
});
