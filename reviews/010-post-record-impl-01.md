# Review: tools/post-record.mjs (r5, C2), implementation round 01

**Revision reviewed:** `237eb31035f9cecb406add50bf279f351cc576fb`
(`237eb31`, branch `r5/post-record`). Three sources agree on this SHA: PR
#15's `headRefOid` (`gh pr view 15 --json headRefOid,files`),
`git ls-remote origin refs/heads/r5/post-record`, and `git rev-parse HEAD`.
The working tree was clean.

**Files checked:** PR #15's file list is `tools/post-record.mjs` (+254,
added) and `tools/post-record.test.mjs` (+218, added). It equals the local
diff: `git merge-base origin/main HEAD` = `f06789a` (which is also
`origin/main`), then `git diff --name-only f06789a..237eb31`.

**Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`), a new session that has
not seen the implementation.

**Mode:** Claude. No design stage, no marker. This is round 01.

**Measured against:** C2 (`BACKLOG.md:77-85`) and the brief. The tool posts
a review file on a PR, a design record as an issue plus one comment per
verdict, a milestone issue, and a reply, each through `gh … --body-file`.
It is a dry run unless given `--confirm`. With `--confirm` it reads each
body back, fails on a mismatch, and skips a body already on the thread.

**Method:** everything below ran on `237eb31`. Nothing was posted. No `gh`
command that creates, comments, edits or deletes was run, and the tool was
never run against real `gh` with `--confirm`. The `--confirm` paths were run
with an in-memory fake `gh` passed through `run(argv, { gh })`. Mutation
runs used a copy of the two files in the session scratch directory, never
the repository.

## Findings

1. **blocking. The tests leave most of the posting surface unasserted, and
   11 of 19 deliberate breaks survive.** Every `--confirm` test uses the
   `review` kind (`tools/post-record.test.mjs:159-212`). No test runs
   `design`, `milestone` or `reply --issue` with `--confirm`. No test
   compares a design piece's body file with its source bytes; the byte and
   BOM checks cover only `review` and `reply`
   (`tools/post-record.test.mjs:32-60`). The fake's `api` branch returns
   the stored body whatever comment id is asked for
   (`tools/post-record.test.mjs:170`). I applied each break alone to a
   scratch copy. I checked that it applied (the file differs from the
   original and `node --check` passes), ran `node --test` on the copy, and
   finally confirmed that the unmutated copy is green. These breaks
   **survive, with all 12 tests green**:
   - B1: the read-back of a created issue is removed (`if (!sameBody(back, a.text))` becomes `if (false)`, `post-record.mjs:224`);
   - B2: verdicts are not retargeted to the new issue (line 229 removed), so they would go to `{issue}`;
   - B3: the design issue body file is written **with a byte-order mark** (line 166). This is the exact defect C2 was written against (`BACKLOG.md:166-168`);
   - B4 and B4b: the design verdict or issue body file has its CRLF turned into LF (lines 166, 177), so it is no longer byte-identical;
   - B5: the design issue is created with `--body <text>` instead of `--body-file` (line 172);
   - B6: the duplicate check always reads the PR thread (`gh pr view`), even for an issue (line 200);
   - B7: the comment-URL regex accepts only `/pull/N#issuecomment-`, which breaks every `gh issue comment` (line 235);
   - B8: `--issue` is ignored and a new issue is always created (line 164);
   - B9 and B10: the `--pr`/`--issue` number check and the "exactly one of" check for `reply` are removed (lines 64-67, 147);
   - B15: an unparseable `gh issue create` output is accepted (line 221);
   - B16: `sameBody` also ignores trailing spaces on every line (line 110);
   - B17: `--title` is ignored for `milestone` (line 152);
   - B18: the read-back fetches a fixed comment id (`issues/comments/1`) instead of the one just posted (line 238).

   These are **killed:** the dry run falling through to posting ("without
   --confirm nothing is posted"), the CRLF separator losing `\r?` (the CRLF
   split test), the duplicate check removed, and a BOM accepted in the
   source.

   The implementation of these paths is correct as written; the
   reproductions under findings 4 and 5 and "Verified" exercise them. But
   C2 promises that design records and milestone issues are posted byte for
   byte and read back, and nothing in the gate would catch a regression
   there. Discipline 6 asks what a passing check would have caught. For the
   issue-creating half of the tool, and for the BOM in a design body, the
   answer is nothing. **Fix:** add `--confirm` tests with a stateful fake
   (one that stores bodies by issue and comment id and returns only the
   requested one) for `design` without `--issue` (issue created, read back,
   verdicts on *that* number), for `design --issue N` (only missing
   verdicts posted), for `milestone`, and for `reply --issue`, using the
   `issues/N#issuecomment-` URL form. Add a byte-identity and no-BOM check
   on every design body file, for LF and CRLF sources. Add
   argument-validation tests for B9 and B10. Rerun the breaks above and
   show each one red.
   *Reproduction:* the mutation script
   (`scratchpad/mutate2.mjs <repo>/tools/post-record.mjs <scratch>/mut`)
   prints `SURVIVED (tests green)` for each break listed above.

2. **non-blocking. The verdict split and the title are taken from lines
   inside code fences, and from any heading that begins "## Review".**
   `VERDICT_SEPARATOR = /(\r?\n---\r?\n\r?\n)(?=## Review)/`
   (`tools/post-record.mjs:24`) is not fence-aware. It also matches
   `## Review plan` or `## Reviewer notes` after a horizontal rule.
   `firstHeading` (`:102-106`) takes the first `# ` line anywhere, including
   a shell comment inside a fenced block. *Reproduction* (dry runs, `--out`
   in scratch):
   - a record whose body has `---`, a blank line and `## Review plan` gets
     two "verdict" comments where there is one verdict;
   - a record with a fenced example that contains a `---` rule followed by
     `## Review — design stage` is split inside the fence;
   - `milestone fence.md`, whose first lines are a ```` ```sh ```` block
     holding `# not a title`, plans `gh issue create --title "not a title"`.

   All four real design records split correctly: 3 verdicts each, equal to
   their `## Review` headings, and the pieces rebuild the file exactly. So
   this is a robustness gap, not a present defect. Suggest skipping fenced
   blocks and anchoring on `## Review — `, the verdict heading's form in
   every record.

3. **non-blocking. Options that do not apply to a kind are silently
   ignored.** `parseArgs` accepts `--pr`, `--issue` and `--title` for every
   kind (`tools/post-record.mjs:56-58`), and each kind reads only its own
   (`:143-180`).
   - `design x.md --pr 16` plans a **new issue**, where the author probably
     meant `--issue 16`; with `--confirm` that is a duplicate public issue.
   - `milestone x.md --issue 3 --pr 4` and `review x.md --pr 3 --issue 9
     --title T` run without complaint.
   - `--title --confirm` takes `--confirm` as the title and so stays a dry
     run. That is harmless, but it is also unreported.

   *Reproduction:* the dry runs above, exit 0 in each case. Suggest
   rejecting any option the kind does not use.

4. **non-blocking. Issue creation is not idempotent: a retry after a
   failure past `gh issue create` makes a second issue.** The duplicate
   check covers comments only (`tools/post-record.mjs:230`). For `design`
   without `--issue`, and for `milestone`, a rerun of the same command after
   the issue was created creates another (`:218-222`). The recovery for a
   design record, `--issue N`, works, but nothing says so. If the issue
   read-back fails, `posted <url>` has not been printed yet (`:226`), and
   the error only names the issue inside `gh`'s own "Command failed" text.
   For comments the retry is safe. *Reproduction* (`scratchpad/retry.mjs`,
   a stateful fake GitHub whose first read-back throws):
   - `review … --confirm` fails on the read-back, and the rerun reports the
     body as already on the PR: **1 comment**;
   - `design … --confirm` fails on the issue read-back, and the rerun
     creates **issue #101 beside #100**, leaving #100 without its verdict;
   - `design … --issue 100 --confirm` posts the one missing verdict, and a
     second run posts nothing;
   - `milestone` run twice gives **2 issues**.

   Suggest that any failure after an issue exists names it and prints the
   `--issue <n>` rerun command.

5. **non-blocking. `--issue` does not recognise verdicts posted under the
   old split, so on the backfilled issues it would post duplicates.**
   Comments on #5–#8 end with the separator (`\n\n---`) that this tool puts
   *before* the next verdict. `sameBody` (`:108-112`) is exact apart from
   line endings. *Reproduction* (read-only `gh issue view N --json
   comments`, compared with `splitDesign` and `sameBody`): for each of
   `design/001…004` against #6, #7, #8 and #5, `--issue` would post **2 of
   3 verdicts again**. A run with a fake `gh` that passes through only the
   read-only `issue view … comments` call stops at "would post: gh issue
   comment 6 …verdict-1.body.md". No r5 run posts to those issues, and
   Claude mode writes no design records, so this is a note for the usage
   text: `--issue` is for issues this tool opened.

6. **non-blocking. Run through a symlink or junction, the tool does nothing
   and exits 0.** The main guard compares `path.resolve(process.argv[1])`
   with `fileURLToPath(import.meta.url)` (`tools/post-record.mjs:246`).
   Node resolves the main module to its real path; `argv[1]` keeps the link.
   *Reproduction:* `mklink /J <scratch>\jtools <repo>\tools`, then
   `node <scratch>\jtools\post-record.mjs --help` and `… bogus` each print
   nothing and exit 0. With `--confirm` it would post nothing while
   reporting success. A different drive-letter case is fine: `node
   c:\users\…\post-record.mjs --help` works. Suggest comparing
   `realpathSync` of both sides.

7. **non-blocking. The printed dry-run command is not always a valid
   shell command.** `show()` quotes with `JSON.stringify` only when an
   argument has whitespace, quotes or `<>|&` (`tools/post-record.mjs:192-197`).
   A title such as ``$HOME`x`` is printed bare, and bash or PowerShell would
   expand it. A quoted Windows path is printed with doubled backslashes.
   Posting is unaffected, because `execFileSync` passes the arguments with
   no shell. The printed line is display only. *Reproduction:*
   ``milestone crlf.md --title '$HOME`x'`` prints ``--title $HOME`x``.

8. **non-blocking (for C1, not C2). The tool posts the working-tree file,
   not the file at the PR's head.** C1's proof compares each comment with
   "the file as the PR's head holds it" (`BACKLOG.md:74-75`). `readSource`
   reads whatever is on disk (`tools/post-record.mjs:121`), so an unpushed
   edit, or a checkout of another branch, is posted without a warning. If
   a `review --pr N` run warned when the file differs from its blob at the
   PR's `headRefOid` (line endings aside), the tool would also enforce C1.

## Verified

- **`node --check tools/post-record.mjs`** passes, and
  **`node --test tools/post-record.test.mjs`** gives 12 pass, 0 fail
  (Node v24.21.0, gh 2.100.0).
- **Dry runs never reach `gh`.** In `run`, the only `gh` calls come after
  `if (!opts.confirm) { …; return; }` (`tools/post-record.mjs:211-215`), and
  `plan` never calls it. I ran every kind as a dry run (`review`, `design`,
  `design --issue`, `reply --issue`, `reply --pr`, `milestone`) with both
  `gh.exe` directories removed from `PATH`. All exited 0. As a control,
  spawning `gh` under that `PATH` fails with `ENOENT`.
- **The tests cannot reach `gh`.** Every `run(` call passes `gh:`: `NEVER`
  or a fake (`tools/post-record.test.mjs:148,174,182,199`); the other tests
  call only `plan`, `splitDesign` or `sameBody`. The main guard does not
  fire under `node --test`, whose `argv[1]` is the test file. The suite is
  also green with `gh` off `PATH`.
- **Byte identity:** `cmp reviews/009-r5-scope-impl-04.md <out>/009-r5-scope-impl-04.body.md`
  is identical, and that file has mixed CRLF and LF. The body file starts
  `23 20 52`, with no BOM. For `design/002-harness-release-2.md` (CRLF),
  the issue body and the three verdict body files, rejoined with
  `\r\n---\r\n\r\n`, `cmp` identical to the record.
- **CRLF:** the Windows checkout is CRLF (`core.autocrlf=true`;
  `git ls-files --eol` shows `i/lf w/crlf` for `post-record.mjs`). The
  split handles LF and CRLF (break B12 is killed). `firstHeading` returns
  `Title — CRLF` without the `\r`, since `$` in multiline mode stops before
  `\r`. `sameBody` treats CRLF and LF as equal.
- **Records without verdicts:** `design none.md` plans only the issue.
  `design none.md --issue 5` plans nothing and exits 0.
- **URL parsing:** real comment URLs have both forms:
  `…/pull/14#issuecomment-5799853970` (`gh pr view 14 --json comments`)
  and `…/issues/6#issuecomment-5787440340` (`gh issue view 6`). The regex
  `/#issuecomment-([0-9]+)$/` (`:235`) extracts the id from each, and
  `/\/issues\/([0-9]+)$/` (`:220`) extracts `16` from an issue URL. `gh pr
  comment` and `gh issue comment` both print the new comment's URL. This
  one is not reproduced, because doing so would post; finding 1 asks for
  the issue form in a test.
- **`repos/{owner}/{repo}`** (`:238`) resolves from the current
  directory's repository or `GH_REPO` (`gh api --help`). This is the same
  resolution `gh pr comment` and `gh issue comment` use, so outside a
  checkout the post fails first, and the read-back cannot be the only
  failing step. PR conversation comments are issue comments, so
  `issues/comments/<id>` reads both.
- **Argument validation:**
  - `--pr 0x1` and `--pr 007` are refused;
  - `reply` without a target is refused;
  - a missing file fails with `ENOENT` and exit 1;
  - an empty file, a BOM and invalid UTF-8 are refused (`:72-84`; the BOM
    and UTF-8 cases are tested).
- **Windows paths:** body-file paths are native (`path.join`) and go to
  `gh` as `execFileSync` arguments with no shell, so a title such as
  `010 — A record` is passed as UTF-16 argv, not re-encoded by a code page.
  A lowercase drive or path casing still runs the tool; only a link does not
  (finding 6).

— Claude Opus 5.5 (claude-opus-5-5), reviewer
One blocking finding remains (finding 1: the tests leave the design, milestone and issue-comment posting paths unasserted).
