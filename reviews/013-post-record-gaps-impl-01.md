# Review: the post-record test gaps (r5, C2 extended), implementation round 01

**Revision reviewed:** `4eb998264c24c9767fffc5361112c90329d5c5e5`
(`4eb9982`, branch `r5/post-record-gaps`). Three sources agree on this
SHA: PR #18's `headRefOid` (`gh pr view 18 --json headRefOid,files`),
`git ls-remote origin r5/post-record-gaps`, and `git rev-parse HEAD`. The
working tree was clean.

**Files checked:** PR #18's file list is `tools/post-record.mjs` (+13, −5)
and `tools/post-record.test.mjs` (+92, −3). It equals the local diff:
`git merge-base HEAD origin/main` = `b6d8b78` (also `main` and
`origin/main`), then `git diff --name-only b6d8b78 HEAD`. One commit,
`4eb9982`.

**Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`), a fresh-context session
that has not seen the implementation.

**Mode:** Claude. No design stage, no marker.

**Method:** read-only in the repository and on GitHub. The only `gh` call
was `pr view`. I did not run the tool with `--confirm` against GitHub. All
breaks ran on copies of the blobs at `4eb9982` and `b6d8b78` (`git show`),
in `…/scratchpad/rv13/`. Each copy equals the checkout apart from CR
(`core.autocrlf=true`).

## The aim: C2's extension

`BACKLOG.md:91-95` has two proof steps, and both are met.

- **A test posts a review file from a subdirectory of the checkout.**
  `test.mjs:537-558` puts the file in `reviews/`, posts it with `--confirm`
  to a PR that holds `reviews/010-x-impl-01.md`, and is refused when the PR
  holds the same name at the top level. The refusal also kills a
  `basename` implementation (R4 below).
- **Each named break turns a test red.** See the table below. Every break
  landed, and `node --check` passed on each broken copy.

| break (gaps item, `BACKLOG.md:349-353`) | mine | red test |
|---|---|---|
| no `\` to `/` conversion (round 03's Q2) | R1 | `test.mjs:525` and `:537` |
| lone `\` in the quoting set (Q1) | R5 | `test.mjs:575` |
| info string on a closing fence closes (Q3) | R8 | `test.mjs:581` |
| PR number hard-coded in the check (Q7) | R10 | `test.mjs:560` |
| entry point by path, not realpath (N12) | R12 | `test.mjs:586` |

**The path conversion off Windows.** The unit test at `test.mjs:525-535`
passes `path.win32` explicitly. `path.win32.relative` is pure string
handling and does not depend on the host, so R1 goes red on every
platform. To show this, I made a copy whose own `path` is `path.posix`
(`import __path …; const path = __path.posix`). There, the unit test is
green unbroken and red with R1. The subdirectory test alone would not
catch R1 off Windows, since `path.sep` is `/` there. PR #16's round 02
asked for exactly this, and it is now answered.

**The junction test.** It creates one thing: the link
`<mkdtemp>/linked-tools`, which points at the test's own directory
(`test.mjs:589-592`). Nothing is written outside the temp directory. The
`finally` block removes the temp directory. On Node 24.21, I checked with
a dummy target that `rmSync(dir, { recursive: true, force: true })`
removes the junction and not the target's files. The checkout is clean
after every run, and no `post-record-*` directory is left behind. The two
that exist in `%TEMP%` date from 2026-09-23 and hold a dry run's
`README.body.md`, so the tests did not leave them. On POSIX, the type
`"junction"` is ignored and a directory symlink is made. R12 then goes red
the same way, because Node's main module is loaded by its realpath.

**Behaviour is unchanged.** `repoPath` and `shellQuote` are verbatim
extractions (`post-record.mjs:280-282`, `:306-308`). With `p` left at its
default, `repoPath(top, path.resolve(file))` is the old expression. Checked:

- on the same argv (a review, a directory named `it's a dir`, a reply,
  a title with quotes and `$`), dry runs of `main` and of `4eb9982` print
  identical lines;
- `shellQuote` equals the old inline `q` on 11 strings, including `''`,
  `'`, a newline, `$x` and `é`;
- `repoPath` equals the old expression on 4 path pairs, including mixed
  `/` and `\`;
- `main`'s 23 tests pass against the new tool, and no existing test was
  edited: the only deletions in the test diff are import lines.

## Findings

No blocking finding.

1. **non-blocking. The new unit tests pin the helpers, not their use.**
   Two call-site breaks show the edge:
   - **R2:** `checkPrHolds` computes `rel` with `path.relative` and skips
     `repoPath` (`post-record.mjs:287`). Only the subdirectory test
     catches it, and only on Windows. Elsewhere it does no harm, so this is
     acceptable.
   - **R6 survives on every platform:** `show()` (`:310-312`) stops calling
     `shellQuote` and puts `\` back into its own set. No dry-run test
     prints a backslash path without a space. The dry-run test's path has
     a space, as round 03 noted.

   The gap as named, "a lone backslash in the quoting set", is closed. R6
   is the next step. Suggested: in the existing dry-run test, assert that
   each printed line equals `"  gh " + a.gh.map(shellQuote).join(" ")`.
   That ties `show()` to `shellQuote` on any platform. Two more breaks
   survive, outside the named gaps:
   - **R3:** `repoPath` splits on the host's `path.sep`, not `p.sep`. It
     gives correct results on each host.
   - **R9:** a closing fence followed by trailing spaces no longer closes.
     CommonMark allows those spaces. Untested before this change too, and
     optional.
2. **non-blocking, not introduced here. A checkout reached through a
   junction or symlink is refused.** I reproduced this with a real `git`
   and a fake `gh`, in a scratch repository under `%TEMP%`:
   - `checkPrHolds` accepts `repo/reviews/x.md` given directly;
   - it refuses the same file given through a junction to `repo`:
     "../via-junction/reviews/x.md is not one of PR #15's files". `git
     rev-parse --show-toplevel` returns the physical path, while
     `path.resolve(file)` keeps the link.
   - It fails safe, and `main` has the same expression. It matters beyond
     Windows: on macOS `/var` is `/private/var`, so any checkout under a
     symlinked directory is refused.
   - The new subdirectory test cannot see this, because its fake `git`
     echoes the test's own directory (`test.mjs:73`).

   Suggested for the backlog, not this PR: `realpathSync` the file before
   `repoPath`, plus a test with a real `git` through a junction.
3. **non-blocking. The junction test links to the live `tools/`
   directory.** Cleanup is safe on the Node in use (verified above). Still,
   the only thing between a recursive delete and the checkout's `tools/`
   is how `rmSync` treats a junction. Copying `post-record.mjs` into the
   temp directory and linking to that copy tests the same `isMain` path
   (the tool imports only `node:` modules) and leaves no target outside
   the temp directory.
4. **non-blocking, wording.**
   - The comment "A review is posted only when the PR holds it…"
     (`post-record.mjs:275-277`) now sits above `repoPath`, so it reads as
     `repoPath`'s. It belongs above `checkPrHolds` (`:284`).
   - The test file's header (`test.mjs:1-7`) names `git` as the one real
     process a test runs. The junction test also spawns `node` (with
     `--help`, which returns before any `gh`).

## Verified

- **Checks at `4eb9982`:** `node --check tools/post-record.mjs` passes, and
  `node --test tools/post-record.test.mjs` gives 29 tests, 29 pass, 0 fail,
  in the checkout and in the scratch copy. `main`'s copy gives 23 of 23.
- **My breaks** (`rv13/mutate6.mjs`, R1–R13):
  - red: R1, R2 (on Windows), R4, R5, R7 (the `'` escape removed), R8,
    R10, R11 (the review's comment target hard-coded to 15), R12 and R13
    (`isMain` by the raw `argv[1]` string);
  - survived: R3, R6 and R9 (finding 1).
  - The unbroken copy is green.
  - On landing: my first R5 went through a shell that collapsed `\\` to
    `\`. It "landed" as `\-`, an escaped hyphen that changes nothing, and
    it survived. Written with a file edit instead, R5 goes red. A textual
    diff is not proof that a regex break landed.
- **Earlier break sets, rerun on `4eb9982`:**
  - `mutate3.mjs` (30): every applicable break is killed, including N12,
    which survived in round 03. B1, N2, N3, N9 and N11 no longer match,
    as in round 03, and `mutate4`'s P-set covers those lines.
  - `mutate4.mjs` (P1–P13): all killed.
  - `mutate5.mjs`: the file at that path is now the builder's G1–G5
    (modified 2026-09-24 08:33). Round 03's Q1–Q9 version is gone. G1–G5
    all go red. I reproduced Q1, Q2, Q3 and Q7 independently as R5, R1,
    R8 and R10.
- **Simulated POSIX** (`rv13/posix.mjs`): with the tool's `path` as
  `path.posix`, the forward-slash unit test is green unbroken, red with
  R1, and green with R2. On POSIX, R2 is not a defect.
- **The PR body:** its test list and count (29) match my run. Its claim
  that the earlier sets leave no survivor matches mine. Its "any
  platform" for G1 is true of the unit test, per the simulation above.

— Claude Opus 5.5 (claude-opus-5-5), reviewer
No blocking finding remains.

## Completion

Landed by PR #18, merged on 2026-09-24 (UTC) at the owner's instruction ("merge
#18 when the review is clean"), after its review comment and with GitGuardian
green. The note is non-material and transcribes the evidence for C2's extension.

- A test posts a review file from `reviews/` with `--confirm`; the path
  conversion is tested with `path.win32` and `path.posix`.
- Each break named in the gaps item turns its test red (the builder's set and the
  reviewer's own, each confirmed applied); `node --test`: 29 pass, 0 fail.
- One review round, clean on `4eb9982`; `39c76f0` only adds its record, posted
  with the tool after GitHub showed the new head.
- Non-blocking findings, listed in the PR's "Left out" for the backlog: the call
  sites of the extracted functions are unpinned; a checkout reached through a link
  is refused (pre-existing); the junction test links the live `tools/`; two stale
  comments.

— Implementer (Claude Opus 5.5)
