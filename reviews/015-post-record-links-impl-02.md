# Review: a checkout reached through a directory link (r5, C2 extended again), implementation round 02

**Revision reviewed:** `c8070fdadffabcdbad7f789af5659a90c8100c4d`
(`c8070fd`, branch `r5/post-record-links`). Three sources agree on this
SHA: PR #20's `headRefOid` (`gh pr view 20 --json headRefOid,files`),
`git ls-remote origin r5/post-record-links`, and `git rev-parse HEAD`. The
working tree was clean.

**Files checked:** PR #20's file list is
`reviews/015-post-record-links-impl-01.md` (+187), `tools/post-record.mjs`
(+31, −10) and `tools/post-record.test.mjs` (+48, −2). It equals the local
diff: `git merge-base HEAD origin/main` = `6540a4b` (also `main` and
`origin/main`), then `git diff --name-only 6540a4b HEAD`. There are three
commits since the merge base: `18c6946` (round 01's target), `6be5f17`
(round 01's record) and `c8070fd` (the fixes). This round reviews
`git diff 18c6946 c8070fd -- tools/` and re-checks the change as a whole.

**Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`). This continues the
round-01 reviewer session, as `PRINCIPLES.md` (*Reviewer sessions*)
allows, and re-reads the current revision.

**Mode:** Claude. No design stage, no marker.

**Method:** read-only in the repository and on GitHub. The only `gh` calls
were `pr view`. I did not run the tool with `--confirm`. All breaks and
probes ran on copies of the blobs at `c8070fd`, `18c6946` and `6540a4b`,
in `…/scratchpad/rv15/`. Every break was confirmed to have landed.

**Round 01's record:** the comment on PR #20 equals
`reviews/015-post-record-links-impl-01.md` as `c8070fd` holds it, apart
from the final newline. It was posted at 08:24:15Z, after `6be5f17`
(08:24:04Z) and before `c8070fd` (08:26:58Z).

## Round 01's findings

1. **8.3 short names (blocking): resolved.**
   - `physical()` now resolves the directory with `realpathSync.native`,
     and so does the top-level lookup (`post-record.mjs:257-265`, `:304`).
   - Both runs pass 30 of 30: the checkout normally, and the scratch copy
     with `TEMP`/`TMP` set to the 8.3 alias
     `…\C-9DFF~1\D7177D~1\SCRATC~1\rv15\TEMP-W~1`.
   - My round-01 probe now accepts the 8.3 path and the upper-case path.
   - The new upper-case assertion (`test.mjs:638-641`) kills round 01's
     tool: with `18c6946`'s tool and this test file, the result is
     `REVIEWS/R.MD is not one of PR #15's files`.
2. **A file that is itself a symlink (non-blocking): resolved in the code,
   but untested** (new finding 1). My probe now matches `main` in both
   cases. A PR that lists only the target no longer accepts the link.
3. **A missing file (non-blocking): resolved.** `defaultCommitted` returns
   `false` (probe; `test.mjs:643`), and break L5 is killed.
   `checkPrHolds` now gives a `UsageError` again, as it does on `main`.
4. **L2 (non-blocking): pinned.** The `linkTop` wrapper
   (`test.mjs:634-636`) kills L2 under both `TEMP` settings. L3 is kept.
5. **Test header (non-blocking): fixed** (`test.mjs:6-9`).

## Findings

No blocking finding.

1. **non-blocking. The file-symlink behaviour can be tested here, but has
   no test.**
   - Break **M5** survives under both `TEMP`s. M5 drops the `lstatSync`
     branch, so `physical()` again resolves a file link to its target
     (`post-record.mjs:261`).
   - The coordinator's note says a file symlink needs developer mode.
     This machine has it: `AllowDevelopmentWithoutDevLicense` is `0x1`.
     `symlinkSync(…, "file")` succeeds for this user, and my probes
     created one in both rounds.
   - I added four lines to a scratch copy of the link test. They create
     `real/reviews/ln.md` → `real/reviews/r.md` and skip if creation
     throws. Then, with the PR listing `reviews/r.md`, they assert that
     `checkPrHolds` on `link/reviews/ln.md` throws
     "reviews/ln.md is not one of…". Result: 30 of 30 pass on
     `c8070fd`, and the test goes red under M5 ("Missing expected
     exception").
   - Adding this would give the `lstatSync` branch the before-and-after
     proof that the other branches have.
2. **non-blocking. L1b survives, and in effect it is not a break.**
   - For a regular file, the second `.native` call resolves the whole
     path, as the builder says.
   - For a file link in an 8.3 directory, `c8070fd` still refuses: the
     PR's blob for a symlink is the link text, so it is not the file's
     content, and the check reports "differs from PR #N's head". L1b
     refuses too, as "not one of PR #N's files".
   - `defaultCommitted` gives the same result either way, because git
     accepts a short path (round 01's probe: "8.3 committed OK").
   - Only the message differs, so this survivor is acceptable.
3. **non-blocking. `isMain`'s switch to `.native` is harmless, but
   nothing requires it.**
   - Break **M6** puts the JavaScript `realpathSync` back on both sides
     of `isMain` (`post-record.mjs:406-409`). It survives.
   - Run as a program from an 8.3 path (`…\rv15\A-LONG~1\m6.mjs --help`),
     the M6 copy prints its usage, just as the head copy does. Node loads
     the main module through the same JavaScript realpath, so both sides
     match either way.
   - Keeping `.native` is fine. The claim that it is needed for 8.3
     paths is not borne out.
   - One untested risk applies to every `.native` call. It relies on
     `GetFinalPathNameByHandle`, and on a drive whose driver does not
     support that call, it throws where the JavaScript version would not.
     In `isMain`, that makes the tool exit 0 silently.
   - Subst and mapped network drives are also untested. The PR's
     "Left out" could name both.
4. **non-blocking, to fix before the merge. The PR body still describes
   round 01.**
   - Its breaks block still lists "L2 … SURVIVED" and has no L1b, L4 or
     L5.
   - "What was built" does not mention the `.native` resolution, the
     file-link branch, the missing-file handling or the `isMain` change.
   - The reason for keeping L3, which the coordinator's note places in
     the PR, is not there yet.
   - `PRINCIPLES.md` (*Pull requests*) requires the check output verbatim
     and the reviewed revision. Both need updating when this round is
     recorded.

## Verified

- **Checks at `c8070fd`:** `node --check tools/post-record.mjs` passes.
  `node --test tools/post-record.test.mjs` gives 30 tests, 30 pass,
  0 fail, both in the checkout and with the 8.3 `TEMP`.
- **Old tools against the new tests:**
  - `main`'s own test file (29 tests) passes against the new tool.
  - `main`'s tool fails the new link test.
  - `18c6946`'s tool fails it too, on the upper-case path.
- **Break sets, run on `c8070fd`:**
  - `mutate3.mjs`: every applicable break is killed. B1, N2, N3, N4, N9
    and N11 no longer match, as in round 01. N12 no longer matches
    either, because `isMain` was rewritten; my G5′ covers it.
  - `mutate4.mjs` (P1–P13): all killed.
  - `mutate5.mjs`: G1–G4 red. G5 no longer matches; G5′ covers it.
  - `mutate7.mjs`: L1 red. L2 and L3 no longer match; `mutate8` covers
    them.
  - Builder's `mutate8.mjs`, under both `TEMP`s: L1, L2, L4 and L5 red;
    L1b and L3 survive (finding 2 above; L3 as in round 01).
  - Mine (`rv15/mutate9.mjs`), under both `TEMP`s:
    - **G5′**, `isMain` by path, not realpath: red (the directory-link
      entry test).
    - **M5**, a file link resolved to its target: survives (finding 1).
    - **M6**, `isMain` with the JavaScript realpath: survives (finding 3).
    - **M7**, `physical()` throws on a missing file: survives. That is
      acceptable: `defaultCommitted`'s `try` still returns `false`, and
      the command line reads the file in `plan()` before `checkPrHolds`
      runs.
  - Every unbroken copy is green.
- **Probes on `c8070fd`** (`rv15/probe3.mjs`):
  - a direct path, an 8.3 path and an upper-case path: accepted;
  - a missing file: `UsageError`, and `committed` is `false`;
  - a file symlink: refused in both cases, as on `main`.
- **Entry point:** `node C:\Users\diego\projects\HARNES~1\tools\post-record.mjs --help`,
  and the same call with a changed-case path, both print the usage.
- **Cleanup:** after every run, `%TEMP%` held only the two `post-record-*`
  directories from 2026-09-23, and the 8.3 `TEMP` directory was empty. I
  removed one stray file of mine (`%TEMP%\rv15c.txt`, from a `gh` output
  redirect). The checkout is clean apart from this file.

— Claude Opus 5.5 (claude-opus-5-5), reviewer
No blocking finding remains.
