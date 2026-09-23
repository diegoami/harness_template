# 003 — Harness release 3: the parametrizable scaffold

**Stage:** design · **Status:** revision 2, awaiting re-review · **Date:** 2026-09-23.

**How this record works** (`design/README.md`): the reviewer appends a signed
verdict below; nothing is implemented before an AGREE.

**Revisions.** v1 (`a3ae6c8`) was BLOCKED on five findings: light's scoping of
the shared protocol, the incomplete flag contract, a light README that
prescribed absent files, no mechanism for the promised auto-merge, and an
end-to-end plan that could not pass. v2 is this revision.

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

**Scoping `design: none`.** One sentence in `PRINCIPLES.md` makes the light
shape coherent everywhere: where a project's slot records `design: none`, every
reference in this file to a design record resolves to the implementation review
file, the design stage does not exist in either mode, the defect path is the
implementation review, and an owner amendment that would otherwise bypass a
design stage is recorded in the project slot (the policy field itself). The
adapters add only their mode's sentence.

**Who performs the merge.** With `merge: auto`, the **implementer session**
performs it — not GitHub, not an action. Once the review is clean (`AGREE` in
OpenCode mode, no blocking finding in Claude mode) and CI is green on the pull
request, it runs `gh pr merge <n> --squash --delete-branch`, writes the
completion note on `main` (release 2's post-landing ordering), and reports. No
branch protection, no GitHub auto-merge setting and no workflow permissions are
required; the conditions live in the slot and the protocol. Without a remote the
policy cannot run, and the generator warns.

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
| `--description` | one paragraph | asked; `--yes` writes `TBD — the first session replaces this line`, and the README lists it |
| `--preset` | `light`, `standard`, `auto` | `standard` |
| `--ref` / `--tag` | any ref; default the newest `r*` tag | `r*` newest |
| `--github` | `none`, `private`, `public` | `none` |
| `--merge` | `owner`, `auto` | preset |
| `--design` | `required`, `none` | preset |
| `--plan` / `--roadmap` | `yes`, `no` | preset |
| `--test` | the test command | `node --test "tools/**/*.test.mjs"` |
| `--ci` | `yes`, `no` | `yes` when `--github` is not `none`, else `no` |
| `--owner` | GitHub owner | the authenticated `gh` login |
| `--yes` | accept defaults | — |

Precedence, defaults and refusals:

- `--tag` is an alias of `--ref`; giving both is refused. The default ref is
  the newest `r*` tag by version sort (`git tag --list 'r*' --sort=-v:refname`,
  first line).
- Any value outside its list is refused with the accepted values printed.
- `--name` is always required; `--interactive` asks for it. `--dir` defaults to
  `../<name>`.
- `--yes` accepts every default; a default that cannot be invented (the
  description) is written as an explicit `TBD` line that the first session
  replaces, and the generated README says so.
- Both adapters (`AGENTS.md`, `CLAUDE.md`) always ship, because the project slot
  lives in `CLAUDE.md`. A single-mode project deletes the other adapter — a
  trivial change. Unbundling the slot so a `--modes` flag could exist is out of
  scope.
- The file set is **derived from the policy, not fixed per preset**: `--plan no`
  removes `PLAN.md`, `--plan yes` adds it; the same for `--roadmap` /
  `ROADMAP.md`; `--design none` removes `design/README.md`, `--design required`
  adds it. The preset supplies the defaults the flags override.

Behavior:

1. Resolve the ref (default: newest `r*` tag by version sort) and the file set:
   `presets/<preset>.json` supplies defaults, the policy flags override them.
2. Refuse a target that exists and is not empty (as today).
3. Read each file with `git show <ref>:<path>`; refuse a missing one before
   writing anything (as today).
4. Fill the slot: `{{PROJECT}}`, the product paragraph (or the explicit `TBD`
   line), the policy lines (`merge:`, `design:`), the gates table (the test
   command, CI), and the default read/ignore and never-echo lists.
5. Write the generated README **from the chosen policy**: the remote owner step
   only when `--ci yes`; the roadmap and plan steps only when those files
   shipped; the design-record step only when `design: required`.
6. Write `.github/workflows/check.yml` when `--ci yes`: one job on
   `push: [main]` and `pull_request`, running the test command as given. On a
   fresh project with no tests yet the command matches nothing, reports `1..0`
   and exits 0 — the scaffold's honest state, as Scopetta's `check.yml`
   documents; the gate starts meaning something the moment a test lands.
7. `git init -b main`, one commit `Scaffold from harness <ref> (<preset>)`.
8. When `--github` is not `none`: `gh repo create <owner>/<name>
   --private|--public --source <dir> --push`; report the URL. If `gh` is absent
   or unauthenticated, say so and stop after the local commit.
9. Print the next steps: replace the `TBD` description if it was written,
   create the remote if it was skipped, then start the first session.

### 3. Presets

| preset | files | design | merge | plan | roadmap |
|---|---|---|---|---|---|
| `light` | `PRINCIPLES.md`, `AGENTS.md`, `CLAUDE.md`, `reviews/README.md`, `verification/README.md` | `none` | `owner` | no | no |
| `standard` | all (adds `PLAN.md`, `ROADMAP.md`, `design/README.md`) | `required` | `owner` | yes | yes |
| `auto` | all | `required` | `auto` | yes | yes |

`presets/<name>.json` holds `files`, `policy`, `plan`, `roadmap`. The old
`scaffold.manifest.json` retires with this release; `presets/standard.json`
carries its file list.

A `light` project has no `design/` directory and creates no design records; its
review records live in `reviews/` — the Claude-mode shape applied to both
adapters, scoped by the `design: none` sentence in §1.

A warning, not a refusal, when `--merge auto` and `--github none`: the CI half
of the merge condition cannot run without a remote.

### 4. Commands and docs

`README.md` gains a "Create a project" section: the three command forms, the
question list, and the preset table. The generated README names the preset, the
ref, and the filled policy.

## Verification

- `node --check tools/scaffold.mjs`.
- Generate `light`, `standard` and `auto` into temp directories with `--yes` and
  inspect: the file set derived from the policy; the slot's product, policy and
  gates filled; `{{PROJECT}}` replaced; the preset-aware README; one commit; a
  non-empty target refused. The reviewer reproduces this independently.
- **End to end, under the owner's assumptions:** one private GitHub repo from
  the `auto` preset. The first change is **non-trivial** — it adds the project's
  first real content and its first test under `tools/`, so the gate stops being
  honest-green — and runs through the design review, the implementation review,
  and the auto-merge (`gh pr merge --squash --delete-branch`) on AGREE plus
  green CI, recorded in `experiments/`. The reviewer inspects the run and
  re-runs the generation. Whether the scratch repo is deleted afterwards is an
  open question below.

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

---

## Review — design stage

**Revision reviewed:** a3ae6c8.
**Verdict:** BLOCK — the light shape, generator contract, and auto-merge verification path need design corrections before implementation.

### Findings

1. **`light` leaves shared design-record rules impossible to apply** — blocking. `PRINCIPLES.md:68-71` says that a design record exists in OpenCode mode, while `PRINCIPLES.md:88-90` requires a design record for an owner amendment that bypasses design and `PRINCIPLES.md:97-101` sends OpenCode defect fixes through the design stage. The proposal only adds the adapter sentence at `design/003-parametrizable-scaffold.md:48-52` and then says that light has no `design/` directory at `:116-118`. It must state how `design: none` scopes the shared protocol: no design record, implementation review alone, and where a later policy amendment or the design-stage defect-path decision is recorded. Otherwise a light OpenCode project is both required to have no design records and required to create them.

2. **The flag and question contract is incomplete** — blocking. The table at `design/003-parametrizable-scaffold.md:64-81` gives no description default even though `--yes` is defined as accepting defaults, and it does not define the placeholder accepted by `--yes` or the refusal/answer behavior of `--interactive` for the required `--name`. `--modes` has values but no effect on the file set or generated instructions. Likewise, `--design`, `--plan`, and `--roadmap` are described as preset overrides at `:85-86`, but no rule derives the corresponding file set from those overrides; this conflicts with the fixed preset lists at `:106-113` and the no-`design/` light shape at `:116-118`. Finally, the contract does not say whether supplying both `--ref` and `--tag` is refused or which wins, nor how “newest `r*` tag” is ordered. Specify these defaults, prompts, invalid-value/refusal paths, precedence rules, and file-set effects before implementation.

3. **The light generated README would prescribe absent files** — blocking. The current scaffold README instructs the user to shape `ROADMAP.md` and delete `PLAN.md` at `tools/scaffold.mjs:105-112`; the light preset explicitly omits both at `design/003-parametrizable-scaffold.md:106-109`. The proposed generated README requirement at `:93-101` does not require those instructions to be conditional on the selected preset. A light project therefore cannot follow its generated first-session commands. The README design must describe the per-preset first-session list (and similarly avoid design-record instructions when `design: none`).

4. **The `auto` preset has no mechanism that can perform the promised auto-merge** — blocking. The policy promises a merge when review and gates are clean at `design/003-parametrizable-scaffold.md:34-46`, and verification requires “auto-merge on AGREE plus green CI” at `:136-140`. The only remote operation specified is `gh repo create ... --source ... --push` at `:98-100`, while the generated workflow is only one test job at `:95-96`; neither enables GitHub auto-merge or branch protection nor maps the signed local `AGREE`/clean Claude review record to a merge action. Either the design must provide the GitHub settings/action/commands and their permissions, or `auto` must be explicitly reduced to a policy that an external owner/automation performs. As written, the advertised third scaffold cannot deliver its defining behavior.

5. **The end-to-end verification is internally incompatible with the shared classification and default gate** — blocking. `PRINCIPLES.md:49-51` says a trivial change takes neither stage, but the proposed E2E item at `design/003-parametrizable-scaffold.md:136-140` requires a “trivial change” to go through both design and implementation review. In addition, every preset copies only harness documents (`scaffold.manifest.json:3-11`); it supplies no `package.json` or test script, while `--test` defaults to `npm test` at `:78` and CI is enabled for the private GitHub run by `:79`. The design must use a non-trivial process change for the two-review proof and specify a passing test/project setup (or an explicit test command) before claiming green CI and auto-merge. The current verification plan cannot pass from the generated auto project as described.

### Verified

- The ownership split is coherent in principle: `PRINCIPLES.md:15` owns the shared protocol, while `AGENTS.md:16-40` and `CLAUDE.md:9-32` own their adapter processes. The proposed `PRINCIPLES.md` merge rule at `:42-47` can therefore be authoritative, with the adapters retaining only their mode-specific sentence and pointer. It also does not contradict the competition rule: `docs/05-harness-competition.md:47-50` treats removal of the owner gate as the experiment variable and uses the same signed-review-plus-green-CI conditions for the owner-less arm.
- The existing post-landing completion pattern is compatible with automatic landing: `design/002-harness-release-2.md:191-204` records its completion note in commit `63cb9a9`, after the merge commit `75054f2`, rather than requiring it in the reviewed implementation. The release-3 policy should preserve that ordering when `auto` is selected; no contradiction with the inherited completion rule was found.
- The preset file union is otherwise coherent: the current manifest has the eight harness files at `scaffold.manifest.json:3-11`, and the standard/auto “all” rows at `design/003-parametrizable-scaffold.md:108-110` are the light five files plus `PLAN.md`, `ROADMAP.md`, and `design/README.md`. The three listed owner questions at `:150-156` are genuine owner decisions, and the out-of-scope list at `:143-148` does not silently claim the competition, worktrees, Codex adapter, or existing-run migration.
- The stated `gh repo create <owner>/<name> --private|--public --source <dir> --push` shape and the non-fatal local-commit fallback are consistent with the local-first behavior documented in `docs/06-testing-the-harness.md:26-35` and the proposal's own sequence at `:87-102`. The specified CI triggers (`push` on `main` and `pull_request`) are also unambiguous at `:95-96`; the missing issue is the setup and merge automation needed to make the E2E claim true.

### Not verified

- No implementation exists at this revision, so the generated prompts, derived file sets, README variants, `check.yml`, GitHub fallback behavior, and actual auto-merge run could not be executed. Those require implementation-stage verification after the blocking design findings are resolved.

— GPT-5.6 Luna (opencode/gpt-5.6-luna#high), reviewer
BLOCK
