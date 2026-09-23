# 003 — Harness release 3: the parametrizable scaffold

**Stage:** design · **Status:** revision 3, awaiting re-review · **Date:** 2026-09-23.

**How this record works** (`design/README.md`): the reviewer appends a signed
verdict below; nothing is implemented before an AGREE.

**Revisions.** v1 (`a3ae6c8`) was BLOCKED on five findings (light's scoping, the
flag contract, a preset-blind README, no auto-merge mechanism, an unpassable
end-to-end plan). v2 (`7048391`) resolved those and was BLOCKED on two it
introduced: the unused-adapter deletion was called trivial, and the generated
README's design step was not mode-scoped. v3 is this revision.

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
  lives in `CLAUDE.md`. A single-mode project may delete the other adapter, but
  the deletion is a **harness-file change**: it changes the available process
  and takes the review its mode requires — a reviewed change, not a trivial
  one. Unbundling the slot so a `--modes` flag could exist is out of scope.
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
   shipped; the design-record step only when `design: required`, and marked
   **OpenCode-only** — Claude has no design stage, and the shared README must
   not instruct a Claude user to write one.
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

---

## Review — design stage (revision 2, 7048391)

**Verdict:** BLOCK — all five v1 findings are addressed, but v2 introduces two blocking process contradictions.

### Findings

1. **Deleting the unused adapter is incorrectly classified as trivial** — blocking. The v2 interface removes `--modes` and correctly says both adapters always ship because the slot is in `CLAUDE.md` (`design/003-parametrizable-scaffold.md:115-118`), but it then says that a single-mode project may delete the other adapter as “a trivial change.” `PRINCIPLES.md:41-47` makes any harness-file diff non-trivial unless it is a pure typo/comment, and `PRINCIPLES.md:110-112` requires a harness-process change to take its mode's review. Deleting `AGENTS.md` or `CLAUDE.md` changes the available process and cannot be an unreviewed trivial change; classify it as a reviewed change or remove that instruction.

2. **The generated README's design instruction is not mode-scoped** — blocking. The revised behavior says the design-record step is emitted when `design: required` (`design/003-parametrizable-scaffold.md:134-136`), but `design: required` is the standard and auto default (`:151-155`) while Claude explicitly has no design stage and no design records (`CLAUDE.md:19-20`, `PRINCIPLES.md:68-71`). Because both adapters always ship (`:115-116`), the shared generated README must say that this step is OpenCode-only; otherwise a Claude user following the generated README is instructed to do exactly the stage its adapter forbids.

### Verified

- **Light scoping is resolved.** The v2 sentence at `design/003-parametrizable-scaffold.md:61-67` covers all the previously problematic shared references: a design record resolves to the implementation review, no design stage exists in either mode, the defect path is the implementation review, and a would-be design bypass is recorded in the project slot. This agrees with the light file set and review-record placement at `:161-163` and with Claude's existing no-design boundary.
- **The flag contract is resolved.** Defaults and the explicit `TBD` behavior are stated at `:88-102` and `:112-114`; invalid values, required interactive name, alias precedence, and version-sorted newest-tag selection are specified at `:104-114`; and policy-derived file-set rules are explicit at `:119-122`. Removing `--modes` is coherent as an interface decision because both adapters and the `CLAUDE.md` slot always ship, with unbundling out of scope (`:115-118`), subject to finding 1's classification correction.
- **The preset-aware README requirement is resolved for shipped-file presence.** The revised behavior at `design/003-parametrizable-scaffold.md:134-136` suppresses remote, roadmap, plan, and design-record instructions according to the selected policy, so light no longer points at absent `PLAN.md`, `ROADMAP.md`, or `design/`. Finding 2 is the remaining mode-specific qualification.
- **The auto-merge mechanism is now explicit and honest.** The implementer session, rather than GitHub automation, waits for the clean review and green PR CI and runs `gh pr merge <n> --squash --delete-branch`, then writes the completion note after landing (`design/003-parametrizable-scaffold.md:69-76`). This removes the v1 assumption about branch protection, GitHub auto-merge, workflow permissions, or an unmentioned action. The post-landing ordering is supported by `design/002-harness-release-2.md:191-204`.
- **The E2E plan is corrected.** It now calls for a non-trivial first content-and-test change under `tools/` and explicitly names the design review, implementation review, merge command, green CI, and experiment record (`design/003-parametrizable-scaffold.md:181-188`). The default command is the dependency-free Node test glob (`:99`, `:137-141`); Scopetta's workflow documents that the empty glob reports `1..0` and exits 0 (`../Scopetta/.github/workflows/check.yml:26-35`), while its UI check demonstrates that dependency-heavy checks are separately installed when needed (`../Scopetta/.github/workflows/check.yml:37-54`, `../Scopetta/tools/check_ui.mjs:5-9`). The first non-trivial change makes the initially honest-green gate meaningful before the two reviews and merge.
- The three open questions remain correctly marked as owner decisions (`design/003-parametrizable-scaffold.md:197-203`), and no contradiction with the competition's owner-gate variable was introduced (`docs/05-harness-competition.md:47-50`).

### Not verified

- No implementation exists at revision `7048391`, so the actual prompt flow, generated README variants, derived file sets, workflow execution, GitHub merge command, and E2E experiment remain implementation-stage checks.

— GPT-5.6 Luna (opencode/gpt-5.6-luna#high), reviewer
BLOCK
