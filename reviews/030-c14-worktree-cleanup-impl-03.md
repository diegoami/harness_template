# Review 030, round 03: C14, the worktree cleanup script

- **Revision:** `aa91b544de9c4b2e68c06d04d937558b3761c209`, the head of
  pull request #36 (`r6/c14-worktree-cleanup`), seven commits on `main` at
  `47e80b1`. Since round 02 (`6e5ae1f`) there are two: `422c926`, which
  records round 02, and `aa91b54`, which answers it. It is the head commit
  I was given.
- **Target proof.** Fetch: `git fetch origin`, then
  `git fetch origin pull/36/head`; `git cat-file -t aa91b54…` gives
  `commit`. `gh pr view 36 --json headRefOid,files` gives `aa91b54…`. In my
  worktree `git rev-parse HEAD` gives `aa91b54…`, and the merge base with
  `origin/main` is `47e80b1`.
- **Files:** the pull request's 6 files, which equal
  `git diff --name-only $(git merge-base origin/main HEAD)..HEAD`:
  - `BACKLOG.md`
  - `README.md`
  - `reviews/030-c14-worktree-cleanup-impl-01.md`
  - `reviews/030-c14-worktree-cleanup-impl-02.md`
  - `utils/worktrees.mjs`
  - `utils/worktrees.test.mjs`

  Rounds 01 and 02 are on the branch, so this is round 03.
  `git log 422c926..HEAD` holds no stop notice.
- **Where I worked:** `../harness_template-work/review-36-20260927T121048Z`,
  a fresh worktree made with `git worktree add --detach`, `HEAD`
  `aa91b54…`, detached, with the file list above. I was started in the
  implementer's worktree, and did not review there. Every experiment ran
  on throwaway repositories in temporary directories, all deleted;
  `--clean`, `--merged` and `--reattach` ran only there.
- **Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`), the reviewer of
  rounds 01 and 02, resumed.
- **Mode:** Claude mode, per-change review, round 03, the last before the
  rounds ceiling.

## Findings

1. **non-blocking.** The README's "Submodules are skipped"
   (`README.md:100`) is broader than the code. The code skips a
   submodule only when a scan finds it (`utils/worktrees.mjs:267`). A
   submodule given as a path itself is listed, and only its reattach is
   refused (`:568`). C14 (`BACKLOG.md:302-304`) and `--help`
   (`utils/worktrees.mjs:65`) say it exactly. **Suggest** "A scan skips
   submodules, and a submodule is never reattached", in the next text
   change if not here.

No blocking finding remains.

## Round 02's findings

1. **Ignored key in a tracked `build/` (blocking): resolved.**
   - `isRebuildable` now needs the entry to be an ignored directory whose
     own name is listed (`utils/worktrees.mjs:438`). That is the rule I
     proposed.
   - My reproduction now gives `keep`, with "1 ignored entry not on the
     rebuildable list … (build/signing.p12)", and the key survives
     `--clean`.
   - The new test goes red when the old any-component rule is put back.
   - C14 (`BACKLOG.md:312-319`), `--help`, the README and the script
     comment all state the narrower rule. The change is dated under
     "Narrowed on 2026-09-27" (`BACKLOG.md:406-412`).
2. **Submodules listed and reattached: resolved.**
   - My reproduction, a superproject recording an older commit of `lib`,
     cloned with `--recurse-submodules`, then `--reattach --clean` on the
     clone, now lists only the superproject. The superproject's status
     stays empty.
   - Each of these breaks turns the new test red:
     - dropping the scan's submodule skip;
     - dropping the no-reattach guard;
     - dropping the `core.worktree` naming of a submodule's work tree.
3. **Untested in-progress states: resolved.**
   - One test per marker, from a list written apart from the script's.
   - A real bisect, in a linked worktree and in a detached main checkout.
   - Each of these breaks turns a test red:
     - dropping `BISECT_LOG`, `MERGE_HEAD` or `sequencer` from
       `IN_PROGRESS`;
     - dropping the main checkout's in-progress check.
4. **The decision's recommended default: resolved.** The note
   (`BACKLOG.md:1112-1142`) now gives all four options with their
   descriptions. It says the question marked "Rebuildable list
   (Recommended)", and that "Keep strict" was the implementer's
   recommendation in its report. I cannot compare the quoted wording with
   the conversation. It is the owner's record, and its evidence is the
   owner's merge, so it is pending, not a finding.

## The two new *Left out* entries

- **Build output ignored by file patterns is kept: accepted.** It fails
  closed, as it says. On throwaway repositories:
  - `build/*` and `*.o` each list `build/x.o` as an ignored file, and the
    worktree is kept.
  - `node_modules` without a slash still lists `node_modules/` as one
    ignored directory, so the worktree is removable.
  - With `/build/`, an unignored `sub/build/y.o` is untracked, and the
    worktree is kept.

  The rule never deletes what the owner's decision protects. It only
  leaves some leftovers for removal by hand.
- **Only a bisect is set up for real: accepted.** The marker logic is the
  same file test for every marker, and each marker has its own test. A
  real bisect is the one state that normally leaves a worktree clean and
  detached. A stopped merge, cherry-pick or revert normally leaves
  changes, and then the dirty count keeps the worktree anyway.

## Verified

- **Identity:** `git remote get-url origin` names
  `diegoami/harness_template`.
- **The gates, at `aa91b54`:**
  - `node --test tools/scaffold.test.mjs tools/post-record.test.mjs utils/worktrees.test.mjs`:
    104 tests, 104 pass, 0 fail.
  - `node --check` passes on all six `tools/*.mjs` and `utils/*.mjs`.
- **The decoy check, rerun.** `node --test utils/worktrees.test.mjs`, with
  `GIT_DIR` and `GIT_WORK_TREE` pointed at a throwaway repository's linked
  worktree, passes 43 of 43. All 34 of the decoy's files are unchanged,
  mtimes included.
- **Earlier breaks still caught:** dropping `--untracked-files=all` still
  turns its test red.
- **Nothing else in the script changed.** Outside the lines above,
  `aa91b54` changes only comments and text. The environment filter, dry
  run, prune blocker and failure path are as reviewed in rounds 01 and 02.
- **The pull request body** names both review rounds and has the four
  parts. Its check output matches my run in total (104). Its *Left out*
  gives a reason for every deliberate gap.
- **Harness-only:** still no file in `presets/` and no line of `ADOPT.md`
  names the tool (`grep -rln`, exit 1).

— Claude Opus 5.5 (claude-opus-5-5), reviewer
No blocking finding remains.
