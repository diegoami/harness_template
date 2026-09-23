# Review — stale text (posting record, adoption prompt), implementation round 02

**Revision reviewed:** `e29263221e24e9c59d1242535c09c91068d1fda3` (`e292632`,
branch `fix/stale-text`; `git rev-parse fix/stale-text` returns the same sha).
**Files checked:** `ADOPT.md`, `BACKLOG.md`, `design/004-release-4.md`,
`reviews/005-stale-text-impl-01.md` — obtained locally:
`git merge-base main e292632` = `39c29e3`, then
`git diff --name-only 39c29e3..e292632`. Three commits in range: `63f79e6` (the
change), `aa06072` (round 01 recorded), `e292632` (the fixes). The list equals
the expected list; no pull request exists for this branch.
**Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`); a re-review continuing the
round-01 reviewer session (`PRINCIPLES.md`, *Reviewer sessions*), re-reading the
current revision rather than the fix summary.
**Mode:** Claude — no design stage, no marker.

## Round-01 findings

1. **Issue #5's date** (blocking) — **resolved.** `BACKLOG.md:14-15` now says
   "#6–#8 once releases 1–3 had merged, #5 just before release 4 merged" —
   matches issue #5 `01:28:04Z` vs PR #4 merged `01:29:25Z`, and issues #6–#8
   `01:34:46Z`–`01:35:00Z` after merges at `22:31:09Z`, `00:10:40Z`,
   `00:36:46Z`. The loose "in the same pass" is gone.
2. **Encoding described as uniform** (blocking) — **resolved.**
   `BACKLOG.md:17-20` now describes each body separately: `ÔÇö`/`┬À` in issues
   #5–#8 (measured 22/16/14/16 × `ÔÇö` and 2 × `┬À` each), PR #4 "lost its dashes
   outright" (8 × U+FFFD, no `ÔÇö`), a byte-order mark on issue #5 and PR #4
   only, comments intact. All true against the round-01 measurements; nothing
   posted has changed since (issue #6 still never edited; PR #4 and issue #5
   `lastEditedAt` as before).
3. **Claude adoption loop without the ceiling** (blocking) — **resolved.**
   "fix and re-review until none does" is removed; `ADOPT.md:97` adds "Rounds
   are capped by the ceiling in `PRINCIPLES.md` in both modes." That points at
   the rule instead of restating it, and no longer contradicts
   `PRINCIPLES.md:94-99`.
4. **`design: none` alignment** (non-blocking) — **resolved.** The OpenCode
   heading reads "both stages, or only the second when you chose
   `design: none`" (`ADOPT.md:77-78`), and done-when asks for the design record
   "where there is a design stage" (`ADOPT.md:110-111`); both agree with step 3
   (`ADOPT.md:54-55`) and `PRINCIPLES.md:132-136`.
5. **Reviewer acquisition restated** (non-blocking) — **resolved.**
   `ADOPT.md:83` "reviewed as `AGENTS.md` requires"; `ADOPT.md:94-95`
   "`CLAUDE.md`'s fresh-context review". The partial restatement is gone.
6. **Where owner decisions go / "a brief"** (non-blocking) — **resolved**,
   with a new note below (finding 1). The answers go to the project slot
   (`ADOPT.md:90-91`), which owns decided rules (`PRINCIPLES.md:18`), and the
   undefined "a brief" is gone.
7. **The design-004 correction** (non-blocking) — **resolved.**
   `design/004-release-4.md:177-185`: "the same way" became "after their
   merges" (true for PRs #1–#3 and issues #6–#8), three separate links to #6,
   #7, #8, and the signature "— Claude Opus 5.5, the stale-text correction (not
   this record's implementer)" no longer claims the implementer role. The
   original note and its signature (`:159-175`) are untouched.

## Findings

1. **With no remote, the implementer's brief goes in the reviewer's file** —
   non-blocking. `ADOPT.md:92-93`: "the pull request body (the review file when
   there is no remote) lists the file list, the filled slot and every
   collision." `reviews/README.md` gives the review file to the reviewer (its
   opening, findings and final lines); the only implementer section it allows
   is `## Completion` (`reviews/README.md:27-33`). If the implementer writes
   the brief there before the review, two authors share one file, and the
   brief lands in a file the reviewer is meant to create. A neutral home — the
   commit message, or a `PLAN.md` entry — would keep the review file the
   reviewer's. This is a new wording, but it does not contradict an owned rule
   outright, and the collisions are still reported, so it does not block.

2. **"Only the second" can be read as step 2** — non-blocking.
   `ADOPT.md:77-78` says "both stages, or only the second when you chose
   `design: none`", but the list under it is numbered 1–3, where the design
   stage is items 1–2 and the implementation stage is item 3. "Only the
   implementation stage (item 3)" would remove the ambiguity.

## Verified

- Gate 0 as above: sha, merge base, file list, three commits in range; working
  tree clean before this file was written.
- `reviews/005-stale-text-impl-01.md` at `e292632` is byte-identical to the
  round-01 file as written (`git diff aa06072 -- reviews/…` empty,
  `git diff --stat aa06072 e292632 -- reviews/` empty).
- The fix diff (`git diff 63f79e6..e292632`) touches only the round-01 points;
  nothing else in the three files changed.
- Timestamps and encoding: re-used the round-01 measurements (issue and PR
  `createdAt`/`mergedAt`/comment times, GraphQL `lastEditedAt`, BOM bytes and
  `ÔÇö`/`┬À`/U+FFFD counts from dumped bodies). Every claim in the new
  `BACKLOG.md:11-20` matches them.
- The new `ADOPT.md` step 5 and step 6 read against `CLAUDE.md`, `AGENTS.md`
  (two stages, `design: none` makes the implementation review decide,
  `AGENTS.md:43-46`), `PRINCIPLES.md` (rounds, owner decisions,
  `design: none`, bootstrap), `design/README.md` and `reviews/README.md`: no
  contradiction; finding 1 is a matter of authorship, not a conflict.
- `git diff --check 39c29e3..e292632` clean; no new line exceeds 80 characters
  (one line is over 80 bytes only because of the multi-byte characters it
  quotes).
- Not run: `tools/scaffold.mjs`; no GitHub or git write of any kind. PR #4's
  stale body is outside the file list, as the coordinator notes.

— Claude Opus 5.5 (claude-opus-5-5), reviewer
No blocking finding remains.
