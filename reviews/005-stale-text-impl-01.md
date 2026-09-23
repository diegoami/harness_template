# Review — stale text (posting record, adoption prompt), implementation round 01

**Revision reviewed:** `63f79e64832537f517136ba1e866ed3123faa641` (`63f79e6`,
branch `fix/stale-text`; `git rev-parse fix/stale-text` returns the same sha).
**Files checked:** `ADOPT.md`, `BACKLOG.md`, `design/004-release-4.md` —
obtained locally: `git merge-base main 63f79e6` = `39c29e3`, then
`git diff --name-only 39c29e3..63f79e6`. One commit in range (`63f79e6`). The
list equals the expected list; no pull request exists for this branch.
**Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`), a fresh-context session that
has not seen the implementation.
**Mode:** Claude — no design stage, no marker.

## Findings

1. **The new backlog paragraph mis-states when issue #5 was created** —
   blocking. `BACKLOG.md:13-14`: "the design records were backfilled as issues
   #5–#8 once the releases had merged". Issue #5 was created at
   `2026-09-23T01:28:04Z` (body last edited `01:28:57Z`); PR #4 merged at
   `01:29:25Z`. So #5 was opened *before* release 4 merged — after
   implementation, so "no design issue before implementation" (line 13) holds,
   but "once the releases had merged" does not. Only issues #6–#8
   (`01:34:46Z`–`01:35:00Z`) postdate their merges, and all design-verdict
   comments on #5–#8 were posted later still (`01:41:09Z`–`01:41:30Z`). "In the
   same pass" (line 16) is also loose: there were two posting passes — issue #5
   with PR #4's reviews at `01:28:04`–`01:28:06Z`, and issues #6–#8 with PRs
   #1–#3's reviews at `01:34:46`–`01:35:07Z` — and a third for the design
   verdicts. The change exists to make this record accurate, so the clause has
   to match the timestamps. Suggested: "…backfilled as issues #5–#8 — #5 just
   before PR #4 merged, #6–#8 after their merges — with the design verdicts
   posted as comments after all four had merged; the implementation reviews
   went to PRs #1–#4 alongside them — after merge for #1–#3, just before it for
   #4."

2. **The mis-encoding is described as uniform; it is not** — blocking.
   `BACKLOG.md:17-18`: "(issues #5–#8, PR #4) are mis-encoded (`—` posted as
   `ÔÇö`, with a leading byte-order mark)". Measured on the bodies from
   `gh issue view N --json body` / `gh pr view 4 --json body`:
   - issue #5: leading BOM (`ef bb bf`) and 22 × `ÔÇö`;
   - issues #6, #7, #8: **no** BOM (they begin `# 00…`), 16 / 14 / 16 × `ÔÇö`;
   - PR #4: leading BOM, but **no** `ÔÇö` — its 8 em dashes became U+FFFD
     (shown as `´┐¢`), which is lossy, not a reversible re-decoding;
   - all four issues also carry `·` as `┬À` (2 each);
   - every comment on issues #5–#8 and PRs #1–#4, and the bodies of PRs #1–#3,
     are clean UTF-8 (no BOM, no `ÔÇö`, real `—`).
   The difference matters to the backlog's own remedy: PR #4's body cannot be
   repaired by re-decoding, only re-posted from source. Suggested: "issues #5–#8
   show `—` as `ÔÇö` (and `·` as `┬À`); issue #5 and PR #4 open with a
   byte-order mark; PR #4's dashes were replaced by U+FFFD, which is lossy."

3. **The Claude adoption path loops without the round ceiling** — blocking.
   `ADOPT.md:94-95`: "fix and re-review until none does." `PRINCIPLES.md:94-99`
   caps a stage at three rounds: a third round that does not end clean "stops
   and goes to the owner … It does not loop." An adopting session is told to
   execute `ADOPT.md` "as written" (`ADOPT.md:5-7`), so this new sentence
   instructs the opposite of the protocol; `PRINCIPLES.md:25-26` makes a
   contradiction between files a defect to fix in the change that found it.
   Suggested: "fix and re-review within the round ceiling (`PRINCIPLES.md`)."
   The OpenCode branch's "Iterate" (`ADOPT.md:83-84`, carried over) would read
   better with the same pointer, but it does not say "until", so it is not a
   contradiction.

4. **Steps 3, 5 and 6 are not fully aligned for OpenCode with `design: none`**
   — non-blocking. Step 3 now takes `design/` "only if you keep the design stage
   (OpenCode mode with `design: required`)" (`ADOPT.md:54-55`), but step 5's
   OpenCode branch always writes `design/001-adopt-harness.md`
   (`ADOPT.md:77-81`), and step 6 asks for "the design record too in OpenCode
   mode" (`ADOPT.md:108-109`) without the `design: required` qualifier.
   `PRINCIPLES.md:132-136` says that under `design: none` "the design stage does
   not exist in either mode". Either qualify step 6 (and step 5's heading) with
   `design: required`, or state that the adoption itself takes the design stage
   whatever the slot will record — whichever the owner intends; the tension
   predates this change but the step-3 edit makes it visible.

5. **Step 5 restates reviewer acquisition owned by the adapters** —
   non-blocking. `ADOPT.md:82-83` ("a subagent from a different model family,
   with an explicit model id") and `ADOPT.md:93` ("A fresh-context session
   reviews it") restate the OpenCode and Claude processes, which the ownership
   map gives to `AGENTS.md` and `CLAUDE.md` (`PRINCIPLES.md:16-17`), while
   `ADOPT.md:26-27` says "this prompt does not restate them". The OpenCode
   restatement is also partial — it drops "fresh context" and "high reasoning
   effort" (`AGENTS.md:18-21`). The old text restated the same idea, so this is
   carried over rather than introduced; a pointer ("reviewed as `AGENTS.md`
   requires") would remove the drift risk.

6. **The Claude branch does not say where the owner decisions are recorded** —
   non-blocking. `ADOPT.md:89-90` puts open questions to the owner "as owner
   decisions (`PRINCIPLES.md`)", and `PRINCIPLES.md:108-109` requires them
   recorded with a default, reason and mark; in OpenCode mode they live in the
   design record, but the Claude branch's pull-request body lists only "the file
   list, the filled slot and every collision" (`ADOPT.md:91-92`). Adding "and
   the owner decisions" to that list closes it. "A brief when there is no
   remote" (`ADOPT.md:91`) is a term no harness file defines; "the review's
   input" or "a local summary" would be plainer.

7. **The design-004 correction is slightly imprecise** — non-blocking.
   `design/004-release-4.md:178`: "Releases 1–3 were backfilled the same way" —
   not quite: release 4's implementation reviews reached PR #4 before its merge
   (`01:28:05Z` vs `01:29:25Z`), releases 1–3's after. The link text "issues
   #6–#8" (`:179`) targets issue #6 only. The signature
   "— Implementer (Claude Opus 5.5)" (`:183`) sits in an OpenCode record whose
   implementer role is DeepSeek (`AGENTS.md:13-17`, `design/README.md:4`); a
   reader could take it for the record's implementer. Naming the change it
   comes from (e.g. "implementer of the stale-text fix") would avoid that. The
   factual core is right: issues #6–#8 hold releases 1–3's records with their
   three verdicts each, PRs #1–#3 carry the implementation reviews, and the
   landing commit `39c29e3` (`01:30:07Z`) precedes issue #6 (`01:34:46Z`) by
   under five minutes, so "minutes after" holds. The original text is kept
   verbatim above it.

## Verified

- Gate 0 as above: sha, merge base, file list, one commit in range; working tree
  clean at the start.
- `git tag`: `r1`–`r4`; `r4` is the latest, so `r3` → `r4` in `ADOPT.md:5,17,97`
  is correct. `tools/scaffold.mjs:183,228` still say "r3 or later" — correct as
  a minimum, not stale.
- PR timestamps (`gh pr view 1..4 --json createdAt,mergedAt,comments`): merged
  #1 `2026-09-22T22:31:09Z`, #2 `2026-09-23T00:10:40Z`, #3 `00:36:46Z`, #4
  `01:29:25Z`; review comments #1–#3 at `01:34:50`–`01:35:07Z` (after merge),
  #4 at `01:28:05`–`01:28:06Z` (before merge). The backlog's
  "after merge for #1–#3, just before it for #4" is correct.
- Issue timestamps (`gh issue view 5..8`): created #5 `01:28:04Z`, #6
  `01:34:46Z`, #7 `01:34:54Z`, #8 `01:35:00Z`; each has three design verdicts
  (BLOCK, BLOCK, AGREE) as comments at `01:41:09`–`01:41:30Z`; #6–#8 also carry
  a "Backfilled record" comment. `lastEditedAt` via GraphQL: PR #4
  `01:28:08Z`, issue #5 `01:28:57Z`, issue #6 never edited.
- Encoding: bodies and comments dumped to scratch files, first three bytes read
  with `od`, `ÔÇö` / `—` / `┬À` / BOM counted with `grep` (details in finding 2).
- `BACKLOG.md:3-7` now defers to the bootstrap bullet (`PRINCIPLES.md:137-139`)
  instead of restating "both stages"; `AGENTS.md:70` still says both stages for
  OpenCode, which is consistent. No ownership conflict.
- The new `ADOPT.md` text read against `CLAUDE.md` (no design stage, no marker,
  fresh-context reviewer, owner merges), `AGENTS.md`, `PRINCIPLES.md` (records,
  rounds, owner decisions, bootstrap, `design: none`), `design/README.md:4-5`
  (Claude writes no design records) and `reviews/README.md:21-23` (Claude's
  final line). The only contradiction found is finding 3.
- Scope: the diff touches only the three items the commit message names;
  `git diff --check` is clean; no added line exceeds 80 columns.
- Remaining stale text of the same kind, searched with `git grep` for `r3`,
  `file-only`, `only in the files`, `both stages`, `backfill`, `no design
  issue`: none left in the repository. Outside it, PR #4's body still opens
  "Closes nothing (this repository has no design issue…)", although issue #5
  existed when that body was last edited — a candidate for the backlog's
  re-posting item, not a file in this change. Also noted, not a finding: the
  design-004 completion's "the three design verdicts as comments"
  (`design/004-release-4.md:171-172`, committed `01:30:07Z`) predates those
  comments (`01:41Z`); it is true now.
- Not run: `tools/scaffold.mjs` (unchanged, and excluded by the brief); no
  GitHub or git write of any kind.

— Claude Opus 5.5 (claude-opus-5-5), reviewer
Three blocking findings remain (1, 2 and 3).
