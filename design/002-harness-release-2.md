# 002 — Harness release 2

**Stage:** design · **Status:** proposed · **Date:** 2026-09-23.

**How this record works** (`design/README.md`): this file is the design
proposal; the reviewer appends a signed `## Review — design stage` section
below. Nothing is implemented before an explicit **AGREE**. When a remote
exists, the same text is posted verbatim as the design issue.

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
4. The design record's `Status:` line drifts — the toy's record read "under
   review" after two AGREEs (`toy-r1/design/001-iteration-0-scaffold.md:3`)
   because no rule owns it (Friction 4).

## Findings grounded in the files

- `PLAN.md:14-23` states the five fields every iteration must record, and
  `PLAN.md:29-32` ships a three-column table (`iteration | request | effort |
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
- `design/README.md`: in OpenCode mode the note is a `## Completion` section in
  the design record, owned and signed by the implementer.
- `reviews/README.md`: in Claude mode, which has no design record, the note is
  appended to the implementation review file under `## Completion`, owned and
  signed by the implementer.
- **One writer:** the implementer. The reviewer never writes the note.

**Files:** `PRINCIPLES.md`, `design/README.md`, `reviews/README.md`; the
placement is recorded in the ownership map's protocol row.

### 4. `Status:` gets an owner

`design/README.md`: the `Status:` field belongs to the **implementer**, updated
when a verdict round is recorded. Values: `proposed` → `in review` →
`agreed` or `blocked` → `landed`. (One writer, so the field cannot be left
describing a state nobody owns.)

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
2. **The completion note's home in Claude mode** — the implementation review
   file (proposed) or the pull-request body. _(Mechanic; the reviewer may
   settle it.)_
