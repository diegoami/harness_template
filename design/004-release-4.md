# 004 — Harness release 4

**Stage:** design · **Status:** landed · **Date:** 2026-09-23.

**How this record works** (`design/README.md`): the reviewer appends a signed
verdict below; nothing is implemented before an AGREE.

**Revisions.** v1 (`d69c538`) was BLOCKED on three findings (Gate 0's local
proof, the round ceiling's scope, the removed "paths to inspect"). v2
(`6f12a15`) resolved those and was BLOCKED on two: the local Gate 0 proof left
its base undefined and its equality check implicit, and the record's `Status:`
used a value the design-record vocabulary does not allow. v3 is this revision.

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
  > the target before judging: the revision, and the files of the change — the
  > pull request's head and file list where a pull request exists, otherwise the
  > diff from the change's base (`git merge-base main <revision>`, then
  > `git diff --name-only <merge-base>..<revision>`). **The revision the reviewer
  > holds must equal the named target, and its file list must equal the change's
  > file list**; every finding names a file in that list. An empty diff or a
  > mismatched revision is the wrong tree, so the review stops and says so
  > rather than reviewing what it can see.

- **`reviews/README.md`** — the opening bullet requires the checked target as
  well, and the same format serves an appended design verdict:

  > The verdict opens with **the revision it covers** (the commit sha), the file
  > list the reviewer checked and how it was obtained (the pull request's files,
  > or the local diff from the merge base), the reviewer's display name and model
  > id, and the mode. Findings name files from that list; a mismatch or an empty
  > list is a wrong target, not a finding.

- **`design/README.md`** — one line: a design verdict follows
  `reviews/README.md`'s format, target proof included.

### 2. A round limit

- **`PRINCIPLES.md`, protocol** — a new bullet after *Reviewer sessions*:

  > **Rounds.** Rounds are counted per stage: each appended design verdict, and
  > each implementation review file (`-NN`), is one round. Rounds 1 and 2 may
  > rework; a third round that does not end clean — `AGREE` in OpenCode mode,
  > the statement that no blocking finding remains in Claude mode — stops and
  > goes to the owner, who decides: re-scope, record a decision, or, at the
  > implementation stage only, waive. It does not loop.

- **`reviews/README.md`** — the naming bullet notes the count and the ceiling
  and points at the rule; `design/README.md` notes that appended design verdicts
  count the same way.

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
  keep the inspect bullet and add the two fields:

  > - **paths to inspect:** the source roots and documents worth reading by
  >   default.
  > - **the canonical source:** the one place to read and edit; name any mirror,
  >   copy or generated artifact that must never be edited or cited.
  > - **paths to normally ignore:** each with its reason — generated by what, a
  >   copy of what, or merely large. Ignoring a path never means deleting or
  >   gitignoring it.

- **`ADOPT.md`**, step 2 — the reconnaissance asks for the paths to inspect, the
  canonical source, and a reason per ignored path.

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

## Completion

Written on landing (tag `r4`, merge `8e30733`), per the rule release 2
introduced; the note is non-material and transcribes the verification items.

- `node --check tools/scaffold.mjs` — clean.
- `standard` was generated from the reviewed revision by the implementer and
  independently by the reviewer, and the slot read: the canonical source and a
  reason per ignored path are present; temporary directories removed.
- Reviews: design `AGREE` on `682585b` (three rounds — the case the ceiling
  names); implementation `AGREE` on `8cbcea5`
  ([`reviews/004-release-4-impl-02.md`](../reviews/004-release-4-impl-02.md)).
- Landed: PR #4 merged at `8e30733`; tag `r4` on the bookkeeping commit.
- Recorded to GitHub after the fact, on the owner's observation: the design
  proposal is [issue #5](https://github.com/diegoami/harness_template/issues/5)
  with the three design verdicts as comments, and PR #4 carries the two
  implementation reviews. Releases 1–3 remain file-only (git history).

— Implementer (DeepSeek V4.1 Flash)

**Correction** (2026-09-23, after landing): the last sentence above went stale
minutes after it was written. Releases 1–3 were then backfilled, after their
merges: issues [#6](https://github.com/diegoami/harness_template/issues/6),
[#7](https://github.com/diegoami/harness_template/issues/7) and
[#8](https://github.com/diegoami/harness_template/issues/8) hold the design
records with their verdicts as comments, and PRs #1–#3 carry the
implementation reviews. The note above is kept as written; this corrects it.

— Claude Opus 5.5, the stale-text correction (not this record's implementer)

---

## Review — design stage

**Revision reviewed:** d69c538.
**Verdict:** BLOCK — findings 1–3 must be resolved before implementation.

### Findings

1. **Gate 0 does not define the local target proof and overstates the remote condition** — blocking. The proposed protocol says to show the pull request head and file list “where a remote exists” (`design/004-release-4.md:59-63`), but a configured remote does not imply that a pull request exists; this is therefore unusable for a local run with no PR. The new record rule requires a checked file list and the command that produced it (`design/004-release-4.md:65-71`), while the protocol only identifies the revision for the local case and gives no local command/source for that list. Qualify the PR evidence by PR existence and specify the local revision/file-list proof. The addition itself does not conflict with the existing opening requirements (`reviews/README.md:3-9`) or Claude’s no-marker ending (`reviews/README.md:17-19`), but those facts do not close the operational gap for both record kinds: design verdicts use the same format by reference (`design/README.md:27-29`) and also need a local proof.

2. **The round ceiling is not expressible for every mode and record kind** — blocking. The intended mapping can be inferred from `NN` starting at `01` (`reviews/README.md:3-4`): verdict rounds 1 and 2 may rework, and a non-clean round 3 escalates. However, the proposal limits the count to review records named `-NN` (`design/004-release-4.md:75-80`), whereas a design-stage verdict is appended to `design/NNN-<slug>.md` and has no such round suffix (`design/README.md:27-31`). More importantly, “without an AGREE” cannot define the Claude outcome because Claude explicitly has no AGREE marker (`CLAUDE.md:19-21`; `reviews/README.md:17-19`). The proposed owner option to “waive” also needs to respect the existing implementation-stage-only waiver rule (`PRINCIPLES.md:88-90`). State the exact round-1/2/3 behavior for appended design verdicts and for Claude’s “no blocking finding remains” result, and give the mode-appropriate owner escalation outcome.

3. **Removing “paths to inspect” contradicts a live shared rule** — blocking. The design explicitly replaces the first two slot bullets (`design/004-release-4.md:100-107`), but `PRINCIPLES.md` still instructs builders to use the project’s “paths to inspect and to ignore” from the slot (`PRINCIPLES.md:147-149`), and the adoption reconnaissance still asks for both categories (`ADOPT.md:35-39`). A canonical source is not a replacement for the source roots and documents worth reading by default in the current slot (`CLAUDE.md:43-47`) unless the shared habit and adoption instructions are changed as part of this design. Retain an inspect-paths field or explicitly update its owning references; the proposed “ignoring a path never means deleting or gitignoring it” wording is otherwise preserved (`design/004-release-4.md:105-107`).

### Verified

- Extending discipline 3 in place keeps the count at six (`design/004-release-4.md:85-93`), agrees with the archive’s negative-result lesson (`docs/archive/02-ic2-complex-model.md:69-74`), and does not contradict the mutation-harness pattern (`verification/README.md:27-33`) or the completion-note boundary in `PRINCIPLES.md:102-109`.
- The ownership-map touch is directionally correct: target proof and rounds belong to the protocol, while the discipline and project-slot ideas remain with their existing owners (`PRINCIPLES.md:8-23`; `design/004-release-4.md:112-115`).
- The verification plan includes syntax checking, exercising scaffold generation, and reading the document changes (`design/004-release-4.md:117-123`); the listed worktree/task-state/model-trailer/backlog items are not required by the four stated lessons (`design/004-release-4.md:125-131`).

### Not verified

- The proposed scaffold and document edits do not exist at the reviewed revision, so their generated output and final cross-file consistency cannot yet be executed.

— GPT-5.6 Luna (opencode/gpt-5.6-luna#high), reviewer
BLOCK

---

## Review — design stage (revision 2, 6f12a15)

**Verdict:** BLOCK — findings 1–2 must be resolved before AGREE.

### Findings

1. **The local Gate 0 proof still has an undefined base and an implicit equality check** — blocking. V2 correctly limits pull-request evidence to cases where a pull request exists and supplies the local command (`design/004-release-4.md:64-70`), and the record-format addition covers both appended design verdicts and implementation reviews (`design/004-release-4.md:72-82`). But `<base>` is not defined: a local reviewer cannot reproduce `git diff --name-only <base>...<revision>` consistently for either record kind, and the text does not explicitly require the PR head (or the local revision) and its file list to equal the named target. “Mismatched target” is the right stop outcome, but define the base and the equality check before relying on it as Gate 0.

2. **The v2 record status contradicts the design-record owner’s vocabulary** — blocking. The record currently says `**Status:** revision 2, awaiting re-review` (`design/004-release-4.md:3`), but the canonical status table permits `proposed`, `in review`, `agreed`, `blocked`, and `landed`, with a re-review request requiring `in review` (`design/README.md:11-23`). This is a live process contradiction in the record being reviewed and must be corrected before the design can reach AGREE.

### Verified

- The Gate 0 design now covers both modes and both record kinds: PR head/files when a PR exists, a local diff otherwise, a required acquisition description in the verdict, and a stop rather than a finding for an empty or mismatched target (`design/004-release-4.md:64-82`; `CLAUDE.md:19-20`; `design/README.md:27-29`). The remaining issue is the undefined local base/equality operation above, not a requirement for a PR in local-first mode.
- The round ceiling is now per stage and explicitly counts each appended design verdict and each `-NN` implementation review (`design/004-release-4.md:86-97`). Rounds 1 and 2 may rework; a non-clean third round escalates, with AGREE for OpenCode and “no blocking finding remains” for Claude, and waiver permitted only at implementation stage (`design/004-release-4.md:88-93`; `PRINCIPLES.md:88-90`).
- The slot design retains paths to inspect, adds a canonical source and reason-bearing ignore paths, and preserves the no-delete/no-gitignore rule (`design/004-release-4.md:114-126`; `PRINCIPLES.md:147-149`). Its proposed `CLAUDE.md`/`slotText` wording and `ADOPT.md` reconnaissance requirements are aligned.
- V1’s other verified items still hold: discipline 3 remains one of six and the negative-result rule does not conflict with the mutation pattern or completion-note boundary (`design/004-release-4.md:99-110`; `verification/README.md:27-33`; `PRINCIPLES.md:102-109`); the ownership touch remains appropriate (`design/004-release-4.md:128-131`); and the stated verification/out-of-scope boundaries remain relevant (`design/004-release-4.md:133-147`).

### Not verified

- The proposed scaffold and document edits are still not implemented, so `node --check`, generated-slot output, and the final cross-file behavior cannot yet be run.

— GPT-5.6 Luna (opencode/gpt-5.6-luna#high), reviewer
BLOCK

---

## Review — design stage (revision 3, 682585b)

**Verdict:** AGREE — the v2 findings are resolved and no blocking contradiction remains.

### Findings

None.

### Verified

- Gate 0 now names a reproducible local base and command: `git merge-base main <revision>` followed by `git diff --name-only <merge-base>..<revision>` (`design/004-release-4.md:65-73`). I reproduced it for `682585b`; it resolved the merge base to `8e5dba14e39ccc66a8e10ce9a28a90c219369af7` and produced the non-empty file list `design/004-release-4.md`. The held revision/file-list equality and empty or mismatched-target stop condition apply to local reviews, while the PR head/file-list branch applies only when a PR exists, covering OpenCode and Claude and both design and implementation records (`design/004-release-4.md:75-85`; `CLAUDE.md:19-20`; `design/README.md:27-29`).
- The record status is now `in review` (`design/004-release-4.md:3`), exactly matching the canonical re-review transition (`design/README.md:11-19`).
- The round ceiling still counts per stage, including appended design verdicts and `-NN` implementation files; rounds 1 and 2 may rework, and a non-clean third round escalates with the correct OpenCode/Claude clean outcomes and implementation-only waiver (`design/004-release-4.md:89-100`; `PRINCIPLES.md:88-90`).
- The slot proposal still retains paths to inspect, adds the canonical source and reasons for ignored paths, and preserves the no-delete/no-gitignore rule across the proposed adapter, scaffold, and adoption instructions (`design/004-release-4.md:117-129`; `PRINCIPLES.md:147-149`).
- The v1 findings and verified items remain resolved: discipline 3 stays within six disciplines and correctly strengthens negative-result verification without conflicting with the mutation pattern or completion-note boundary (`design/004-release-4.md:102-113`; `verification/README.md:27-33`; `PRINCIPLES.md:102-109`); ownership remains correctly assigned (`design/004-release-4.md:131-134`); and the verification and out-of-scope lists remain appropriate (`design/004-release-4.md:136-150`).

### Not verified

- The proposed edits are not yet implemented, so generated scaffold output and the final `node --check` result remain implementation-stage verification items.

— GPT-5.6 Luna (opencode/gpt-5.6-luna#high), reviewer
AGREE
