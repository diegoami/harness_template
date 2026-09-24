# Review: the scaffold's `--test` guard and the rest of C8 (r5, C8, C9), implementation round 02

**Revision reviewed:** `889c88341383a80dcd4848af5a7b85d4a5ced576`
(`889c883`, branch `r5/scaffold`). Three sources agree on this SHA: PR #22's
`headRefOid` (`gh pr view 22 --json headRefOid,files`),
`git ls-remote origin r5/scaffold`, and `git rev-parse HEAD`. The working
tree was clean.

**Files checked:** PR #22's file list is `ADOPT.md`, `CLAUDE.md`,
`reviews/017-scaffold-impl-01.md`, `reviews/README.md`, `tools/scaffold.mjs`
and `tools/scaffold.test.mjs`. It equals the local diff:
`git merge-base HEAD origin/main` = `9eda6e9`, then
`git diff --name-only 9eda6e9 HEAD`. Two commits were added after round 01:
- `e7e6350`, which adds only the round-01 file;
- `889c883`, the fixes, which I reviewed as `git diff e7e6350 889c883`, and
  within the full diff from the merge base.

The round-01 file is unchanged between the two commits.

**Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`), the round-01 reviewer
continued, as *Reviewer sessions* allows. It has not seen the
implementation.

**Mode:** Claude. No design stage, no marker.

**Method:** read-only in the repository and on GitHub. I generated runs only
into the scratchpad, without `--github`. The interactive runs used a
Windows-form target path. I broke files in place and restored them with
`git checkout -- <file>`, with `git status` clean after each break. The
scratch artifacts are deleted. The only new file in the repository is this
one. Nothing was posted, committed or pushed.

**Posting of round 01:** PR #22 has one comment, created at
2026-09-24T10:24:55Z. That is after `e7e6350` (10:24:43Z) and before
`889c883` (10:30:21Z). Its body equals `reviews/017-scaffold-impl-01.md` as
the head holds it, apart from line endings and the final newline.

## Round-01 findings, re-checked

1. **Blocking 1 (the PowerShell hint): fixed.** I ran the scaffold end to
   end through Windows PowerShell 5.1.22000 at the head:

   | typed in PowerShell 5.1 | exit | stderr | gates table |
   |---|---|---|---|
   | the hint's form, `--test 'node --test \"tools/**/*.test.mjs\"'` | 0 | no warning | `` `node --test "tools/**/*.test.mjs"` `` ✔ |
   | `--test 'node --test "tools/**/*.test.mjs"'` | 0 | the glob-without-quotes warning, with the 5.1 form | `` `node --test tools/**/*.test.mjs` `` |
   | the unbalanced `'node --test "tools/**/*.test.mjs'` | 0 | the same warning | the same |
   | `'node -e "process.exit(0)"'` (no glob) | 0 | no warning | `node -e process.exit(0)` |

   The last row is shown only by the new `unit gate:` line. The code comment
   now says what the guard refuses and what it only warns about, and
   `--help` and the error give the working form.
2. **Blocking 2 (`vX.Y.Z` in the run's `reviews/README.md`): fixed.** Each
   generated preset's `reviews/README.md` contains
   `reviews/v1.2.0-milestone-01.md`. The C8 test asserts it for every
   preset.
3. **False refusals: fixed.** `quotesBalanced` reads quotes as bash does.
   `echo 'a"b'` and `node -e "a\\"` are accepted, and each has a test.
4. **Values that break the output: partly fixed.** An empty or
   whitespace-only value is now refused. Backticks, `|` and U+2028 remain;
   the builder declined them.
5. **Test coverage: mostly fixed.**
   - The plan files are asserted per preset, and so is `--plan no`, which
     gives `ROADMAP.md`.
   - "Reviewed before it is created" is no longer restated, so it needs no
     test.
   - The interactive path is still untested (finding 1 below).
6. **The `--ref HEAD` trap: fixed.** The `before` hook refuses to run while
   a shipped file is uncommitted. With one byte appended to
   `presets/light.json`, the suite exits 1, every test fails, and the
   message reads "commit first: these shipped files have uncommitted
   changes, and the tests generate from HEAD". The header explains the
   split between the working tree and `HEAD`.
7. **The plan file and light's TBD: not addressed**, and the builder
   declined. This stays non-blocking.
8. **The slot line restating the rule: fixed.** It now reads "as
   `PRINCIPLES.md` (*Milestones*) says".
9. **`ADOPT.md`: fixed.** `milestones:` is now in §2 and in §6's done-when.
10. **The interactive refusal: not addressed**, and the builder declined.
    This stays non-blocking.

## New findings

1. **non-blocking — the interactive guard is still untested.**
   `tools/scaffold.mjs:477` calls the guard for interactive answers, and I
   confirmed it at the head: a piped interactive answer of `node --test 'x`
   is refused, and nothing is written. But I made a break that guards only
   the flag, `if (args.test !== undefined) checkTestCommand(test);`, and it
   stays green at 13/13. The interactive answer is the route the hint itself
   recommends. One piped-stdin test with a Windows-form or `os.tmpdir()`
   target would close this.
2. **non-blocking — the PR body is stale.** It still describes the old hint
   ("PowerShell (`--%`, or answer interactively)"), shows `ℹ tests 8`, and
   quotes the old refusal text. Its "Left out" does not list what round 02
   declined, although the re-review request says those items are "noted in
   the PR". *Pull requests* requires the check output verbatim and what was
   left out. Update the body before merge, including one line on C9's
   residual: under Windows PowerShell 5.1, an unbalanced value arrives with
   no quotes and gets a warning rather than a refusal. The claim's refusal
   holds for values that reach the tool intact. Saying so saves the
   milestone reviewer from reading C9 as NOT MET on that shell.
3. **non-blocking — the warning says "rerun", but the run has already been
   written.** When the glob warning fires, the project is still generated
   and committed. Rerunning into the same `--dir` then fails with "exists
   and is not empty". Say "delete `<target>` and rerun, or correct the gates
   table".
4. **non-blocking, could not test — PowerShell 7.3+.** In PowerShell 7.3+,
   `$PSNativeCommandArgumentPassing` passes quotes intact. By that
   mechanism, the 5.1 form (`\"`) would reach the tool with literal
   backslashes. It passes `quotesBalanced`, draws no warning, and would put
   `node --test \"…\"` into the gates table. The hint is explicitly scoped
   to "Windows PowerShell 5.1", and the `unit gate:` line would show the
   backslashes, so this is minor. `pwsh` is not installed here.

## Verified

- **Gates at the head:** `node --check` passes on all four `tools/*.mjs`.
  `node --test tools/scaffold.test.mjs` gives 13/13 pass, and
  `node --test tools/post-record.test.mjs` gives 30/30 pass. There are no
  `scaffold-test-*` leftovers in `os.tmpdir()`.
- **C8, each preset** generated with `--yes --ref 889c883… --preset <p>
  --name t`, without `--github`:

  | preset | exit | stray `{{…}}` | dangling links | files |
  |---|---|---|---|---|
  | light | 0 | none | 0 | 7 |
  | standard | 0 | none | 0 | 10 |
  | auto | 0 | none | 0 | 10 |

  The stray check covers everything outside `reviews/milestone-prompt.md`;
  the links were checked with `check-links.mjs`. The prompt holds exactly
  its 15 documented placeholders. The milestones line points to
  `PRINCIPLES.md`, and names TBD for light and `PLAN.md` for standard and
  auto. `reviews/README.md` carries `v1.2.0-milestone-01` in every preset.
- **Breaks, each landed** (`node --check` clean) and restored, with
  `git status` clean:
  - turned red:
    - single quotes ignored in `quotesBalanced`;
    - the backslash escape ignored;
    - the glob warning removed;
    - the `unit gate:` line removed;
    - the empty check removed;
    - the hint reverted to a `--%` form;
    - the guard moved after the writes;
  - both uncommitted content breaks, `presets/light.json` and
    `reviews/README.md`, are refused by "commit first";
  - survived: the guard applied only to the flag (new finding 1).
- **Interactive runs** (piped, Windows-form paths):
  - a bad answer is refused, and nothing is written;
  - a run with defaults exits 0 and prints
    `unit gate: node --test "tools/**/*.test.mjs"`;
  - nothing was written outside the scratchpad.

— Claude Opus 5.5 (claude-opus-5-5), reviewer
No blocking finding remains.
