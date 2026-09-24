# Review: a checkout reached through a directory link (r5, C2 extended again), implementation round 01

**Revision reviewed:** `18c6946471f0884d86a7ff3959e007b8c1a7c0ff`
(`18c6946`, branch `r5/post-record-links`). Three sources agree on this
SHA: PR #20's `headRefOid` (`gh pr view 20 --json headRefOid,files`),
`git ls-remote origin r5/post-record-links`, and `git rev-parse HEAD`. The
working tree was clean.

**Files checked:** PR #20's file list is `tools/post-record.mjs` (+18, −9)
and `tools/post-record.test.mjs` (+32, −0). It equals the local diff:
`git merge-base HEAD origin/main` = `6540a4b` (also `main` and
`origin/main`), then `git diff --name-only 6540a4b HEAD`. One commit,
`18c6946`.

**Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`), a fresh-context session
that has not seen the implementation.

**Mode:** Claude. No design stage, no marker.

**Method:** read-only in the repository and on GitHub. The only `gh` calls
were `pr view`. I did not run the tool with `--confirm` against GitHub. All
breaks and probes ran on copies of the blobs at `18c6946` and `6540a4b`
(`git show`), in `…/scratchpad/rv15/`. Every break script was written as a
file and passed its paths as plain arguments. Each script checks that its
pattern matched exactly once and that the written file differs from the
source.

## The aim: C2's second extension

`BACKLOG.md` C2, "Extended again on 2026-09-24": *a test with real `git` in a
repository reached through a directory junction or symlink passes the PR
check.* **Met on this machine.**

- `test.mjs:606-633` builds a real repository at `<tmp>/real`, commits
  `reviews/r.md`, links `<tmp>/link` to it (`:622`), and calls
  `checkPrHolds` with real `git` (`:628`) and `defaultCommitted` (`:629`) on
  the path through the link.
- **It fails before the fix.** With `main`'s tool (`6540a4b`) and the new
  test file, the new test is the only red one, with
  `../link/reviews/r.md is not one of PR #15's files; post only what the PR holds`.
  That matches the PR body word for word.
- **It passes after the fix:** 30 of 30.
- **It cleans up.** It writes only `real/` and `link/` inside its own
  `mkdtemp` directory, and `git config` is local to that repository. The
  junction and its target are both inside the directory that `s.done()`
  removes. `%TEMP%` held the same two `post-record-*` directories, dated
  2026-09-23, before and after every run. No `rv15probe-*` was left either.

## Findings

1. **blocking. The fix does not match what `git` says on Windows, so the
   new test goes red where `%TEMP%` is an 8.3 short path.**
   - `physical()` uses the JavaScript `realpathSync`
     (`post-record.mjs:254-255`). On Windows, that function resolves
     junctions and symlinks, but it keeps 8.3 short names and the case the
     caller typed.
   - Git for Windows reports the long, on-disk name. In a scratch
     repository at `…\a-long-directory-name`, addressed as `…\A-LONG~1`,
     `git rev-parse --show-toplevel` returns the long form. `checkPrHolds`
     at `18c6946` then refuses the file:
     `../../RV15PR~1/A-LONG~1/reviews/r.md is not one of PR #1's files`.
     A path typed in upper case is refused the same way (`REVIEWS/R.MD`).
     `main` behaves identically, so the tool's refusal is not new.
   - **The new test is new, though, and it depends on this.** I set `TEMP`
     and `TMP` to the short form of a long directory
     (`…\C-9DFF~1\D7177D~1\SCRATC~1\rv15\TEMP-W~1`) and ran the suite at
     `18c6946`. The new test is red, with 29 passing:
     `../../../../../../../C-9DFF~1/…/real/reviews/r.md is not one of PR #15's files`.
     Windows often sets `%TEMP%` to a short path, for example when the
     profile folder name has a space or is longer than eight characters.
     On such a machine this gate is red for anyone who adopts the harness.
   - This is the same defect class that C2's extension fixes: the tool
     keeps a path that `git` has resolved differently. The comment at
     `:251-253` says the path is resolved "before it is compared with what
     git says". On Windows it is not resolved the way `git` resolves it.
   - **Suggested fix (verified):** use `realpathSync.native` in `physical()`
     and at `:295`. It resolves the path the way the OS does
     (`GetFinalPathNameByHandle` on Windows, `realpath(3)` on POSIX), and
     on this machine it gives the same form `git` reports. With that
     change:
     - all 30 tests pass, both normally and with the 8.3 `TEMP`;
     - the 8.3 path and the upper-case path are both accepted;
     - L1 is still red.

     I did not test subst or mapped drives. Adding them to the PR's
     "Left out" list would be enough. Optionally, on Windows, the test
     could also reach the file by its short name when one exists.
   - If the builder disagrees, this goes to the owner, as `CLAUDE.md` says.
2. **non-blocking. A file that is itself a symlink is now checked as its
   target.** `physical()` resolves the last path component too. I made a
   file symlink `reviews/ln.md` → `reviews/other.md` (untracked, in a
   scratch repository):
   - at `18c6946`, a PR that lists `reviews/other.md` **accepts**
     `ln.md`. A PR that lists `reviews/ln.md` refuses it with
     "`reviews/other.md` is not one of PR #1's files", which names a file
     the user did not give.
   - at `main`, both cases are refused.

   The posted body is still a body the PR holds at its head, so C1's
   invariant stands. What should happen is that the file the user names is
   checked under its own name. Resolving only the directory does that:
   `path.join(realpathSync(path.dirname(path.resolve(file))), path.basename(file))`.
   It passes all 30 tests (break M4 below), and git then shows the symlink
   blob, which differs from the file's content, so the check fails safe.
   Review records are never symlinks in practice, so I leave this to the
   builder's judgement. It could also be recorded as left out.
3. **non-blocking. A missing file now throws a raw `ENOENT`.**
   - `defaultCommitted` calls `physical()` outside its `try`
     (`post-record.mjs:260`), so a missing file throws
     `ENOENT … lstat '<path>'` instead of returning `false`.
   - `checkPrHolds` throws the same, where `main` gave a `UsageError`.
   - Neither is reachable through the command line: `plan()` reads the
     file first (`:180`, `readSource`), and it already fails with a raw
     `ENOENT` that names the path.

   The message is clear enough. The contract "True when the file is
   tracked…" (`:258`) no longer holds for a missing file, though. Moving
   the call inside the `try` would restore it.
4. **non-blocking. L2 and L3: the survivor claim holds. Both changes are
   harmless. L2 can be pinned cheaply.**
   - **The claim.** `mutate7.mjs` on `18c6946` gives L1 red, L2 SURVIVED
     and L3 SURVIVED, each confirmed to have landed. I checked why:
     - Git for Windows returns the physical top level through a junction.
       It does so even with `GIT_WORK_TREE` set to the link path, or with
       `core.worktree` set to it.
     - `git ls-files --error-unmatch` and `git diff --quiet HEAD` accept a
       pathspec through the junction.
     - So on this platform, neither resolution changes anything.
   - **L2 is harmless.** `realpathSync` of an existing directory only
     normalises the slashes here. A git that printed an MSYS-style path
     would make it throw `ENOENT`, where without it the result would be a
     `UsageError`. Both refuse the file.
   - **L2 can be pinned.** I added two lines to a scratch copy of the new
     test: a `git` wrapper that reports the link path for
     `rev-parse --show-toplevel` and delegates everything else to real
     `git`, plus a second `checkPrHolds` call with it. The copy passes
     30 of 30, and with L2 applied the new test goes red. I recommend
     keeping L2 and adding that wrapper.
   - **L3 is harmless**, apart from finding 3's missing-file case. It
     cannot be simulated without a fake `git` executable on `PATH`,
     because `defaultCommitted` does not take a `git` argument. Keep it
     for symmetry, with a comment or a PR note saying it has no test on
     this platform. The PR body already says so.
5. **non-blocking, carried over.** The test file's header
   (`test.mjs:6-7`) still says that one test runs `git`. Two now do, and
   the junction test also runs `node`. Round 013's finding 4 already noted
   this, and it is in the out-of-r5 follow-ups. I mention it only because
   this change adds a second real-`git` test.

## Verified

- **Checks at `18c6946`:** `node --check tools/post-record.mjs` passes, and
  `node --test tools/post-record.test.mjs` gives 30 tests, 30 pass, 0 fail,
  in the checkout and in the scratch copy. `main`'s own test file gives
  29 of 29 against the new tool, so no existing assertion changed meaning.
- **Before and after:** `main`'s tool with the new test has 29 passing and
  1 failing (the new test, with the message quoted above). The head tool
  passes 30 of 30.
- **Earlier break sets, rerun on `18c6946`:**
  - `mutate3.mjs`: every applicable break is killed. B1, N2, N3, N4, N9 and
    N11 no longer match. `mutate4`'s P-set covers B1, N2, N3 and N9 (P8,
    P5, P6, P7). P13 and G2 cover N11. My N4′ covers N4.
  - `mutate4.mjs` (P1–P13): all killed.
  - `mutate5.mjs` (G1–G5): all red. G1 now also turns the new test red.
  - `mutate7.mjs` (L1–L3): L1 red; L2 and L3 survive (finding 4).
  - Each unbroken copy is green.
- **My breaks** (`rv15/mutate8.mjs`, each confirmed to have landed):
  - **N4′**, the new code's `diff --quiet HEAD` call removed: red (the
    committed-check test).
  - **M3**, `rel` computed from the link path while git runs from the real
    directory: red (the new test).
  - **M2**, git run from the link directory while `rel` uses the real
    path: survives, and is harmless here because git accepts the link.
  - **M4**, the directory-only alternative from finding 2: survives,
    because it is not a break.
- **Probes** (`rv15/probe*.mjs`), run on both `main` and `18c6946`: a
  direct path; an 8.3 path; an upper-case path; a missing file; and a file
  symlink, which this machine can create. The results are in findings 1–3.
  The `realpathSync.native` variant (`rv15/native/`) accepts both the 8.3
  path and the upper-case path.
- **Other path comparisons in the tool:** only `isMain` (`:397`), which
  resolves both sides with the same function. Nothing else compares paths.
- **The PR body:** its test list and count (30), the failure message before
  the fix, and L1–L3's outcomes all match my runs.

— Claude Opus 5.5 (claude-opus-5-5), reviewer
One blocking finding remains (finding 1: on Windows, resolve the path with `realpathSync.native` so it matches git, including 8.3 short names).
