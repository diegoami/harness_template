# Review: the pgn-postmortem field report, round 04

**Revision covered:** `cd4e37990079658244540bcbd5b6f3c6469e22a2` (PR #24,
branch `r5/pgn-postmortem-report`). Round 03 covered `b016eba`. Since then
come `e8674c5` (the round-03 file) and `cd4e379` (the fix, which changes
only `BACKLOG.md`). Round 03 did not end clean. The owner chose to fix the
findings and run this round (PR body; `cd4e379`'s message).

**Files reviewed:** `BACKLOG.md`, `docs/sources/pgn-postmortem-field-report.md`,
`reviews/019-pgn-postmortem-report-impl-01.md`,
`reviews/019-pgn-postmortem-report-impl-02.md`,
`reviews/019-pgn-postmortem-report-impl-03.md`.

How I got them:
- `gh pr view 24 --json headRefOid,files` gives the head `cd4e379…` and
  these five files.
- `git ls-remote origin` gives the branch as `cd4e379…` and `main` as
  `07b34bd…`.
- The local `HEAD` is `cd4e379…`, with a clean tree.
- `git merge-base cd4e379 origin/main` is `07b34bd`, and
  `git diff --name-only 07b34bd..cd4e379` gives the same five files.

That proves the target. The committed round-03 file is byte-identical to the
one I wrote (`cmp`).

**Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`), continuing the session of
rounds 01–03.

**Mode:** Claude. No design stage, no marker.

**Method:** read-only. I read `git diff e8674c5 cd4e379 -- BACKLOG.md`,
every line of `BACKLOG.md` at `cd4e379` that mentions pgn-postmortem or
PR #24, and the PR body (`gh pr view 24 --json body`). I posted, created,
edited, pushed and committed nothing. The only file I wrote is this one.

## Round-03 findings

| # | finding | status | evidence |
|---|---|---|---|
| 1 | Not-in-r5 credits items 1 and 3 to the owner | **resolved** | `BACKLOG.md:56-58`: "items 1, 2, 3 and 5 (r6, PR #24: items 2 and 5 by the owner's decision, items 1 and 3 by the implementer's routing; Notes)". |
| 2 | a 91-column line | **resolved** | `:527-528` is rewrapped. Of the lines this PR adds to `BACKLOG.md`, only the link line (`:291`, 94 columns) exceeds 80, as the boar_life link line does. |
| 3 | the two premises, for the owner | **resolved** | The coordinator reports that the owner confirmed the owner ruled on items 4, 2 and 5 only. I cannot check the conversation and take this as given. The PR body now corrects the round-01 brief under *Left out*, and the record follows the confirmed account (below). |

## Who decided what: `BACKLOG.md` and the PR body

**Item 4 (C12, r5) is the owner's decision in both places.**
- The in-r5 line (`:34-39`) names it without attribution.
- C12 says "by the owner's decision (PR #24)" (`:215`).
- Notes (a) (`:514`) says the same.
- The PR body: "The owner ruled on items 4, 2 and 5".

**Items 2 and 5 (r6) are the owner's decision in both places.**
- The Not-in-r5 list (`:56-58`).
- The r6 heading (`:292-293`): "items 2 and 5 by the owner's decision".
- Notes (b) and (c).
- The PR body: "2 and 5 by the owner's decision".

**Items 1 and 3 (r6) are the implementer's routing in both places.**
- The Not-in-r5 list.
- The r6 heading gives item 1 "by the reason of boar_life decision (a)".
- The Notes (`:520-524`): "the implementer's routing, not an owner
  decision … The owner's merge of PR #24 confirms it".
- The PR body: "The implementer routed items 1 and 3 by the reason of
  boar_life decision (a) … and the owner's merge confirms them".
- The PR body's done-when separates the owner's routing from the
  implementer's.

**Item 6 and the second-source rule carry no attribution beyond the owner's
instruction.** The Notes say only "Item 6 adds a second source". The body's
done-when ties the second sources to that instruction ("each repeat is added
to its existing item as a second source").

**Nowhere does either place still credit items 1 or 3 to the owner.** The
PR's first commit message (`0ef34ec`: "By the owner's decisions: … items 1,
2, 3 and 5 go to r6") cannot be amended. The body's *Left out* correction
covers it, and the Notes govern.

## Findings

1. **non-blocking.** The PR body still calls item 3 a repeat.
   - Under *What was built*, the body says "items 3 and 6 repeat boar_life
     items".
   - The Notes (`:524-527`) say "The report marks item 3 NEW; it is kept as
     a second source … because both concern what an adopted tag holds".
   - This is about what item 3 is, not who decided it, and the Notes are
     the record. A word in the body would make the two agree, for example
     "item 6 repeats boar_life items, and item 3 (marked NEW) extends one".

## Verified

- **Gate 0 and the file list,** as above.
- **`cd4e379` changes only the two places named:** the Not-in-r5 entry and
  the wrap at `:527-528`. No claim, and no other routing, is touched.
- **The PR body's *Check output*** (`git diff --stat main`) matches
  `git diff --stat 07b34bd cd4e379` exactly: 5 files, 594 insertions and 5
  deletions.
- **The *Left out* section** carries three things:
  - C12 reworded before it landed (round-02 finding 2);
  - C5's C1–C11 (round-01 finding 7, for the owner);
  - the correction of the round-01 brief.
- **The routing is unchanged.** Item 4 is C12 in r5. Items 1, 2, 3 and 5
  are in r6. Item 6 is a second source. Nothing enters *Smaller items* or
  the release step. C12's text is the same as at `0ccd7d9`.

— Claude Opus 5.5 (claude-opus-5-5), reviewer
No blocking finding remains.
