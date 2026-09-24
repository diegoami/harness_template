# Review: the pgn-postmortem field report, round 03

**Revision covered:** `b016ebacc2a32b29176be9b53813c7166ca6f4d2` (PR #24,
branch `r5/pgn-postmortem-report`). Round 02 covered `0ccd7d9`. Since then:
`19b8485` (the round-02 file) and `b016eba` (the fix, which changes only
`BACKLOG.md`).

**Files reviewed:** `BACKLOG.md`, `docs/sources/pgn-postmortem-field-report.md`,
`reviews/019-pgn-postmortem-report-impl-01.md`,
`reviews/019-pgn-postmortem-report-impl-02.md`.

How I got them:
- `gh pr view 24 --json headRefOid,files` gives the head `b016eba…` and
  these four files.
- `git ls-remote origin` gives the branch = `b016eba…` and `main` =
  `07b34bd…`.
- The local `HEAD` is `b016eba…`, with a clean tree.
- `git merge-base b016eba origin/main` = `07b34bd`, and
  `git diff --name-only 07b34bd..b016eba` gives the same four files.

The target is proven. The committed round-02 file is byte-identical to the
one I wrote (`cmp`).

**Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`), continuing the round-01
and round-02 session.

**Mode:** Claude. No design stage, no marker.

**Method:** read-only. `git diff 19b8485 b016eba -- BACKLOG.md`, the text
at `b016eba`, and `gh pr view 24` reads. I posted, created, edited, pushed
and committed nothing. The only file I wrote is this one.

## Round-02 findings

| # | finding | status | evidence |
|---|---|---|---|
| 1 | items 1 and 3 credited to the wrong decision | **partly resolved** | The Notes (`BACKLOG.md:519-527`) and the r6 heading (`:291-292`) no longer credit items 1 and 3 to an owner decision. The Not-in-r5 list still does: see finding 1 below. On the premise, see finding 3. |
| 2 | C12 reworded before it landed | **to be answered in the PR body** | The coordinator will put it under *Left out*. The body at `b016eba` does not have it yet. That is acceptable, because the body is edited without a commit, but see finding 3. |

## Findings

1. **blocking.** The Not-in-r5 list still credits items 1 and 3 to the owner.
   - `BACKLOG.md:56-57`: "the pgn-postmortem report's items 1, 2, 3 and 5
     (r6, the owner's decision, PR #24)".
   - After `b016eba`, the Notes say the opposite (`:519-520`): "Items 1 and
     3 go to r6 with the ADOPT rebuild. This is the implementer's routing,
     not an owner decision". So does the heading at `:291-292`.
   - The plan now contradicts itself about who decided the scope. The
     milestone reviewer reads this list against the claims.
   - This is the check the fix asked me to make: that the text no longer
     claims an owner decision for items 1 and 3 that the record does not
     hold. At `:56` it still does.
   - **Fix:** for example, "items 1, 2, 3 and 5 (r6: items 2 and 5 by the
     owner's decision, items 1 and 3 by the implementer's routing; PR #24)",
     or point to the Notes.

2. **non-blocking.** One added line breaks the file's wrapping.
   - `BACKLOG.md:526` is 91 columns: "its suggestion is recorded there.
     Item 6 adds a second source to boar_life items that are".
   - Every other line `b016eba` adds is at most 78 columns.

3. **non-blocking, for the owner.** The two premises contradict each other,
   and both come from the coordinator.
   - The round-01 brief I was given said: "The owner decided in the session:
     item 4 → r5 as claim C12; items 2 and 5 → r6; items 1 and 3 → r6 with
     the ADOPT rebuild; item 6 → a second source on the existing items".
   - `0ef34ec`'s message says the same ("By the owner's decisions: … items
     1, 2, 3 and 5 go to r6"), and so do the PR body's "routed by the
     owner's decisions (Notes)" and its done-when, "Every item is routed
     where the owner decided".
   - The round-03 message says the owner ruled on items 2, 4 and 5 only.
   - My round-02 finding 1 rested on the first account. I cannot see the
     conversation, so I do not judge which account is right.
   - Either way, the record must be one thing. The text now takes the second
     account (apart from finding 1). The PR body should match it, not only
     under *Left out*: its "routed by the owner's decisions" and its
     done-when wording should match too. The owner, who merges, should
     confirm which account holds.
   - The new Notes sentence "The owner's merge of PR #24 confirms it" is
     consistent with how C12 describes evidence, and with the current
     merge-as-check practice.

## Verified

- **Gate 0 and the file list,** as above.
- **`b016eba` changes only the two places named.** The r6 heading
  (`:291-292`) and Notes item 1/3 sentence (`:519-527`). No claim, the
  in-r5 line, the Not-in-r5 list and the candidate bullets are untouched.
- **The routing itself is unchanged and still consistent with the claims.**
  Item 4 is C12 in r5, items 1, 2, 3 and 5 are in r6, and item 6 is a
  second source.
- **Round-01 findings 1–4 and 6 stay resolved.** C12's text is the same as
  at `0ccd7d9`.

— Claude Opus 5.5 (claude-opus-5-5), reviewer
One blocking finding remains (1: the Not-in-r5 list at `BACKLOG.md:56-57` still credits items 1 and 3 to the owner's decision). This is round 03 and it does not end clean, so it goes to the owner (`PRINCIPLES.md`, *Rounds*).
