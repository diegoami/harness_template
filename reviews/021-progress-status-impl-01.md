# Review: r5's progress in its status, round 01

**Revision covered:** `00a7542ddb8dea4632cd2027309d891725a74158` (PR #26,
branch `r5/progress-status`, one commit on `main` at `4619968`).

**Files reviewed:** `BACKLOG.md`. Obtained from
`gh api repos/diegoami/harness_template/pulls/26 --jq .head.sha`
(`00a7542…`) and `gh pr view 26 --json files` (the one file), and
`git ls-remote origin refs/heads/r5/progress-status` (`00a7542…`); the
worktree's `HEAD` is `00a7542…`. Checked equal to the local diff:
`origin/main` = the PR's base = `4619968`, and
`git diff --name-only origin/main...HEAD` = `BACKLOG.md`. Target proven.

**Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`), a fresh-context session.

**Mode:** Claude. No design stage, no marker.

**Method:** read-only. `git log`, `git show` and `git diff` in the PR's
worktree, and read-only `gh pr view`, `gh pr diff` and `gh api` GETs.
Nothing was posted, created, pushed or committed; the only file written is
this one.

## Findings

1. **blocking.** "Two things remain" leaves out items the records mark as
   open before the r5 milestone.
   - `BACKLOG.md:18-19`: "Before the candidate is frozen, two things remain:
     C12's rule in `PRINCIPLES.md` (*Owner decisions*), and the release step
     below." Both are right (see *Verified*). The list is not complete.
   - **C5's proof and C12.** C5's proof names "every change to C1–C11"
     (`BACKLOG.md:145`), so it does not reach C12. PR #24's *Left out* says
     "Extending it is the owner's call, in a later change". Its round 04
     lists it as open, "for the owner"
     (`reviews/019-pgn-postmortem-report-impl-04.md:99`). No later change
     settles it. A claim changes only visibly and dated (`PRINCIPLES.md`
     *Milestones*), so this owner's call has to be made before the
     candidate or not at all.
   - **A stop notice without a remote.** PR #21's *Left out* lists its
     round-02 findings "to settle before the r5 milestone". Finding 4 there
     (`reviews/016-protocol-gaps-impl-02.md:146-154`) says a stop notice is
     "a comment" (`PRINCIPLES.md:106-107`), while "Without a remote, the
     files stand alone" (`:185`), so a stopped review leaves no record there.
     Its fix was "a line in the change's next review file, or accept the
     gap". `PRINCIPLES.md` is unchanged at those lines. No PR body or record
     accepts the gap; PR #22's *Left out* names only two pre-milestone fixes
     (C11's wording, C8's date), which PR #23 made. The same list's short
     line, "TEST, each with its evidence — opens" (`PRINCIPLES.md:232`), is
     also still there; that one is a rewrap, trivial.
   - The paragraph exists so that a new session "can see where the release
     stands from the file itself" (PR body). Read as written, a new session
     freezes the candidate without asking the owner about C5 or the stop
     notice. The PR's done-when, "names … what remains", is not met.
   - **Fix:** name them among what remains, for example "and two owner
     calls: whether C5's proof reaches C12 (PR #24), and the stop-notice gap
     without a remote (PR #21)". Or record their disposition if the owner
     has made one. Either way the count "two" changes.

2. **non-blocking.** C2's "extended by #18 and #20" reads against C2's own
   text.
   - `BACKLOG.md:15-16`: "C2 (PR #15, extended by #18 and #20)". C2 says
     "**Extended on 2026-09-24** by the owner's decision (PR #16)"
     (`:109`) and "**Extended again on 2026-09-24** by the owner's decision
     (PR #19)" (`:113`).
   - Both are true. #16 and #19 extended the claim; #18 and #20 landed the
     extensions, as their titles say ("(r5, C2 extended)", "(r5, C2 extended
     again)"). But a reader holding the two passages sees two PR pairs for
     one word.
   - **Suggest:** "C2 (PR #15, and its two extensions by #18 and #20)", or
     "its extensions landed by #18 and #20".

3. **non-blocking, wording.** The label's form is new to the section.
   - `BACKLOG.md:14`: "**Progress** (2026-09-24)." The section's labels are
     "**Status:**", "**Release step:**", "**In r5:**" with a colon, or
     "**The promise.**", "**Where r5 starts.**" with a full stop inside the
     bold, and the file's dated labels put the date inside the bold
     ("**Owner decision (2026-09-23): …**", `:473`).
   - **Suggest:** "**Progress (2026-09-24):**".

## Verified

- **Gate 0.** The PR head on GitHub, the remote branch and the worktree's
  `HEAD` are `00a7542…`; the PR's file list equals the local diff (above).
  `git diff --stat origin/main...HEAD` is `BACKLOG.md | 15 ++++++++++++---`,
  12 insertions and 3 deletions, as the PR body's *Check output* says.
- **The *Status* paragraph** (`BACKLOG.md:9-12`):
  - `427749c` is "Merge pull request #14 from diegoami/plan/r5-scope", and
    `gh pr view 14` gives the same merge commit.
  - `reviews/009-r5-scope-impl-01..04.md` are four rounds. Rounds 01–03 end
    with blocking findings; round 04 ends "No blocking finding remains"
    (`:85`). Its completion note says round 03 "went to the owner, who
    decided to fix the findings and run a fourth".
  - The dropped sentence, "No r5 work starts before the change that lands
    this section has merged", was a condition that has been met; the r5
    boundary it set is kept in *Where r5 starts* (`:34-41`).
- **The claim-to-PR mapping** (`BACKLOG.md:14-17`), against three sources:
  - PR titles: #15 "(r5, C2)", #17 "(r5, C1 and C3)", #18 "(r5, C2
    extended)", #19 "(r5, C4, C5, C6, C11)", #20 "(r5, C2 extended
    again)", #21 "(r5, C7)", #22 "(r5, C8, C9)", #23 "(r5, C10)". #14, #16
    and #24 name no implemented claim.
  - Merge commits on `git log --first-parent origin/main`: `ab073e2` (#15),
    `6daa17d` (#17), `1114cd1` (#18), `f3ab50c` (#19), `8c32605` (#20),
    `55aa8c2` (#21), `a82bd43` (#22), `41e1ed1` (#23), `a0c7442` (#24),
    each followed by its completion-note commit; `4619968` is the base.
  - Completion notes, in each PR's last review file: `010-…-03` (#15, C2),
    `012-…-02` (#17, C1 and C3), `013-…-01` (#18, C2's extension, one
    round), `014-…-02` (#19, C4, C5, C6, C11), `015-…-02` (#20, C2's second
    extension), `016-…-02` (#21, C7), `017-…-02` (#22, C8, C9), `018-…-02`
    (#23, C10). Each is the highest-numbered file of its PR, and each has a
    `## Completion` section naming the same claims. The PR body's list of
    these files is right.
  - Every claim C1–C11 appears once, and C1–C11 is the full set before C12.
- **C12** (`BACKLOG.md:17`): its text says "**Added on 2026-09-24** by the
  owner's decision (PR #24)"; PR #24's completion note says the same.
  `PRINCIPLES.md`'s *Owner decisions* (`:119-124`) says nothing yet about
  where the evidence of a decision lives, so "not yet implemented" holds.
- **The release step:** `BACKLOG.md:50` requires `ADOPT.md` to name `r5`
  before the candidate is frozen; `ADOPT.md:5,17,101` still name `r4`.
- **Against *Milestones*:** "Then the milestone review follows
  `PRINCIPLES.md` (*Milestones*), with the prompt filled in from
  `reviews/milestone-prompt.md`" matches `PRINCIPLES.md:219-226` by
  reference; the milestone issue and the gate results come with it.
- **The other pre-milestone lists were checked** besides finding 1. PR
  #19's *Left out* items are settled: the copy timing and the stopped
  review by #21, the plan-history range (`PRINCIPLES.md:229-230`), C2's
  wording and C8's narrowing by #21, "this harness: `BACKLOG.md`" (now "in
  the harness repository itself", `:215`), and the short line "every claim
  a verdict —" (rewrapped by #21, which left the one in finding 1). PR
  #21's C11 and C8 items, and its short `BACKLOG.md` line, were settled by
  #23. PR #20's, #22's and #23's *Left out* items are backlog or r6 items,
  not pre-milestone.
- **Open PR #25** (`r5/pgn-postmortem-addendum`) changes `BACKLOG.md`,
  `docs/sources/…` and `reviews/020-…`, and routes to r6. It is an r5 PR
  under *Where r5 starts* if it merges before the candidate, but it adds no
  claim, so the PR body's reason for leaving it out holds.
- **No claim changed (C5).** The diff touches only `BACKLOG.md:9-21`; no
  changed line is in *Claims* (`:86-229`), the owner table, *In r5*, the
  release step or *Not in r5*.
- **Wrapping.** The new lines are 45–78 columns; `:18` is 64 because the
  next word, `` `PRINCIPLES.md` ``, would pass 79. The dash in "C1–C11" and
  the `(PR #N)` then `(#N)` pattern match the file.
- **Scope.** One file, the two paragraphs the aim names; the commit message
  says what changed and why.

— Claude Opus 5.5 (claude-opus-5-5), reviewer
One blocking finding remains (1: "two things remain" omits the open owner call on C5's proof reaching C12 and PR #21's unsettled stop-notice gap).
