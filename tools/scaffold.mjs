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

// The harness has one mode per tool, so the implementer's tool picks the mode.
// The defaults are the current assignment, not the rule.
const TOOLS = {
  "claude-code": {
    name: "Claude Code",
    mode: "Claude mode",
    where: "`CLAUDE.md`, *The process*",
    merger: "the main session",
    model: "claude-opus-5-5",
    reviewer: "a fresh Claude Code subagent, the implementer's model family",
    milestoneReviewer: "DeepSeek, `opencode/deepseek-v4.1-flash`, through `opencode run`",
  },
  opencode: {
    name: "OpenCode",
    mode: "OpenCode mode",
    where: "`AGENTS.md`",
    merger: "the implementer",
    model: "opencode/deepseek-v4.1-flash",
    reviewer: "GPT-5.6 Luna, high effort, `opencode/gpt-5.6-luna#high`, as a subagent",
    milestoneReviewer: "Claude, `claude-opus-5-5`, through Claude Code",
  },
};
const PREMISES = {
  product: "the project's content is the deliverable",
  testbed:
    "the project exists to exercise the process; its content is not the deliverable",
};

const CHOICES = {
  "--preset": PRESETS,
  "--premise": Object.keys(PREMISES),
  "--implementer": Object.keys(TOOLS),
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
  "--implementer-model",
  "--reviewer",
  "--milestone-reviewer",
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

const QUOTING_HINT =
  `In bash, wrap the whole value in single quotes: ` +
  `--test 'node --test "tools/**/*.test.mjs"'. In Windows PowerShell 5.1, ` +
  `which silently drops unescaped inner double quotes, escape each one: ` +
  `--test 'node --test \\"tools/**/*.test.mjs\\"'. Or answer the question ` +
  `interactively.`;

// True when the value's quotes close, read as bash reads them: nothing is
// special inside single quotes; a backslash escapes the next character
// outside them.
function quotesBalanced(value) {
  let single = false;
  let double = false;
  for (let i = 0; i < value.length; i++) {
    const c = value[i];
    if (single) {
      if (c === "'") single = false;
    } else if (c === "\\") i++;
    else if (c === "'" && !double) single = true;
    else if (c === '"') double = !double;
  }
  return !single && !double;
}

// A shell can mangle the --test value on its way in: a quote can be lost, and
// a stray Enter adds a line break. The scaffold would write the damage into
// the gates table faithfully, so it refuses what it can detect and warns about
// what it cannot.
function checkTestCommand(test) {
  const problem =
    test.trim() === ""
      ? "is empty"
      : /[\r\n]/.test(test)
        ? "contains a line break"
        : !quotesBalanced(test)
          ? "has an unbalanced quote"
          : null;
  if (problem)
    fail(
      `the --test value ${problem}: ${JSON.stringify(test)}. Your shell probably ` +
        `changed it on the way in. ${QUOTING_HINT}`,
    );
  // Windows PowerShell 5.1 drops every inner quote, leaving balanced text.
  if (/[*?[]/.test(test) && !/["']/.test(test))
    console.warn(
      `scaffold: warning — the --test value has a glob but no quotes: ` +
        `${JSON.stringify(test)}. If your shell dropped its quotes, rerun. ` +
        QUOTING_HINT,
    );
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
  --premise <premise>    product | testbed                         (product)
  --implementer <tool>   claude-code | opencode; picks the mode    (claude-code)
  --implementer-model <id>   the implementer's model id            (the tool's)
  --reviewer <who>       who reviews each change, with its model   (the mode's)
  --milestone-reviewer <who>   who reviews releases, with its model (the mode's)
  --github <mode>        none | private | public                   (none)
  --merge <policy>       owner | auto                              (preset)
  --design <policy>      required | none; OpenCode mode only       (preset)
  --plan <yes|no>        copy PLAN.md                              (preset)
  --roadmap <yes|no>     copy ROADMAP.md                           (preset)
  --test <command>       the test command for the gates table      (${DEFAULT_TEST})
  --ci <yes|no>          write .github/workflows/check.yml          (yes with a remote)
  --owner <login>        the GitHub owner                          (gh login)
  --interactive          ask every question (default without --yes)
  --yes                  accept every default

The roles and the premise are asked before the policy, and written into the
project slot. The implementer's tool picks the mode, since the harness has one
mode per tool: Claude Code works in Claude mode, OpenCode in OpenCode mode.
Only OpenCode mode is asked --design and gets the slot's design: line; with
--implementer claude-code, --design is refused.

Quoting --test: the value usually holds double quotes, which a shell can
strip. In bash, wrap the whole value in single quotes:
  --test 'node --test "tools/**/*.test.mjs"'
Windows PowerShell 5.1 silently drops unescaped inner double quotes; escape
each with a backslash:
  --test 'node --test \\"tools/**/*.test.mjs\\"'
Or answer the question interactively. An empty value, one with an unbalanced
quote or a line break is refused; a glob with no quotes draws a warning; and
the command that went into the gates table is printed at the end.`);
}

let ttyRl = null;
let pipedLines = null;

async function initInput() {
  if (process.stdin.isTTY) return;
  pipedLines = [];
  const source = createInterface({ input: process.stdin });
  for await (const line of source) pipedLines.push(line);
}

async function ask(question, def) {
  const suffix = def !== undefined ? ` [${def}]` : "";
  if (pipedLines) {
    // Piped answers still show each question, so a run shows what it asked.
    const answer = (pipedLines.shift() ?? "").trim();
    console.log(`${question}${suffix}: ${answer}`);
    return answer || def;
  }
  if (!ttyRl) {
    ttyRl = createInterface({ input: process.stdin, output: process.stdout });
  }
  const answer = (await ttyRl.question(`${question}${suffix}: `)).trim();
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
    fail(
      `preset '${name}' does not exist at this ref; the parametrizable scaffold needs r3 or later`,
    );
  }
  return JSON.parse(raw);
}

function slotText({
  name,
  description,
  premise,
  tool,
  model,
  reviewer,
  milestoneReviewer,
  merge,
  design,
  test,
  ci,
  plan,
  roadmap,
}) {
  const t = TOOLS[tool];
  const planFile = plan
    ? "`PLAN.md`"
    : roadmap
      ? "`ROADMAP.md`"
      : "TBD — name the one file that will hold each release's claims";
  const ciRow = ci
    ? `
  | CI | \`.github/workflows/check.yml\` | the unit gate | pull requests and \`main\` pushes | as CI runs | a red CI blocks the merge |`
    : "";
  const mergeConditions =
    merge === "auto"
      ? `- **merge conditions:** a clean review (\`AGREE\` in OpenCode mode, no
  blocking finding in Claude mode), its reviews posted on the pull request
  (\`PRINCIPLES.md\`, *Posting*), and every gate green; ${t.merger} merges
  with \`gh pr merge --squash --delete-branch\`, and the pull request records it.
`
      : "";
  // Only OpenCode mode has a design stage, so only its slot has the line.
  const designLine =
    tool === "opencode"
      ? `- **design:** ${design} — OpenCode mode only (\`AGENTS.md\`, *The two
  stages*).
`
      : "";
  return `- **product:** ${name} — ${description}
- **premise:** ${premise} — ${PREMISES[premise]}.
- **roles:** recorded before the mode; the mode is the implementer's tool's.
  - **implementer:** ${t.name}, model \`${model}\`; the project works in ${t.mode}
    (${t.where}).
  - **reviewer of each change:** ${reviewer}.
  - **reviewer of releases:** ${milestoneReviewer} (\`PRINCIPLES.md\`,
    *Milestones*).
- **paths to inspect:** the project's source roots and documents worth reading
  by default.
- **the canonical source:** the one place to read and edit; name any mirror,
  copy or generated artifact that must never be edited or cited.
- **paths to normally ignore:** generated, vendored or binary paths, each with
  its reason; read the lockfile only when dependencies are the task. Ignoring a
  path never means deleting or gitignoring it.
- **never read or echo:** secrets, signing material, one machine's paths. None
  are known; keep it that way and list them here when that changes. A path
  outside the repository is described relative to it, never absolutely.
- **merge:** ${merge}
${mergeConditions}${designLine}- **milestones:** annotated tags \`vX.Y.Z\` on \`main\`, as
  \`PRINCIPLES.md\` (*Milestones*) says; the plan that holds each release's
  claims: ${planFile}.
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
  tool,
  merge,
  design,
  plan,
  roadmap,
  ci,
  github,
  tbd,
}) {
  const t = TOOLS[tool];
  const steps = [];
  if (tbd) {
    steps.push(
      "Replace the `TBD` product line in `CLAUDE.md`'s project slot with one paragraph.",
    );
  }
  if (ci) {
    steps.push(`**Owner action — the remote.** Create it before the first iteration:

   \`\`\`sh
   gh repo create <owner>/${name} --${github === "public" ? "public" : "private"} --source . --push${github === "none" ? "   # or --public" : ""}
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
  if (tool === "opencode" && design === "required") {
    steps.push(
      "For a non-trivial change, write the design record first ([`design/README.md`](design/README.md)).",
    );
  }
  const list = steps.map((step, i) => `${i + 1}. ${step}`).join("\n");

  return `# ${name}

Scaffolded from the harness at \`${ref}\` (${sha.slice(0, 12)}), preset \`${preset}\`.

Read [\`AGENTS.md\`](AGENTS.md) if you work with OpenCode, or
[\`CLAUDE.md\`](CLAUDE.md) if you work with Claude Code. Both read
[\`PRINCIPLES.md\`](PRINCIPLES.md).

## Policy

- **mode:** ${t.mode} — the implementer's tool is ${t.name} (the project slot in \`CLAUDE.md\`).
- **merge:** \`${merge}\` — ${merge === "auto" ? `${t.merger} merges on a clean review, its reviews posted, and green gates` : "the owner merges"}.
${tool === "opencode" ? `- **design:** \`${design}\` — ${design === "required" ? "a design record before implementation" : "no design stage; the implementation review alone decides"}.\n` : ""}
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

  const askedFlags = [
    "name",
    "dir",
    "description",
    "preset",
    "ref",
    "premise",
    "implementer",
    "implementer-model",
    "reviewer",
    "milestone-reviewer",
    "github",
    "merge",
    ...(args.implementer === "opencode" ? ["design"] : []),
    "plan",
    "roadmap",
    "test",
    "ci",
    "owner",
  ];
  const interactive =
    args.interactive ||
    (!args.yes && askedFlags.some((flag) => args[flag] === undefined));
  if (interactive) await initInput();
  const name =
    args.name ??
    (interactive ? await ask("Project name (repo slug)") : undefined);
  if (!name) fail("--name is required");
  const dir =
    args.dir ??
    (interactive ? await ask("Target directory", `../${name}`) : `../${name}`);
  const ref =
    args.ref ??
    (interactive ? await ask("Harness ref", newestTag()) : newestTag());
  const sha = resolveCommit(ref);

  const presetName =
    args.preset ??
    (interactive ? await askChoice("Preset", PRESETS, "standard") : "standard");
  const preset = readPreset(sha, presetName);

  let description = args.description;
  if (description === undefined && interactive) {
    description = await ask("Product description (empty writes TBD)");
  }
  if (!description) description = TBD;

  // The premise and the roles come before the policy; the mode follows the
  // implementer's tool.
  const premise =
    args.premise ??
    (interactive
      ? await askChoice("Premise", Object.keys(PREMISES), "product")
      : "product");
  const tool =
    args.implementer ??
    (interactive
      ? await askChoice("Implementer's tool", Object.keys(TOOLS), "claude-code")
      : "claude-code");
  // --design belongs to OpenCode mode; refused, not ignored, before any write.
  if (args.design !== undefined && tool !== "opencode") {
    fail(
      "--design applies only in OpenCode mode (--implementer opencode); Claude mode has no design stage",
    );
  }
  const role = async (flag, question, def) => {
    const value =
      args[flag] ?? (interactive ? await ask(question, def) : def);
    if (!value || !value.trim() || /[\r\n]/.test(value))
      fail(`--${flag} must be one non-empty line: ${JSON.stringify(value)}`);
    return value.trim().replace(/\.$/, "");
  };
  const model = await role("implementer-model", "Implementer's model id", TOOLS[tool].model);
  if (model.includes("`")) fail("--implementer-model must not hold a backtick");
  const reviewer = await role("reviewer", "Reviewer of each change", TOOLS[tool].reviewer);
  const milestoneReviewer = await role(
    "milestone-reviewer",
    "Reviewer of releases",
    TOOLS[tool].milestoneReviewer,
  );

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
  // Asked only in OpenCode mode; Claude mode has no design stage (D5).
  const design =
    tool !== "opencode"
      ? undefined
      : (args.design ??
        (interactive
          ? await askChoice(
              "Design stage (OpenCode mode)",
              ["required", "none"],
              preset.policy.design,
            )
          : preset.policy.design));
  const plan =
    (args.plan ??
      (interactive
        ? await askChoice("Copy PLAN.md?", ["yes", "no"], preset.policy.plan ? "yes" : "no")
        : preset.policy.plan
          ? "yes"
          : "no")) === "yes";
  const roadmap =
    (args.roadmap ??
      (interactive
        ? await askChoice(
            "Copy ROADMAP.md?",
            ["yes", "no"],
            preset.policy.roadmap ? "yes" : "no",
          )
        : preset.policy.roadmap
          ? "yes"
          : "no")) === "yes";
  const test =
    args.test ??
    (interactive ? await ask("Test command", DEFAULT_TEST) : DEFAULT_TEST);
  checkTestCommand(test);
  const ci =
    (args.ci ??
      (interactive
        ? await askChoice(
            "Write the CI workflow?",
            ["yes", "no"],
            github === "none" ? "no" : "yes",
          )
        : github === "none"
          ? "no"
          : "yes")) === "yes";
  let owner = args.owner;
  if (github !== "none" && interactive) {
    owner = (await ask("GitHub owner (empty uses the gh login)", "")) || undefined;
  }

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
  const slot = slotText({
    name,
    description,
    premise,
    tool,
    model,
    reviewer,
    milestoneReviewer,
    merge,
    design,
    test,
    ci,
    plan,
    roadmap,
  });
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
    readmeText({
      name,
      ref,
      sha,
      preset: presetName,
      tool,
      merge,
      design,
      plan,
      roadmap,
      ci,
      github,
      tbd,
    }),
  );
  // The orchestrated Claude mode puts each subagent in its own worktree there.
  writeFileSync(
    path.join(target, ".gitignore"),
    "# Subagent worktrees (CLAUDE.md, The process)\n.claude/worktrees/\n",
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
      `, ${TOOLS[tool].mode}, premise ${premise}, merge ${merge}` +
      (design ? `, design ${design}` : "") +
      `, ci ${ci ? "yes" : "no"}`,
  );
  if (github !== "none") console.log(`  remote: https://github.com/${owner}/${name}`);
  else console.log("  no remote; see README.md to add one");
  console.log(`  unit gate: ${test}`);
  console.log("  next: read the generated README.md");
  if (ttyRl) ttyRl.close();
}

await main();
