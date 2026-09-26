// scaffold.test.mjs — node --test tools/scaffold.test.mjs
//
// Runs the real scaffold into temporary directories, and with --github only
// against a fake gh and a local bare repository in the temp directory:
// nothing outside the temp directory is created. The tool runs from the
// working tree, but the files it copies come from the committed HEAD, so the
// suite refuses to run while any shipped file has uncommitted changes:
// commit first, or it would test content you are not looking at.

import { test, before } from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  chmodSync,
  copyFileSync,
  existsSync,
  linkSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SCAFFOLD = path.join(path.dirname(fileURLToPath(import.meta.url)), "scaffold.mjs");
const REPO = path.dirname(path.dirname(SCAFFOLD));

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
});

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
      // r6 C13 (c), and C9 as extended: every preset ships the per-change prompt.
      assert.ok(readdirSync(path.join(r.target, "reviews")).includes("review-prompt.md"), preset);
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

// Every generated slot line fits 79 columns, except the gates table's rows.
function assertSlotWidth(target, what) {
  for (const line of slotOf(target).split(/\r?\n/))
    if (!line.startsWith("  |")) assert.ok(line.length <= 79, `${what}: ${line.length} columns: ${line}`);
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
      assertSlotWidth(r.target, tool);
    } finally {
      r.done();
    }
  }
});

test("every generated slot line fits 79 columns, for both premises and both tools", () => {
  for (const args of [
    [],
    ["--premise", "testbed"],
    ["--premise", "testbed", "--implementer", "opencode"],
    ["--preset", "auto"],
    ["--preset", "auto", "--implementer", "opencode"],
  ]) {
    const r = scaffold(args);
    try {
      assert.equal(r.status, 0, r.stderr);
      assertSlotWidth(r.target, args.join(" ") || "defaults");
    } finally {
      r.done();
    }
  }
});

test("the defaults: product, Claude Code, and each role's default in the slot", () => {
  const r = scaffold([]);
  try {
    assert.equal(r.status, 0, r.stderr);
    const slot = slotOf(r.target).replace(/\s+/g, " ");
    assert.match(slot, /\*\*premise:\*\* product —/);
    assert.ok(slot.includes("**implementer:** Claude Code, model `claude-opus-5-5`"), slot);
    assert.ok(slot.includes("**reviewer of each change:** a fresh subagent, `claude-opus-5-5`"), slot);
    assert.ok(
      slot.includes("**reviewer of releases:** a model that is not Claude, for example Codex or DeepSeek"),
      slot,
    );
  } finally {
    r.done();
  }
  // The change reviewer's default follows the implementer's model.
  const changed = scaffold(["--implementer-model", "claude-other-9"]);
  try {
    assert.equal(changed.status, 0, changed.stderr);
    assert.ok(
      slotOf(changed.target).replace(/\s+/g, " ").includes("**reviewer of each change:** a fresh subagent, `claude-other-9`"),
    );
  } finally {
    changed.done();
  }
});

test("blank interactive answers give the premise product and the tool Claude Code", () => {
  const r = scaffoldAsked([]);
  try {
    assert.equal(r.status, 0, r.stderr);
    const slot = slotOf(r.target).replace(/\s+/g, " ");
    assert.match(slot, /\*\*premise:\*\* product —/);
    assert.match(slot, /\*\*implementer:\*\* Claude Code, model `claude-opus-5-5`/);
  } finally {
    r.done();
  }
});

for (const [what, args, flag] of [
  ["an empty --reviewer", ["--reviewer", ""], "--reviewer"],
  ["a multi-line --reviewer", ["--reviewer", "one\ntwo"], "--reviewer"],
  ["a blank --milestone-reviewer", ["--milestone-reviewer", "   "], "--milestone-reviewer"],
  ["a backtick in --implementer-model", ["--implementer-model", "a`b"], "--implementer-model"],
]) {
  test(`${what} is refused before anything is written`, () => {
    const r = scaffold(args);
    try {
      assert.notEqual(r.status, 0, "the scaffold accepted it");
      assert.ok(r.stderr.includes(flag), r.stderr);
      assert.equal(existsSync(r.target), false, "the target was written");
    } finally {
      r.done();
    }
  });
}

test("an OpenCode run's AGENTS.md names the slot's models, and no other", () => {
  const r = scaffold([
    "--implementer", "opencode",
    "--implementer-model", "opencode/kimi-k3",
    "--reviewer", "Claude, `claude-opus-5-5`, a | b",
  ]);
  try {
    assert.equal(r.status, 0, r.stderr);
    const agents = readFileSync(path.join(r.target, "AGENTS.md"), "utf8");
    assert.ok(agents.includes("| implementer | `opencode/kimi-k3` |"), agents);
    // A | in the reviewer is escaped, so the table keeps its two columns.
    assert.ok(agents.includes("| reviewer | Claude, `claude-opus-5-5`, a \\| b |"), agents);
    assert.ok(agents.includes("`— Implementer (opencode/kimi-k3)`"), agents);
    assert.doesNotMatch(agents, /DeepSeek|deepseek|GPT-5\.6|gpt-5\.6/);
    assert.match(agents.replace(/\s+/g, " "), /the slot governs/);
  } finally {
    r.done();
  }
});

test("a Claude-mode run's AGENTS.md is the ref's, unchanged", () => {
  const r = scaffold(["--implementer", "claude-code", "--implementer-model", "claude-other-9"]);
  try {
    assert.equal(r.status, 0, r.stderr);
    const shipped = execFileSync("git", ["-C", REPO, "show", "HEAD:AGENTS.md"], { encoding: "utf8" });
    assert.equal(readFileSync(path.join(r.target, "AGENTS.md"), "utf8"), shipped);
  } finally {
    r.done();
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

// --- r6 C13: the scaffold's git and gh are cut off from the caller's -------

// The variables C13 names: they locate a repository or inject configuration.
const NAMED = [
  "GIT_DIR",
  "GIT_WORK_TREE",
  "GIT_INDEX_FILE",
  "GIT_COMMON_DIR",
  "GIT_OBJECT_DIRECTORY",
  "GIT_ALTERNATE_OBJECT_DIRECTORIES",
  "GIT_PREFIX",
  "GIT_CONFIG_PARAMETERS",
  "GIT_CONFIG_COUNT",
];
const isNamed = (key) =>
  NAMED.includes(key.toUpperCase()) || /^GIT_CONFIG_(KEY|VALUE)_\d+$/i.test(key);

// A decoy repository with a linked worktree, both in `dir`. A git hook run from
// that worktree exports GIT_DIR pointed at the worktree's gitdir.
function decoy(dir) {
  const main = path.join(dir, "decoy");
  const worktree = path.join(dir, "decoy-wt");
  const git = (cwd, ...args) =>
    execFileSync("git", ["-C", cwd, ...args], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  mkdirSync(main);
  git(main, "init", "-q", "-b", "main");
  writeFileSync(path.join(main, "f.txt"), "decoy\n");
  git(main, "add", "f.txt");
  git(main, "commit", "-q", "-m", "decoy");
  git(main, "worktree", "add", "-q", "-b", "wt", worktree);
  const gitdir = git(worktree, "rev-parse", "--absolute-git-dir").trim();
  const common = path.join(main, ".git");
  const digest = (file) =>
    existsSync(file) ? createHash("sha256").update(readFileSync(file)).digest("hex") : "absent";
  // The decoy's config, HEAD, refs and index.
  const state = () => ({
    config: readFileSync(path.join(common, "config"), "utf8"),
    head: readFileSync(path.join(common, "HEAD"), "utf8"),
    worktreeHead: readFileSync(path.join(gitdir, "HEAD"), "utf8"),
    refs: git(main, "for-each-ref", "--format=%(refname) %(objectname)"),
    index: digest(path.join(common, "index")),
    worktreeIndex: digest(path.join(gitdir, "index")),
  });
  return { worktree, gitdir, common, state };
}

// A fake gh: a copy of node named gh, which a preloaded script turns into gh,
// since Windows starts no script file as a program without a shell. It records
// its arguments and its environment, answers `api user`, and for `repo create
// --source <dir> --remote origin` does what gh does there: it runs git in
// <dir> to point origin at FAKE_GH_ORIGIN, a local bare repository.
const FAKE_GH = `
const { execFileSync } = require("node:child_process");
const { appendFileSync, writeSync } = require("node:fs");
const path = require("node:path");
if (/^gh(\\.exe)?$/i.test(path.basename(process.execPath))) {
  // Node took gh's first argument for a script to run; it is the subcommand.
  const args = [path.basename(process.argv[1]), ...process.argv.slice(2)];
  appendFileSync(process.env.FAKE_GH_LOG, JSON.stringify({ args, env: process.env }) + "\\n");
  if (args[0] === "api" && args[1] === "user") writeSync(1, "fake-owner\\n");
  else if (args[0] === "repo" && args[1] === "create") {
    const at = (flag) => args[args.indexOf(flag) + 1];
    execFileSync("git", ["-C", at("--source"), "remote", "add", at("--remote"), process.env.FAKE_GH_ORIGIN]);
  } else {
    writeSync(2, "fake gh: unexpected call " + args.join(" ") + "\\n");
    process.exit(1);
  }
  process.exit(0);
}
`;

function fakeGh(dir) {
  const bin = path.join(dir, "bin");
  mkdirSync(bin);
  const exe = path.join(bin, process.platform === "win32" ? "gh.exe" : "gh");
  try {
    linkSync(process.execPath, exe);
  } catch {
    copyFileSync(process.execPath, exe);
    if (process.platform !== "win32") chmodSync(exe, 0o755);
  }
  const script = path.join(dir, "fake-gh.cjs");
  writeFileSync(script, FAKE_GH);
  return { bin, script, log: path.join(dir, "gh-calls.jsonl") };
}

test("--github against a fake gh: the push lands, gh gets none of the caller's repository variables, and the decoy is untouched", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "scaffold-test-"));
  try {
    const d = decoy(dir);
    const origin = path.join(dir, "origin.git");
    execFileSync("git", ["init", "-q", "--bare", origin], { stdio: "ignore" });
    const gh = fakeGh(dir);
    const globalConfig = path.join(dir, "global.gitconfig");
    writeFileSync(globalConfig, "");
    const systemConfig = path.join(dir, "system.gitconfig");
    writeFileSync(systemConfig, "");
    const target = path.join(dir, "run");
    const pathKey = Object.keys(process.env).find((k) => k.toUpperCase() === "PATH") ?? "PATH";
    const env = {
      ...process.env,
      [pathKey]: gh.bin + path.delimiter + process.env[pathKey],
      NODE_OPTIONS: `--require "${gh.script.replaceAll("\\", "/")}"`,
      FAKE_GH_LOG: gh.log,
      FAKE_GH_ORIGIN: origin,
      // A real gh, had one run, would find no GitHub here.
      GH_HOST: "fake-gh.invalid",
      // What a hook run from the decoy's worktree exports, and injected
      // configuration that breaks any git that sees it.
      GIT_DIR: d.gitdir,
      GIT_WORK_TREE: d.worktree,
      GIT_INDEX_FILE: path.join(d.gitdir, "index"),
      GIT_COMMON_DIR: d.common,
      GIT_OBJECT_DIRECTORY: path.join(d.common, "objects"),
      GIT_ALTERNATE_OBJECT_DIRECTORIES: path.join(d.common, "objects"),
      GIT_PREFIX: "sub/",
      // Windows reads a variable's name in any case, so there this one is
      // given in mixed case, and must be cut off all the same.
      [process.platform === "win32" ? "Git_Config_Parameters" : "GIT_CONFIG_PARAMETERS"]:
        "'core.bare'='true'",
      GIT_CONFIG_COUNT: "1",
      GIT_CONFIG_KEY_0: "core.bare",
      GIT_CONFIG_VALUE_0: "true",
      // The user's own choice of config, which passes through.
      GIT_CONFIG_GLOBAL: globalConfig,
      GIT_CONFIG_SYSTEM: systemConfig,
      GIT_CONFIG_NOSYSTEM: "1",
    };
    const before = d.state();
    const r = spawnSync(
      process.execPath,
      [SCAFFOLD, "--yes", "--ref", "HEAD", "--name", "t", "--dir", target, "--github", "private"],
      { encoding: "utf8", env },
    );
    const calls = existsSync(gh.log)
      ? readFileSync(gh.log, "utf8").trim().split("\n").map((line) => JSON.parse(line))
      : [];
    for (const call of calls) {
      const what = `gh ${call.args.join(" ")}`;
      assert.deepEqual(Object.keys(call.env).filter(isNamed), [], `${what} received them`);
      for (const key of [
        "GIT_CONFIG_GLOBAL",
        "GIT_CONFIG_SYSTEM",
        "GIT_CONFIG_NOSYSTEM",
        "GIT_AUTHOR_NAME",
        "FAKE_GH_ORIGIN",
      ])
        assert.equal(call.env[key], env[key], `${what} lost ${key}`);
    }
    assert.equal(r.status, 0, r.stderr);
    assert.deepEqual(
      calls.map((call) => call.args),
      [
        ["api", "user", "--jq", ".login"],
        ["repo", "create", "fake-owner/t", "--private", "--source", target, "--remote", "origin"],
      ],
    );
    const rev = (cwd, ref) => execFileSync("git", ["-C", cwd, "rev-parse", ref], { encoding: "utf8" }).trim();
    assert.equal(rev(origin, "refs/heads/main"), rev(target, "HEAD"), "the push did not land main");
    assert.deepEqual(d.state(), before, "the decoy's config, HEAD, refs or index changed");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
