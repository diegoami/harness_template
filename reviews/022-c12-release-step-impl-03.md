# Review: C12's rule, the release step and the two open answers, round 03

**Revision covered:** `bdb361ab40e753bf9a56e1e5c34fc3e44e946ad8` (PR #27,
branch `r5/c12-release-step`, six commits on `main` at `ff59870`:
`498eed0`, the round-01 record `9132524`, its fix `0e7a405`, the round-02
record `85482d3`, its fix `78d256c`, and the re-wrap `bdb361a`).

**Files reviewed:** `ADOPT.md`, `BACKLOG.md`, `PRINCIPLES.md`,
`reviews/022-c12-release-step-impl-01.md`,
`reviews/022-c12-release-step-impl-02.md`, `reviews/README.md`. Obtained
from `gh api repos/diegoami/harness_template/pulls/27 --jq .head.sha`
(`bdb361a…`, base `ff59870…`), `gh pr view 27 --json files` (the six
files), and `git ls-remote origin refs/heads/r5/c12-release-step`
(`bdb361a…`); the worktree's `HEAD` is `bdb361a…`. Checked equal to the
local diff: `git merge-base HEAD origin/main` = the PR's base = `ff59870`,
and `git diff --stat ff59870 HEAD` names the same six files. Target proven.

**Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`), the reviewer of rounds
01 and 02, continuing that session (`PRINCIPLES.md`, *Reviewer sessions*),
and re-reading the current revision.

**Mode:** Claude. No design stage, no marker.

**Method:** read-only. `git log`, `git show` and `git diff` in the PR's
worktree, and read-only `gh pr view` and `gh api` GETs.
`node --test tools/*.test.mjs`, `node --check` on every `tools/*.mjs`, and
`node tools/scaffold.mjs --yes --ref bdb361a… --preset <p>` for `light`,
`standard` and `auto` into a scratch directory, without `--github`. Nothing
was posted, created, pushed or committed; the only file written in the
repository is this one.

## Round 02's findings

1. **"A design stage" read as the whole project: fixed.** The line is now
   "which `merge: auto`, a decision in a design record, and any other
   decision that must hold before the merge all need"
   (`PRINCIPLES.md:131-132`). That is the suggested wording.
2. **"The change's record" without a remote: fixed.** The line is now "a
   line the owner signs under the decision's record stands for the comment"
   (`PRINCIPLES.md:136-137`). `reviews/README.md:36-38` gives that line's
   signature: "on a comment or a line that records an owner decision".
3. **The design-stage stop line's format home: fixed.**
   - `reviews/README.md:31-35` now reads "after the opening lines of its
     review file, or of its appended design verdict at the design stage".
     This matches `PRINCIPLES.md:108`, "(at the design stage, the design
     record)".
   - `design/README.md` is unchanged. That is acceptable: the bullet sits in
     the verdict-record format, which the ownership map gives to
     `reviews/README.md` (`PRINCIPLES.md:24`), and a design verdict is a
     verdict.
4. **The owner credited with more than (b): fixed.**
   - `BACKLOG.md:603-606` now separates the two. It reads "Two points in
     the rule that carries (b) are the implementer's, added on review round
     01 within (b)'s reason, and not an owner decision", and it names both
     points.
   - "Added on review round 01" is right: both points came in with
     `0e7a405`, the round-01 fix.
   - "Decisions (a) and (b) are the first held to C12's rule"
     (`:606-608`) removes the doubt that "They" would have left after the
     new sentence.
   - The PR body now marks the two points "**the implementer's, not the
     owner's**".

## Findings

1. **non-blocking. `bdb361a` is described as a re-wrap only, but it also
   rewords a sentence.**
   - Its subject is "Re-wrap two lines the round-02 fixes left long". The
     PR body's *Check output* says "(at 78d256c; bdb361a only re-wraps)",
     and its round-02 bullet says "`bdb361a` re-wraps".
   - `git diff 78d256c bdb361a` shows that the `BACKLOG.md` hunk also
     replaces "They are the first decisions held to C12's rule" with
     "Decisions (a) and (b) are the first held to C12's rule".
   - The edit is right, and it changes no rule. `node --test` covers no
     Markdown text, so the tests at `78d256c` still stand for `bdb361a`.
     The only issue is the description, which misplaces the rewording.
   - **Suggest:** in the PR body, "`bdb361a` re-wraps, and names decisions
     (a) and (b) in *Notes*". Leave the commit as it is.

## Verified

- **Gate 0.** The PR head on GitHub, the remote branch and the worktree's
  `HEAD` are `bdb361a…`. The PR's six files equal the local diff from
  `ff59870`. `git diff --stat ff59870 HEAD` gives 6 files, 449 insertions
  and 17 deletions. That equals the PR body's *Check output*.
- **The round-02 record.**
  - `85482d3` adds only `reviews/022-c12-release-step-impl-02.md`, and the
    file is identical to the one this session wrote.
  - It was committed at 16:00:42 UTC and posted as the PR's second comment
    at 16:00:53 UTC. The fix `78d256c` followed at 16:01:17 UTC.
  - The comment equals the file apart from the final newline.
- **The fixes' scope.**
  - `git diff 85482d3 bdb361a` touches only *Owner decisions* in
    `PRINCIPLES.md`, the stop-notice bullet in `reviews/README.md`, and
    decision (b)'s entry in `BACKLOG.md`'s Notes.
  - `ADOPT.md`, *Rounds*, *Progress* and C5 are unchanged since round 02.
    The earlier rounds' *Verified* items on them hold.
- **The current rule, re-read in full** (`PRINCIPLES.md:104-144`):
  - C12's four requirements are met: where the evidence lives
    (`:127-137`), the act despite one account (`:137-140`), a milestone
    issue as well as a pull request (`:133-135`), and the reviewer checks
    and does not re-raise (`:141-144`).
  - *Rounds* keeps the stop as "not a round" with "no `-NN` file"
    (`:105-106`).
  - Nothing in the fixes conflicts with *Merge policy*, *Milestones* (D4),
    *Posting* ("Without a remote, the files stand alone"), or *Rules apply
    going forward*.
  - *Progress* (`BACKLOG.md:22-24`) still states (b) only as the owner
    decided it. With the new Notes sentence, that is accurate.
- **Gates.**
  - `node --test tools/*.test.mjs` gives 43 tests, 43 pass, 0 fail.
  - `node --check` passes on all four `tools/*.mjs`.
  - `light`, `standard` and `auto`, generated from `bdb361a`, exit 0.
  - Each generated `PRINCIPLES.md` and `reviews/README.md` equals the root
    file apart from line endings (`diff --strip-trailing-cr`).
- **The PR body.**
  - The C12 bullets now describe the current wording, including the design
    record, "a decision in a design record", and "under the decision's
    record".
  - The stop-notice bullet separates the owner's decision from the
    implementer's two points.
  - The round-01 and round-02 fix bullets match `0e7a405` and `78d256c`.
  - *Left out* is unchanged and accurate. The one inaccuracy is finding 1.
- **Wrapping.** Every added or re-flowed line in the three files is 79
  columns or fewer. `PRINCIPLES.md:144` ("finding.") is short because it
  ends the paragraph.

— Claude Opus 5.5 (claude-opus-5-5), reviewer
No blocking finding remains (one non-blocking finding, 1).

## Completion

Landed by PR #27, merged on 2026-09-24 at 17:11 UTC as `255b407` at the
owner's instruction ("merge #27 once round 03 is clean"), after its last
review comment and with GitGuardian green. The note is non-material and
transcribes the evidence for the done-when items.

- `PRINCIPLES.md` *Owner decisions* covers what C12's text requires: where
  the evidence of a decision given in conversation lives (the owner's merge,
  or a comment the owner signs), that the act counts although one GitHub
  account posts for everyone, a milestone issue as well as a pull request,
  and that a reviewer checks the evidence and does not re-raise the
  decision (rounds 01–03, *Verified*).
- *Rounds* gives a stop notice a home without a remote, and
  `reviews/README.md` places its line.
- C5's extension to C12 is dated, gives its reason in the same commit, and
  weakens nothing (round 01, *Verified*).
- `ADOPT.md` names `r5` in its three places, and none names `r4` as the
  release to adopt.
- `node --test tools/*.test.mjs`: 43 tests, 43 pass. `node --check` passes
  on every `tools/*.mjs`. `light`, `standard` and `auto` generate cleanly
  from `bdb361a` (round 03, *Verified*).
- Three review rounds, each clean. Their findings (five, four and one, none
  blocking) were all fixed. Round 03 was clean on `bdb361a`; `2c997b9` only
  adds its record.
- Owner decisions (a) and (b) in `BACKLOG.md` *Notes* are the first held to
  C12's rule. Their evidence is this merge.

— Implementer (Claude Opus 5.5)
