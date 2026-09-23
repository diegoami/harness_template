# Review: the boar_life field report and the post-record test gaps (BACKLOG), implementation round 02

**Revision reviewed:** `062db44c242dcf0914c0f971874de78d22897968`
(`062db44`, branch `r5/backlog-field-report`). Three sources agree on this
SHA: PR #16's `headRefOid` (`gh pr view 16 --json headRefOid,files`),
`git ls-remote origin refs/heads/r5/backlog-field-report` (after
`git fetch`), and `git rev-parse HEAD`. The working tree was clean.

**Files checked:** PR #16's file list is `BACKLOG.md` (+62, −1),
`docs/sources/boar-life-field-report.md` (+52) and
`reviews/011-backlog-field-report-impl-01.md` (+158). It equals the local
diff: `git merge-base HEAD origin/main` = `4cd81a5` (still `main` on the
remote), then `git diff --name-only 4cd81a5 HEAD`. Two commits are new since
round 01: `88f26e3` records round 01, and `062db44` answers it. The source
file is unchanged since `0ece338`.

**Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`), continuing the session of
round 01 and re-reading the current revision.

**Mode:** Claude. No design stage, no marker.

**Method:** read-only. I posted, created, edited and pushed nothing. The
only `gh` calls were `pr view` reads. The owner's decisions (c) and (d) are
taken as given.

## Round-01 findings

- **1 (blocking), the two smaller items in r5 without a claim: fixed.**
  - `BACKLOG.md:36-38` excludes the verification pattern from r5, and
    `:346-347` marks item 6 "not in r5 by the owner's decision, for r6".
  - The test gaps are in r5 through C2 (`:353`, "In r5, through C2"), and
    C2 carries the extension and its proof (`:91-95`).
  - Decision (c) records both (`:390-394`).
  - Nothing is left that is in r5 without a claim.
- **2 (blocking), item 2's lost suggestion and the rule that contradicted
  `ADOPT.md`: fixed.**
  - The suggestion is a candidate under the boar_life list (`:223-225`),
    routed to r6 by decision (d).
  - The Notes now describe instead of prescribe: "boar_life took `r4` plus
    `main`'s fixes and recorded both SHAs" (`:389-390`). Nothing contradicts
    `ADOPT.md:98-99` any more.
  - The "Release step" (`:40-42`) covers the recurrence at the `r5` tag.
- **3 (the scaffold): fixed**, "at adoption and in the scaffold"
  (`:210-211`).
- **4 (wording): fixed.** "a real product" (`:203`); the `ROADMAP.md`
  quotations are capitalised as in `ROADMAP.md:55,68`; "an info string on a
  closing fence line" (`:351`) now matches round 03's Q3.
- **5 (C10 and builders):** left for the C10 change, as proposed.

## C5: the extension of C2

It meets C5 (`BACKLOG.md:108-116`).
- **Visible and dated.** It is marked "**Extended on 2026-09-24** by the
  owner's decision (PR #16)" in C2 itself (`:91`).
- **The reason in the same commit.** The reason, "since they belong to r5's
  own tool", sits beside it, and decision (c) in Notes is dated and names PR
  #16. Both land in `062db44`, the commit that changes C2, so
  `git log -p … -- BACKLOG.md` shows the change and its reason together.
- **A strengthening.** The C2 hunk adds five lines and removes none. The
  earlier text and proof of C2 are untouched, and no other claim C1–C11 is
  touched: the diff's other deletions (`0ece338..062db44`) are the in-r5
  line, the boar_life wording, the item-6 and test-gap bullets, and Notes
  (b).

## Findings

No blocking finding. These refine the new text and are not conditions:

1. **non-blocking. C2's new proof does not name two of the gaps its claim
   closes.**
   - The claim says the gaps "are closed". The proof (`:93-95`) names a
     subdirectory test and "each break named in the … item". The item lists
     three named breaks, plus the untested path conversion and symlink entry
     point (`:349-353`).
   - **The symlink / junction entry point (N12)** has no proof step.
   - **The path conversion (round 03's Q2)** matters only where `path.sep`
     is `\`. On a POSIX runner, a subdirectory test stays green with the
     conversion removed.
   - A milestone reviewer tests the claim itself, so this is not a
     weakening. But the proof is the checklist.
   - Suggested: "…turns a test red, including Q2 run on Windows (or with a
     `\` separator simulated); and a test runs the entry point through a
     directory junction."
2. **non-blocking. "Four template problems" now heads five bullets.**
   `:203` says four, and `:223` adds the fifth (`ADOPT.md` names only a tag,
   item 2), which is routed by decision (d), not (a). Suggested: "Four
   template problems a real product meets, and a release problem, …", or
   drop the count.
3. **non-blocking. The r5 section's own record of the 2026-09-24 change is
   thin.**
   - `:11` still reads "decided on 2026-09-23: the owner accepted the scope
     and every decision below". Decisions (c) and (d) live only in Notes
     (`:390-394`), not in the D table.
   - The Release step (`:40-42`) has no proof and no one named to check it.
     `git show r5:ADOPT.md` naming `r5` would do.
   - Also, decision (c)'s reason calls item 6 "adoption work". It is a
     `verification/README.md` pattern. The routing is the owner's; only the
     stated reason fits loosely.

   A sentence on `:11` pointing at the 2026-09-24 extension, and the check
   for the Release step, would close all three.

## Verified

- **Gate 0**, above. The source file's blob is unchanged since round 01,
  where its rendering was checked.
- **C1 for round 01.** PR #16 has one comment
  (`#issuecomment-5804139360`, 2026-09-23T22:40:31Z). It equals
  `reviews/011-backlog-field-report-impl-01.md` at `062db44`, apart from the
  final newline (`diff` after stripping CR). It is dated after `88f26e3`
  (22:40:25Z) and before `062db44` (22:47:59Z).
- **Wrapping.** No added line in `0ece338..062db44` exceeds 80 columns.
- **Decisions (c) and (d)** carry "recommended defaults, taken", a date, the
  PR and reasons, in the Notes format of (a) and (b). Neither contradicts the
  milestone rule or the "Not in r5" list (`:44-48`).
- **The Release step** is consistent with `ADOPT.md`, which today names `r4`
  at lines 5, 17 and 99.

— Claude Opus 5.5 (claude-opus-5-5), reviewer
No blocking finding remains.

## Completion

Landed by PR #16, merged on 2026-09-23 (UTC) at the owner's instruction
("merge #16"), after the last review comment and with GitGuardian green. The note
is non-material and transcribes the evidence.

- Two review rounds. Round 01 had two blocking findings, both answered by the
  owner's decisions (the test gaps join r5 through C2, and item 6 does not; the
  exact-commit pin waits for r6, and ADOPT.md naming r5 becomes a release step).
  Round 02 ended with no blocking finding on `062db44`; `2c6f418` only adds its
  record.
- Both rounds were posted with `tools/post-record.mjs`, each read back equal to
  its file. Round 02 was first refused because GitHub's record of the PR's head
  stayed on `062db44` after the push; at the owner's decision the PR was closed
  and reopened, which re-synced it, and the post then passed the PR check.
- C5: C2's extension is dated, with its reason in the same commit, and only
  adds to the claim.

— Implementer (Claude Opus 5.5)
