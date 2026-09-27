# Review 030, round 02: C14, the worktree cleanup script

- **Revision:** `6e5ae1f8fa22d148d75e3b8bdbb603fa45982330`, the head of
  pull request #36 (`r6/c14-worktree-cleanup`), five commits on `main` at
  `47e80b1`. Since round 01 (`12baf29`) there are three: `944cbd3`, which
  records round 01; `bcc96ae`, which answers it; and `6e5ae1f`, which
  implements the owner's decision on ignored files. It is the head commit I
  was given.
- **Target proof.** Fetch: `git fetch origin`, then
  `git fetch origin pull/36/head`; `git cat-file -t 6e5ae1f…` gives
  `commit`. `gh pr view 36 --json headRefOid,files` gives `6e5ae1f…`. In my
  worktree `git rev-parse HEAD` gives `6e5ae1f…`, and the merge base with
  `origin/main` is `47e80b1`.
- **Files:** the pull request's 5 files, which equal
  `git diff --name-only $(git merge-base origin/main HEAD)..HEAD`:
  `BACKLOG.md`, `README.md`, `reviews/030-c14-worktree-cleanup-impl-01.md`,
  `utils/worktrees.mjs`, `utils/worktrees.test.mjs`. This change's review
  file is round 01's, so this is round 02. `git log 944cbd3..HEAD` holds no
  stop notice.
- **Where I worked:** `../harness_template-work/review-36-20260927T113514Z`,
  a fresh worktree made with `git worktree add --detach`, `HEAD`
  `6e5ae1f…`, detached, with the file list above. I was started in the
  implementer's worktree, and did not review there. Every experiment ran
  on throwaway repositories in temporary directories, all deleted;
  `--clean`, `--merged` and `--reattach` ran only there.
- **Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`), the round-01 reviewer
  resumed.
- **Mode:** Claude mode, per-change review, round 02.

## Findings

1. **blocking.** An ignored key inside a *tracked* folder named on the
   list is deleted. The owner decided that "ignored folders that tools
   regenerate don't block removal", and that "any other ignored file
   (.env, keys, local config) still keeps the worktree"
   (`BACKLOG.md:1100-1105`). The code goes further. `isRebuildable` passes
   any ignored entry with *any* path component on the list
   (`utils/worktrees.mjs:418`), even when that folder is tracked source
   rather than ignored output. For example, a tracked `build/` often holds
   an app's icons and packaging files, and a `*.p12` or `*.env` beside
   them is ignored. C14 (`BACKLOG.md:311-313`), `--help`
   (`utils/worktrees.mjs:90`) and the code agree with each other, so this
   is the decision's rule widened, not a text mismatch.
   **Reproduced:** a tracked `build/icon.txt`, `.gitignore` holding
   `*.p12`, and a detached worktree aged 48 h with `build/signing.p12` in
   it:
   - The dry run gives `remove`, `ignored: []`,
     `rebuildable: ["build/signing.p12"]`, "deletes rebuildable:
     build/signing.p12".
   - After `--clean`, the key is gone.

   The dry run does name it, but the decision promised that a key keeps
   the worktree.
   **Fix:** count an entry as rebuildable only when it is itself an
   ignored directory whose last component is on the list:
   `p.endsWith("/") && REBUILDABLE.has(p.slice(0, -1).split("/").pop())`.
   With `--ignored=matching`, git lists a matched directory once, with its
   trailing slash, so `node_modules/`, `pkg/node_modules/` and `build/`
   still match. A hand-made file inside an ignored `build/` still goes
   with it, as decided. In a scratch copy with that one line, all 33 of
   the suite pass, and the case above gives `keep`, with "1 ignored entry
   not on the rebuildable list … (build/signing.p12)". The key survives
   `--clean`. Add that case as a test. C14's "an entry with a path
   component on the … list … at any depth" and `--help`'s wording then
   need "an ignored directory named …".

2. **non-blocking.** Given a repository's top, the tool now also lists
   that repository's submodules, and with `--reattach` it reattaches them.
   In `bcc96ae`, a repository's top is scanned for child repositories too
   (`utils/worktrees.mjs:242`, `:250-257`). A submodule at the top level
   has a `.git` file, so it is taken as a repository of its own. Its
   checkout is detached, as submodules normally are.
   **Reproduced:** a superproject that records an older commit of `lib`,
   cloned with `--recurse-submodules`. `node utils/worktrees.mjs --reattach
   <clone>` lists `<clone>/.git/modules/lib` with `reattach`: "clean, HEAD
   an ancestor of origin/main". `--reattach --clean` runs
   `git switch main` in the submodule, and the superproject's status is
   then `M lib`. No work is lost, but the superproject is changed, and a
   plain dry run lists every top-level submodule as a detached main
   checkout. **Suggest** skipping a child whose
   `git rev-parse --show-superproject-working-tree` is not empty, or at
   least never reattaching one.

3. **non-blocking.** Two of the new keep reasons have no test. In
   scratch copies, both breaks below pass the suite, 33 of 33:
   - the in-progress check for a detached main checkout removed
     (`utils/worktrees.mjs:543`);
   - `IN_PROGRESS` cut down to `rebase-merge` alone, dropping
     `rebase-apply`, `MERGE_HEAD`, `CHERRY_PICK_HEAD`, `REVERT_HEAD`,
     `sequencer` and `BISECT_LOG` (`:448-456`).

   Only a rebase is tested. A bisect is the likely case: it leaves a
   linked worktree clean and detached. On the main checkout, git's own
   `switch` would probably refuse during most of these (UNVERIFIED: not
   run). One more test, a `git bisect start` in the detached idle
   worktree, would cover the list.

4. **non-blocking.** The decision's record is unclear about which option
   was recommended. The quoted options mark "Rebuildable list
   (Recommended)", and the note ends "The recommended default, taken"
   (`BACKLOG.md:1100-1101`, `:1112`). In between it calls "Keep strict"
   "the implementer's recommendation" (`:1108-1109`). `PRINCIPLES.md`
   (*Owner decisions*) records a decision "with a recommended default".
   **Suggest** saying which was the recommended default, and, if the two
   differed, whose each was.

## Round 01's findings

Each one is resolved. I re-ran each round-01 reproduction on `6e5ae1f`:

1. **Untracked file under `status.showUntrackedFiles=no`: resolved.** The
   status is now `--untracked-files=all` (`utils/worktrees.mjs:431-436`).
   The verdict is `keep`, "dirty (1 entry, untracked included)", and the
   file survives `--clean`. The new test goes red without the flag.
2. **Ignored files: resolved**, by the owner's decision: a `.env` keeps
   the worktree, named in the reason, and survives `--clean`. The
   rebuildable list is new ground; see finding 1.
3. **Failure path: resolved.** The new test, two initialised submodules
   and a plain worktree, goes red under both round-01 breaks (exit 0, and
   stopping after the first failure). My reproduction still gives
   `FAILED`, then `ok`, and exit 1.
4. **Folder inside a repository: resolved.** `outer/clones` now lists
   `alpha`, not `outer`, with the warning "inside the repository …, which
   is not listed; its child repositories are". Treating any directory as
   a top turns the new test red.
5. **Rebase in progress: resolved.** The verdict is `keep`, "a rebase in
   progress". Removing the check turns the new test red. See finding 3
   for the rest of the list.
6. **Untested guards: resolved.** Each of these breaks now turns a test
   red:
   - default checked out elsewhere;
   - the blocker weakened to `> 0`;
   - an unreadable status;
   - uncounted commits.

   An unknown idle time is left untested, with its reason given in the
   pull request's *Left out*. I accept it: git always keeps a `HEAD` in a
   listed worktree's admin dir.

## Verified

- **Identity:** `git remote get-url origin` names
  `diegoami/harness_template`.
- **The gates, at `6e5ae1f`:**
  - `node --test tools/scaffold.test.mjs tools/post-record.test.mjs utils/worktrees.test.mjs`:
    94 tests, 94 pass, 0 fail.
  - `node --check` passes on all six `tools/*.mjs` and `utils/*.mjs`.
- **Breaks that the new tests catch**, each confirmed to have landed:
  - no `--untracked-files=all`;
  - no ignored files kept;
  - no in-progress check for linked worktrees;
  - any directory taken as a repository's top;
  - the rebuildable test made top-level only;
  - exit 0 after a failed command;
  - stopping after the first failure;
  - the checked-out-elsewhere guard dropped;
  - the blocker weakened;
  - the unreadable-status guard dropped;
  - the uncounted-commits guard dropped.
- **The decision's rule, apart from finding 1:**
  - The list matches the decision's names. It adds names of the same kind
    (`.import`, `venv`, `obj`, `coverage` and so on) under "and similar".
  - `bin`, `out`, `tmp` and the like are left off, and an ignored `bin/`
    keeps the worktree (tested).
  - The dry run names what a removal deletes.
  - Everything git cannot tell the tool keeps the worktree.
- **The texts against the code:**
  - C14 (`BACKLOG.md:294-396`) matches the code on the path rule, the
    status flags, the in-progress files, reattach's conditions and exit 1.
  - The `README.md` section matches too, and so does `--help`, whose
    lines are within 79 columns (tested).
  - Both C14 changes are dated, with their reasons, in the commits that
    make them. The claim had not landed yet.
  - The decision's evidence is the owner's merge, so it is pending, not a
    finding.
- **The pull request body** has the four parts. Its check output matches
  my run (94 of 94). Its *Left out* gives the reason for each deliberate
  gap.
- **Harness-only:** still no file in `presets/` and no line of `ADOPT.md`
  names the tool (`grep -rln`, exit 1).

— Claude Opus 5.5 (claude-opus-5-5), reviewer
One blocking finding remains (finding 1).
