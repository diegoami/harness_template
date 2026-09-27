# Review 030, round 01: C14, the worktree cleanup script

- **Revision:** `12baf29b6e1e3ed62e88b2a3d9d36bb39b14f95b`, the head of
  pull request #36 (`r6/c14-worktree-cleanup`), two commits on `main` at
  `47e80b1`: `9389301` (the claim C14 and its owner decision) and
  `12baf29` (the script, its tests, the README section). It is the head
  commit I was given.
- **Target proof.** Fetch: `git fetch origin`, then
  `git fetch origin pull/36/head`; `git cat-file -t 12baf29…` gives
  `commit`. `gh pr view 36 --json headRefOid,files` gives `12baf29…`. In my
  worktree `git rev-parse HEAD` gives `12baf29…`, and the merge base with
  `origin/main` is `47e80b1`.
- **Files:** the pull request's 4 files, which equal
  `git diff --name-only $(git merge-base origin/main HEAD)..HEAD`:
  `BACKLOG.md`, `README.md`, `utils/worktrees.mjs`,
  `utils/worktrees.test.mjs`. No review file is in the list, so this is
  round 01 and no earlier stop notice applies. `030` is the next number
  free in `reviews/` at `HEAD` and at `origin/main`.
- **Where I worked:** `../harness_template-work/review-36-20260927T104939Z`,
  a fresh worktree made with `git worktree add --detach`, `HEAD`
  `12baf29…`, detached, with the file list above. Every experiment ran on
  throwaway repositories in temporary directories, all deleted; `--clean`,
  `--merged` and `--reattach` ran only there. Against the real repository
  I ran only the dry run.
- **Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`), a fresh forked
  subagent that saw neither the implementation nor its sessions.
- **Mode:** Claude mode, per-change review, round 01.

## Findings

1. **blocking.** An untracked file can be deleted, although C14 counts
   untracked files as dirty. `dirtyCount` runs plain
   `git status --porcelain` (`utils/worktrees.mjs:317`). That command
   follows the repository's `status.showUntrackedFiles`, so with `no` it
   prints nothing for an untracked file. The claim says the dirty count
   is "the lines of `git status --porcelain`, untracked files included"
   (`BACKLOG.md:304-305`). The README says the tool removes "only the ones
   it can prove are safe" (`README.md:93`). `git worktree remove` without
   `--force` does not catch it either.
   **Reproduced** on a throwaway repository with
   `git config status.showUntrackedFiles no`, a detached worktree holding
   one untracked `notes.txt`, and its admin files aged 48 h:
   - The dry run gives `remove`, `dirty: 0`, "detached, clean, no commit
     on no ref".
   - `--clean` prints `ok … worktree remove …`, and `notes.txt`, the only
     copy, is gone.

   **Fix:** `git status --porcelain --untracked-files=all`. With that one
   change in a scratch copy, the same case gives `keep`, `dirty: 1`,
   "dirty (1 entry, untracked included)", and the file survives
   `--clean`. Add a test that sets `status.showUntrackedFiles no` on the
   fixture. The suite has none, so nothing catches the break today.

2. **non-blocking.** Ignored files are deleted without a word. The dirty
   count leaves out ignored files (`utils/worktrees.mjs:316-320`), and
   `git worktree remove` deletes them with the rest of the directory. I
   reproduced it: `.env` in `.gitignore`, a detached worktree holding a
   `.env`, aged 48 h. The verdict is `remove`, `dirty: 0`, and `.env` is
   gone after `--clean`. Build output can be rebuilt, but a local `.env`
   or notes file often cannot. That is at odds with "can prove are safe"
   (`README.md:93`). The claim, as written, is met. **Suggest** either
   counting `git status --porcelain --ignored` entries as a keep reason
   (or showing them as their own state), or saying in the README and
   `--help` that removal deletes ignored files. The owner's choice.

3. **non-blocking.** The failure path of `--clean` has no test. C14 says
   `--clean` "reports each outcome and continues past a failure"
   (`BACKLOG.md:326`), and the pull request adds "exits 1 if one failed".
   The code does both (`utils/worktrees.mjs:588`, `:591`, `:594`, `:618`).
   I reproduced it with a git refusal: two detached, idle worktrees of a
   repository with a submodule, one with the submodule initialised. The
   run gave `FAILED … fatal: working trees containing submodules cannot
   be moved or removed`, then `ok` for the other, and exit 1. But in
   scratch copies both breaks pass the suite, 20 of 20:
   - `return 0` in place of `return failed ? 1 : 0`;
   - stopping the loop after the first failed command.

   **Suggest** that very case (an initialised submodule) as the test: it
   is a real refusal, and needs no fake.

4. **non-blocking.** A folder of repositories inside another repository
   is taken as that repository, and its children are skipped without a
   warning. `discover` treats a path as a repository whenever
   `rev-parse --git-common-dir` succeeds there
   (`utils/worktrees.mjs:177-181`), which it does for any directory inside
   a work tree. I reproduced it: `outer/` a repository, `outer/clones/`
   ignored by it and holding the repository `alpha` and its linked
   worktree. `node utils/worktrees.mjs outer/clones` reports only `outer`,
   with no warning, and never lists `alpha` or its worktree. The README's
   own example, `node utils/worktrees.mjs ..` "every repository in the
   parent folder" (`README.md:99`), hits this on a machine whose home
   folder is a dotfiles repository. **Suggest** treating a path as a
   repository only when it is the top of a work tree
   (`rev-parse --show-toplevel`) or a git dir, and scanning the children
   otherwise.

5. **non-blocking.** A worktree in the middle of a rebase is removed. I
   reproduced it: a branch worktree with one commit, then
   `git rebase --exec false main`, which stops with `rebase-merge/` in
   its admin dir, leaving `HEAD` detached and the tree clean. Aged 48 h,
   it gets `remove`: "detached, clean, no commit on no ref". No commit is
   lost, because the branch keeps its commits. But the rebase state goes
   with the admin dir. A bisect likely goes the same way (UNVERIFIED: not
   run). **Suggest** keeping a
   worktree whose admin dir holds `rebase-merge`, `rebase-apply`,
   `MERGE_HEAD`, `CHERRY_PICK_HEAD`, `REVERT_HEAD` or `BISECT_LOG`, with
   that reason.

6. **non-blocking.** Several fail-closed guards have no test. In scratch
   copies, removing each of these still passes the suite, 20 of 20:
   - "`<default>` is checked out in `<path>`" for a detached main checkout
     (`utils/worktrees.mjs:402-403`). Without it, `git switch` fails
     instead (reproduced: with the guard, the verdict is `main detached`
     with that reason, and no command runs);
   - the prune blocker's `w.unique !== 0`, weakened to `> 0`, so that a
     count that failed no longer blocks (`:445`);
   - the keep reasons for an unreadable status (`:422`), uncounted
     commits (`:424`) and an unknown idle time (`:426`).

   These are the paths that stop the tool when git cannot tell it
   something, and nothing asserts them.

## Verified

- **Identity:** `git remote get-url origin` names
  `diegoami/harness_template`.
- **The gates, at `12baf29`:**
  - `node --test tools/scaffold.test.mjs tools/post-record.test.mjs utils/worktrees.test.mjs`:
    81 tests, 81 pass, 0 fail.
  - `node --check` passes on all six `tools/*.mjs` and `utils/*.mjs`.
- **The decoy check, rerun.** I built a throwaway repository with a linked
  worktree, and ran `node --test utils/worktrees.test.mjs` with `GIT_DIR`
  and `GIT_WORK_TREE` pointed at it: 20 of 20 pass. All 34 files of the
  decoy's `.git` and worktree have the same mtime and content afterwards.
- **The implementer's breaks, spot-checked** in scratch copies, each shown
  to have landed:
  - no `--no-optional-locks`: 4 fail, including the dry-run test;
  - the caller's environment passed through: 1 fails, the `GIT_DIR` test;
  - a missing, locked worktree pruned: 4 fail.

  Dropping `--branches` from the unique count is not caught, but it only
  makes the tool keep more, so it is not a safety gap.
- **Behaviour that holds**, read and in part reproduced:
  - no `--force`, no `fetch`, and no branch deletion anywhere in the
    script;
  - removal only through `git worktree remove`;
  - a missing worktree whose `HEAD` holds commits on no ref keeps its
    repository's prune, as the claim says;
  - reattach needs clean, an ancestor, a local default, and the default
    not checked out elsewhere;
  - repositories are grouped by common dir, and a worktree outside the
    given folder is found;
  - the caller-variable list is the same regular expression as
    `tools/scaffold.mjs:92`.
- **A dry run on the real repository** (read-only) listed its 4 worktrees,
  all `keep`: the main checkout; the implementer's branch worktree, not
  merged and recent; the locked worktree Claude Code made for me; and this
  review worktree, recent. It printed "nothing to run.".
- **Harness-only:** no file in `presets/` and no line of `ADOPT.md` names
  `worktrees.mjs` or `utils/` (`grep -rln`, exit 1).
- **The claim came first:** `9389301` adds C14, dated, with its reason
  and the owner decision (`BACKLOG.md:294-354`, `:1042-1053`), and
  `12baf29` leaves `BACKLOG.md` unchanged. The decision's evidence is the
  owner's merge, so it is pending, not a finding.
- **The README section** says what the script does, and to run the dry
  run first (`README.md:89-106`). Finding 1 makes its "prove are safe"
  untrue for now.
- **The pull request body** has the four parts. Its check output matches
  my gate run (81 of 81, with the same test names). The one default
  changed from the brief, a missing worktree holding commits being kept,
  is in the claim.

— Claude Opus 5.5 (claude-opus-5-5), reviewer
One blocking finding remains (finding 1).
