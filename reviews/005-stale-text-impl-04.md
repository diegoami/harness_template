# Review — stale text (posting record, adoption prompt), implementation round 04

**Revision reviewed:** `9722a03e7e99f5d9e4ba3169759331ab0ca45572` (`9722a03`,
branch `fix/stale-text`; `git rev-parse fix/stale-text` returns the same sha).
**Files checked:** `ADOPT.md`, `BACKLOG.md`, `design/004-release-4.md`,
`reviews/005-stale-text-impl-01.md`, `reviews/005-stale-text-impl-02.md`,
`reviews/005-stale-text-impl-03.md` — obtained locally:
`git merge-base main 9722a03` = `39c29e3`, then
`git diff --name-only 39c29e3..9722a03`. Eight commits in range; new since
round 03: `13c3acd` (round 03 recorded), `fdbaa5b` (ADOPT.md rewrap),
`9722a03` (BACKLOG.md posting paragraph). The list equals the expected list;
no pull request exists for this branch.
**Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`); a re-review continuing the
same reviewer session (`PRINCIPLES.md`, *Reviewer sessions*), re-reading the
current revision and the live GitHub bodies.
**Mode:** Claude — no design stage, no marker. Round 03 ended clean; this round
reviews a material edit made after it (`PRINCIPLES.md`, *Materiality*).

## Round-03 finding

1. **`ADOPT.md:93` over the wrap width** (non-blocking) — **resolved** by
   `fdbaa5b`. `ADOPT.md:92-95` now wraps within 80 characters.

## Findings

None.

## Verified

- **Gate 0** as above; working tree clean before this file was written.
- **`fdbaa5b` is whitespace-only.** `ADOPT.md` at `fdbaa5b~1` and `fdbaa5b`,
  with every run of spaces, tabs and newlines collapsed to one separator,
  hashes to the same md5 (`97781268…`); the diff moves "collision." to the next
  line and nothing else.
- **`13c3acd`** adds only `reviews/005-stale-text-impl-03.md`, identical to the
  round-03 file as written (`git diff 13c3acd -- …` empty).
- **`9722a03`** changes only `BACKLOG.md:17-22`; `git diff --check
  39c29e3..9722a03` is clean.
- **Live bodies** (`gh issue view 5..8 --json body`,
  `gh pr view 4 --json body,closingIssuesReferences`): no `ÔÇ`, no `┬À`, no
  U+FFFD bytes, no mangled `´┐¢`, and no byte-order mark in any of the five;
  issues open with `# 0`, PR #4 with `**D`. `lastEditedAt`: issues #5–#8
  `2026-09-23T10:13:30Z`–`10:13:33Z`, PR #4 `10:24:25Z` — on the date the
  paragraph states.
- **PR #4.** `closingIssuesReferences` = `[5]`; the body contains
  `Closes #5` on its own line and no "Closes nothing". Against the round-01
  capture of the old body (BOM stripped, CRLF removed, each of the 8 mangled
  `´┐¢` masked; the new body's `—`/`–` masked the same way), the only
  difference is the removed "Closes nothing (…)" line and the blank line after
  it. The 8 restored characters are 7 × `—` and 1 × `–`, the en dash at
  "rounds 1–2" — the right choice for a range.
- **Issues equal the design records** after CRLF removal and trailing blank
  lines trimmed on both sides (`cmp` byte-equal):
  - #5 = `design/004-release-4.md` at `d69c538` (136 lines);
  - #6 = `design/001-harness-release-1.md` at `b06e6f3` (161 lines);
  - #7 = `design/002-harness-release-2.md` at `8c770ea` (158 lines);
  - #8 = `design/003-parametrizable-scaffold.md` at `a3ae6c8` (156 lines).
  Each sha is the "Revision reviewed" of the first design verdict comment on
  that issue, so "the design records at their first reviewed revisions"
  (`BACKLOG.md:21`) is exact.
- **The new paragraph is true now.** `BACKLOG.md:17-19` moves the damage into
  the past tense and keeps its per-body description, which matches the
  round-01 measurements. One precision for the record, not a finding: the old
  PR #4 body stored its lost dashes as the literal characters `´┐¢` (U+FFFD's
  UTF-8 bytes read as cp850), not as a raw U+FFFD as round 01 put it; either
  way the dashes were gone, so "lost its dashes outright" stands.
  `BACKLOG.md:20-22` (re-posted clean on 2026-09-23; issues decoded back; PR #4
  dashes restored by hand; "Closes nothing" removed) matches every check above.
  The issues now hold each record's first reviewed revision, not its final text;
  that is the pairing the verdict comments review, and the paragraph says so.
- Not run: `tools/scaffold.mjs`; no GitHub or git write of any kind.

— Claude Opus 5.5 (claude-opus-5-5), reviewer
No blocking finding remains.
