# Review — release 5 scope and claims, implementation round 03

**Revision reviewed:** `6bce181d8de6f50cc752fcaad888ad6b0cfb8064`
(`6bce181`, branch `plan/r5-scope`). Three sources agree on this SHA: PR
#14's `headRefOid` (`gh pr view 14 --json headRefOid,files`),
`git ls-remote origin plan/r5-scope`, and `git rev-parse HEAD`. It is the
commit after `6639007`, which records round 02. The working tree was clean, so
the committed round-02 file is the file as written.

**Files checked:** PR #14's file list: `BACKLOG.md` (+144 −1),
`reviews/009-r5-scope-impl-01.md` (+193) and `reviews/009-r5-scope-impl-02.md`
(+164). It equals the local diff: `git merge-base HEAD origin/main` =
`d67c94b`, then `git diff --name-only d67c94b..6bce181`. New since round 02:
`6639007` (the round-02 file) and `6bce181` (`BACKLOG.md`, +46 −31). Every
hunk of `6bce181` lies inside the section (`BACKLOG.md:9-150`).

**Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`), continuing the round-01
and round-02 session and re-reading the current revision.

**Mode:** Claude. No design stage, no marker. This is round 03, the ceiling
round (`PRINCIPLES.md:94-99`). It also carries the material edit that records
the owner's answers.

## Round-02 findings

- **1 (blocking), equality at the candidate: fixed.** C1 and C2 compare
  against "the file as the PR's head holds it" (`BACKLOG.md:69-70`, `:79-80`),
  which excludes the completion note appended after the merge.
- **2 (blocking), C5's tautology: fixed.** The proof is now the history of
  the section (`:104-106`), which can fail. The new verdict mapping in the
  same claim is contradictory (finding 2 below).
- **3 (blocking), C10 against C4/C11: fixed.** The rule now covers running
  the code or tools under review, and exempts the reviewer's own verdict and
  finding issues (`:129-133`).
- **Non-blocking 4–8:**
  - fixed: C11 lists the template's parts (`:141-144`); D9 drops "two in one
    round" (`:55`); C1 and "Where r5 starts" close the pass-by-absence
    (`:28-30`, `:67-69`); the promise names the D4 override (`:22`); C8
    requires the run's own scheme (`:121-122`); C2 covers the milestone issue
    (`:74`); C5 maps verdicts (see finding 2).
  - Filling the owner column was folded into this round, as predicted.

## Findings

1. **blocking — the owner's answers do not render: every row has six cells
   under a five-column header.** The rows end `… | <reason> || accepted |`
   (`BACKLOG.md:47-57`). The `||` opens an empty fifth cell, and `accepted`
   falls into a sixth, which GitHub-flavoured Markdown drops. On GitHub, then,
   the "owner" column shows blank, and the rendered page records no owner
   decision at all. Checked on the PR head by a read-only
   `gh api repos/diegoami/harness_template/contents/BACKLOG.md?ref=6bce181…`
   with `Accept: application/vnd.github.html`: the D9–D11 rows render with an
   empty last `<td></td>` and no "accepted". This is the one material content
   of this round, and `PRINCIPLES.md:108-109` requires the owner-decision mark
   to be recorded. **Fix:** `| <reason> | accepted |` in all eleven rows.

2. **blocking — C5's verdict mapping leaves no verdict for a non-blocking
   PARTLY MET or COULD NOT TEST.** "`AGREE` only when every claim is MET and
   no finding blocks, so a NOT MET or a blocking finding means `BLOCK`, and a
   PARTLY MET or COULD NOT TEST is a finding the reviewer grades"
   (`BACKLOG.md:101-103`). Take a PARTLY MET that the reviewer grades
   non-blocking. It cannot be `AGREE`, because not every claim is MET. It is
   not `BLOCK` either, because there is no NOT MET and no blocking finding.
   C5 makes this mapping a rule the implementation must write, so the rule
   would be contradictory as specified. The source's rule is that any NOT MET
   or any blocking finding blocks
   (`docs/sources/ic2-milestone-review.md:64-65`). **Fix:** "`AGREE` only
   when no claim is NOT MET and no finding blocks". Or, if the owner wants the
   stricter reading, "any claim not MET means `BLOCK`", and drop "a finding
   the reviewer grades".

3. **non-blocking — the owner's acceptance is attested only by the
   implementer.** The Status line (`BACKLOG.md:11-12`) and the eleven cells
   record that the owner accepted D1–D11. The coordinator reports that the
   owner said so directly in the session. Nothing in the repository or on
   PR #14 lets a reviewer verify it, so I treat it as recorded, not verified.
   The owner's own merge of this PR, or a line from the owner on the PR,
   would confirm it.

4. **non-blocking — "Where r5 starts" forbids what `PRINCIPLES.md` allows.**
   After the landing merge, only r5 PR merges and completion-note commits may
   reach `main` (`BACKLOG.md:28-30`, and C1's proof at `:67-68`). But a
   trivial change "may go straight to the main branch"
   (`PRINCIPLES.md:49-51`). One legitimate typo commit on `main` during r5
   would make C1 NOT MET. Either admit trivial commits in both places ("or a
   trivial commit, per `PRINCIPLES.md`"), or state that during r5 even
   trivial changes go through a PR.

5. **non-blocking — "none weakens a claim" meets triage.** C5's proof
   (`BACKLOG.md:105-106`) forbids any weakening. Four-way triage, in the same
   claim (`:103`), allows "the claim was wrong", corrected visibly. A
   correction that narrows a wrong claim would read as a weakening. Say
   "none weakens a claim except as a recorded 'claim was wrong' correction",
   and name where the reason goes: the Status line says "here" (`:15`), while
   the proof says "in the same commit".

6. **non-blocking — the template list omits the "not in this release"
   list and the reviewer's limits.** C11's parts (`BACKLOG.md:141-144`) omit
   both. The IC2 brief carries them so that absences are not reported as
   defects and the reviewer stays read-only
   (`docs/sources/ic2-milestone-review.md:84-90`).

7. **non-blocking — cosmetic.** Line 14 is still 89 characters, a link line.
   Lines 75 ("through `--body-file`. It") and 123 ("`tools/*.mjs`.") are
   ragged wraps left by the edits.

## Verified

- Gate 0: head, remote ref and local HEAD agree. PR files equal the local
  diff, and the three paths are the ones expected.
- No change outside the section: every hunk of `6639007..6bce181` falls in
  `BACKLOG.md:9-150`.
- The decisions: all eleven keep their default and reason. The accepted
  values match the defaults, and D2's "any model that is not Claude" for a
  Claude-mode range still matches the owner's settled rule.
- C1's first-parent condition is checkable
  (`git log --first-parent <landing merge>..<candidate>`), and completion-note
  commits are recognisable, as `d93c257`, `3b93b34` and `d67c94b` show.
- C10's exemption does not collide with C2's dry run, C8's temporary-directory
  runs or C9's before/after runs.
- The promise, C2 and C4 now agree on the override and the milestone issue.

— Claude Opus 5.5 (claude-opus-5-5), reviewer
Two blocking findings remain (1: the owner column's `|| accepted |` rows render blank on GitHub; 2: C5's AGREE/BLOCK mapping has no verdict for a non-blocking PARTLY MET or COULD NOT TEST). Round 03 does not end clean, so it goes to the owner.
