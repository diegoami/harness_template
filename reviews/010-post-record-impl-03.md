# Review: tools/post-record.mjs (r5, C2), implementation round 03

**Revision reviewed:** `2c505bfce8dd46d67cfb5dfbb03af08507adb0c8`
(`2c505bf`, branch `r5/post-record`). Three sources agree on this SHA: PR
#15's `headRefOid` (`gh pr view 15 --json headRefOid,files`),
`git ls-remote origin refs/heads/r5/post-record`, and `git rev-parse HEAD`.
The working tree was clean.

**Files checked:** PR #15's file list is
`reviews/010-post-record-impl-01.md` (+237), `reviews/010-post-record-impl-02.md`
(+205), `tools/post-record.mjs` (+394) and `tools/post-record.test.mjs`
(+519). It equals the local diff: `git merge-base origin/main HEAD` =
`f06789a` (still `origin/main`), then `git diff --name-only f06789a..2c505bf`.
Two commits are new since round 02: `a2134a3` records round 02, and
`2c505bf` answers it.

**Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`), continuing the session of
rounds 01–02 and re-reading the current revision.

**Mode:** Claude. No design stage, no marker. This is round 03, the
ceiling round: if it does not end clean, it goes to the owner.

**Method:**
- I posted nothing, and ran no `gh` command that creates, comments, edits
  or deletes.
- Against the real PR #15, `run(… --confirm)` ran with a guard. The guard
  passes only `gh … view` calls to the real `gh` and throws on anything
  else. It was paired with the real `git`.
- Mutation runs and the throwaway clones stayed in the session scratch
  directory.

## Round-02 findings

- **1 (blocking), the guard checked the local commit and not the PR: fixed.**
  `review --pr N --confirm` now runs `checkPrHolds`
  (`tools/post-record.mjs:278-297`, called at `:331-332`). It reads
  `gh pr view N --json headRefOid,files`, requires the file's repository
  path to be one of the PR's files, and compares the file with
  `git show <headRefOid>:<path>`, line endings aside. I reproduced it with
  the real `gh` (read-only) and the real `git`:
  - `reviews/010-post-record-impl-02.md` and `-01.md` pass the check, and
    both stop at "already on pr #15", so nothing would be posted;
  - `README.md` is **refused** ("is not one of PR #15's files"), and so is
    `reviews/009-r5-scope-impl-04.md`;
  - these also pass: the path given as `../reviews/…` from `tools/`, and a
    lowercase absolute Windows path;
  - in a scratch clone with a local edit to the round-02 file, it is
    **refused** ("differs from PR #15's head 2c505bf; push it first");
  - in a scratch `file://` clone of `main` only, where
    `git cat-file -t 2c505bf` fails, it is **refused** ("is not in this
    clone; git fetch, then retry");
  - a file outside any repository is refused, by `git rev-parse` failing.

  The tests cover not in the PR, stale, unfetched, and a CRLF head
  (`test.mjs:440-482`). Breaks P1–P4 and my Q5, Q6 and Q9 (a `git show`
  failure passes; a byte-exact head comparison; the check skipped) are
  killed by that test.
- **2, fences: fixed.** The code follows CommonMark:
  - a fence may be indented up to 3 spaces (`:41`);
  - only the same character, at least as long, with nothing after it,
    closes a fence (`:119-124`);
  - the span stops before the closing line's ending, so a verdict right
    after a fence still splits.

  Each case is tested for LF and CRLF (`test.mjs:210-221`). All four real
  design records still split into 3 verdicts each and rebuild exactly.
- **3, backslashes in printed paths: fixed.** `\` is out of the safe set
  (`:302`). The dry run now prints
  `--body-file '<scratch>\dry3\README.body.md'`.
- **4, surviving breaks: fixed**, except N12 (see below). B16, B17 and N10
  (a staged edit) are now killed.
- **5, the `--issue` hint: fixed.** Every failure after an issue exists
  gets "issue #N exists, so rerun with --issue N" (`:338-345`). A
  verdict-post failure is tested (`test.mjs:385-401`), and my Q8
  (the hint only for a mismatch) is killed.

## Findings

No blocking finding. The three below are test gaps: the code is right in
each case, but a later change could break it without any test going red.

1. **non-blocking. The tests never exercise the repository-path
   computation, so on Windows the tool could refuse every review and
   still pass.** `FakeGitHub.git` answers `rev-parse` with the file's own
   directory (`test.mjs:59-71`), so the repository path is always a bare
   file name. Break Q2 **survives**: it removes
   `.split(path.sep).join("/")` (`:281`), which would turn
   `reviews/010-…` into `reviews\010-…`, a path no PR file matches. The
   real-`git` runs above show the unbroken code is right on this Windows
   clone. Suggest putting the file in a subdirectory of the scratch
   repository that `test.mjs:493-512` already builds.
2. **non-blocking. Three more breaks survive, all on lines the tests do
   not reach:**
   - Q1: `\` alone put back into the safe set survives. The dry-run test's
     path contains a space, so it is quoted either way (`test.mjs:282-286`).
     That test covers the space case, not the backslash case.
   - Q3: a closer that carries an info string (`` ```text ``) also closes
     (`:123`).
   - Q7: `checkPrHolds` hard-coded to PR 15 (`:282`), because every
     fixture uses PR 15.
3. **non-blocking. A symlinked entry point is untested (N12).** The builder
   records this as a known gap: creating a symlink on Windows needs admin
   rights. A directory junction does not, and it shows the behaviour:
   round 02 ran the tool through one and got output and exit codes.

**On the process question** (a builder testing a posting tool against a
real thread): I recommend that the C10 change also cover the builder.
A posting or creating path is exercised only against fakes, a scratch
repository, or a dry run. A `--confirm` run against a real issue or PR
counts as posting and is made only for the real record. The tool now
blocks the specific slip on PR #15, but a `reply` or `milestone` has no
repository check by design, so the tool alone cannot prevent it. This is
the owner's decision for C10, not a condition on this PR.

## Verified

- **Checks:** `node --check tools/post-record.mjs` passes, and
  `node --test tools/post-record.test.mjs` gives 23 tests, 23 pass, 0 fail.
- **Mutation runs:**
  - mutate3: every applicable break is killed except N12. B1, N2, N3, N9
    and N11 no longer apply to the rewritten lines, and mutate4's P-set
    covers those lines.
  - mutate4 (the builder's, P1–P13): all killed.
  - my mutate5 (Q1–Q9): Q4, Q5, Q6, Q8 and Q9 killed; Q1, Q2, Q3 and Q7
    survive (findings 1–2).
  - For each break, I confirmed that it landed and that `node --check`
    passed, and the unbroken copy was green.
- **Dry runs never reach `gh`.** With `gh` removed from `PATH`, dry runs of
  `review` (the PR check runs only with `--confirm`), `design`,
  `reply --issue` and `milestone` exit 0. The dry-run test still passes
  `gh: NEVER, committed: NEVER`.
- **The tests cannot reach `gh`.** Every `run` call gets a fake `gh` and a
  fake `git`; a bare `gh` function gets `git: NEVER` (`test.mjs:126-131`).
  The one real process a test spawns is `git`, in a `mkdtemp` repository.
- **Round 02 on PR #15:** its comment (`#issuecomment-5802159309`, posted
  20:11:27Z) equals `reviews/010-post-record-impl-02.md` at `2c505bf`,
  line endings aside. It was posted after `a2134a3` (20:11:21Z) and before
  `2c505bf` (20:15:19Z), and the file has not changed since `a2134a3`.
  Round 01 (`#issuecomment-5801272781`) was verified in round 02.
- **Note:** `gh pr view --json files` may list at most 100 files. A review
  in a larger PR could then be refused. That fails safe, and it does not
  affect this repository's PRs.

— Claude Opus 5.5 (claude-opus-5-5), reviewer
No blocking finding remains.
