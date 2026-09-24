# Review: the four protocol gaps and two milestone questions (r5, C7), implementation round 02

**Revision reviewed:** `d7f633fcb06a6046bb9068fcb56292a94e20b4eb`
(`d7f633f`, branch `r5/protocol-gaps`). Three sources agree on this SHA: PR
#21's `headRefOid` (`gh pr view 21 --json headRefOid,files`),
`git ls-remote origin refs/heads/r5/protocol-gaps`, and `git rev-parse HEAD`.
The working tree was clean.

**Files checked:** PR #21's file list is `AGENTS.md`, `BACKLOG.md`,
`PRINCIPLES.md`, `presets/auto.json`, `presets/light.json`,
`presets/standard.json`, `reviews/016-protocol-gaps-impl-01.md` and
`reviews/milestone-prompt.md`. It equals the local diff:
`git merge-base HEAD origin/main` = `42d8bca`, then
`git diff --name-only 42d8bca HEAD`. There are three commits:
- `f28d05b`, which round 01 reviewed;
- `9be338e`, which adds only the round-01 file;
- `d7f633f`, the fixes, which I reviewed as `git diff 9be338e d7f633f`,
  and within the full diff from the merge base.

**Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`), a fresh-context session
that has not seen the implementation (the round-01 reviewer, continued, as
*Reviewer sessions* allows).

**Mode:** Claude. No design stage, no marker.

**Method:** read-only in the repository and on GitHub. I generated each
preset from the head SHA into the scratchpad, without `--github`, and deleted
the runs afterwards. The only write in the repository is this file. Nothing
was posted, committed or pushed.

## Round 01, re-checked

1. **Fixed** (it was blocking). The reviewer bullet now checks "the plan's
   history since the commit that fixed the claims" (`PRINCIPLES.md:218-219`).
   That agrees with the prompt (`milestone-prompt.md:72-79`), the
   claims-before-work bullet (`PRINCIPLES.md:204-207`) and the milestone
   issue (`:210-211`). No text says "since the previous tag" any more.
2. **Fixed** (it was blocking).
   - The Rounds rule settles every open point (`PRINCIPLES.md:104-110`):
     - a stopped review is no review and not a round;
     - it "gets no `-NN` file, carries no marker, and is recorded only as
       a stop notice";
     - for milestones, "a stop notice is not a verdict".
   - The prompt agrees:
     - its STOPPING block (`milestone-prompt.md:43-45`) asks for a comment
       beginning "STOP NOTICE:", with no table, no findings and no marker,
       and says it is no review and no round;
     - both stop points send the reviewer to it (`:40-41`, `:51-52`);
     - the limits allow it (`:107-108`);
     - output step 2 applies "unless you stopped" (`:120`);
     - the read-back and the reply cover it (`:135-137`).
   - A stop can no longer end `AGREE`. It no longer fits the D10 count.
     `reviews/README.md:27-28` ("A milestone verdict ends with the marker")
     does not apply, because a stop notice is not a verdict.
   - This fits *Fallback* (`:111-112`) and Gate 0's stop (`:84-85`), and
     `reviews/README.md:12-13` ("a wrong target, not a finding").
3. **Fixed.** "Every verdict's copy — each `BLOCK` as well as the `AGREE` —
   lands after the tag, together with that completion note"
   (`PRINCIPLES.md:247-250`). Walking the paths again:
   - **BLOCK, then fix PRs:** those PRs add no verdict copy, so C1's per-PR
     proof (`BACKLOG.md:83-86`) has no unposted review file. `main`'s first
     parent gains only PR merges.
   - **BLOCK with no fix PR** (all findings triaged "not a defect" or
     "accepted gap"): the copy waits for the tag like any other, so it has
     a home.
   - **AGREE:** the copies land after the candidate, outside
     `<landing merge>..<candidate>`, so C1 holds for r5.

   Round 01's r6 note still applies, now to several files: the post-tag
   commit adds whole files under `reviews/**` to `main` and opens the next
   range. It is for the r6 scope, not a finding here.
4. **Resolved; no owner decision needed.**
   - "not backfilled unless the owner decides so on the record"
     (`PRINCIPLES.md:152`) now allows exactly the design/001 exception
     (`BACKLOG.md:398-407`).
   - D11's default is "this repository's decision in Notes, made general".
     The Notes hold the going-forward decision and its design/001
     exception. The exception's recorded form is "the original line is
     kept, and the additions are signed as not the implementer's", and the
     correction clause generalizes it.
   - The clause matches design/001's and design/004's corrections on every
     point, as round 01 found. So the bullet is within D11 as its default
     reads.
5. **Fixed.**
   - The header says "every placeholder listed below"
     (`milestone-prompt.md:4`).
   - Every generated prompt has 0 literal `{{…}}`. Its only `{{…}}` tokens
     are the 15 documented names.
   - The narrowed C8 holds mechanically.
6. **Fixed, with one new point** (finding 1).
   - C2's decision now has a Notes entry (`BACKLOG.md:424-428`). It is
     marked, dated, and gives the default and the reason, in the form of
     the PR #16 entry above it. That the default was *recommended* cannot
     be checked from the records: PR #19's body says only "By the owner's
     decision on round 01". I take the entry as the record.
   - The red-before-fix is in PR #20's body, line 57: "Before the fix, the
     link test failed with `../link/reviews/r.md is not one of PR #15's
     files`".
   - C8's additions are relabelled "an extension, not a correction"
     (`BACKLOG.md:154-156`).
7. **Mostly fixed.** Two short lines are left inside paragraphs (finding 3).

The round-01 file was posted as it should be:
- the comment on PR #21 (2026-09-24T10:01:48Z) equals
  `reviews/016-protocol-gaps-impl-01.md` at the head, apart from the final
  newline;
- it came after `9be338e` (12:01:37+02:00) and before `d7f633f`
  (12:03:21+02:00).

## Findings

1. **non-blocking. C8's relabel changes a claim's text without its own date
   or a reason in the plan.**
   - `d7f633f` rewrites the wording of PR #19's dated note inside C8. It
     was "; shipping the prompt and naming posted reviews in the `auto`
     line are added, from PRs #19 and #17". It is now "… are an extension,
     not a correction, added in the same change …"
     (`BACKLOG.md:154-156`).
   - The edit carries no date of its own. Its reason is only in the commit
     message.
   - C5's proof asks that `log -p <landing merge>..<candidate> --
     BACKLOG.md` show "every change to C1–C11 with its reason written here
     in the same commit" (`BACKLOG.md:131-133`). The milestone reviewer
     will see this hunk with no reason in the plan.
   - The claim's meaning does not change, and it is not weakened. But this
     is the one claim edit in the PR that is not visibly dated.
   - *Fix:* keep PR #19's words and append "**Relabelled on 2026-09-24**
     (PR #21): the two additions are an extension, not a correction".
2. **non-blocking. C11 still places the copy "when a verdict arrives".**
   - C11 reads "when a verdict arrives the implementer reproduces each
     finding, replies on the milestone issue per finding, and copies the
     verdict into `reviews/` (D9)" (`BACKLOG.md:181-183`).
   - The rule now defers every copy to after the tag
     (`PRINCIPLES.md:247-250`). The copy still happens, so the claim can be
     read as met. A strict reviewer could still read "when a verdict
     arrives" as covering all three actions and grade C11 PARTLY MET.
   - *Fix:* a dated "worded more exactly" note on C11, like C2's
     (`BACKLOG.md:104-107`), or leave it for the milestone reviewer to judge.
3. **non-blocking, wrapping.** Two short lines are left inside paragraphs:
   - "TEST, each with its evidence — opens" (`PRINCIPLES.md:221`), in the
     rewrapped reviewer bullet;
   - "change, from PRs #19 and #17. **Narrowed on" (`BACKLOG.md:156`).

   Every other added line is 79 characters or fewer, apart from the
   ownership-map table row.
4. **non-blocking. A stop notice has no home without a remote.**
   - A stop "is recorded only as a stop notice, a comment"
     (`PRINCIPLES.md:106-107`).
   - The protocol also says "Records are files" (`:73`) and "Without a
     remote, the files stand alone" (`:174`).
   - So a per-change review that stops in a project with no remote leaves
     no record at all.
   - *Fix:* "(without a remote, a line in the change's next review file)",
     or accept the gap.

## Verified

- **Gate 0:** as above. `9be338e` touches only the round-01 file, which is
  identical to what I wrote in round 01.
- **Generated runs:** `node tools/scaffold.mjs --yes --ref d7f633fc… --preset
  <p> --name t --dir <scratch>`, with no `--github`.
  - `light`, `standard` and `auto` each exit 0 and ship
    `reviews/milestone-prompt.md`.
  - Relative links outside code fences, checked with the rewritten checker
    (it also handles reference definitions and `<…>` targets): `light` 18
    checked, 0 dangling; `standard` 27, 0; `auto` 27, 0.
  - The runs were deleted afterwards.
- **C7:** still met, part by part as in round 01. The line numbers have
  shifted: `design: none` is at `PRINCIPLES.md:143-149`, rules going forward
  at `:150-154`, and rounds at `:101-110`. `AGENTS.md:31-36` names
  `design/README.md` in a code span.
- **Placeholders:** 15 are documented (`milestone-prompt.md:10-24`), and
  each is used in the fence. `{{ISSUE}}` gains a use in the STOPPING block.
  No generated file outside the prompt has a `{{…}}` token.
- **C5:** in the full diff, `BACKLOG.md` changes only:
  - C2 (`:104-107`) and C8 (`:152-159`) among the claims;
  - one new Notes entry (`:424-428`).

  C1, C3–C7, C9–C11, the promise, the decisions and the not-in-r5 list are
  untouched. Neither claim is weakened (finding 1 aside).
- **Checks:** `node --check` passes on `tools/*.mjs`, and
  `node --test tools/post-record.test.mjs` passes 30 of 30. No tool changed.
- **Ownership:** nothing is restated outside its owner. The prompt's line
  "It counts as no review and no round" is the prompt's own instruction to
  its reader, and it agrees with the Rounds rule.
- **Scope:** every hunk in `d7f633f` answers a round-01 finding.

— Claude Opus 5.5 (claude-opus-5-5), reviewer
No blocking finding remains.
