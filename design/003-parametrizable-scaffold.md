# 003 — Harness release 3: the parametrizable scaffold

**Stage:** design · **Status:** proposed · **Date:** 2026-09-23.

**How this record works** (`design/README.md`): the reviewer appends a signed
verdict below; nothing is implemented before an AGREE.

**Input.** Owner directive (2026-09-23): give me a few scaffolds to test on the
next, well-defined project; assume GitHub exists and the owner auto-approves
merges; make it parametrizable, with the questions I answer at setup; give me
the commands. The toy is parked
([`experiments/toy-r1/record.md`](../experiments/toy-r1/record.md)).

---

## Problem

Release 2 ships one fixed scaffold. `tools/scaffold.mjs` copies one file list
(`scaffold.manifest.json:3-12`) with `--tag/--ref/--name/--dir`, writes a fixed
README (`tools/scaffold.mjs:97-126`), and creates nothing else. The owner's next
project needs at least three shapes — a light process, the standard one, and the
auto-merge one — and needs GitHub on demand. Two process sentences are
hard-coded today and block that: "The owner merges"
(`AGENTS.md:37-40`, `CLAUDE.md:26-32`) and the mandatory design stage in OpenCode
mode (`AGENTS.md:16-40`).

## Design

### 1. Policy lives in the project slot; the adapters read it

The generator fills three policy fields in the project slot, and a project can
change them later:

- `merge: owner | auto` — default `owner`; `auto` = a change merges when its
  review is clean and every gate is green.
- `design: required | none` — default `required`; `none` removes the design
  stage in OpenCode mode (the implementation review alone decides).
- the gates table, already in the slot.

Text changes:

- **`PRINCIPLES.md`, protocol — Merge policy.** "The owner merges, unless the
  project slot records `merge: auto`; then a change merges when its review is
  clean — `AGREE` in OpenCode mode, no blocking finding in Claude mode — and
  every gate is green. A project that takes `auto` states its merge conditions
  in its slot, and the pull request records the merge." One owner for the rule;
  the slot holds the value.
- **`AGENTS.md`** — the stages keep their text; one sentence is added: "The
  owner merges (`PRINCIPLES.md`), unless the project slot records
  `merge: auto`." And where the design stage is stated: "A project whose slot
  records `design: none` has no design stage: the implementation review alone
  decides."
- **`CLAUDE.md`** — the same merge sentence (`merge: auto`); Claude mode has no
  design stage already.

### 2. `tools/scaffold.mjs` becomes the parametrizable installer

```
node tools/scaffold.mjs --name <slug> --dir ../<slug> [flags]      # flags
node tools/scaffold.mjs --interactive                              # asks
node tools/scaffold.mjs --yes --name <slug> --dir ../<slug>        # defaults
```

Flags (each is also a question when absent and not `--yes`):

| flag | values | default |
|---|---|---|
| `--name` | repo slug | required |
| `--dir` | target directory | `../<name>` |
| `--description` | one paragraph | asked; a placeholder is refused unless `--yes` |
| `--preset` | `light`, `standard`, `auto` | `standard` |
| `--ref` / `--tag` | any ref; default the newest `r*` tag | `r*` newest |
| `--github` | `none`, `private`, `public` | `none` |
| `--merge` | `owner`, `auto` | preset |
| `--design` | `required`, `none` | preset |
| `--plan` / `--roadmap` | `yes`, `no` | preset |
| `--modes` | `both`, `opencode`, `claude` | `both` |
| `--test` | the test command | `npm test` |
| `--ci` | `yes`, `no` | `yes` when `--github` is not `none`, else `no` |
| `--owner` | GitHub owner | the authenticated `gh` login |
| `--yes` | accept defaults | — |

Behavior:

1. Resolve the ref (default: newest `r*` tag) and read `presets/<preset>.json`
   for the file list and policy defaults; explicit flags override the preset.
2. Refuse a target that exists and is not empty (as today).
3. Read each file with `git show <ref>:<path>`; refuse a missing one before
   writing anything (as today).
4. Fill the slot: `{{PROJECT}}`, the product paragraph, the policy lines, the
   gates table (the test command, CI), and the default read/ignore and
   never-echo lists.
5. Write the generated README (what this is; the commands; the first-session
   list including the remote owner action).
6. Write `.github/workflows/check.yml` when `--ci yes`: one job, the test
   command, on `push: [main]` and `pull_request`.
7. `git init -b main`, one commit `Scaffold from harness <ref> (<preset>)`.
8. When `--github` is not `none`: `gh repo create <owner>/<name>
   --private|--public --source <dir> --push`; report the URL. If `gh` is absent
   or unauthenticated, say so and stop after the local commit.
9. Print the next steps: fill nothing (the slot is filled), create the remote if
   skipped, then start the first session.

### 3. Presets

| preset | files | design | merge | plan | roadmap |
|---|---|---|---|---|---|
| `light` | `PRINCIPLES.md`, `AGENTS.md`, `CLAUDE.md`, `reviews/README.md`, `verification/README.md` | `none` | `owner` | no | no |
| `standard` | all (adds `PLAN.md`, `ROADMAP.md`, `design/README.md`) | `required` | `owner` | yes | yes |
| `auto` | all | `required` | `auto` | yes | yes |

`presets/<name>.json` holds `files`, `policy`, `plan`, `roadmap`. The old
`scaffold.manifest.json` retires with this release; `presets/standard.json`
carries its file list.

A `light` project has no `design/` directory and no `design: none` design
records; its review records live in `reviews/` — the Claude-mode shape, applied
to both adapters.

A warning, not a refusal, when `--merge auto` and `--github none`: the CI half
of the merge condition cannot run without a remote.

### 4. Commands and docs

`README.md` gains a "Create a project" section: the three command forms, the
question list, and the preset table. The generated README names the preset, the
ref, and the filled policy.

## Verification

- `node --check tools/scaffold.mjs`.
- Generate `light`, `standard` and `auto` into temp directories with `--yes` and
  inspect: the file set per the table; the slot's product, policy and gates
  filled; `{{PROJECT}}` replaced; the generated README; one commit; a non-empty
  target refused. The reviewer reproduces this independently.
- **End to end, under the owner's assumptions:** one private GitHub repo from
  the `auto` preset; a trivial change run through the process (design review →
  implementation review → auto-merge on AGREE plus green CI), with the run
  recorded in `experiments/`. The reviewer inspects the run and re-runs the
  generation; whether the scratch repo is deleted afterwards is an open
  question below.

## Out of scope (recorded, not lost)

- Layout variants — three-file vs two-file vs pointer harnesses (E1).
- The competition runner; worktrees; Codex adapter.
- Migrating existing runs to a newer tag.
- The `Geoclick2027` candidates (`docs/08` §4).

## Open questions

1. **GitHub default** — `none` (proposed) or `private`. _Owner decision._
2. **The end-to-end scratch repo** — delete after the test (proposed) or keep it
   private as evidence. _Owner decision._
3. **`auto` without GitHub** — warn and proceed (proposed) or refuse. _Owner
   decision._
