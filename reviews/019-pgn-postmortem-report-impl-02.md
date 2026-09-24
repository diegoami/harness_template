# Review: the pgn-postmortem field report, round 02

**Revision covered:** `0ccd7d9430718faa9f8dcbdf73ee08a8e0cb0b6b` (PR #24,
branch `r5/pgn-postmortem-report`). Round 01 covered `0ef34ec`. Since then:
`fb09dae` (the round-01 file) and `0ccd7d9` (the fixes, which change only
`BACKLOG.md`).

**Files reviewed:** `BACKLOG.md`, `docs/sources/pgn-postmortem-field-report.md`,
`reviews/019-pgn-postmortem-report-impl-01.md`.

How I got them:
- `gh pr view 24 --json headRefOid,files` gives the head `0ccd7d9…` and
  these three files.
- `git ls-remote origin` gives `r5/pgn-postmortem-report` = `0ccd7d9…` and
  `main` = `07b34bd…`.
- The local `HEAD` is `0ccd7d9…`, with a clean tree.
- `git merge-base 0ccd7d9 origin/main` = `07b34bd`, and
  `git diff --name-only 07b34bd..0ccd7d9` gives the same three files.

The target is proven. The source file is unchanged since round 01
(`git diff fb09dae 0ccd7d9` touches only `BACKLOG.md`). The committed
round-01 file is byte-identical to the one I wrote (`cmp`).

**Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`), continuing the round-01
session (`PRINCIPLES.md`, *Reviewer sessions*).

**Mode:** Claude. No design stage, no marker.

**Method:** read-only. `git diff fb09dae 0ccd7d9 -- BACKLOG.md`, the cited
review files and `gh pr view` reads. I posted, created, edited, pushed and
committed nothing, and ran no creating path. The only file I wrote is this
one.

## Round-01 findings

| # | finding | status | evidence |
|---|---|---|---|
| 1 | C12's reason not reproducible for r5 | **resolved** | C12 (`BACKLOG.md:214-218`) and Notes (a) (`:514-515`) now name the reviews of PRs #16, #19 and #23 as taking an owner decision as given. Reproduced: `011-backlog-field-report-impl-02.md:23-24` (PR #16), `014-milestones-impl-02.md:72` (PR #19, "Taken as the owner's decision"), `018-smaller-rules-impl-01.md:19` and `-02.md:27` (PR #23). The pgn-postmortem half was reproduced in round 01. |
| 2 | the proof applies a later rule to earlier records | **resolved** | *Proof* (`:211-214`): "for each owner decision recorded after the rule lands … Decisions recorded before it are not held to it (*Rules apply going forward*, D11)". This agrees with `PRINCIPLES.md:150-154`. |
| 3 | the single account; D4 | **resolved** | `:207-210`: the named act "counts as the owner's confirmation, although the owner and the agents post from one GitHub account", and the rule covers "a decision recorded on a milestone issue (D4's override)". This is consistent with *Comment, not approval* (`PRINCIPLES.md:158-161`) and adds to the *Owner decisions* bullet without contradicting it. |
| 4 | in-r5 line names C12 only as an exception | **resolved** | `:34-39` now ends "; and, from the pgn-postmortem report, item 4 (C12)", outside the smaller-items exceptions. The line, Not-in-r5 (`:56-57`), C12 and the Notes agree. |
| 5 | routing records loose | **partly resolved** | Items 1 and 3 now have a reason, and the heading separates item 1 from items 2 and 5. The new wording misdates one decision: see finding 1 below. |
| 6 | item 3 is NEW, kept as a second source | **resolved** | Notes (`:521-525`): "The report marks item 3 NEW; it is kept as a second source … because both concern what an adopted tag holds, and its suggestion is recorded there." |
| 7 | C5 names C1–C11 | **left to the owner, as advised** | `:135` unchanged. |

**On the coordinator's question:** I agree that editing C12 in this PR is not
a change to a landed claim.
- `PRINCIPLES.md` *Milestones* says the claims "are fixed when the change
  that records them lands". C12 lands only when PR #24 merges.
- The text that lands is dated ("Added on 2026-09-24") and gives its reason.
- See finding 2 for how this edit will look in the milestone range.

## Findings

1. **non-blocking.** The Notes attribute items 1 and 3 to the wrong decision.
   - `BACKLOG.md:519-521`: "Items 1 and 3 go to r6 with the ADOPT rebuild,
     under the owner's decision (a) of 2026-09-23 on the boar_life report".
   - That decision is limited to boar_life's items (`:484-486`: "Its items
     1, 3, 4 and 5 go to r6 with the ADOPT rebuild"). pgn-postmortem's items
     1 and 3 were routed by the owner on 2026-09-24, in this PR's session.
     Round 01 suggested borrowing decision (a)'s *reason*, not its date and
     authority.
   - The r6 heading (`:291-292`) has a related problem. "item 1 with the
     ADOPT rebuild, items 2 and 5 by the owner's decision" reads as if item
     1 were not the owner's decision.
   - **Suggest:** "Items 1 and 3 go to r6 with the ADOPT rebuild, by the
     owner's decision; the reason is boar_life decision (a)'s: they are
     adoption problems…", and for the heading, "Routed to r6 by the owner's
     decision (Notes): item 1 with the ADOPT rebuild, items 2 and 5 on their
     own".

2. **non-blocking.** The milestone reviewer will see this PR edit C12.
   - `git log -p <landing merge>..<candidate> -- BACKLOG.md` will show
     `0ccd7d9` narrowing C12's proof from "each owner decision recorded in
     r5" to "recorded after the rule lands", and that commit adds no dated
     line of its own.
   - It is not a weakening of a landed claim (above). The round-01 file in
     the range, and `0ccd7d9`'s message, explain it.
   - A line in the PR body's *Left out* or in the completion note saying
     "C12 was reworded within PR #24, before it landed, on review round 01"
     would spare the milestone reviewer the question.

## Verified

- **Gate 0 and the file list,** as above.
- **Wrapping.** Every line `0ccd7d9` adds to `BACKLOG.md` is at most 79
  columns. Only the four places named in the round-01 findings changed.
- **C12 is still testable.**
  - Its text part can be checked against `PRINCIPLES.md` once the rule lands.
  - Its evidence part applies only to decisions recorded after the rule
    lands. If no owner decision is recorded between that point and the
    candidate, this part holds for no case. The milestone reviewer should
    then say so rather than grade C12 MET on the text alone.
  - This is a note for the milestone prompt, not a defect in this PR.
- **No other claim changed.** In `0ccd7d9`, the hunks inside *Claims* touch
  only C12.
- **The routing is unchanged.** Item 4 is in r5, items 1, 2, 3 and 5 are in
  r6, and item 6 is a second source. Nothing enters *Smaller items* or the
  release step.

— Claude Opus 5.5 (claude-opus-5-5), reviewer
No blocking finding remains.
