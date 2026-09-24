// scaffold.test.mjs — node --test tools/scaffold.test.mjs
//
// Runs the real scaffold into temporary directories, from the committed HEAD
// of this checkout, and never with --github: nothing outside the temp
// directory is created.

import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SCAFFOLD = path.join(path.dirname(fileURLToPath(import.meta.url)), "scaffold.mjs");

function scaffold(args) {
  const dir = mkdtempSync(path.join(tmpdir(), "scaffold-test-"));
  const target = path.join(dir, "run");
  const r = spawnSync(
    process.execPath,
    [SCAFFOLD, "--yes", "--ref", "HEAD", "--name", "t", "--dir", target, ...args],
    { encoding: "utf8" },
  );
  return { ...r, dir, target, done: () => rmSync(dir, { recursive: true, force: true }) };
}

// --- C9: the --test guard --------------------------------------------------

for (const [what, value] of [
  ["an unbalanced double quote", 'node --test "tools/**/*.test.mjs'],
  ["an embedded newline", "node --test\nrm -rf x"],
  ["an embedded carriage return", "npm test\r"],
]) {
  test(`--test with ${what} is refused before anything is written`, () => {
    const r = scaffold(["--test", value]);
    try {
      assert.notEqual(r.status, 0, "the scaffold accepted it");
      assert.match(r.stderr, /--test/);
      assert.match(r.stderr, /quot/i, "no hint about shell quoting");
      assert.equal(existsSync(r.target), false, "the target was written");
    } finally {
      r.done();
    }
  });
}

test("a well-quoted --test value is accepted and lands in the gates table", () => {
  const r = scaffold(["--test", 'node --test "tools/**/*.test.mjs"']);
  try {
    assert.equal(r.status, 0, r.stderr);
    const claude = readFileSync(path.join(r.target, "CLAUDE.md"), "utf8");
    assert.ok(claude.includes('`node --test "tools/**/*.test.mjs"`'));
  } finally {
    r.done();
  }
});

test("--help carries a note on quoting --test", () => {
  const r = spawnSync(process.execPath, [SCAFFOLD, "--help"], { encoding: "utf8" });
  assert.equal(r.status, 0);
  assert.match(r.stdout, /quot/i);
  assert.match(r.stdout, /PowerShell/);
});

// --- C8: what a generated run carries ------------------------------------

test("every preset names its milestones and plan in the slot", () => {
  for (const preset of ["light", "standard", "auto"]) {
    const r = scaffold(["--preset", preset]);
    try {
      assert.equal(r.status, 0, r.stderr);
      const claude = readFileSync(path.join(r.target, "CLAUDE.md"), "utf8");
      assert.match(claude, /\*\*milestones:\*\* annotated tags `vX\.Y\.Z` on `main`/, preset);
      assert.ok(readdirSync(path.join(r.target, "reviews")).includes("milestone-prompt.md"), preset);
    } finally {
      r.done();
    }
  }
});

test("merge: auto names posted reviews in its merge conditions and README", () => {
  const r = scaffold(["--preset", "auto"]);
  try {
    assert.equal(r.status, 0, r.stderr);
    const claude = readFileSync(path.join(r.target, "CLAUDE.md"), "utf8");
    const readme = readFileSync(path.join(r.target, "README.md"), "utf8");
    assert.match(claude, /merge conditions:\*\*[\s\S]*?posted/);
    assert.match(readme, /merge:\*\* `auto` — [^\n]*posted/);
  } finally {
    r.done();
  }
});
