# 002 — Harness release 2

**Stage:** design · **Status:** revision 3, awaiting re-review · **Date:** 2026-09-23.

**How this record works** (`design/README.md`): this file is the design
proposal; the reviewer appends a signed `## Review — design stage` section
below. Nothing is implemented before an explicit **AGREE**. When a remote
exists, the same text is posted verbatim as the design issue.

**Revisions.** v1 (`8c770ea`) was BLOCKED on findings 1–2 (the completion
note's boundary; the `Status:` transitions) plus one non-blocking citation
correction. v2 (`23d1594`) resolved those and was BLOCKED on one finding: the
Claude completion-note file was identified by an AGREE marker Claude does not
have. v3 is this revision; earlier verdicts stay below as history and the
latest governs.

**Input.** The `toy-r1` field test — [`experiments/toy-r1/record.md`](../experiments/toy-r1/record.md)
— found release 1 sound and named four template and ownership fixes. The owner
directed that they be folded into release 2.

---

## Problem

Release 1 held on a non-card project without harness edits, and the field test
produced four items worth fixing in the templates themselves:

1. `PLAN.md`'s table does not carry the overlay's own required fields, so the
   first session had to redesign it and lost a review round to the mismatch
   (`experiments/toy-r1/record.md`, Friction 1).
2. The scaffold's generated README does not surface the remote as an owner
   action, although an iteration whose done-when names CI cannot complete
   without one (`record.md`, Friction 2; the toy design record carries the
   decision as an open question at
   `toy-r1/design/001-iteration-0-scaffold.md:258-267`).
3. No record closes the completion loop: the toy's last design verdict says
   "the pull-request CI run has not been verified here"
   (`toy-r1/design/001-iteration-0-scaffold.md:361-363`), and the done-when is
   carried only by the PR body and the merge (Friction 3).
4. The design record's `Status:` line drifts because no rule owns it: in the
   toy's record it read `under review` at `a8723dc` and `ef86f2f` *after* the
   first design AGREE, and the current value still names `ef86f2f` although the
   latest reviewed revision is `d954ff0`
   (`toy-r1/design/001-iteration-0-scaffold.md:3-6`; Friction 4 in
   `experiments/toy-r1/record.md`).

## Findings grounded in the files

- `PLAN.md:14-23` states the five fields every iteration must record, and
  `PLAN.md:29-32` ships a four-column table (`iteration | request | effort |
  reviewer`) — the contradiction the field test hit.
- The scaffold's generated README lists the first-session steps
  (`tools/scaffold.mjs:97-113`) and then "Optional remote"
  (`tools/scaffold.mjs:114-120`), which is where the dependency hides.
- `PRINCIPLES.md:64-102` owns the shared protocol; it has no completion step,
  and its materiality rule does not classify one.
- `design/README.md:3-13` defines the record but names no owner for `Status:`;
  `reviews/README.md:3-24` defines the review record and has no place for the
  implementer's closing note in Claude mode, which has no design record.

## Design

Each change has exactly one owner (`PRINCIPLES.md`, the ownership map).

### 1. `PLAN.md` — the table the overlay requires

Replace the table at `PLAN.md:25-32` with the field-tested eight-column shape
(genericized from `toy-r1/PLAN.md:32-39`):

`| iteration | request | done when | out of scope | mode | design record | effort | reviewer |`

- Two example rows: iteration 0, and the growth row (`5+`: the first unblocked
  request).
- A note above the table: an iteration may be a **build-order step** with no
  roadmap request; its request cell says so, and the exception is recorded, not
  improvised.
- The section `PLAN.md:14-23` keeps owning the field *rules*; the table is the
  template that carries them.

**File:** `PLAN.md`.

### 2. The scaffold README — the remote as an owner action

In the generated README (`tools/scaffold.mjs:97-120`):

- the first-session list gains an explicit owner step: *if the project's checks
  run in CI, create the remote before an iteration whose done-when names CI —
  `gh repo create <owner>/<name> --source . --push`; a done-when that names CI
  is not met until the workflow has run green*;
- "Optional remote" is retitled and rewritten to say when it stops being
  optional.

**File:** `tools/scaffold.mjs` (the generated README only).

**Verification:** run the scaffold from the reviewed revision into a temp
directory, read the generated README, remove the directory.

### 3. The completion note

- `PRINCIPLES.md`, protocol: **Completion.** When a change lands, the
  implementer appends a short **completion note** to the change's record: each
  done-when item, and the evidence that closed it — the CI run, the gate
  output. The note records an outcome and is **non-material**: it changes no
  proposal, no assertion and no process text, so the latest verdict still
  governs and no re-review follows.
- **The boundary.** The note may only transcribe the already-agreed done-when
  items and their evidence or outcome. Changing a done-when, an assertion, an
  owner decision or any process rule is **material** and takes the review its
  mode requires; a note that does any of those is not a completion note. This
  is what stops a proposal change hiding under the heading.
- `design/README.md`: in OpenCode mode the note is a `## Completion` section in
  the design record, owned and signed by the implementer.
- `reviews/README.md`: in Claude mode, which has no design record, the note is
  appended under `## Completion` to the **final implementation review file** —
  the last round whose final line states that no blocking finding remains
  (Claude has no AGREE marker) — owned and signed by the implementer. The
  reviewer settled open question 2 this way — not the pull-request body;
  repository records stay canonical.
- **One writer:** the implementer. The reviewer never writes the note.

**Files:** `PRINCIPLES.md`, `design/README.md`, `reviews/README.md`; the
placement is recorded in the ownership map's protocol row.

### 4. `Status:` gets an owner and transitions

`design/README.md`: the `Status:` field belongs to the **implementer** — one
writer — and every transition is recorded in the same commit as the event it
describes:

| event | the field becomes |
|---|---|
| the record is written | `proposed` |
| a verdict is requested (first submission, or a re-review after fixes) | `in review` |
| a verdict is recorded | `agreed` or `blocked`, and the value names the revision the verdict covers |
| a material edit after `agreed`, with the re-review requested | `in review` |
| the change has merged and the completion note is written | `landed` |

A record can reach `landed` only when the latest verdict is `agreed`; a
`blocked` record cannot become `landed` without an intervening `agreed`. The
field applies to design records, so it is OpenCode-only; Claude mode has no
design records.

**File:** `design/README.md`.

### 5. Bookkeeping, at landing

Update [`EXPERIMENTS.md`](../EXPERIMENTS.md) and the field-test record's status
to say the four items were folded into `r2`, with the tag. Same commit as the
tag.

## Ownership map touch

One row changes: the protocol row gains "completion note". The design-record
and verdict-record format rows already own the placements; no new owners.

## Verification

The harness repository declares **no test gates** — changes are document-only
and reviewed under the process. This release touches one runtime artifact, the
scaffold, so its verification is:

1. `node --check tools/scaffold.mjs`;
2. a scaffold smoke run from the reviewed revision: the generated README
   contains the new owner step and the retitled remote section, eight harness
   files are copied, one commit is made, a non-empty target is refused;
3. the reviews — the implementer's, then the reviewer's, which repeats the
   smoke independently.

## Out of scope (recorded, not lost)

- The `Geoclick2027` candidates ([`docs/08-geoclick2027-harness.md`](../docs/08-geoclick2027-harness.md)
  §4): context-budget table, handoff file, model trailer, task-state shape,
  doctor, finding tiers, automerge conditions.
- The implementer's **answers** have no named home in Claude mode; the field
  test's "conversation saved" question. Candidate for release 3.
- Experiments E1–E6.
- No change to the modes, the stage structure, the classification, or the
  materiality rules beyond the completion note's stated non-material status.

## Open questions

1. **Scope** — the four field-test items only, as the owner directed, or also
   the `Geoclick2027` candidates. Recommended: the four; the Geoclick list is
   explicitly deferred here. _(Owner decision, already indicated in the
   direction to fold the four; recorded rather than assumed.)_

**Settled by the v1 review:** 2. the completion note's home in Claude mode is
the final implementation review file — the last round whose final line states
that no blocking finding remains — not the pull-request body (§3).

---

## Review — design stage

**Revision reviewed:** 8c770ea.
**Verdict:** BLOCK — findings 1–2 must be resolved before implementation can earn AGREE.

### Findings

1. **The completion-note exception needs an enforceable boundary** — blocking. `PRINCIPLES.md:73-78` currently makes material edits to a design record re-reviewable, while the proposal (`design/002-harness-release-2.md:90-101`, `147-148`) adds a non-material completion-note category. The proposal says the note changes no proposal, assertion, or process text, but does not state the operational boundary that distinguishes a note from a disguised amendment. It must say that the note may only transcribe the already-agreed done-when items and their evidence/outcome; changing a done-when, assertion, owner decision, or process rule is material and triggers re-review. Otherwise an implementer could label a proposal change `Completion` and bypass the gate.

2. **`Status:` transitions do not yet close the drift path** — blocking. The proposal assigns the field to the implementer and lists values (`design/002-harness-release-2.md:106-111`), but only says it is updated when a verdict round is recorded. That supplies no trigger for `in review` or `landed`, and no transition back to `in review` after a BLOCK is fixed; one writer does not itself prevent omission. Specify the mandatory transition events and order (creation, review submission, each verdict, re-review after a fix, merge/landing, and completion-note recording), including that a blocked record cannot become `landed` without a later AGREE.

3. **Some evidence citations are stale or imprecise** — non-blocking. The proposal calls the current `PLAN.md:29-32` table “three-column” (`design/002-harness-release-2.md:39-40`), but it has four columns: `iteration | request | effort | reviewer`. Also, the cited current `toy-r1/design/001-iteration-0-scaffold.md:3` now says `Status: agreed`, not `under review`; the friction is accurately reported at `experiments/toy-r1/record.md:86-88`, and the historical `a8723dc`/`ef86f2f` versions show the cited drift. Correcting the citation will make the diagnosis reproducible without changing its substance.

### Verified

- The four proposed items correspond to the field-test friction: the plan shape and missing build-order exception (`experiments/toy-r1/record.md:75-77`), the unsurfaced remote dependency (`:78-80`), the unclosed completion loop (`:81-85`, corroborated by `toy-r1/design/001-iteration-0-scaffold.md:361-363`), and status ownership (`:86-88`).
- The proposed plan shape carries all five overlay fields plus effort and reviewer, and explicitly records the build-order exception (`design/002-harness-release-2.md:55-68`); the toy's corrected table demonstrates the intended eight-column result (`toy-r1/PLAN.md:29-39`).
- The scaffold change is limited to generated README text. Its owner action is conditional on CI and on a CI-named done-when (`design/002-harness-release-2.md:72-87`), while the scaffold itself retains its explicit local/no-network contract (`tools/scaffold.mjs:7-9`) and does not create a remote.
- The ownership-map touch is minimal: protocol semantics remain in `PRINCIPLES.md`, placements remain in the design/review format owners, the implementer is the sole completion-note writer, and the reviewer still writes its own verdict. The Claude placement does not introduce a design stage (`AGENTS.md:16-40`; `CLAUDE.md:19-20`).
- Open question 1 is correctly an owner decision. Open question 2 is settled here: the canonical home in Claude mode is the final implementation review file for the change (the review round whose verdict is AGREE), not the pull-request body; repository records remain canonical and the review-record format owns that file (`PRINCIPLES.md:68-72`, `reviews/README.md:3-9`).
- The out-of-scope list accounts for the Geoclick candidates, the Claude answers question, E1–E6, and unrelated mode/stage/classification changes (`design/002-harness-release-2.md:139-148`); no silent extra release objective is apparent.

### Not verified

- No implementation exists at this revision, so the revised generated README, scaffold smoke behavior, `node --check`, status updates, and completion-note recording cannot yet be verified. Those belong to implementation-stage verification after the blocking design findings are resolved.

— GPT-5.6 Luna (opencode/gpt-5.6-luna#high), reviewer
BLOCK

---

## Review — design stage (revision 2, 23d1594)

**Verdict:** BLOCK — the Claude completion-note discriminator contradicts Claude's review-record format.

### Findings

1. **Claude mode has no AGREE verdict to identify the completion-note file** — blocking. v2 says the note belongs in the implementation review file “whose verdict is the AGREE” (`design/002-harness-release-2.md:111-115`, repeated at `184-186`). But Claude explicitly has “no AGREE/BLOCK marker” (`CLAUDE.md:19-20`), and `reviews/README.md:17-19` requires Claude's final line to state whether any blocking finding remains, with no marker. Keep the settled choice of the final implementation review file, but identify it by the last Claude review round whose final line states that no blocking finding remains (and reserve `AGREE` for OpenCode); as written, the rule is not implementable without contradicting the existing owner.

### Verified

- The completion-note boundary now has the required guard: it may only transcribe already-agreed done-when items and their evidence/outcome, while changing a done-when, assertion, owner decision, or process rule is material and takes the mode's review (`design/002-harness-release-2.md:104-108`).
- The `Status:` transition table now names one writer, all required events, same-commit recording, and the `landed` constraint (`design/002-harness-release-2.md:121-138`). In particular, landing requires the latest verdict to be `agreed`, and a blocked record requires an intervening `agreed`.
- The citation correction is resolved: the plan is described as a four-column table (`design/002-harness-release-2.md:47-49`), and the status drift is grounded in the `a8723dc`/`ef86f2f` history plus the current value naming `ef86f2f` against latest reviewed revision `d954ff0` (`:38-43`).
- The underlying open-question-2 decision is correct and remains the canonical final implementation review file rather than the pull-request body; only its Claude-mode identifier needs the correction above. The one-writer rule still leaves the reviewer responsible for its own verdict (`design/002-harness-release-2.md:109-119`).
- No other new contradiction is apparent in the revised scope, ownership touch, scaffold condition, or out-of-scope list (`design/002-harness-release-2.md:80-95`, `148-175`).

### Not verified

- No implementation exists at this revision, so the scaffold smoke run, `node --check`, generated README, status updates, and completion-note recording cannot be verified yet; these remain implementation-stage checks.

— GPT-5.6 Luna (opencode/gpt-5.6-luna#high), reviewer
BLOCK
