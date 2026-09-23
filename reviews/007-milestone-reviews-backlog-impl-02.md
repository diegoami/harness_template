# Review — milestone reviews queued in the backlog, implementation round 02

**Revision reviewed:** `d3955a2059b1d65aac76fe2f9e4d127a79bd3970` (`d3955a2`,
branch `backlog/milestone-reviews`; `git rev-parse backlog/milestone-reviews`
returns the same sha).
**Files checked:** `BACKLOG.md`,
`reviews/007-milestone-reviews-backlog-impl-01.md`,
`reviews/007-milestone-since-r4-01.md` — obtained locally:
`git merge-base main d3955a2` = `365f0fe`, then
`git diff --name-only 365f0fe..d3955a2`. Three commits in range: `19181b9`
(the change), `3bfcf95` (round 01 recorded), `d3955a2` (the fixes). The list
equals round 01's list plus the round-01 review file; no pull request exists
for this branch.
**Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`); a re-review continuing the
round-01 reviewer session (`PRINCIPLES.md`, *Reviewer sessions*), re-reading
the current revision and the five projects' files.
**Mode:** Claude — no design stage, no marker.

Taken as given, per the owner (2026-09-23): each change gets a fresh-context
Claude review; at milestones Claude requests a review from any model that is
not Claude, DeepSeek included.

## Round-01 findings

1. **"Already matches `CLAUDE.md`"** (blocking) — **resolved.** The clause is
   gone. `BACKLOG.md:50-53` now says only Scopetta keeps a per-change review,
   "and it ends in a marker and lets Claude merge", which is true
   (`Scopetta/CLAUDE.md:50-51`, `:54-55`). It also says the proposal "keeps
   this harness's per-change review as it is in `CLAUDE.md`", which is a
   pointer, not a restatement.
2. **Bullets credited to Scopetta** (blocking) — **resolved.** Each bullet
   now names its sources, and I re-checked each one:
   - The fixed template, "so the author does not steer", is balloons-JS's
     (`docs/review-prompt.md:9-12`: "the author of a change does not get to
     decide what its reviewer looks for").
   - UTF-8, no byte-order mark, and `--body-file` are Geoclick's
     (`SKILL.md:114-115`, `:155`).
   - One comment is Tressette's (`CLAUDE.md:76-77`) and balloons-JS's
     (`review-prompt.md:68`).
   - One issue per finding is Scopetta's (`CLAUDE.md:98-99`), Geoclick's
     (`CLAUDE.md:193-195`) and discola-web's ("one issue per reproduced
     finding").
   - The per-finding reply is Tressette's (`CLAUDE.md:48-50`) and Geoclick's
     (`SKILL.md:154`).
   - The copy into `reviews/` is this repository's own practice.
   - "Only one review issue is open at a time" is Scopetta's
     (`CLAUDE.md:87-90`) and balloons-JS's (`CLAUDE.md:156-158`).
   - "Geoclick and discola-web use the milestone's existing thread" holds
     (`Geoclick2027/CLAUDE.md:172-179`; discola-web's "recorded on the thread
     the milestone already has").

   One detail is still slightly off; see new finding 1.
3. **"Converged on this"** (non-blocking) — **resolved.** `BACKLOG.md:48-51`
   now credits the five with the milestone half only, and says their
   per-change review differs.
4. **Milestone = release tag; the hand runs** (non-blocking) — **resolved.**
   `BACKLOG.md:70-72` leaves what a milestone is open ("perhaps a release
   tag"), calls both runs ad hoc, and says PR #11's `r4..756696b` "ends at no
   tag".
5. **Rounds paraphrase** (non-blocking) — **resolved.** `BACKLOG.md:90-91`: "The
   Rounds rule sends a third round that does not end clean to the owner",
   which matches `PRINCIPLES.md:96-98`.
6. **"DeepSeek finding N" ambiguous** (non-blocking) — **resolved.**
   `BACKLOG.md:82`, `:85-86` now read "#10, DeepSeek finding N".
7. **Naming** (non-blocking) — **resolved.** `BACKLOG.md:109-113` now names
   `007-milestone-since-r4-01.md` alongside `006-r4-milestone-NN.md`, and asks
   whether a milestone copy and the change that records it share a number
   ("`006` has one slug, `007` has two", which is true of the tree at
   `d3955a2`).

## Findings

1. **"The commit range from the last reviewed end" is not Tressette's rule**
   (non-blocking). `BACKLOG.md:56-58` credits the range from the last
   reviewed end to "Scopetta, Tressette, balloons-JS", but only two of the
   three work that way:
   - Tressette's range starts at the previous issue's head whether or not
     that issue was ever reviewed: "The next review issue's `<BASE>` is the
     last review issue's `<HEAD>`, run or not, so the ranges never overlap"
     (`Tressette/CLAUDE.md:43-44`). An unrun range stays open, and nothing
     carries it into the next review.
   - Scopetta starts at the "reviewed end" (`Scopetta/CLAUDE.md:74-81`).
   - balloons-JS reaches the same result by superseding an issue that was
     never reviewed and starting from its base (`balloons-JS/CLAUDE.md:156-158`,
     `docs/review-prompt.md:14-15`).

   The two approaches are a real design choice, so crediting Tressette's
   non-overlapping ranges to the reviewed-end approach could mislead the
   design. Suggested wording: "…from the last reviewed end (Scopetta,
   balloons-JS; Tressette starts from the last issue's head, run or not)".
   Tressette is correctly credited with Claude opening an issue that holds
   the prompt and the range (`Tressette/CLAUDE.md:34-38`).

2. **The per-finding reply could also credit discola-web** (non-blocking).
   Its skill has the same step: "Reply on the thread with what happened to each
   finding" (`discola-web/.claude/skills/review-handoff/SKILL.md:127`).
   Leaving it out is not wrong, only incomplete; discola-web is correctly
   left out of the `--body-file` attribution.

## Verified

- **Gate 0.** `git rev-parse backlog/milestone-reviews` = `d3955a2…`;
  merge-base `365f0fe`; the diff lists `BACKLOG.md`,
  `reviews/007-milestone-reviews-backlog-impl-01.md` and
  `reviews/007-milestone-since-r4-01.md`. Working tree clean before this file
  was written.
- **The fixes touch only what round 01 raised.** `git diff 3bfcf95..d3955a2`
  changes only `BACKLOG.md`: the milestone item, the two "#10, DeepSeek"
  labels, the Rounds bullet and the naming item. The copied review is
  unchanged since `19181b9` (`git diff --quiet` over that path), so round 01's
  byte-for-byte check against the PR #11 comment still stands.
- **The round-01 file is recorded as written.** `3bfcf95` adds only
  `reviews/007-milestone-reviews-backlog-impl-01.md`, and later commits don't
  touch it.
- **Re-read the attributions against the five projects' files:**
  `Scopetta/CLAUDE.md` (lines 42–109), `Tressette/CLAUDE.md` (1–80),
  `balloons-JS/CLAUDE.md` (130–180) and `docs/review-prompt.md`,
  `Geoclick2027/CLAUDE.md` §3a and its `review-handoff/SKILL.md`, and
  `discola-web/CLAUDE.md` with its `review-handoff/SKILL.md`. Apart from the
  two findings above, every parenthetical credit holds. "Adopted an
  independent review at milestones, which blocks nothing" holds for all five.
- **No restatement or contradiction.** The item points at `CLAUDE.md` for the
  per-change review and cites "the owner's rule" for the reviewer; no line
  contradicts a current file, and the edits stay within the stated aim.
- `git diff --check 365f0fe..d3955a2` is clean. No changed line of
  `BACKLOG.md` is over 80 characters; lines 18 and 125 are over, but they
  predate this change.
- Not done: no git or GitHub write of any kind; in the other repositories,
  only file reads and `git log`.

— Claude Opus 5.5 (claude-opus-5-5), reviewer
No blocking finding remains.
