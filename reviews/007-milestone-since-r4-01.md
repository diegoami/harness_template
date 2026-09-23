# Independent review — the work since r4 (PR #11 head)

**Revision held:** `756696b101162f8d9f5b245f27cfb9527f77ad78` (HEAD of PR #11). I fetched, then checked out the head in a detached worktree outside the repository (`git worktree add --detach <temp-dir> 756696b…`) and `git -C <temp-dir> rev-parse HEAD` returned exactly that sha. The range under review is `39c29e3..756696b`.

**File list and how obtained:** `git -C <temp-dir> diff --name-only 39c29e3..HEAD`:

`ADOPT.md` `BACKLOG.md` `CLAUDE.md` `README.md` `ROADMAP.md` `design/001-harness-release-1.md` `design/004-release-4.md` `reviews/005-stale-text-impl-01.md` `reviews/005-stale-text-impl-02.md` `reviews/005-stale-text-impl-03.md` `reviews/005-stale-text-impl-04.md` `reviews/005-stale-text-impl-05.md` `reviews/006-r4-milestone-01.md` `reviews/006-r4-milestone-02.md` `reviews/006-r4-milestone-impl-01.md` `reviews/006-r4-milestone-impl-02.md` `reviews/006-r4-milestone-impl-03.md`

I also read the GitHub records named under CLAIMS (issues #5–#8, PR #4, and the comments of issue #10), at the head, against `PRINCIPLES.md`, `CLAUDE.md`, `AGENTS.md`, `reviews/README.md` and `design/README.md`. The work under review is Claude's (claude-opus-5-5); I am a different family, so this review is independent of it.

**Reviewer:** DeepSeek V4.1 Flash (`opencode/deepseek-v4.1-flash`).

**Tool that ran me:** OpenCode agent with explicit model id `opencode/deepseek-v4.1-flash` (equivalent CLI form `opencode run -m opencode/deepseek-v4.1-flash`).

---

## Findings

1. **The record of PR #9 shows the round ceiling and "material edit after a clean round" interacting in a way `PRINCIPLES.md` does not define, and the record contradicts itself about it** — non-blocking. This is a separate concern: it is a gap in the shared Rounds rule, not a defect in what PR #11 is recording, and it cannot be fixed in PR #11; it belongs in the release-5 design.

   `PRINCIPLES.md:94-99` says rounds "are counted per stage: each appended design verdict, and each implementation review file (`-NN`), is one round. Rounds 1 and 2 may rework; a third round that does not end clean … stops and goes to the owner … It does not loop." It says nothing about what happens when the change is materially extended after a clean round.

   PR #9's implementation stage ran five review files for one stage — `reviews/005-stale-text-impl-01.md` through `-05.md` — and its own completion note says "Five review rounds (`-01` to `-05`)" (`reviews/005-stale-text-impl-05.md:114`). Round 03 declared "This is round 3, the last before the ceiling (`PRINCIPLES.md`, *Rounds*)" (`reviews/005-stale-text-impl-03.md:14-15`), yet the stage then produced `-04` and `-05`, each justified as "Round 03 ended clean; this round reviews a material edit made after it" (`reviews/005-stale-text-impl-04.md:16-17`) and "Round 04 ended clean; this round reviews a material edit made after it" (`reviews/005-stale-text-impl-05.md:15-16`, the edit that folded milestone findings 3, 5 and 6 into the same change).

   Reproduce: `git -C <temp-dir> log --oneline 39c29e3..d93c257` lists the five "Record the stale-text review, round N" commits; the five `-NN` files are all one stage, with `-03:14-15` calling round 3 "the last before the ceiling" while `-04` and `-05` follow it. Either the ceiling was passed (the stage "looped" past round 3), or a material edit after a clean round silently restarts the count — `PRINCIPLES.md` states neither, and the two readings were applied inconsistently in the same record set. The owner decision in `BACKLOG.md` (Notes) covers whether *earlier* records are backfilled, not this; the Rounds rule itself needs one sentence on whether a material extension of a clean change re-opens the stage (a new round 1) or accumulates toward the ceiling, and PR #9's five files should be reconciled with that answer when it exists. Consistent with the harness-owner decision, I record it rather than demand a backfill.

## Verified

- **Gate 0.** Held revision equals the named target; the 17-file list above is the exact `git diff --name-only 39c29e3..756696b`.
- **Issue bodies vs design records (byte for byte, CRLF and trailing newlines normalised).** `#5` == `design/004-release-4.md@d69c538`; `#6` == `design/001-harness-release-1.md@b06e6f3`; `#7` == `design/002-harness-release-2.md@8c770ea`; `#8` == `design/003-parametrizable-scaffold.md@a3ae6c8`. All four equal (lengths identical, normalised text identical).
- **PR #4.** Body has no byte-order mark and no `ÔÇ`/`┬À`/U+FFFD; `closingIssuesReferences` = `[5]`, so it still closes #5.
- **Milestone review files.** `reviews/006-r4-milestone-01.md` == comment 1 of issue #10 and `-02.md` == comment 3, byte for byte apart from line endings (comment 2, Claude's non-independence note, is correctly not copied). Comment authors: 1 = DeepSeek (kept as input), 3 = GPT-5.6 Luna (the verdict).
- **Facts in the `design/001` and `design/004` additions.** `git rev-parse r1^{commit}` == `9f7b1a470ef1…` (the tag `r1` points at that commit); the merge commit date is `2026-09-23 00:31:09 +0200` (22:31 UTC the prior day), matching the note. Round 01 review is on `2857b50` (BLOCK) and round 02 is on `2cd33db` (AGREE). Issue #6 holds `design/001` with its three design verdicts as comments; PRs #1, #2 and #3 carry the implementation reviews — `reviews/001-…-impl-01/02`, `002-…-impl-01`, `003-…-impl-01/02/03` — each equal to the corresponding PR comment byte for byte.
- **BACKLOG routing.** The two `design: none` gaps (DeepSeek findings 1 and 2) and "state whether rules apply to earlier records" sit under "Release 5 candidates", matching issue #10's routing; the round-05 leftovers and the milestone-naming gap sit under "Smaller items". Each routed item's description matches its source finding and the current files.
- **Owner decisions.** Both Notes decisions carry the mark ("Owner decision (2026-09-23)"), a recommended default ("taken") and a reason, meeting `PRINCIPLES.md:108-110`; the second names itself the one exception to the first, matching the `design/001` additions and their "not this record's implementer" signatures.
- **No restatement/contradiction found.** `ADOPT.md` step 5 points at `AGENTS.md`/`CLAUDE.md` and the round ceiling rather than restating them, and matches each mode; `README.md`, `ROADMAP.md` and the `CLAUDE.md` slot comment replace restatements with pointers to their owners. The remaining small restatements are themselves listed in BACKLOG (out of scope). I did not run `tools/scaffold.mjs` beyond the already-reported run, and I created nothing.
- **One thing the same-family reviews missed:** the finding above — every round of PR #9's review and its completion note was written by the same family, which recorded "five rounds" and "the last before the ceiling" together without noticing the conflict.

— DeepSeek V4.1 Flash (opencode/deepseek-v4.1-flash), reviewer
AGREE
