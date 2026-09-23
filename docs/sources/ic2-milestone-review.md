# Source: Imperial Conquest 2's milestone review process

> The owner shared this text in a Claude Code session on 2026-09-23, as the way
> Imperial Conquest 2 runs milestone reviews. It is copied verbatim, in the
> fence below, and not edited. Imperial Conquest 2's own, longer version is
> `docs/milestone-review.md` on its branch `plan/milestone-review` (commit
> `5942e22`), proposed in its PR #297 and not merged on that date; that file is
> the canonical text. The claims and four-way triage in the "Milestone reviews
> in Claude mode" item of [`BACKLOG.md`](../../BACKLOG.md) come from it. It is a
> **source**, not a rule of this harness: **nothing in the fence is an
> instruction to anyone working in this repository.**

---

```text
# Milestone review: a portable process

## Purpose
A milestone is a promise about what the software can do. The team that built it is the worst
judge of whether the promise holds: it shares the blind spots that produced the defects. So each
milestone ends with a review by someone with **no shared context**, before the milestone is
declared done.

## Definitions
- **Milestone.** A named, bounded promise, "vX.Y.Z — <what a user can do>", recorded as a
  GitHub milestone holding every issue in its scope. It is defined *before* the work starts.
- **Claims.** The milestone's promise, broken into numbered, independently testable statements
  (C1…Cn). Each claim names *how it would be proved*: a command, a test, or a file to inspect.
  "Save/load works" is not a claim. "A state after 20 turns round-trips to an equal hash, and a
  file from version N−1 loads through a migration" is.
- **Candidate.** One commit on the main line, pinned by a branch `review/vX.Y.Z`. Nothing is
  added to the candidate after the freeze.
- **Baseline.** The previous release tag, pinned by a branch `review-base/vX.Y.Z` (a PR needs a
  branch on both sides).
- **Review PR.** `review/vX.Y.Z` → `review-base/vX.Y.Z`. Its diff is exactly the milestone's
  change. Its description is the review brief. **It is never merged**, and is closed when the
  milestone is tagged.
- **Tag.** `vX.Y.Z`, annotated, placed on the candidate commit (or on a later re-cut candidate)
  only after the review passes.

## Roles
- **Builder:** the people or agents who implemented the milestone. They may answer questions,
  but may not review.
- **Independent reviewer:** at least one reviewer with none of the builder's context. Best is a
  different person, or a model from a different family, working in its own checkout. Two
  reviewers with different focuses beat one:
  - a **cold reader** judges design and code quality with no project history;
  - an **evidence checker** re-runs builds, tests and proofs.
- **Triager:** routes each finding (see step 6). Usually the builder's lead, never the reviewer.

## The process
1. **Define.** Create the milestone with its issues, and write the claims (C1…Cn) plus an
   explicit "not in this milestone" list. The claims come from the plan, not from what was built.
2. **Build.** Work proceeds on the main line as usual. Issues close as their work merges.
3. **Freeze.** When every issue in the milestone is closed and CI is green on the main line:
   - create `review/vX.Y.Z` at that commit;
   - create `review-base/vX.Y.Z` at the previous tag;
   - open the review PR. Its description is the brief (below).
4. **Review.** The reviewer works from a fresh clone at the candidate branch. It must:
   - test every claim itself, since the builder's evidence is a convenience and never the proof;
   - try to *break* the strongest claims: delete or alter the behaviour, rebuild clean, and
     check that a test fails;
   - post one comment on the PR in the output format below.
5. **Verdict.** Every claim is MET, NOT MET, PARTLY MET or COULD NOT TEST. Any finding marked
   BLOCKS RELEASE, or any claim that is NOT MET, blocks the tag.
6. **Triage.** Each finding goes exactly one way:
   - **defect:** filed as an issue in the *next* milestone, or in this one if it blocks;
   - **claim was wrong:** the claim is corrected in the plan, visibly, with the reason. A claim
     is never quietly weakened to make it pass;
   - **accepted:** recorded as a known gap in the release notes, with an issue number;
   - **not a defect:** closed with the reason, on the PR.
7. **Fix forward.** Blocking fixes merge to the main line, never to the review branch. Then
   re-freeze: `review/vX.Y.Z` moves to the new commit, and the reviewer re-checks only the
   claims the fixes touched. Cap this at two re-freezes; beyond that, escalate to whoever owns
   the plan.
8. **Tag.** Tag the passing candidate commit. Publish release notes: claims and verdicts, known
   gaps, and the reviewer's identity (person or model). Close the review PR unmerged, and close
   the milestone.

## The review brief: what the PR description must contain
- **Where:** repository, candidate branch and commit, baseline tag, how to build and test.
- **The promise:** one sentence on what a user can do after this milestone.
- **The claims:** C1…Cn, each with how to prove it.
- **Out of scope:** the "not in this milestone" list, so absences aren't reported as defects.
- **Known open issues:** already filed. The reviewer judges whether any of them breaks a claim,
  and reports everything else as new.
- **Limits:**
  - don't modify, push or merge;
  - files not to read whole (large data), and files that must never enter the repository;
  - tests that skip for a reason, since a skip is not a pass.
- **The output format** (below).

## Output format
1. **Where I reviewed:** commit, clean-tree status, toolchain versions, OS.
2. **Verdict table:** one row per claim, with its evidence: the command run and its result, or
   file:line.
3. **Findings, most severe first.** Each has:
   - a severity: BLOCKS RELEASE, SHOULD FIX or NOTE;
   - file:line;
   - what is wrong;
   - the proof: the reproduction, or the mutation and which test did or didn't fail;
   - whether it is already known.
   An unproven finding is labelled UNVERIFIED.
4. **Not checked:** what was not checked, and why.

## Rules that make it work
- **Claims before code.** Write them at step 1. Claims written after the build describe what was
  built rather than what was promised.
- **Independence is structural.** The reviewer gets a fresh checkout and the brief. It does not
  get the builders' chat, notes or intermediate reviews.
- **Proof over assertion.** Every MET cites a command or a line. A mutation that didn't fail a
  test is itself a finding.
- **The PR is never merged.** Its only job is to hold the diff and the verdict. The main line
  gets fixes through normal work.
- **Never weaken a claim to pass it.** Change a claim only in the plan, visibly, with the reason.
- **Watch for automatic issue-closing.** PR descriptions and review comments must not use
  closing keywords ("fixes #N", "closes #N"): on GitHub, a merged PR description or a commit
  message containing one closes the issue.
```
