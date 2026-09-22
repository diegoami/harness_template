# 001 — Harness release 1

**Stage:** design · **Status:** revision 2, awaiting re-review · **Date:** 2026-09-23.

**How this record works** (D-6 in `docs/03-standardization-decisions.md`): this
file is the design proposal; the reviewer's verdict is appended below as a
`## Review — …` section, signed, ending in an explicit `AGREE` or `BLOCK`. When
a remote exists, this text is posted verbatim as the design issue. Nothing here
is implemented before an AGREE.

**Revisions.** v1 (`b06e6f3`) was reviewed and **BLOCKED** on findings 1–6
(below). v2 is this revision; it answers each finding with specification rather
than prose: a complete ownership map, the non-trivial test, the six gates
disciplines, the shared verdict protocol, and the mode boundaries. The v1
verdict stays in place as history; the latest verdict governs.

---

## Problem

Four projects grew one harness each. The working arrangement is the same in all
four — OpenCode (DeepSeek implements, Luna reviews cross-family) and Claude
(Claude implements, a fresh context reviews) — but the wrapper drifted: where
the shared principles live, what counts as a change that needs the process, how
a verdict is recorded, and what happens when a reviewer cannot review. Release 1
consolidates the process and leaves verification — tests, UI checks, mutation
harnesses, CI — to each project.

## Owner directives this rests on

1. Consolidate exactly four harnesses: `discola-web`, `Tressette`, `Scopetta`,
   `balloons-JS`.
2. The main purpose is running one project under **two working modes**:
   OpenCode (DeepSeek implements, Luna reviews, different family, fresh context,
   explicit model id) and Claude (Claude does its own thing: implements, and a
   fresh-context session reviews; no design-issue stage).
3. **Verification belongs to the project**: engine tests, UI checks, mutation
   harnesses and CI are not part of the harness.
4. **Local-first**: the harness works with no GitHub; when a remote exists, the
   same records are posted verbatim, and issues/PRs/`gh` are used but not
   required.
5. A **competition** will later remove the owner-merge requirement and measure
   which harness performs better; release 1 only keeps that possible.
6. A **run is a fresh repository** scaffolded from a release tag; several
   instances never share one repository.
7. Feature requests live in `ROADMAP.md`, written by the owner, shaped by the
   agent; inside a request the agent has **artistic license**, and the point is
   the process, not precision.
8. The postponed `imperial_conquest_2` model (worktrees, per-task models,
   label-only status) is not part of release 1.

## Decisions applied

The recommended defaults from `docs/03-standardization-decisions.md`, which the
owner may override at merge:

- **D-1** separate `PRINCIPLES.md`; `AGENTS.md` and `CLAUDE.md` link to it.
- **D-2** Scopetta's non-trivial test with the conservative floor.
- **D-3** the iteration overlay is optional and ships with `ROADMAP.md`.
- **D-4** the gates seam: six disciplines, each project declares its gates.
- **D-5** the verification patterns are documentation, optional by design.
- **D-6** local-first records under `design/` and `reviews/`.
- **D-7** the model assignment table, the invariant and the update rule.
- **D-8** harness files at the root; runs are separate repos made by the
  scaffold.

## What release 1 contains

**The run files** — what `scaffold.manifest.json` copies into a new project:

| file | content |
|---|---|
| `PRINCIPLES.md` | the habits; the authoritative **ownership map**; the non-trivial test and floor; the **six gates disciplines**; the **shared verdict protocol** |
| `AGENTS.md` | the OpenCode adapter: roles and assignment table; the invariant and update rule; two stages; BLOCK scope; withdraw/re-scope |
| `CLAUDE.md` | the Claude adapter: fresh-context review, same-family default, no design stage, the external-process option; then the **project slot** |
| `PLAN.md` | the optional iteration overlay: done-when per iteration, effort/reviewer per iteration, the owner's part, the fork-provenance table. Deletable. |
| `ROADMAP.md` | the feature backlog: how to request, statuses, shaping, artistic license (`docs/07`) |
| `design/README.md` | the design-record format: naming, sections, the verdict append |
| `reviews/README.md` | the verdict-record format: naming, signature convention, what a verdict covers |
| `verification/README.md` | the nine optional patterns from `docs/01` §9, one paragraph each |

**The lab files** — release 1 also delivers, in this repository and not into
runs: this `README.md`, `docs/`, `experiments/`, `EXPERIMENTS.md` (correcting
the release-1 spine in `docs/03`: the experiment index is a lab file — a run
does not experiment on the harness), `tools/scaffold.mjs`, and
`scaffold.manifest.json`.

**Not in release 1:** any test, UI check, mutation harness or CI file; any
GitHub requirement; worktrees; a Codex adapter; the competition's runner.

## The project slot

The harness files are project-agnostic except one clearly marked section at the
end of `CLAUDE.md`:

```
## Project slot
<!-- fill this in the run's first session -->
- product: {{PROJECT}} — one paragraph
- paths to inspect / normally ignore
- never read or echo
- the gates table: commands, what each covers, when, repeats, failure model
- conventions (language, no-build promises, decided and not to be re-opened)
```

The scaffold replaces `{{PROJECT}}` and leaves the rest as tokens for the run's
first session. Rationale: no duplicate template tree to drift; the harness
files stay uniform; the slot is where a project's own rules live, which is what
`CLAUDE.md` already does in all four source projects.

## Ownership map, authoritative (planned content of `PRINCIPLES.md`)

| idea | owner | non-owners |
|---|---|---|
| the habits: reproduce before acting; say what a passing check would have caught; one measurement is a coin toss; flag out-of-scope and fix fully when flagged; show diffs; read/ignore; output economy; session handoff; old and new side by side; assert what a person notices then play it | `PRINCIPLES.md` | link |
| the non-trivial test, the conservative floor, the pure-typo exception | `PRINCIPLES.md` | link |
| the six gates disciplines | `PRINCIPLES.md` | link |
| the verdict protocol: revision scope, materiality, fallback, waiver, owner decisions, defect path, bootstrap | `PRINCIPLES.md` | link |
| the OpenCode adapter: roles, assignment table, invariant, reviewer acquisition, two stages, BLOCK scope, withdraw/re-scope | `AGENTS.md` | link |
| the Claude adapter: fresh-context review, same-family default, no design stage, the external-process option | `CLAUDE.md` | link |
| the project rules: product, paths, never-echo, gates table, conventions, one source of truth, decided-not-to-reopen, open work | `CLAUDE.md` project slot | link |
| the iteration overlay and the fork-provenance table | `PLAN.md` | link |
| feature requests and artistic license | `ROADMAP.md` | link |
| the design-record format | `design/README.md` | link |
| the verdict-record format and signature convention | `reviews/README.md` | link |
| the optional verification patterns | `verification/README.md` | link |
| the experiment-record pattern (`FORGETTING.md` shape) | this repo's `docs/06`; a lab practice, not copied into runs | — |

**The table is authoritative.** A non-owning file links to an idea and does not
restate it. A contradiction found between the files is recorded as a defect and
fixed in the change that found it. If the table does not settle a sentence that
spans two owners, the fallback order is: `PRINCIPLES.md` for principles and the
protocol, `AGENTS.md` for the OpenCode process, `CLAUDE.md` for project rules.

## The non-trivial test (planned content of `PRINCIPLES.md`)

A change is **non-trivial** if it can change:

- **(a)** the observable behaviour of the product or of any tool;
- **(b)** what any check measures or asserts;
- **(c)** the design or process a builder must follow — including the harness
  files, the design records, and any document that states design;
- **(d)** user-facing copy.

Anything that meets none of (a)–(d) is **trivial**. As a **conservative floor** —
the checklist a builder uses instead of tracing imports — a diff touching
`public/**`, `tools/**`, `design/**`, `reviews/**`, `.github/**`, the harness
files or the package manifests is non-trivial whether or not the author believes
the test is met, **unless it is a pure typo or comment that changes no
behaviour, no assertion and no process text**.

A trivial change takes neither stage: no design record, no review, no verdict.
It may go straight to the main branch, still runs the gates its diff can affect,
and does not relax CI.

## The six gates disciplines (planned content of `PRINCIPLES.md`)

1. **Declare the gates in one table**: the commands, what each covers, when it
   runs, how many repeats, and the failure model that justifies the repeats.
2. **A red gate does not merge.**
3. **A new assertion is made to fail before it is made to pass.**
4. **Reproduce before you act** — a reviewer's finding and your own claim alike.
5. **Assert what a person would notice** — pixels, contrast, timing — then play
   it.
6. **Say what a passing check would have caught** had the code been wrong.

## The shared verdict protocol (planned content of `PRINCIPLES.md`)

- Records are files. A **design record** is `design/NNN-<slug>.md`: problem,
  findings with `file:line`, design, open questions. Its reviewer appends a
  verdict section. An **implementation review** is
  `reviews/NNN-<slug>-impl-NN.md`, naming the revision it covers.
- A verdict covers **the named revision**. Any material change invalidates it.
  Non-material: commit messages, whitespace, and typos that change no
  behaviour, no assertion and no process text.
- The verdict's final line is the signature
  `— <display name> (<model id with variant>), reviewer`, followed by a line
  containing only `AGREE` or `BLOCK`.
- **Fallback**: a failed, cancelled or unavailable review is no review and no
  approval. Retry, or select another reviewer; record its model id and who
  selected it; the fallback becomes the designated reviewer for that stage.
- **Waiver**: an implementation-stage exception only, recorded, and never called
  AGREE. Bypassing the design stage is an owner amendment, recorded in the
  design record.
- **Owner decisions** are recorded with a recommended default, the reason, and
  an owner-decision mark. The reviewer may require that a decision be made and
  recorded; it may not reject it merely for differing from its own preference.
- **Defect path**: a defect found after a change landed is recorded and fixed by
  a change that lands the assertion that would have caught it. The fix takes the
  design stage unless all four hold: limited to the recorded defect; no
  behaviour beyond it; no change to what a check measures; no process change.
- **Bootstrap**: a change to a harness file that changes what a builder must do
  or how the process works takes both stages; a pure typo takes neither.
- With a remote, the same text is posted as the issue/PR comment; the file stays
  canonical.

## Mode boundaries (how the adapters divide the work)

| | OpenCode mode | Claude mode |
|---|---|---|
| implementer | DeepSeek (`opencode/deepseek-v4.1-flash`, the current assignment) | Claude |
| reviewer | a subagent, **different family**, high effort, fresh context, explicit model id (currently Luna, `opencode/gpt-5.6-luna#high`) | a fresh-context session; **same family by default**, no cross-family requirement. An external process from another family is allowed (E6), recorded with its model id |
| design stage | yes: design record → signed AGREE, then implement | **none** |
| stage verdicts | AGREE/BLOCK appended to the design record; implementation review file | one signed implementation review; no AGREE/BLOCK machine required |
| fallback | another reviewer from a different family, recorded (model + selector) | a new session, or an external process, recorded |
| waiver | implementation stage only; design bypass = owner amendment | same |
| merge | the owner (until the competition removes it) | the owner |

## The records

The format — naming, the signature convention, what a verdict covers — is owned
by `reviews/README.md`; the rules are owned by `PRINCIPLES.md` (above). The
files: `design/NNN-<slug>.md`, `reviews/NNN-<slug>-impl-NN.md`. With a remote,
the same text is posted as the issue/PR comment; the file stays canonical.

## The scaffold

`node tools/scaffold.mjs --tag r1 --name <name> --dir <path>`

1. Reads `scaffold.manifest.json`; refuses a target directory that exists and is
   non-empty.
2. Reads each file with `git show <tag>:<path>` — no dependency on the working
   tree or network.
3. Writes them; replaces `{{PROJECT}}` with the name.
4. Generates a minimal `README.md` (project name, the harness tag, the first
   session's instruction).
5. `git init`, one commit: `Scaffold from harness r1`.
6. Prints next steps. It does **not** create a GitHub repository; the generated
   README documents `gh repo create` as an optional follow-up.

## Non-goals

- No mandated verification tooling; `verification/` is a library, not a gate.
- No GitHub dependency, no `gh` in the loop.
- No worktrees; no parallel-agent orchestration.
- No second-machine story; no labels-as-state.

## Bootstrap on this release

This proposal is the design stage of the change that introduces the harness, so
it is reviewed before anything is written. On AGREE the files are implemented on
branch `release/r1`, the implementation is reviewed the same way, and the owner
merges and tags `r1`. The implementation review is
`reviews/001-harness-release-1-impl-01.md`.

## Open questions

**Owner decisions** (the reviewer may require them decided and recorded, not
decide them):

1. **Project slot location** — in `CLAUDE.md` (proposed, as in the four, because
   both modes read it) or its own `PROJECT.md`.
2. **Scaffold source** — `--tag` requires `r1` before the first run, and this
   release creates the first tag. Proposed: accept `--ref <commit|tag>`,
   document `--tag` as the normal case; the first run may use the merge commit.
3. **Verification library shape** — one `README.md` with nine sections
   (proposed) or a file per pattern once the toy has worked examples to cite.
4. **Artistic license** — kept in `ROADMAP.md` (proposed), because it belongs
   to the request mechanism.

**Settled by the v1 review:** 5. the reviewer writes its own verdict files —
design-stage verdicts appended to the design record, implementation verdicts
authored in `reviews/`.

## Answering the v1 findings

1. **Union preserved** — the ownership map assigns every item `docs/01` §8
   lists: the defect path and verdict protocol to `PRINCIPLES.md`; BLOCK scope
   to `AGENTS.md`; fork provenance to `PLAN.md`; one-source-of-truth,
   decided-not-to-reopen and open work to the `CLAUDE.md` project slot; the
   experiment-record pattern to the lab (`docs/06`); and `EXPERIMENTS.md` is
   corrected to a lab file.
2. **Mode boundaries** — stated above, including the same-family default, the
   absence of a cross-family requirement, the absence of the design stage, and
   no AGREE/BLOCK machine for Claude.
3. **Ownership** — the map is authoritative, with the contradiction rule and the
   fallback order; the verdict protocol lives in `PRINCIPLES.md` and the record
   format in `reviews/README.md`, one idea each.
4. **Local-first semantics** — fallback, waiver, materiality and its exceptions,
   owner decisions, defect path and bootstrap are written out above.
5. **Classification** — the four conditions, the conservative floor and the
   pure-typo guard are stated above.
6. **Gates disciplines** — the six are enumerated above.

---

## Review — design stage

**Revision reviewed:** b06e6f3.
**Verdict:** BLOCK — findings 1–6 must be resolved before implementation can earn AGREE.

### Findings

1. **The release inventory does not preserve the full union of harness ideas** — blocking. The manifest names the iteration overlay, but does not name or assign the defect path, BLOCK scope, fork-provenance table, experiment-record pattern, or balloons' open-work file; it also does not assign the one-source-of-truth and decided-not-to-reopen rules. These are distinct items in the union (`docs/01-harness-comparison.md:313-332`), and the release spine separately calls for `EXPERIMENTS.md` (`docs/03-standardization-decisions.md:166-190`). Tressette's provenance table is real (`Tressette/PLAN.md:1770-1780`) and balloons' open-work/decided material is real (`balloons-JS/CLAUDE.md:5-13`, `balloons-JS/CLAUDE.md:113-129`). A broad “habits” label in `PRINCIPLES.md` (`design/001-harness-release-1.md:61-79`) is not a preservation or an ownership assignment; the proposal must name the destination and rule for each, or explicitly explain a deliberate equivalent.

2. **The two adapter boundary is incomplete** — blocking. The proposal says Claude has a fresh-context review and no design stage (`design/001-harness-release-1.md:27-30`, `design/001-harness-release-1.md:67-70`), but never states that the default Claude reviewer is same-family and that no cross-family reviewer is required. It also gives one global signed `AGREE`/`BLOCK` record convention without saying how the Claude review record differs from OpenCode's design-stage/verdict machine. The source comparison explicitly makes those mode-specific boundaries (`docs/01-harness-comparison.md:110-147`), while Tressette states “no separate design-issue stage” directly (`Tressette/CLAUDE.md:12-19`). State the Claude defaults and the exact shared-versus-mode-specific record behavior; otherwise OpenCode's design stage or cross-family requirement can leak into Claude mode.

3. **No authoritative ownership map is actually proposed** — blocking. The file table says `PRINCIPLES.md` will contain “the ownership map” (`design/001-harness-release-1.md:67`), but supplies no rows. Worse, the proposal assigns verdict/materiality to `AGENTS.md`, signature/materiality to `reviews/README.md`, and then restates the signature/materiality rule globally (`design/001-harness-release-1.md:68`, `design/001-harness-release-1.md:72-73`, `design/001-harness-release-1.md:101-113`). Scopetta's map is authoritative precisely because it assigns each idea once and requires non-owning files to link (`Scopetta/PRINCIPLES.md:12-26`). Add the complete map, including the ideas in finding 1, and remove or classify every duplicate statement.

4. **Local-first review semantics are asserted but not operationally defined** — blocking. The proposal establishes canonical files and revision-linked re-review (`design/001-harness-release-1.md:101-113`), but does not state the rules needed to apply fallback, waiver, and materiality without GitHub: recording the replacement reviewer's model and selector; making a fallback reviewer designated; limiting waiver to implementation review; requiring an owner amendment to bypass design; defining the whitespace/commit-message/typo exceptions; and treating material body/comment changes as re-review triggers. Those are the rules that make the claim “expressible entirely in these files” testable, and they are present in the source process (`Scopetta/AGENTS.md:109-137`). Add them to the owned files and specify that a local waiver is never an AGREE.

5. **The non-trivial test and pure-typo exception are not stated** — blocking. `design/001-harness-release-1.md:52` and `design/001-harness-release-1.md:67` name Scopetta's test and floor but give builders neither the four observable-change conditions nor the conservative path checklist. Scopetta defines both (`Scopetta/PRINCIPLES.md:28-44`), and safely limits the exception to a pure typo/comment that changes no behaviour, assertion, or process text (`Scopetta/PRINCIPLES.md:62-66`). Without that wording, a process change can be relabelled a typo to skip review. The release design must state the test, floor, and guard explicitly.

6. **The gates seam names a category but not the six required disciplines** — blocking. The proposal says `PRINCIPLES.md` will contain “the gates disciplines” and the project slot will contain a gates table (`design/001-harness-release-1.md:67`, `design/001-harness-release-1.md:81-94`), but never enumerates the six obligations: one declared table, red gate blocks merge, new assertion fails first, reproduce before acting, assert what a person notices/play it, and state what a passing check would have caught (`docs/01-harness-comparison.md:234-259`). The design correctly excludes project-specific tests, UI checks, mutation harnesses, and CI files (`design/001-harness-release-1.md:74-79`, `design/001-harness-release-1.md:130-135`); the fix is to make the seam's six process obligations explicit, not to import those tools.

### Verified

- The local-first direction is correct: the proposal makes repository files canonical and posts the same text verbatim remotely when available (`design/001-harness-release-1.md:101-113`).
- The scaffold shape is implementable by inspection: it uses local `git show`, rejects an existing non-empty target, performs no network/GitHub operation, and initializes fresh history (`design/001-harness-release-1.md:115-128`).
- The bootstrap is sequenced correctly: this design is reviewed first, implementation follows AGREE, and the implementation receives its own review (`design/001-harness-release-1.md:137-143`).
- Open questions 1–4 are owner decisions (slot location, first-run ref interface, library shape, and artistic-license placement); question 5 is the reviewer's process decision. I settle question 5 as **yes**, with the reviewer authoring its implementation verdict in `reviews/` while the design-stage verdict remains appended to the design record.
- The optional verification library is kept non-mandatory and no project verification tool is included in the proposed release inventory (`design/001-harness-release-1.md:74`, `design/001-harness-release-1.md:130-133`).

### Not verified

- No scaffold implementation exists at the reviewed revision, so Windows execution, actual `git show` output, target-directory refusal, and the generated commit could not be run; these remain implementation-review checks.

— GPT-5.6 Luna (opencode/gpt-5.6-luna#high), reviewer
BLOCK
