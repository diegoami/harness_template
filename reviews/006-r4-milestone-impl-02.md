# Review — the r4 milestone review and the owner's decisions on it, implementation round 02

**Revision covered:** `b5710958ebfa53bc44ab7d43a66233fc8cce5b8d`, branch
`fix/r4-milestone-review` (`git rev-parse fix/r4-milestone-review` returned it
exactly).

**Files checked, and how obtained:** no pull request exists yet, so the local
diff from the merge base: `git merge-base main b571095` → `d93c257`, then
`git diff --name-only d93c257..b571095`:

`BACKLOG.md` `design/001-harness-release-1.md` `reviews/006-r4-milestone-01.md`
`reviews/006-r4-milestone-02.md` `reviews/006-r4-milestone-impl-01.md`

The list is round 01's plus the round-01 review file, committed at `49ea6f0`
(not `81ca1c1`). The fixes are `b571095` alone
(`git diff 49ea6f0 b571095 --stat`: `BACKLOG.md`, `design/001`). The held
revision equals the named target.

**Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`), continuing the round-01
reviewer session, as `PRINCIPLES.md:90-93` allows; the current files were
re-read, not the summary.
**Mode:** Claude — no design stage, no marker.

## Round-01 findings

1. **Resolved.** `BACKLOG.md:96-104` records the `design/001` completion as its
   own owner decision: the mark, "The recommended default, taken", a reason,
   and "the one exception to the decision above". It names both departures:
   the r2 rules, and the status and note written by Claude although
   `design/README.md` gives them to the implementer.
   `design/001-harness-release-1.md:358-359` now points at it. This meets
   `PRINCIPLES.md:108-110`. See new finding 1 on one clause of the reason.
2. **Resolved.** `BACKLOG.md:90-92`: "the verdicts written before Gate 0 landed
   (`80702f8`) — the implementation reviews of releases 1–3 and the design
   verdicts of 001–004". Checked: `1b5763e` (design/004's last verdict) is an
   ancestor of `80702f8`, and `git grep merge-base 1b5763e` finds no Gate 0
   text in `PRINCIPLES.md`, `reviews/README.md` or `design/README.md`.
3. **Resolved.** `BACKLOG.md:60-62`, a release-5 item: "State whether rules
   apply to earlier records", scoped as settled "for this repository only" by
   the Notes decision.
4. **Resolved.** DeepSeek findings 1 and 2 are now under "Release 5
   candidates" (`BACKLOG.md:48-59`), "routed to this design there". That matches
   issue #10's comment 2 ("the release-5 design"). The `light` item now names
   the ownership-map row too (`:56-58`). The round-05 item adds the missing
   trigger and typo exception (`:76`), which is still accurate against
   `BACKLOG.md:3-7`.
5. **Resolved.** `BACKLOG.md:77-79` records the naming gap. See new finding 2.
6. **Resolved.** `design/001-harness-release-1.md:366-367` (the merge line): "2026-09-23 00:31
   +0200 (22:31 UTC the day before)". This matches `git log -1 9f7b1a4` and
   `mergedAt 2026-09-22T22:31:09Z`.
7. **Left as is**, with a reason: the original line is kept by design. That is
   acceptable; the finding was non-blocking and the correction line itself
   says the original is kept.

## New findings

1. **One clause of the finding-1 reason is not supported by the record** —
   non-blocking. `BACKLOG.md:101-102`: the status line "pointed at review round
   01 when round 02 existed, which was wrong under release 1's own rules".
   Release 1 had no rule for the status field: `git grep -i status r1` finds
   nothing in `PRINCIPLES.md`, `AGENTS.md`, `CLAUDE.md`, `design/README.md` or
   `reviews/README.md`; the status table arrived with r2. Round 02 of release 1
   accepted the line as written ("links the implementation review history",
   `reviews/001-harness-release-1-impl-02.md:16`). The line was **stale**, but
   it did not break a rule of release 1. The rest of the reason ("correcting it
   leaves every landed release findable by status") stands on its own. Suggest:
   "…when round 02 existed, a stale pointer; correcting it leaves every landed
   release findable by status." This is a wording fix to the recorded reason,
   not a challenge to the decision (`PRINCIPLES.md:109-110`).

2. **"Independent" is the wrong word for the milestone-review suffix** —
   non-blocking. `BACKLOG.md:78-79`: "`NN` counts independent reviews, not
   rounds". `006-r4-milestone-01.md` is the review found **not** independent
   (`BACKLOG.md` Notes, the r4 milestone-review item: "not independent, kept as
   input"). Say "separate reviews" instead.

3. **One unwrapped line in the Completion** — non-blocking, cosmetic.
   `design/001-harness-release-1.md:360` is 149 characters: the issue link plus
   a whole sentence, where the rest of the section wraps at about 80. Rewrap
   after "finding 1)."

## Verified

- **Gate 0** as above; `git diff --check d93c257 b571095` is clean.
- **Unchanged since round 01:** `reviews/006-r4-milestone-01.md` and `-02.md`
  (`git diff abcbac0 b571095 --stat` lists neither), so round 01's byte-for-byte
  check against issue #10 comments 1 and 3 still holds. The Completion's facts
  are unchanged apart from the date (`2857b50`, `2cd33db` AGREE, `9f7b1a4` =
  `r1^{commit}`, issue #6, PR #1 comments after the merge).
- **The two owner decisions agree with each other.** The first states the
  forward-only rule; the second calls itself "the one exception to the decision
  above". Neither changes a rule that `PRINCIPLES.md` owns. The general
  question is routed to release 5 (`BACKLOG.md:60-62`).
- **Scope.** `b571095` touches only `BACKLOG.md` and `design/001`, and only
  the lines that the round-01 findings named. The Completion is still signed
  as not the implementer's (`design/001-harness-release-1.md:372-373`).

— Claude Opus 5.5 (claude-opus-5-5), reviewer
No blocking finding remains.
