# Review — the r4 milestone review and the owner's decisions on it, implementation round 01

**Revision covered:** `abcbac0cb18b06e08175037648cc12fc5a6be238`, branch
`fix/r4-milestone-review` (`git rev-parse fix/r4-milestone-review` returned it
exactly).

**Files checked, and how obtained:** no pull request exists yet, so the local
diff from the merge base: `git merge-base main abcbac0` → `d93c257`, then
`git diff --name-only d93c257..abcbac0`:

`BACKLOG.md` `design/001-harness-release-1.md` `reviews/006-r4-milestone-01.md`
`reviews/006-r4-milestone-02.md`

The list equals the expected list; the held revision equals the named target.

**Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`), a fresh-context session that
has not seen the implementation.
**Mode:** Claude — no design stage, no marker.

## Findings

1. **The owner decision on Luna finding 1 is not recorded to the convention,
   and it is the only authority for departing from two written rules** —
   blocking. `design/001-harness-release-1.md:5-7` sets the status to `landed`
   and `:356-372` adds a `## Completion` signed "Claude Opus 5.5, completing the
   record after the fact (not this record's implementer)". `design/README.md:11`
   gives the `Status:` field to "the implementer — one writer", and
   `design/README.md:36-38` has the completion note "signed by the
   implementer". The departure is transparent, and the owner may make it, but
   its only record is `BACKLOG.md:83` — "for finding 1 the owner chose to
   complete `design/001` anyway" — and the Completion's opening "at the owner's
   decision" (`design/001-harness-release-1.md:358`). Neither gives a
   recommended default or a reason, which `PRINCIPLES.md:108-110` requires of
   every owner decision. It also sits directly against the general rule the
   same note states, "a later rule is not applied to it" (`BACKLOG.md:78-79`),
   while `landed` and the completion note are exactly such later rules
   (`git show r1:design/README.md` has neither; `r2` introduces both). The
   word "anyway" names the exception without justifying it. Fix: record the
   finding-1 decision in `BACKLOG.md`'s Notes as its own owner decision — the
   recommended default, the reason (for example: Luna asked for the correction
   before release 5; the r1 implementer's session no longer exists; a note
   signed by a non-implementer that only transcribes the git record is the
   least-invention way to close it), and the mark — and say that it is the
   one exception to the forward-only rule and to the one-writer rule. One or
   two sentences; nothing else needs to change.

2. **The forward-only decision is scoped as "the reviews before r4", but Luna's
   finding 2 also names r4's own design verdicts** — non-blocking.
   `BACKLOG.md:79`: "the reviews before r4 carry no Gate 0 target proof". Luna's
   finding 2 (`reviews/006-r4-milestone-02.md:17`) cites the implementation
   reviews of releases 1–3 **and** the appended design verdicts in
   `design/001`–`design/004`, including `design/004-release-4.md:189-192`
   ("**Revision reviewed:** d69c538." — no file list). Those verdicts were
   recorded at `1b5763e`, before Gate 0 arrived at `80702f8`, so the general
   rule at `BACKLOG.md:77-78` does cover them — but the concrete sentence reads
   as excluding them, and a later milestone reviewer may re-raise them. Suggest:
   "the verdicts written before Gate 0 (`80702f8`) — the implementation reviews
   of r1–r3 and the design verdicts in `design/001`–`004` — carry no target
   proof and are not backfilled."

3. **A general rule about how records are judged is stated in a non-owning
   file** — non-blocking now; it should move to `PRINCIPLES.md` in release 5.
   "A record is held to the rules in force when it was written, and a later
   rule is not applied to it" (`BACKLOG.md:77-79`) is a statement about the
   verdict protocol's reach, which the ownership map gives to `PRINCIPLES.md`
   (`PRINCIPLES.md:15`). It does not contradict or silently change any rule
   there: `PRINCIPLES.md:75-83` is written as a duty of the reviewer at review
   time and is silent on retroactivity — which is why DeepSeek
   (`reviews/006-r4-milestone-01.md:38`, "not retroactively required") and Luna
   (`reviews/006-r4-milestone-02.md:17`) read it oppositely. As a decision about
   this repository's own records, `BACKLOG.md` is an acceptable home
   (`BACKLOG.md:6-7`: "this file is it"), and `BACKLOG.md` does not ship to runs
   (`presets/*.json`). But every scaffolded project that later upgrades its
   harness meets the same question and will not find this answer. Not blocking,
   because this change applies the decision only to this repository; add a
   smaller item: "State in `PRINCIPLES.md` whether a new protocol rule applies
   to records written before it."

4. **The routed items are accurate but drop part of two sources, and one
   disagrees with issue #10's routing note** — non-blocking.
   - `BACKLOG.md:56-60` matches DeepSeek finding 1
     (`reviews/006-r4-milestone-01.md:21`) and the current files:
     `PRINCIPLES.md:105-107`, `:132-136`; `reviews/README.md:27-33` places the
     completion note for Claude mode only. Accurate.
   - `BACKLOG.md:61-63` matches DeepSeek finding 2 and the current files
     (`presets/light.json` omits `design/README.md`; `AGENTS.md:31-32` links it),
     but omits the second half: `PRINCIPLES.md:21` also names
     `design/README.md` as an owner in a `light` run that lacks it.
   - `BACKLOG.md:64-68` matches round-05 findings 1–3
     (`reviews/005-stale-text-impl-05.md:46-73`) and the current files
     (`ROADMAP.md:14`, `README.md:13-14`, `:20-21`, `BACKLOG.md:3-7`), but for
     finding 3 records only the list, not the preamble's missing trigger and
     typo exception (`reviews/005-stale-text-impl-05.md:68-71`). Citing the file
     (`reviews/005-stale-text-impl-05.md`) instead of "its round-05 review"
     would make the source findable.
   - Issue #10's second comment routes DeepSeek findings 1 and 2 to "the
     release-5 design"; this change files them under "Smaller items", not
     "Release 5 candidates". The owner may route them anywhere, but finding 1
     was rated blocking and "central to the rulebook" by its author; a reader
     following the issue will look in the wrong section. Either move them or
     say in the Notes that they were re-routed.

5. **The two milestone review files have no name in `reviews/README.md`, and
   `-01`/`-02` read as rounds** — non-blocking; a gap to record.
   `reviews/README.md:3-5` defines only `NNN-<slug>-impl-NN.md`, with `NN`
   counting rounds of one implementation stage toward the ceiling
   (`PRINCIPLES.md:94-99`). A milestone review is neither: `-01` and `-02` are
   two independent reviews of the same tag, and `-01` is, under the fallback
   rule, no review at all — yet it sits in `reviews/` ending `BLOCK`
   (`reviews/006-r4-milestone-01.md:42`), explained only in `BACKLOG.md:87-90`.
   `006` is also shared with this change's own implementation review
   (`reviews/006-r4-milestone-impl-01.md`), distinguished only by the `-impl-`
   infix. The name is acceptable as a stopgap, since the files must stay
   verbatim and cannot carry a header, but record a smaller item: a naming and
   format rule for milestone reviews in `reviews/README.md` (for example
   `NNN-<slug>-milestone-<reviewer>.md`, or a note that a review found not
   independent is kept as input and does not count as a round).

6. **The merge date is given in UTC while the rest of the record uses local
   dates** — non-blocking. `design/001-harness-release-1.md:366`: "PR #1 merged
   at `9f7b1a4` on 2026-09-22". GitHub's `mergedAt` is `2026-09-22T22:31:09Z`,
   but `git log -1 9f7b1a4` shows `2026-09-23 00:31:09 +0200`, the tag `r1` is
   dated 2026-09-23, and the note itself and the owner decision are dated
   2026-09-23 local. A reader checking with `git log` sees a different day.
   Write "2026-09-22 22:31 UTC".

7. **The stale `Status:` field keeps its field name; the correction does not**
   — non-blocking. Placement is right: the corrected line follows the stale one
   immediately, is bold, and says "The line above is kept as written"
   (`design/001-harness-release-1.md:5-7`), in line with the precedent at
   `design/004-release-4.md:8-15`. But `design/README.md:14-20` describes one
   field that *becomes* each value, and a search for `**Status:**` finds only
   `agreed`. Acceptable as history; if the forward-only note is revised for
   finding 1, consider saying there that the original `Status:` line of a
   pre-r2 record is preserved and corrected below rather than overwritten.

## Verified

- **Gate 0.** `fix/r4-milestone-review` → `abcbac0`; merge base `d93c257`
  (main's head); the four-file list above. `git diff --check` clean; no CR in
  any of the four files at `abcbac0`.
- **Verbatim copies.** Comments 1 and 3 of issue #10
  (`gh issue view 10 --json comments`, `.comments[0].body` and `[2].body`),
  with CR stripped and trailing blank lines removed, compared with `cmp`
  against `git show abcbac0:reviews/006-r4-milestone-01.md` and `-02.md`
  normalised the same way: **identical**, 9532 and 4366 bytes. Comment 2 is
  Claude's non-independence note and was correctly not copied.
- **design/001 facts.** Round 01 on `2857b50` BLOCK and round 02 on `2cd33db`
  AGREE (`reviews/001-harness-release-1-impl-0{1,2}.md:3`, final lines), and the
  same two texts as PR #1's comments (`gh pr view 1 --json comments`). PR #1:
  `MERGED`, merge commit `9f7b1a470ef1…`, `mergedAt 2026-09-22T22:31:09Z`, head
  `07f8448`, which adds only the round-02 review file to `2cd33db`
  (`git diff --stat 2cd33db 07f8448`), so the AGREE covers the merged content.
  `git rev-parse "r1^{commit}"` → `9f7b1a4`: "tag `r1` is that commit" holds.
  Issue #6: the design as its body, a backfill note and the three design
  verdicts as comments, created and closed 2026-09-23T01:34Z, after the merge —
  "posted to GitHub after the fact" holds; PR #1's comments are dated
  2026-09-23T01:34Z, also after the merge.
- **When the rules arrived.** `git show r1:design/README.md` has no status
  table, no `landed`, no Completion; `git grep` at `r1` finds "completion" in
  none of `PRINCIPLES.md`, `design/README.md`, `reviews/README.md`; at `r2` all
  three carry it (`design/README.md:20`, `:33`; `PRINCIPLES.md:102`). Gate 0:
  `git grep merge-base` finds nothing at `80702f8^` and finds
  `PRINCIPLES.md:78-80` and `design/README.md:28` ("the target proof included")
  at `80702f8`, the r4 implementation commit. The record states no done-when
  list (no match in `design/001`); its "Bootstrap on this release" names the
  merge and the `r1` tag, which the note transcribes.
- **Status vocabulary.** `landed` is a `design/README.md:14-20` value, and its
  preconditions hold: latest design verdict AGREE on revision 3 (`061e576`),
  latest implementation verdict AGREE, merged, completion note written.
- **Owner-decision convention for finding 2.** `BACKLOG.md:77-81` carries the
  mark ("Owner decision (2026-09-23)"), the recommended default ("taken") and a
  reason. It meets `PRINCIPLES.md:108-110`, subject to findings 2–3.
- **Scope.** Nothing outside the aim: the diff adds 115 lines and deletes none;
  existing text in `BACKLOG.md` and `design/001` is untouched.
- **Not in the diff.** Issue #10 is still open; its closing is outside this
  change.

— Claude Opus 5.5 (claude-opus-5-5), reviewer
One blocking finding remains (finding 1: record the finding-1 owner decision with its default and reason).
