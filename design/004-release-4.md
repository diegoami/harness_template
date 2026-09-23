# 004 — Harness release 4

**Stage:** design · **Status:** proposed · **Date:** 2026-09-23.

**How this record works** (`design/README.md`): the reviewer appends a signed
verdict below; nothing is implemented before an AGREE.

**Input.** An audit of the live harness against the lessons recorded in the
archives ([`docs/archive/02-ic2-complex-model.md`](../docs/archive/02-ic2-complex-model.md),
[`docs/archive/08-geoclick2027-harness.md`](../docs/archive/08-geoclick2027-harness.md))
found four never adopted. The owner adopted all four (2026-09-23). The rest of
the archived lessons — worktrees, the task-state machine, `doctor`, model
trailers, a handoff file — remain out of scope: they solve scale this harness
does not have.

---

## Problem

1. **No target proof.** A verdict "covers the named revision", but nothing
   requires the reviewer to show what it reviewed or to stop when the target is
   wrong. IC2's Gate 0 exists because a reviewer once produced confident
   findings about an unrelated merged commit.
2. **No round limit.** BLOCK loops can run indefinitely; IC2 caps a stage at two
   rework rounds and then escalates to the owner.
3. **Negative results are trusted.** Gate discipline 3 requires a new assertion
   to fail first, but a claim that *nothing* caught a break is not re-taken. IC2
   recorded the failure class — a stale build produced a phantom green and a
   false "no test caught this" reached a pull request — and we have met it twice
   in miniature: a fake `gh` was silently bypassed and created a repository, and
   a fail-first restore failed because the file was untracked.
4. **The slot's paths are loose.** The project slot lists paths with no
   canonical source and no reasons. Geoclick's archive shows the cost: a mirror
   edited instead of the original, and `data/facts/` (authored input) confused
   with `data/maps/*/facts.json` (generated output) because the basenames
   collide — a mistake that reached a GitHub issue.

## Findings grounded in the files

- `PRINCIPLES.md` protocol: "A verdict or review covers **the named revision**."
  — no file list, no stop condition.
- `PRINCIPLES.md`, gate disciplines: six, and discipline 3 stops at "made to
  fail before it is made to pass".
- `CLAUDE.md`, the slot template between the `SLOT` markers, and
  `tools/scaffold.mjs` (`slotText`): "paths to inspect", "paths to normally
  ignore", "never read or echo" — no canonical source, no reasons.
- `ADOPT.md` step 2 repeats the same three loose fields.
- `reviews/README.md`: the file names the revision, but not the file list it
  checked; the naming bullet counts rounds (`-NN`) without a ceiling.

## Design

Each change has one owner (`PRINCIPLES.md`, the ownership map).

### 1. Target proof (Gate 0)

- **`PRINCIPLES.md`, protocol** — replace the revision bullet with:

  > A verdict or review covers **the named revision**, and the reviewer shows
  > the target before judging: the revision, and where a remote exists the pull
  > request's head and file list. **Every finding names a file in that change**;
  > an empty or mismatched target means the wrong tree, so the review stops and
  > says so rather than reviewing what it can see.

- **`reviews/README.md`** — the opening bullet requires the checked file list as
  well:

  > The file opens with **the revision it covers** (the commit sha), the file
  > list the reviewer checked and the command that produced it, the reviewer's
  > display name and model id, and the mode. Findings name files from that list;
  > a mismatch or an empty list is a wrong target, not a finding.

### 2. A round limit

- **`PRINCIPLES.md`, protocol** — a new bullet after *Reviewer sessions*:

  > **Rounds.** A stage ends on a verdict; rework rounds are counted in the
  > review records (`-NN`). A stage that reaches a second rework without an
  > AGREE — the third verdict round — stops and goes to the owner, who decides:
  > re-scope, record a decision, or waive. It does not loop.

- **`reviews/README.md`** — the naming bullet notes the ceiling and points at the
  rule.

### 3. Negative results are re-taken

- **`PRINCIPLES.md`, gate discipline 3** — extend it in place, so the count
  stays six:

  > **A new assertion is made to fail before it is made to pass**, and a claim
  > that *nothing* caught it is re-taken before it is believed: show that the
  > break landed, that the command ran, and that it ran on the revision under
  > review. A false red announces itself; a false green is silent.

- **`verification/README.md`, pattern 4** — one sentence with the machinery
  detail (a fresh copy or rebuild before the negative result is reported).

### 4. The context-budget field in the slot

- **`CLAUDE.md`**, the slot template, and **`tools/scaffold.mjs`** (`slotText`),
  replace the first two path bullets with:

  > - **the canonical source:** the one place to read and edit; name any mirror,
  >   copy or generated artifact that must never be edited or cited.
  > - **paths to normally ignore:** each with its reason — generated by what, a
  >   copy of what, or merely large. Ignoring a path never means deleting or
  >   gitignoring it.

- **`ADOPT.md`**, step 2 — the reconnaissance asks for the canonical source and
  a reason per ignored path.

### Ownership map touch

The protocol row gains "target proof, rounds". The gate-discipline and
project-slot rows already own the rest; no new owners.

## Verification

- `node --check tools/scaffold.mjs`.
- Generate `standard` from the reviewed revision into a temp directory and read
  the slot: the canonical-source and reason-bearing ignore bullets are present
  and filled; clean up. The reviewer reproduces it.
- The document changes are read against this record.

## Out of scope (recorded, not lost)

- Worktrees, the task-state machine, `doctor`, model attribution trailers, a
  handoff file — archived, for scale this harness does not have.
- Finding tiers beyond `blocking`/`non-blocking`.
- The `--test` quoting guard and the review-never-creates rule
  ([`BACKLOG.md`](../BACKLOG.md)) — they stay in the backlog.

## Open questions

None. The round ceiling's exact wording — "the third verdict round" — is the
reviewer's to confirm or correct.
