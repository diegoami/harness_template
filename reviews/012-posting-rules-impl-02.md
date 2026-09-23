# Review: the posting and pull-request rules (r5, C1 and C3), implementation round 02

**Revision reviewed:** `aec11a3bf957803afc3acbc257556baf088c71a2`
(`aec11a3`, branch `r5/posting-rules`). Four sources agree on this SHA:
PR #17's `headRefOid` (`gh pr view 17 --json headRefOid,files`),
`git ls-remote origin` for both `refs/heads/r5/posting-rules` and
`refs/pull/17/head` (after `git fetch`), and `git rev-parse HEAD`. The
working tree was clean.

**Files checked:** PR #17's file list is `AGENTS.md` (+6, −7), `CLAUDE.md`
(+3, −2), `PRINCIPLES.md` (+26, −4), `design/README.md` (+2, −1),
`reviews/012-posting-rules-impl-01.md` (+213) and `reviews/README.md`
(+2, −2). It equals the local diff: `git merge-base HEAD origin/main` =
`d001807` (still `main` on the remote), then
`git diff --name-only d001807 HEAD`. Two commits are new since round 01:
`db1eabb` records round 01, and `aec11a3` answers it. `design/README.md`
and `reviews/README.md` are unchanged since `c98a797`.

**Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`), continuing the session of
round 01 and re-reading the current revision.

**Mode:** Claude. No design stage, no marker.

**Method:** read-only. I posted, created, edited and pushed nothing, and did
not run `tools/post-record.mjs`. The only `gh` calls were `pr view` reads.
Line numbers are at `aec11a3`.

## Round-01 findings

- **1 (blocking), "equal to it" versus the completion note: fixed.**
  `PRINCIPLES.md:151-153` now reads "equal to the file as the pull request's
  head holds it. The completion note, appended after the merge, is not
  posted." This is C1's wording (`BACKLOG.md:79-80`), and it matches what
  PRs #15 and #16 did. The same sentence covers an OpenCode design record's
  note (`design/README.md:36-39`), since it says "the completion note"
  without limiting it to review files.
- **2 (blocking), `design: none`: fixed.** `PRINCIPLES.md:146-148` scopes the
  design-record issue to "Where the project has a design stage (OpenCode
  mode, `design: required`)". Under `design: none` the clause no longer
  applies, so the resolution rule at `:133-135` has nothing to turn into an
  impossible sentence. `AGENTS.md:73-76` is now only a pointer, and the
  "names the design record" line is gone. Scoping the clause does not
  weaken C1: a project without a design stage has no design record to open.
- **3 (non-blocking), the revision to name: fixed.** `:158-160` "the
  revision its last clean round covered, or, when the owner waives the
  review, the waiver".
- **4 (non-blocking), the merge policy: fixed in the protocol.** `:128-130`
  adds "its reviews are posted (*Posting*)". The scaffold's slot text is
  deferred (new finding 1).
- **5 (non-blocking), no remote: fixed.** `CLAUDE.md:11-13` adds "which also
  covers a project with no remote yet".
- **6 (non-blocking), the closed list: fixed.** `:158-159` gives "(an issue,
  a design record, a claim, a request)" as examples.
- **7 (non-blocking), trivial changes and C1's proof: addressed.** `:162`
  says "A trivial change needs no pull request." That permits a trivial
  pull request but does not forbid one. Leaving the rare case to the owner,
  as the coordinator proposes, is reasonable.
- **8 (non-blocking), `AGENTS.md` wrapping: fixed** (`AGENTS.md:37-40`).

## New findings

1. **non-blocking — the scaffold's `auto` merge line can wait, if it is
   recorded.** `tools/scaffold.mjs:194-198` still writes "a clean review
   … and every gate green" into an `auto` project's slot, without
   "posted". Deferring it is acceptable. The tool is outside this change's
   file list, and changing it would widen a rules change into a tool
   change. The protocol also governs over the slot (`PRINCIPLES.md:27-29`),
   and `:128-130` now states the condition. But C8's proof
   (`BACKLOG.md:132-139`) checks placeholders, dangling links and the
   milestone rule, not merge conditions, so nothing in r5 would catch the
   gap. *Suggest:* name it in PR #17's "Left out", and in `BACKLOG.md` or
   the C8 PR, so that "left for the scaffold work" has a home.
2. **non-blocking — the design-issue clause is scoped by project, not by
   change.** `PRINCIPLES.md:146-148` applies wherever "the project has a
   design stage". In a `design: required` OpenCode project, a trivial
   change and a defect fix under the four conditions (`:114-118`) both skip
   the design stage and have no design record. Read plainly, the clause is
   empty for them, so it does not contradict anything. "Where the change
   takes a design stage" would be exact.
3. **non-blocking — a short line in the merge policy.** `PRINCIPLES.md:130`
   ("(*Posting*), and every gate is green.") ends early in the middle of the
   paragraph. It is the same kind of line as round 01's finding 8. No added
   line exceeds 80 columns.

## Verified

- **C1 and C3 against the revised text.** Every requirement in round 01's
  two tables is met, now including "as the PR's head holds it" (`:152-153`)
  and "the revision its clean review covers" (`:158-160`). Nothing is
  weakened.
- **The ownership map** row (`:15`) still ends "posting, pull requests".
  `AGENTS.md:73-76`, `CLAUDE.md:11-13`, `design/README.md:41-42` and
  `reviews/README.md:24-26` point to the rule and do not restate it.
- **No new contradiction.**
  - The merge policy (`:127-132`) now agrees with the Pull requests rule
    (`:166-167`).
  - "A trivial change needs no pull request" agrees with `:49-51`.
  - "The completion note … is not posted" is an explicit exception to "a
    record is posted when it is written", and it agrees with the Completion
    rule (`:119-126`).
  - `ADOPT.md:81-82` and `:92-93` are still only stale, as in round 01.
- **This PR follows the Posting rule.** Round 01 was posted at 23:27:29Z,
  after `db1eabb` (23:27:19Z), which records it, and before `aec11a3`
  (23:28:06Z). The comment is byte-equal to
  `reviews/012-posting-rules-impl-01.md` at `aec11a3`. It is the PR's only
  comment.
- **The PR body** still reads "Reviewed revision: pending", and its "What
  was built" describes `c98a797`. Both are to be updated when a round ends
  clean, as `:158-160` requires. That is not a finding at this revision.
- **Scope.** The diff since `db1eabb` touches only `AGENTS.md`, `CLAUDE.md`
  and `PRINCIPLES.md`, and each hunk answers a round-01 finding.

— Claude Opus 5.5 (claude-opus-5-5), reviewer
No blocking finding remains.

## Completion

Landed by PR #17, merged on 2026-09-23 (UTC) at the owner's instruction ("merge
#17 when the review is clean"), after its last review comment and with
GitGuardian green. The note is non-material and transcribes the evidence for C1
and C3.

- `PRINCIPLES.md` carries *Posting* (C1) and *Pull requests* (C3); the ownership
  map's protocol row names both; `AGENTS.md`, `CLAUDE.md`, `design/README.md` and
  `reviews/README.md` point to them.
- Two review rounds. Round 01 had two blocking findings (a posted review is equal
  to the file as the PR's head holds it, the completion note not posted; the
  design-issue clause only where there is a design stage), both fixed. Round 02
  ended with no blocking finding on `aec11a3`; `b17f7f1` only adds its record.
- Both rounds were posted with `tools/post-record.mjs`, each after GitHub showed
  the PR's new head and before the next commit, and read back equal.
- Deferred, in the PR's "Left out": the scaffold's generated `auto` merge line
  to the C8 work.

— Implementer (Claude Opus 5.5)
