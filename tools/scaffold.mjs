#!/usr/bin/env node
// scaffold.mjs — create a run repository from a tagged harness release.
//
//   node tools/scaffold.mjs --tag r1 --name toy-r1 --dir ../toy-r1
//   node tools/scaffold.mjs --ref <commit|tag> --name <name> --dir <path>
//
// Copies the files listed in scaffold.manifest.json as they are at the ref,
// replaces {{PROJECT}}, generates a README, and initializes a fresh repository
// with one commit. No network, no GitHub.

import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

function fail(message) {
  console.error(`scaffold: ${message}`);
  process.exit(1);
}

function parseArgs(argv) {
  const args = { tag: null, ref: null, name: null, dir: null };
  for (let i = 0; i < argv.length; i++) {
    const key = argv[i];
    const value = argv[i + 1];
    if (!value || value.startsWith("--")) fail(`missing value for ${key}`);
    if (key === "--tag") args.tag = value;
    else if (key === "--ref") args.ref = value;
    else if (key === "--name") args.name = value;
    else if (key === "--dir") args.dir = value;
    else fail(`unknown argument ${key}`);
    i++;
  }
  return args;
}

const args = parseArgs(process.argv.slice(2));
if (!args.name) fail("--name is required");
if (!args.dir) fail("--dir is required");
const ref = args.ref ?? args.tag;
if (!ref) fail("--tag (or --ref) is required, e.g. --tag r1");

const manifestPath = path.join(repoRoot, "scaffold.manifest.json");
if (!existsSync(manifestPath)) {
  fail(`scaffold.manifest.json not found in ${repoRoot}`);
}
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

let sha;
try {
  sha = execFileSync("git", ["-C", repoRoot, "rev-parse", `${ref}^{commit}`], {
    encoding: "utf8",
  }).trim();
} catch {
  fail(`ref '${ref}' is not a tag or commit in ${repoRoot}`);
}

const target = path.resolve(process.cwd(), args.dir);
if (existsSync(target) && readdirSync(target).length > 0) {
  fail(`target ${target} exists and is not empty`);
}

// Read everything before writing anything, so a missing file leaves no
// half-written target behind.
const files = [];
for (const file of manifest.files) {
  let content;
  try {
    content = execFileSync("git", ["-C", repoRoot, "show", `${sha}:${file}`], {
      encoding: "utf8",
      maxBuffer: 16 * 1024 * 1024,
    });
  } catch {
    fail(`manifest file '${file}' does not exist at ${ref}`);
  }
  files.push([file, content.replaceAll("{{PROJECT}}", args.name)]);
}

mkdirSync(target, { recursive: true });
for (const [file, content] of files) {
  const destination = path.join(target, file);
  mkdirSync(path.dirname(destination), { recursive: true });
  writeFileSync(destination, content);
}

const readme = `# ${args.name}

Scaffolded from the harness at \`${ref}\` (${sha.slice(0, 12)}).

Read [\`AGENTS.md\`](AGENTS.md) if you work with OpenCode, or
[\`CLAUDE.md\`](CLAUDE.md) if you work with Claude Code. Both read
[\`PRINCIPLES.md\`](PRINCIPLES.md).

## First session

1. Fill the **project slot** at the end of \`CLAUDE.md\`: the product paragraph,
   the paths, the gates table, the conventions.
2. Shape the first request in [\`ROADMAP.md\`](ROADMAP.md), or delete it if the
   project does not grow by requests.
3. Delete [\`PLAN.md\`](PLAN.md) if the project does not slice work into
   iterations.

## Optional remote

\`\`\`sh
gh repo create <owner>/${args.name} --source . --push
\`\`\`
`;

writeFileSync(path.join(target, "README.md"), readme);

try {
  execFileSync("git", ["init", "-b", "main"], { cwd: target, stdio: "pipe" });
  execFileSync("git", ["add", "-A"], { cwd: target, stdio: "pipe" });
  execFileSync("git", ["commit", "-m", `Scaffold from harness ${ref}`], {
    cwd: target,
    stdio: "pipe",
  });
} catch (error) {
  const detail = error.stderr ? String(error.stderr) : String(error.message);
  fail(
    `the files are written, but the first commit failed.\n${detail}\n` +
      `Set a git identity (git config --global user.name / user.email) and ` +
      `commit in ${target}.`,
  );
}

console.log(`${args.name} created at ${target}`);
console.log(
  `  ${manifest.files.length} harness files from ${ref} (${sha.slice(0, 12)})`,
);
console.log("  next: open a session and fill the project slot in CLAUDE.md");
