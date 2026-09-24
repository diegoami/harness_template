// scaffold.test.mjs — node --test tools/scaffold.test.mjs
//
// Runs the real scaffold into temporary directories, and never with --github:
// nothing outside the temp directory is created. The tool runs from the
// working tree, but the files it copies come from the committed HEAD, so the
// suite refuses to run while any shipped file has uncommitted changes:
// commit first, or it would test content you are not looking at.

import { test, before } from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SCAFFOLD = path.join(path.dirname(fileURLToPath(import.meta.url)), "scaffold.mjs");
const REPO = path.dirname(path.dirname(SCAFFOLD));

before(() => {
  // Everything a preset ships, plus the presets and the generated README's
  // sources: an uncommitted change there would not reach the run.
  const shipped = new Set(["presets", "CLAUDE.md", "PLAN.md", "ROADMAP.md", "design/README.md"]);
  for (const p of ["light", "standard", "auto"])
    for (const f of JSON.parse(readFileSync(path.join(REPO, "presets", `${p}.json`), "utf8")).files)
      shipped.add(f);
  const dirty = execFileSync("git", ["-C", REPO, "status", "--porcelain", "--", ...shipped], {
    encoding: "utf8",
  }).trim();
  if (dirty)
    throw new Error(
      `commit first: these shipped files have uncommitted changes, and the tests generate from HEAD:\n${dirty}`,
    );
});

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
  ["an unbalanced single quote", "node --test 'tools/**/*.test.mjs"],
  ["an embedded newline", "node --test\nrm -rf x"],
  ["an embedded carriage return", "npm test\r"],
  ["an empty value", "   "],
]) {
  test(`--test with ${what} is refused before anything is written`, () => {
    const r = scaffold(["--test", value]);
    try {
      assert.notEqual(r.status, 0, "the scaffold accepted it");
      assert.match(r.stderr, /--test/);
      assert.match(r.stderr, /single quotes/, "no hint about shell quoting");
      assert.ok(
        r.stderr.includes(`--test 'node --test \\"tools/**/*.test.mjs\\"'`),
        "no working form for Windows PowerShell 5.1",
      );
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

for (const [what, value] of [
  // Three double quotes in the raw text, one of them escaped: balanced.
  ["an escaped double quote", 'node -e "a\\"b"'],
  // A double quote inside single quotes is literal in bash.
  ["a double quote inside single quotes", "echo 'a\"b'"],
  // An escaped backslash, then a closing quote.
  ["an escaped backslash before a quote", 'node -e "a\\\\"'],
]) {
  test(`${what} is read as bash reads it, and accepted`, () => {
    const r = scaffold(["--test", value]);
    try {
      assert.equal(r.status, 0, r.stderr);
    } finally {
      r.done();
    }
  });
}

test("a glob with no quotes is accepted with a warning, and every run prints its gate", () => {
  // What Windows PowerShell 5.1 leaves of the default after dropping quotes.
  const r = scaffold(["--test", "node --test tools/**/*.test.mjs"]);
  try {
    assert.equal(r.status, 0, r.stderr);
    assert.match(r.stderr, /glob but no quotes/);
    assert.match(r.stderr, /PowerShell 5\.1/);
    assert.match(r.stdout, /unit gate: node --test tools\/\*\*\/\*\.test\.mjs/);
  } finally {
    r.done();
  }
});

test("--help carries a note on quoting --test", () => {
  const r = spawnSync(process.execPath, [SCAFFOLD, "--help"], { encoding: "utf8" });
  assert.equal(r.status, 0);
  assert.ok(r.stdout.includes(`--test 'node --test "tools/**/*.test.mjs"'`), "no bash form");
  assert.ok(
    r.stdout.includes(`--test 'node --test \\"tools/**/*.test.mjs\\"'`),
    "no form for Windows PowerShell 5.1",
  );
});

// --- C8: what a generated run carries ------------------------------------

test("every preset names its milestones and its own plan file in the slot", () => {
  for (const [preset, planFile] of [
    ["light", "TBD — name the one file"],
    ["standard", "`PLAN.md`"],
    ["auto", "`PLAN.md`"],
  ]) {
    const r = scaffold(["--preset", preset]);
    try {
      assert.equal(r.status, 0, r.stderr);
      const claude = readFileSync(path.join(r.target, "CLAUDE.md"), "utf8");
      assert.match(claude, /\*\*milestones:\*\* annotated tags\s+`vX\.Y\.Z` on `main`/, preset);
      const line = claude.slice(claude.indexOf("**milestones:**"), claude.indexOf("- **the gates table"));
      assert.ok(line.includes(planFile), `${preset}: ${line}`);
      assert.ok(readdirSync(path.join(r.target, "reviews")).includes("milestone-prompt.md"), preset);
      const reviews = readFileSync(path.join(r.target, "reviews", "README.md"), "utf8");
      assert.match(reviews, /reviews\/v1\.2\.0-milestone-01\.md/, preset);
    } finally {
      r.done();
    }
  }
  // Without PLAN.md, the roadmap holds the claims.
  const r = scaffold(["--preset", "standard", "--plan", "no"]);
  try {
    assert.equal(r.status, 0, r.stderr);
    assert.match(readFileSync(path.join(r.target, "CLAUDE.md"), "utf8"), /claims: `ROADMAP\.md`/);
  } finally {
    r.done();
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
