# Review: name r5 as the tagged release, round 02

**Revision covered:** `57df4a176f88f1d84417c173eefb2d2337dfb933` (PR #29,
branch `r6/readme-status`, three commits on `main` at `e208762`:
`f82bff9`, the change; `8b1c99a`, round 01's record; `57df4a1`, its fixes).

**Files reviewed:** `BACKLOG.md`, `README.md`,
`reviews/023-readme-status-impl-01.md`. Obtained from
`gh api repos/diegoami/harness_template/pulls/29 --jq .head.sha`
(`57df4a1…`, base `main` at `e208762…`), `gh pr view 29 --json files` (the
three files), and `git ls-remote origin refs/heads/r6/readme-status`
(`57df4a1…`); the worktree's `HEAD` is `57df4a1…`. Checked equal to the
local diff: `git merge-base HEAD origin/main` = `origin/main` = the PR's
base = `e208762`, and `git diff --stat e208762 HEAD` names the same three
files. Target proven.

**Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`), continuing the round-01
session (*Reviewer sessions*); the current revision was re-read.

**Mode:** Claude. No design stage, no marker.

**Method:** read-only. `git diff`, `git show` and `awk` in the PR's
worktree, after `git fetch origin`; read-only `gh pr view` and `gh api`
GETs. `node --test tools/*.test.mjs`. Nothing was posted, created, pushed
or committed; the only file written in the repository is this one.

## Findings

1. **non-blocking, wording. The parenthesis now follows the override.**
   - Finding 1's fix put "unless the owner overrides that on the record"
     straight before the parenthesis that was already there, so
     `README.md:36-38` reads "…overrides that on the record (PRs #9 and
     #11–#27; milestone issue #28, `AGREE` at `f22685d`, …)".
   - A quick reader can take the parenthesis as the record of an override.
     The `AGREE` inside it corrects that, and nothing in it is wrong.
   - **Suggest:** end the sentence at "on the record." and start a new one,
     for example "Its range is PRs #9 and #11–#27; milestone issue #28, …".
     Or leave it as it is. This is not material.

## Round 01's findings

- **1 (the override): fixed.** `README.md:35-36` adds "unless the owner
  overrides that on the record", which is the promise's wording
  (`BACKLOG.md:42`). The PR body's *What was built* records that the `r5`
  tag message keeps its shorter wording. That is right: a tag is fixed
  text, and the tag's claims are not what this PR changes.
- **2 (the tool's scope): fixed.** `README.md:33` reads "the implementer's
  records posted when they are written", which matches "every record the
  implementer posts" (`BACKLOG.md:39`).
- **3 (the variant): fixed.** `BACKLOG.md:30` reads "Codex (`gpt-5`,
  Codex desktop)", as the verdict, the tag message and
  `reviews/r5-milestone-01.md` do.
- **4 (the short line): fixed.** `README.md:40-41` now continues "(the
  consolidation). Records in …" in one paragraph. The remaining short lines
  are `README.md:40`, where the next link (`[`reviews/`](reviews/);`)
  would exceed 79 columns, and `BACKLOG.md:31`, where the next code span
  (`` `reviews/r5-milestone-01.md`. ``) would too.

## Verified

- **Gate 0.** The PR head on GitHub, the remote branch and the worktree's
  `HEAD` are `57df4a1…`. The PR's three files equal the local diff from the
  merge base `e208762`: `BACKLOG.md | 9`, `README.md | 20`,
  `reviews/023-readme-status-impl-01.md | 126`, 144 insertions and 11
  deletions.
- **Round 01's record and its posting.** `8b1c99a` adds only
  `reviews/023-readme-status-impl-01.md`, and the file at the head is
  byte-identical to the one round 01 wrote. It was committed at 18:58:49Z
  and is the PR's only comment (`issuecomment-5820324153`, 18:59:01Z),
  before `57df4a1` (18:59:27Z). The comment's body equals the file apart
  from the final newline.
- **The fixes change nothing else.** `git diff f82bff9 57df4a1` touches
  only `BACKLOG.md:29-32` and `README.md:33-41`. Every fact that round 01
  checked stays as it was: `r5` on `f22685d`, round 1's `AGREE` on #28, the
  range's PRs, the claims' home and the *Earlier* list.
- **C5.** The only `BACKLOG.md` change in the fix commit is inside the
  *Tagged* paragraph. No claim, decision or *Not in r5* line moves.
- **The PR body.** *What was built* gives the new wording of both
  summaries and describes the four fixes as `57df4a1` makes them. Its
  *Check output* `git diff --stat main...HEAD` (9, 20 and 126 lines;
  144 insertions and 11 deletions) equals the local stat. The done-when
  items are still accurate. "Reviewed revision: pending" is correct until
  this round is posted.
- **Gates.** `node --test tools/*.test.mjs`: 43 tests, 43 pass, 0 fail.
- **Wrapping.** Every line the fix adds is 79 characters or fewer (`awk`
  counts bytes, and the dashes on `README.md:32` and `:36` are three bytes
  each).

— Claude Opus 5.5 (claude-opus-5-5), reviewer
No blocking finding remains (one non-blocking finding, 1).

## Completion

Landed by PR #29, merged on 2026-09-24 at 20:19 UTC as `e68dca5` at the
owner's instruction ("merge #29 and delete the worktrees"), after its last
review comment and with GitGuardian green. The note is non-material and
transcribes the evidence for the done-when items.

- No file outside `reviews/`, `design/` and `docs/` names `r4` as the
  current release (round 01, *Verified*).
- Every fact the new text states matches the `r5` tag, issue #28 and
  `git log r4..r5` (rounds 01 and 02).
- No claim in `BACKLOG.md` changed (C5).
- `node --test tools/*.test.mjs`: 43 tests, 43 pass.
- Two review rounds, each clean. Round 01's four non-blocking findings were
  fixed in `57df4a1`. Round 02's one wording finding was left, as its
  reviewer allowed; the PR body's *Left out* says why. `9128ea1` only adds
  round 02's record.

— Implementer (Claude Opus 5.5)
