# Review: tools/post-record.mjs (r5, C2), implementation round 02

**Revision reviewed:** `4df5e32b71cee1eb6cc334f4d14b6bef3f200b3e`
(`4df5e32`, branch `r5/post-record`). Three sources agree on this SHA: PR
#15's `headRefOid` (`gh pr view 15 --json headRefOid,files`),
`git ls-remote origin refs/heads/r5/post-record`, and `git rev-parse HEAD`.
The working tree was clean. The coordinator's first message named
`fd2c9b4`, which is not a real SHA; its correction named `4df5e32`, and the
three sources above agree with the correction.

**Files checked:** PR #15's file list is
`reviews/010-post-record-impl-01.md` (+237), `tools/post-record.mjs` (+339)
and `tools/post-record.test.mjs` (+416). It equals the local diff:
`git merge-base origin/main HEAD` = `f06789a` (still `origin/main`), then
`git diff --name-only f06789a..4df5e32`. The changes since round 01 are
`68227d9`, which records round 01, and `4df5e32`, which answers it.

**Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`), continuing the round-01
session and re-reading the current revision.

**Mode:** Claude. No design stage, no marker. This is round 02.

**Method:** I posted nothing. The only `gh` commands I ran were read-only
(`pr view`, `issue view`). The tool ran against real `gh` only as a dry
run. Every `--confirm` path ran with a fake `gh` passed to
`run(argv, { gh })`. Mutation runs used a copy of the two files in the
session scratch directory.

## Round-01 findings

- **1 (blocking), the tests: fixed.** There are 20 tests now, and all 20
  pass. `FakeGitHub` stores bodies by id, reads each body from its
  `--body-file`, rejects `--body`, and serves only the id asked for
  (`tools/post-record.test.mjs:46-101`). `--confirm` is exercised for
  `review`, `design` (new issue, and `--issue`), `milestone` and
  `reply --issue`, plus a mangled read-back, an unexpected URL and the
  duplicate check (`:245-371`). Design body files are compared byte for
  byte after rejoining, for LF and CRLF, with no BOM (`:135-153`).
  I re-ported my 18 round-01 breaks to the new code and added 12 of my own:
  - 25 are killed, each by the test written for it;
  - 5 survive, listed in finding 4 below. None of them touches C2's core
    promises (`--body-file`, byte identity, no BOM, read-back by id, the
    target thread, the duplicate check).

  Every break was confirmed applied (the file differs from the original and
  `node --check` passes), and the unmutated copy was green.
- **2, the split and the title: fixed for the cases raised.** Only
  `## Review — ` starts a verdict (`tools/post-record.mjs:40`). Fenced
  lines are skipped for both the split and the title (`:106-150`). The
  fence detection has new edge cases, in finding 2 below.
- **3, options a kind does not take: fixed.** `KINDS` lists each kind's
  options, and anything else is an error (`:32-37`, `:166-169`). For
  example, `design --pr 16` is refused (`test.mjs:206-217`).
- **4, retry after a created issue: partly fixed.** A read-back
  *mismatch* now says to rerun with `--issue N` (`:297-300`). A read-back
  that *fails*, or a failed verdict post after the issue exists, still
  gives no hint. See finding 5.
- **5, the old issues #5–#8: not addressed.** The builder's reason is that
  they were posted before the tool existed, and `--issue` against them is
  not a supported use. I accept that. The usage text could say it.
- **6, running through a junction: fixed.** `isMain` compares real paths
  (`:322-329`). Through a junction, `--help` prints 20 lines and exits 0,
  and `bogus` fails with the usage error and exit 1. Round 01 got silence
  and exit 0 for both.
- **7, the dry-run quoting: fixed for titles.** A title with `'`, `$`
  and backticks is now printed as `` 'it'\''s $HOME `x`' ``. Paths are not
  fixed; see finding 3.
- **8, the committed check: added, but it does not do what it says.** See
  finding 1.

## Findings

1. **blocking. The `--confirm` guard checks "committed", not "what the
   PR holds", so any committed file can still be posted as a review of
   any PR. That is how `README.md` reached PR #15.** The tool's header
   says it posts a review "only when it is committed and unmodified (so the
   PR holds what is posted)" (`tools/post-record.mjs:13-14`). The refusal
   message says the same thing (`:285-288`). But `defaultCommitted` asks
   only whether the file is tracked and unchanged against the **local
   `HEAD`** (`:242-256`). It never looks at PR `N`. It passes:
   - a file that is not part of the PR (`README.md`);
   - a commit that was never pushed;
   - a checkout of another branch.

   C1's proof compares each comment with "the file as the PR's head holds
   it" (`BACKLOG.md:74-75`), and C2's read-back is measured the same way
   (`:84-85`). So the parenthesis in the header is a promise the code does
   not keep.
   *Reproduction:*
   - `defaultCommitted("README.md")` returns `true`, as do
     `tools/scaffold.mjs`, `reviews/009-…-04.md` and `design/002-….md`;
   - `run(["review","README.md","--pr","15","--confirm"])`, with the real
     committed check and a fake `gh` that stops at the first posting call,
     reaches `pr view 15` and then `pr comment 15`;
   - `gh pr view 15 --json files` lists only `reviews/010-post-record-impl-01.md`,
     `tools/post-record.mjs` and `tools/post-record.test.mjs`.

   The minimized comment on PR #15 (`#issuecomment-5801312831`, reason
   `off-topic`) and the implementer's note (`#issuecomment-5802078555`)
   show it happened.
   **Fix (in the tool):** for `review --pr N`:
   1. read `gh pr view N --json headRefOid,files`, which is read-only;
   2. require the file's repository path to be among the PR's files;
   3. require `git show <headRefOid>:<path>` to equal the file, line endings
      aside.

   That enforces C1 exactly. It also refuses `README.md`, an unpushed
   edit, and the wrong branch. Keep `defaultCommitted` for `design`, which
   has no PR. Test it by having `FakeGitHub` answer
   `pr view --json headRefOid,files`, backed by the scratch repository
   already used at `test.mjs:393-410`.
   **On the process:** the incident began with testing a posting tool's
   `--confirm` path against a real thread. C10's rule, as scoped,
   covers only a review running the code under review
   (`BACKLOG.md:134-138`). A builder testing their own tool is not
   covered. Whether that rule should also cover a builder testing a
   posting or creating path against real GitHub is the owner's decision,
   for the C10 change; it is not part of this PR.

2. **non-blocking. The fence detection is not CommonMark's, and when it
   is wrong the verdicts silently become part of the issue body.**
   `FENCE = /^(```|~~~)/` (`:41`) opens and closes on any fence line. It
   does not match the fence character or length, and does not allow the
   0–3 spaces of indentation CommonMark allows. The span includes the
   newline that ends the closing line (`:115`, `i <= b` at `:122`).
   *Reproduction* (`splitDesign`):
   - a ```` ``` ```` block holding a `~~~` line, followed by a real verdict,
     gives **0 verdicts**: `~~~` closes the block, the next ```` ``` ````
     opens one that never closes, and the verdict ends up in the issue
     body;
   - `---` directly after a closing fence (no blank line) followed by a
     verdict gives **0 verdicts**;
   - a fence indented 3 spaces is not recognised, so a `## Review — ` inside
     it is split out as a verdict.

   All four real design records still split into 3 verdicts each and
   rebuild exactly. Suggest CommonMark's closing rule (the same character,
   at least as long, up to 3 spaces of indentation). Also suggest a refusal
   when the number of line-initial `## Review — ` headings outside fences
   differs from the verdicts found, so a wrong split fails loudly rather
   than posting.

3. **non-blocking. The "POSIX-quoted" dry-run command leaves backslashes
   unquoted, so the printed Windows paths break when pasted into bash.**
   `\\` is in the safe set (`:261`), so `C:\Users\…\x.body.md` is printed
   bare. *Reproduction:* `bash -c 'printf "%s\n" C:\Users\diego\x.body.md'`
   prints `C:Usersdiegox.body.md`. Removing `\\` from the safe set quotes
   such paths. Posting is unaffected. No test covers `show()` (break N11
   survives).

4. **non-blocking. Five breaks still survive with all 20 tests green:**
   - B16: `sameBody` also ignores trailing spaces on each line (`:154`);
   - B17: `--title` is ignored for `milestone` (`:211`);
   - N10: `defaultCommitted` diffs against the index rather than `HEAD`
     (`:249`), so a **staged, uncommitted** edit passes. The scratch-repo
     test covers an unstaged edit and an untracked file only;
   - N11: `show()` never quotes (`:259-263`);
   - N12: `isMain` compares by path instead of real path (`:322-329`).

   N10 is the one worth a test. If finding 1 is fixed by comparing with
   the PR head, the review path no longer depends on it, but `design`
   still does.

5. **non-blocking. The `--issue N` hint covers only a mismatch.** If `gh
   issue view` itself fails (`:296`), or a verdict post fails after the
   issue exists, the error names no rerun, and repeating the same command
   creates a second issue. *Reproduction:* the round-01 retry simulation,
   rerun on `4df5e32` with `committed: () => true`, gives: design retry
   **issues 100 and 101**; milestone run twice **2 issues**; review retry
   **1 comment** (correct); `--issue 100` posts only the missing verdict,
   and a second run posts nothing (correct). Suggest wrapping everything
   after issue creation so that any error names the issue number and the
   `--issue` rerun.

## Verified

- **Checks:** `node --check tools/post-record.mjs` passes, and
  `node --test tools/post-record.test.mjs` gives 20 tests, 20 pass, 0 fail
  (Node v24.21.0).
- **Dry runs reach neither `gh` nor the committed check.** `run` returns
  before either (`:280-284`), and the dry-run test passes `gh: NEVER,
  committed: NEVER` for all five shapes (`test.mjs:221-241`). From the
  CLI, the dry runs for `review`, `design`, `design --issue`,
  `reply --issue` and `milestone` exit 0 with `gh` removed from `PATH`
  (spawning `gh` gives `ENOENT` under that `PATH`).
- **The tests cannot reach `gh`.** Every `run` call passes `gh:` (either
  `NEVER` or `FakeGitHub`, through `confirm()` at `test.mjs:103-105`). The
  one real process a test spawns is `git`, inside a `mkdtemp` directory
  (`:393-410`).
- **Round 01 on PR #15:** its comment (`#issuecomment-5801272781`) equals
  `reviews/010-post-record-impl-01.md` at `4df5e32`, line endings and
  trailing newlines aside. It was posted at 19:15:14Z, after `68227d9`
  (19:15:07Z) and before `4df5e32` (20:05:59Z).
- **Line endings:** this commit has LF in the working tree for all three
  files (`git ls-files --eol`: `i/lf w/lf`). The CRLF paths are still
  covered by the tests with CRLF input (`test.mjs:123-153`, `:184-193`,
  `:262-282`). `defaultCommitted` returns `true` for a CRLF working-tree
  file (`tools/scaffold.mjs`, `w/crlf`), because `git diff` normalises
  line endings.
- **The comment URL** must now name the target thread
  (`/(?:pull|issues)\/N#issuecomment-/`, `:312-314`). Breaks N1 and B7 are
  killed.

— Claude Opus 5.5 (claude-opus-5-5), reviewer
One blocking finding remains (finding 1: the confirm guard checks the local commit, not the file as PR N's head holds it).
