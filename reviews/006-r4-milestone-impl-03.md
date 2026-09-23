# Review — the r4 milestone review and the owner's decisions on it, implementation round 03

**Revision covered:** `273e3780dba19ccac3c0b024b87740ce0064a7d9`, branch
`fix/r4-milestone-review` (`git rev-parse fix/r4-milestone-review` returned it
exactly).

**Files checked, and how obtained:** no pull request exists yet, so the local
diff from the merge base: `git merge-base main 273e378` → `d93c257`, then
`git diff --name-only d93c257..273e378`:

`BACKLOG.md` `design/001-harness-release-1.md` `reviews/006-r4-milestone-01.md`
`reviews/006-r4-milestone-02.md` `reviews/006-r4-milestone-impl-01.md`
`reviews/006-r4-milestone-impl-02.md`

The list is round 02's plus the round-02 review file (committed at `fe1a288`).
The fixes are `273e378` alone (`git diff fe1a288 273e378 --stat`: `BACKLOG.md`
and `design/001`, 8 insertions, 7 deletions). The held revision equals the
named target.

**Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`), continuing the round-01 and
round-02 reviewer session (`PRINCIPLES.md:90-93`); the diff and the current
files were re-read.
**Mode:** Claude — no design stage, no marker.

## Round-02 findings

1. **Resolved.** `BACKLOG.md:101-103`: "pointed at review round 01 although
   round 02 existed when r1 was tagged — stale, not a broken rule, since
   release 1 had no status rule". Checked:
   `git cat-file -e r1:reviews/001-harness-release-1-impl-02.md` succeeds, so
   round 02 is in `r1`. `git grep -i status r1` finds no status rule in the
   rule files.
2. **Resolved.** `BACKLOG.md:79`: "`NN` counts separate reviews, not rounds".
3. **Resolved.** `design/001-harness-release-1.md:358-363` is rewrapped. The
   text is unchanged apart from the line breaks.

## New findings

1. **The rewording left one long line in `BACKLOG.md`** — non-blocking,
   cosmetic. `BACKLOG.md:103` is 125 characters ("…rule — and correcting it
   leaves every landed release findable by status. The original line is kept,
   and the additions are"); the rest of the Notes wrap at about 80. This is the
   same kind as round-02 finding 3. Rewrap it when the file is next touched; it
   changes no meaning.

Nothing else is new: `273e378` changes only the three places named above, and
`git diff --check d93c257 273e378` is clean.

## Verified

- **Gate 0** as above.
- **Unchanged since round 01:** `reviews/006-r4-milestone-01.md` and `-02.md`,
  so the byte-for-byte match with issue #10 comments 1 and 3 still holds.
  The Completion's facts are also unchanged since round 02.
- **Both owner decisions** still carry the mark, the default and a reason
  (`BACKLOG.md:88-104`), meeting `PRINCIPLES.md:108-110`. The second still
  names itself the one exception to the first.
- **Round count.** This is round 03 of this implementation stage, and it ends
  with no blocking finding, so the ceiling in `PRINCIPLES.md:94-99` is not
  reached.

— Claude Opus 5.5 (claude-opus-5-5), reviewer
No blocking finding remains.

## Completion

Landed by PR #11, merged at `de8391b` on 2026-09-23 at the owner's instruction;
issue #10 closed with it. The note is non-material and transcribes the evidence.

- Three review rounds (`-01` to `-03`). Round 01 had one blocking finding (the
  `design/001` exception was not recorded as an owner decision), which was fixed;
  rounds 02 and 03 ended with no blocking finding. The final round covers
  `273e378`, and `756696b` only re-wraps one line.
- Independent review of the range `r4..756696b` by DeepSeek V4.1 Flash on PR #11:
  `AGREE`, with one non-blocking finding (the Rounds rule does not say how a
  material extension after a clean round counts), routed to the release-5
  candidates.
- The milestone review copies equal comments 1 and 3 of issue #10. The facts in
  `design/001` were checked against git and `gh` by the implementer, the reviewer
  and the independent reviewer.

— Implementer (Claude Opus 5.5)
