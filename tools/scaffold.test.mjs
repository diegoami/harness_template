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

// --- r6 C6 and C7: the roles, the premise and the mode --------------------

function slotOf(target) {
  const claude = readFileSync(path.join(target, "CLAUDE.md"), "utf8");
  return claude.slice(claude.indexOf("<!-- SLOT:BEGIN -->"), claude.indexOf("<!-- SLOT:END -->"));
}

// Answers the questions on stdin, one per line; a blank line takes the
// default. The flags given here are not asked.
function scaffoldAsked(answers, args = []) {
  const dir = mkdtempSync(path.join(tmpdir(), "scaffold-test-"));
  const target = path.join(dir, "run");
  const r = spawnSync(
    process.execPath,
    [SCAFFOLD, "--interactive", "--ref", "HEAD", "--name", "t", "--dir", target, ...args],
    { encoding: "utf8", input: [...answers, ...Array(20).fill("")].join("\n") },
  );
  return { ...r, dir, target, done: () => rmSync(dir, { recursive: true, force: true }) };
}

test("the role and premise flags land in the slot, and the mode is the implementer's tool's", () => {
  for (const [tool, premise, label, mode] of [
    ["claude-code", "testbed", "Claude Code", "Claude mode"],
    ["opencode", "product", "OpenCode", "OpenCode mode"],
  ]) {
    const r = scaffold([
      "--premise", premise,
      "--implementer", tool,
      "--implementer-model", `model-of-${tool}`,
      "--reviewer", `change reviewer for ${tool}`,
      "--milestone-reviewer", `release reviewer for ${tool}`,
    ]);
    try {
      assert.equal(r.status, 0, r.stderr);
      const slot = slotOf(r.target).replace(/\s+/g, " ");
      assert.match(slot, new RegExp(`\\*\\*premise:\\*\\* ${premise} —`), tool);
      assert.ok(slot.includes(`**implementer:** ${label}, model \`model-of-${tool}\``), `${tool}: ${slot}`);
      assert.ok(slot.includes(`works in ${mode}`), `${tool}: no mode in ${slot}`);
      assert.ok(slot.includes(`**reviewer of each change:** change reviewer for ${tool}`), tool);
      assert.ok(slot.includes(`**reviewer of releases:** release reviewer for ${tool}`), tool);
    } finally {
      r.done();
    }
  }
});

test("the roles and the premise are asked interactively, and land in the slot", () => {
  const r = scaffoldAsked(["", "", "testbed", "opencode", "oc/model", "rev one", "rev two"]);
  try {
    assert.equal(r.status, 0, r.stderr);
    for (const question of [/Premise/, /Implementer's tool/, /Implementer's model id/, /Reviewer of each change/, /Reviewer of releases/])
      assert.match(r.stdout, question);
    const slot = slotOf(r.target);
    assert.match(slot, /\*\*premise:\*\* testbed —/);
    assert.ok(slot.includes("**implementer:** OpenCode, model `oc/model`"), slot);
    assert.ok(slot.includes("**reviewer of each change:** rev one"), slot);
    assert.ok(slot.includes("**reviewer of releases:** rev two"), slot);
  } finally {
    r.done();
  }
});

test("a run whose implementer's tool is Claude Code has no design: line and is not asked for one", () => {
  const asked = scaffoldAsked(["standard", "", "", "claude-code"]);
  try {
    assert.equal(asked.status, 0, asked.stderr);
    assert.match(asked.stdout, /Implementer's tool/, "the questions were not shown");
    assert.doesNotMatch(asked.stdout, /Design stage/);
    assert.doesNotMatch(slotOf(asked.target), /\*\*design:\*\*/);
    assert.equal(existsSync(path.join(asked.target, "design", "README.md")), false);
  } finally {
    asked.done();
  }
  // The default tool is Claude Code, even for a preset whose design policy is
  // required; and --design is refused there rather than ignored.
  const r = scaffold(["--preset", "standard"]);
  try {
    assert.equal(r.status, 0, r.stderr);
    assert.match(slotOf(r.target), /\*\*implementer:\*\* Claude Code/);
    assert.doesNotMatch(slotOf(r.target), /\*\*design:\*\*/);
    assert.doesNotMatch(readFileSync(path.join(r.target, "README.md"), "utf8"), /\*\*design:\*\*/);
  } finally {
    r.done();
  }
  const refused = scaffold(["--implementer", "claude-code", "--design", "required"]);
  try {
    assert.notEqual(refused.status, 0, "--design was accepted in Claude mode");
    assert.match(refused.stderr, /--design/);
    assert.equal(existsSync(refused.target), false, "the target was written");
  } finally {
    refused.done();
  }
});

test("a run whose implementer's tool is OpenCode is asked for design and has the line", () => {
  const asked = scaffoldAsked(["standard", "", "", "opencode", "", "", "", "", "", "none"]);
  try {
    assert.equal(asked.status, 0, asked.stderr);
    assert.match(asked.stdout, /Design stage/);
    assert.match(slotOf(asked.target), /\*\*design:\*\* none — OpenCode mode only/);
  } finally {
    asked.done();
  }
  const r = scaffold(["--preset", "standard", "--implementer", "opencode"]);
  try {
    assert.equal(r.status, 0, r.stderr);
    assert.match(slotOf(r.target), /\*\*design:\*\* required — OpenCode mode only/);
    assert.ok(existsSync(path.join(r.target, "design", "README.md")));
  } finally {
    r.done();
  }
});

test("a generated run's .gitignore lists .claude/worktrees/", () => {
  const r = scaffold([]);
  try {
    assert.equal(r.status, 0, r.stderr);
    const ignore = readFileSync(path.join(r.target, ".gitignore"), "utf8");
    assert.ok(ignore.split(/\r?\n/).includes(".claude/worktrees/"), ignore);
    const tracked = execFileSync("git", ["-C", r.target, "ls-files"], { encoding: "utf8" });
    assert.ok(tracked.split("\n").includes(".gitignore"), "not in the first commit");
  } finally {
    r.done();
  }
});

test("the never-echo item describes a path outside the repository relative to it", () => {
  const r = scaffold([]);
  try {
    assert.equal(r.status, 0, r.stderr);
    const slot = slotOf(r.target);
    const item = slot.slice(slot.indexOf("**never read or echo:**"), slot.indexOf("- **merge:**"));
    assert.match(item, /outside the repository[\s\S]*relative to it/, item);
  } finally {
    r.done();
  }
});

test("under merge: auto, the main session merges in Claude mode and the implementer in OpenCode mode", () => {
  for (const [tool, who] of [
    ["claude-code", "the main session merges"],
    ["opencode", "the implementer merges"],
  ]) {
    const r = scaffold(["--preset", "auto", "--implementer", tool]);
    try {
      assert.equal(r.status, 0, r.stderr);
      const conditions = slotOf(r.target).slice(slotOf(r.target).indexOf("merge conditions:"));
      assert.match(conditions.split("- **")[0].replace(/\s+/g, " "), new RegExp(who), tool);
      const readme = readFileSync(path.join(r.target, "README.md"), "utf8");
      assert.match(readme, new RegExp(`merge:\\*\\* \`auto\` — ${who}`), tool);
    } finally {
      r.done();
    }
  }
});

test("--help names the role, premise and implementer flags", () => {
  const r = spawnSync(process.execPath, [SCAFFOLD, "--help"], { encoding: "utf8" });
  assert.equal(r.status, 0);
  for (const flag of ["--premise", "--implementer ", "--implementer-model", "--reviewer", "--milestone-reviewer"])
    assert.ok(r.stdout.includes(flag), flag);
  assert.match(r.stdout, /--design[^\n]*OpenCode/);
});
