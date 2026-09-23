#!/usr/bin/env node
// scaffold.mjs — create a project from a tagged harness release.
//
//   node tools/scaffold.mjs                                   # asks
//   node tools/scaffold.mjs --yes --name my-app --dir ../my-app
//   node tools/scaffold.mjs --preset auto --name my-app --dir ../my-app --github private
//
// Copies the preset's files as they are at the ref, fills the project slot in
// CLAUDE.md, generates the README and (optionally) the CI workflow, initializes
// a fresh repository with one commit, and optionally creates the GitHub remote.
// No network unless --github is used.

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline/promises";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const PRESETS = ["light", "standard", "auto"];
const SLOT_BEGIN = "<!-- SLOT:BEGIN -->";
const SLOT_END = "<!-- SLOT:END -->";
const TBD = "TBD — the first session replaces this line";
const DEFAULT_TEST = 'node --test "tools/**/*.test.mjs"';

const CHOICES = {
  "--preset": PRESETS,
  "--github": ["none", "private", "public"],
  "--merge": ["owner", "auto"],
  "--design": ["required", "none"],
  "--plan": ["yes", "no"],
  "--roadmap": ["yes", "no"],
  "--ci": ["yes", "no"],
};
const VALUE_FLAGS = [
  "--name",
  "--dir",
  "--description",
  "--ref",
  "--tag",
  "--test",
  "--owner",
];

function fail(message) {
  console.error(`scaffold: ${message}`);
  process.exit(1);
}

function gitOutput(...args) {
  return execFileSync("git", ["-C", repoRoot, ...args], { encoding: "utf8" });
}

function gitShow(ref, file) {
  return execFileSync("git", ["-C", repoRoot, "show", `${ref}:${file}`], {
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
  });
}

function parseArgs(argv) {
  const opts = {};
  let refSeen = false;
  for (let i = 0; i < argv.length; i++) {
    let key = argv[i];
    let inline = null;
    const eq = key.indexOf("=");
    if (key.startsWith("--") && eq !== -1) {
      inline = key.slice(eq + 1);
      key = key.slice(0, eq);
    }
    if (key === "--yes" || key === "--interactive" || key === "--help") {
      if (inline !== null) fail(`${key} takes no value`);
      opts[key.slice(2)] = true;
      continue;
    }
    const value = inline !== null ? inline : argv[++i];
    if (value === undefined || value.startsWith("--")) {
      fail(`missing value for ${key}`);
    }
    if (key === "--ref" || key === "--tag") {
      if (refSeen) fail("--ref and --tag are aliases; give one");
      refSeen = true;
      opts.ref = value;
    } else if (CHOICES[key]) {
      if (!CHOICES[key].includes(value)) {
        fail(`${key} must be one of: ${CHOICES[key].join(", ")}`);
      }
      opts[key.slice(2)] = value;
    } else if (VALUE_FLAGS.includes(key)) {
      opts[key.slice(2)] = value;
    } else {
      fail(`unknown argument ${key}`);
    }
  }
  return opts;
}

function printHelp() {
  console.log(`Create a project from a tagged harness release.

  node tools/scaffold.mjs                        asks every question
  node tools/scaffold.mjs --yes --name <slug>    accepts every default
  node tools/scaffold.mjs --help                 this text

Questions and flags (each flag is asked when absent):
  --name <slug>          the repository name                       (required)
  --dir <path>           the target directory                      (../<name>)
  --description <text>   one paragraph for the project slot        (TBD)
  --preset <name>        ${PRESETS.join(" | ")}   (standard)
  --ref | --tag <ref>    the harness release to copy               (newest r* tag)
  --github <mode>        none | private | public                   (none)
  --merge <policy>       owner | auto                              (preset)
  --design <policy>      required | none                           (preset)
  --plan <yes|no>        copy PLAN.md                              (preset)
  --roadmap <yes|no>     copy ROADMAP.md                           (preset)
  --test <command>       the test command for the gates table      (${DEFAULT_TEST})
  --ci <yes|no>          write .github/workflows/check.yml          (yes with a remote)
  --owner <login>        the GitHub owner                          (gh login)
  --yes                  accept every default`);
}

let rl = null;
async function ask(question, def) {
  if (!rl) {
    rl = createInterface({ input: process.stdin, output: process.stdout });
  }
  const suffix = def !== undefined ? ` [${def}]` : "";
  const answer = (await rl.question(`${question}${suffix}: `)).trim();
  return answer || def;
}

async function askChoice(question, choices, def) {
  const answer = await ask(`${question} (${choices.join("|")})`, def);
  if (!choices.includes(answer)) {
    fail(`${question}: must be one of ${choices.join(", ")}`);
  }
  return answer;
}

function newestTag() {
  const tags = gitOutput("tag", "--list", "r*", "--sort=-v:refname")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  if (tags.length === 0) {
    fail("no r* tag found; pass --ref <commit|tag>");
  }
  return tags[0];
}

function resolveCommit(ref) {
  try {
    return gitOutput("rev-parse", `${ref}^{commit}`).trim();
  } catch {
    fail(`ref '${ref}' is not a tag or commit in ${repoRoot}`);
  }
}

function readPreset(sha, name) {
  let raw;
  try {
    raw = gitShow(sha, `presets/${name}.json`);
  } catch {
    fail(`preset '${name}' does not exist at this ref`);
  }
  return JSON.parse(raw);
}

function slotText({ name, description, merge, design, test, ci }) {
  const ciRow = ci
    ? `
  | CI | \`.github/workflows/check.yml\` | the unit gate | pull requests and \`main\` pushes | as CI runs | a red CI blocks the merge |`
    : "";
  return `- **product:** ${name} — ${description}
- **paths to inspect:** the source root and the documents worth reading by
  default.
- **paths to normally ignore:** generated, vendored or binary paths; read the
  lockfile only when dependencies are the task.
- **never read or echo:** secrets, signing material, one machine's paths. None
  are known; keep it that way and list them here when that changes.
- **merge:** ${merge}
- **design:** ${design}
- **the gates table:**

  | gate | command | covers | when | repeats | failure model |
  |---|---|---|---|---|---|
  | unit | \`${test}\` | the project's tests | every change | 1 | deterministic tests; repeats when a flaky gate appears |${ciRow}

- **conventions:** the player-facing language and the language of comments and
  commits; promises about build steps and dependencies; decided, and not to be
  re-opened; open work lives in \`ROADMAP.md\` when it exists.`;
}

function fillSlot(claude, slot) {
  const begin = claude.indexOf(SLOT_BEGIN);
  const end = claude.indexOf(SLOT_END);
  if (begin === -1 || end === -1 || end < begin) {
    fail("this ref predates the project-slot markers; use r3 or later");
  }
  return (
    claude.slice(0, begin + SLOT_BEGIN.length) +
    "\n\n" +
    slot +
    "\n\n" +
    claude.slice(end)
  );
}

function readmeText({
  name,
  ref,
  sha,
  preset,
  merge,
  design,
  plan,
  roadmap,
  ci,
  tbd,
}) {
  const steps = [];
  if (tbd) {
    steps.push(
      "Replace the `TBD` product line in `CLAUDE.md`'s project slot with one paragraph.",
    );
  }
  if (ci) {
    steps.push(`**Owner action — the remote.** Create it before the first iteration:

   \`\`\`sh
   gh repo create <owner>/${name} --private --source . --push
   \`\`\`

   A done-when that names CI is not met until the workflow has run green.`);
  }
  if (roadmap) {
    steps.push("Shape the first request in [`ROADMAP.md`](ROADMAP.md).");
  }
  if (plan) {
    steps.push(
      "Keep [`PLAN.md`](PLAN.md) and fill its iteration table, or delete it if the project does not slice work into iterations.",
    );
  }
  if (design === "required") {
    steps.push(
      "**OpenCode mode only:** for a non-trivial change, write the design record first ([`design/README.md`](design/README.md)). Claude mode has no design stage.",
    );
  }
  const list = steps.map((step, i) => `${i + 1}. ${step}`).join("\n");

  return `# ${name}

Scaffolded from the harness at \`${ref}\` (${sha.slice(0, 12)}), preset \`${preset}\`.

Read [\`AGENTS.md\`](AGENTS.md) if you work with OpenCode, or
[\`CLAUDE.md\`](CLAUDE.md) if you work with Claude Code. Both read
[\`PRINCIPLES.md\`](PRINCIPLES.md).

## Policy

- **merge:** \`${merge}\` — ${merge === "auto" ? "the implementer merges on a clean review plus green gates" : "the owner merges"}.
- **design:** \`${design}\` — ${design === "required" ? "OpenCode mode writes a design record before implementation" : "no design stage; the implementation review alone decides"}.

## First session

${list}
`;
}

function workflowText(test) {
  return `name: check

# Generated by the harness scaffold. One job, running the project's declared
# test command (CLAUDE.md, project slot). Pin a runtime here if the project
# needs one.
on:
  push:
    branches: [main]
  pull_request:

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - run: ${test}
`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) return printHelp();

  const interactive = args.interactive || (!args.name && !args.yes);
  const name =
    args.name ??
    (interactive ? await ask("Project name (repo slug)") : undefined);
  if (!name) fail("--name is required");
  const dir =
    args.dir ??
    (interactive ? await ask("Target directory", `../${name}`) : `../${name}`);

  const ref = args.ref ?? newestTag();
  const sha = resolveCommit(ref);

  const presetName =
    args.preset ??
    (interactive ? await askChoice("Preset", PRESETS, "standard") : "standard");
  const preset = readPreset(sha, presetName);

  let description = args.description;
  if (description === undefined && interactive) {
    description = await ask("Product description (empty writes TBD)");
  }
  if (!description) {
    if (!interactive && !args.yes) {
      fail("--description is required unless --yes");
    }
    description = TBD;
  }

  const github =
    args.github ??
    (interactive
      ? await askChoice("GitHub remote", ["none", "private", "public"], "none")
      : "none");
  const merge =
    args.merge ??
    (interactive
      ? await askChoice("Merge policy", ["owner", "auto"], preset.policy.merge)
      : preset.policy.merge);
  const design =
    args.design ??
    (interactive
      ? await askChoice(
          "Design stage (OpenCode mode)",
          ["required", "none"],
          preset.policy.design,
        )
      : preset.policy.design);
  const plan =
    (args.plan ?? (preset.policy.plan ? "yes" : "no")) === "yes";
  const roadmap =
    (args.roadmap ?? (preset.policy.roadmap ? "yes" : "no")) === "yes";
  const test = args.test ?? DEFAULT_TEST;
  const ci =
    (args.ci ?? (github === "none" ? "no" : "yes")) === "yes";

  if (merge === "auto" && github === "none") {
    console.warn(
      "scaffold: warning — merge: auto without a remote: the CI half of the merge condition cannot run.",
    );
  }

  // The file set is derived from the policy, not fixed per preset.
  const files = new Set(preset.files);
  plan ? files.add("PLAN.md") : files.delete("PLAN.md");
  roadmap ? files.add("ROADMAP.md") : files.delete("ROADMAP.md");
  design === "required"
    ? files.add("design/README.md")
    : files.delete("design/README.md");

  const target = path.resolve(process.cwd(), dir);
  if (existsSync(target) && readdirSync(target).length > 0) {
    fail(`target ${target} exists and is not empty`);
  }

  // Read everything before writing anything.
  const contents = new Map();
  for (const file of [...files].sort()) {
    try {
      contents.set(file, gitShow(sha, file));
    } catch {
      fail(`file '${file}' does not exist at ${ref}`);
    }
  }

  const tbd = description === TBD;
  const slot = slotText({ name, description, merge, design, test, ci });
  contents.set("CLAUDE.md", fillSlot(contents.get("CLAUDE.md"), slot));
  for (const [file, content] of contents) {
    contents.set(file, content.replaceAll("{{PROJECT}}", name));
  }

  mkdirSync(target, { recursive: true });
  for (const [file, content] of contents) {
    const destination = path.join(target, file);
    mkdirSync(path.dirname(destination), { recursive: true });
    writeFileSync(destination, content);
  }
  writeFileSync(
    path.join(target, "README.md"),
    readmeText({ name, ref, sha, preset: presetName, merge, design, plan, roadmap, ci, tbd }),
  );
  if (ci) {
    const workflow = path.join(target, ".github", "workflows", "check.yml");
    mkdirSync(path.dirname(workflow), { recursive: true });
    writeFileSync(workflow, workflowText(test));
  }

  try {
    execFileSync("git", ["init", "-b", "main"], { cwd: target, stdio: "pipe" });
    execFileSync("git", ["add", "-A"], { cwd: target, stdio: "pipe" });
    execFileSync(
      "git",
      ["commit", "-m", `Scaffold from harness ${ref} (${presetName})`],
      { cwd: target, stdio: "pipe" },
    );
  } catch (error) {
    const detail = error.stderr ? String(error.stderr) : String(error.message);
    fail(
      `the files are written, but the first commit failed.\n${detail}\n` +
        `Set a git identity (git config --global user.name / user.email) and ` +
        `commit in ${target}.`,
    );
  }

  if (github !== "none") {
    let owner = args.owner;
    try {
      owner =
        owner ??
        execFileSync("gh", ["api", "user", "--jq", ".login"], {
          encoding: "utf8",
        }).trim();
      execFileSync(
        "gh",
        [
          "repo",
          "create",
          `${owner}/${name}`,
          `--${github}`,
          "--source",
          target,
          "--remote",
          "origin",
        ],
        { cwd: target, stdio: "pipe" },
      );
      execFileSync("git", ["push", "-u", "origin", "main"], {
        cwd: target,
        stdio: "pipe",
      });
    } catch (error) {
      const detail = error.stderr ? String(error.stderr) : String(error.message);
      fail(
        `the local repository is created, but the GitHub step failed.\n${detail}\n` +
          `Create it by hand: gh repo create ${owner ?? "<owner>"}/${name} --${github} --source ${target} --push`,
      );
    }
  }

  console.log(`${name} created at ${target}`);
  console.log(
    `  ${contents.size} files from ${ref} (${sha.slice(0, 12)}), preset ${presetName}` +
      `, merge ${merge}, design ${design}, ci ${ci ? "yes" : "no"}`,
  );
  if (github !== "none") console.log(`  remote: https://github.com/${owner}/${name}`);
  else console.log("  no remote; see README.md to add one");
  console.log("  next: read the generated README.md");
  if (rl) rl.close();
}

await main();
