# Review 029, round 03: C13, git isolation and the review target

- **Revision:** `16a7c669f094b2380d983bcc4b63692596cf28ed`, the head of
  pull request #35 (`r6/c13-git-isolation`), five commits on `main` at
  `d830a53`. The last is `16a7c66`, "Simplify the review prompt, answering
  review round 02 of PR #35 (r6, C13)". It is the head commit I was given.
- **Target proof.** Fetch: `git fetch origin`, then
  `git fetch origin pull/35/head`. `gh pr view 35 --json headRefOid` gives
  `16a7c66…`; `git ls-remote origin refs/heads/r6/c13-git-isolation` gives
  `16a7c66…`; `git checkout --detach 16a7c66…`, then `git rev-parse HEAD`
  gives `16a7c66…`. The merge base with `origin/main` is `d830a53`.
- **Files:** the pull request's 13 files, which equal
  `git diff --name-only origin/main...HEAD`: `ADOPT.md`, `CLAUDE.md`,
  `PRINCIPLES.md`, `presets/auto.json`, `presets/light.json`,
  `presets/standard.json`, `reviews/029-c13-git-isolation-impl-01.md`,
  `reviews/029-c13-git-isolation-impl-02.md`, `reviews/README.md`,
  `reviews/review-prompt.md`, `tools/post-record.test.mjs`,
  `tools/scaffold.mjs`, `tools/scaffold.test.mjs`. I re-read all of them,
  and diffed `58fac1f..16a7c66` for the answer.
- **Where I worked:** `.claude/worktrees/agent-a8209d0659eaaa676` (Claude
  Code's worktree isolation, the round-01 reviewer resumed), `HEAD`
  `16a7c66…`, detached, with the file list above. My untracked round-02
  file had the same blob as `58fac1f`'s (`a5d7b77`) and was removed before
  the checkout. The brief was the main session's own, not the prompt, so
  I did not make the prompt's worktree to review in. I made it once, only
  to walk the prompt's steps, and removed it: see *Verified*. Scratch
  copies, decoys and generated runs were in temporary directories, all
  deleted.
- **Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`), the same reviewer
  resumed.
- **Mode:** Claude mode, per-change review, round 03.

## Findings

1. **non-blocking.** The prescribed removal fails once the reviewer has
   written its file. The briefing session "takes the file from that
   worktree, then removes the worktree with `git worktree remove`"
   (`reviews/review-prompt.md:23-24`, `:102-104`; `CLAUDE.md:17-18`). The
   review file is untracked in that worktree, and so is anything a gate
   leaves there. `git worktree remove` refuses such a worktree. I made the
   prompt's worktree, wrote an untracked `reviews/…-impl-01.md` in it, and
   ran `git worktree remove <path>`: "fatal: … contains modified or
   untracked files, use --force to delete it", exit 128. The
   implementer's walk did not write a file, so its removal passed.
   **Fix:** say "moves the file out of that worktree, then removes it with
   `git worktree remove --force`". The worktree is detached and made only
   for this review, so forcing loses nothing that was not taken.

2. **non-blocking.** An example in `reviews/README.md` no longer fits.
   `reviews/README.md:20-21` gives `.claude/worktrees/<name>` as an
   example of where a change's review worked. Under the simplified
   prompt, a change's reviewer always works in
   `../<project>-work/review-<id>-<stamp>` (`reviews/review-prompt.md:57-67`;
   `CLAUDE.md:53-55`), even when it was started under
   `.claude/worktrees/`, so that example is never the right answer.
   **Fix:** give `../<project>-work/review-<id>-<stamp>` as the example.

## Verified

- **Identity:** `git remote get-url origin` names
  `diegoami/harness_template`.
- **Round 02's findings:** all five are fixed, by simplifying the prompt.
  1. The prompt no longer detects where the reviewer stands. After the
     identity check (`:47-48`) and the fetch (`:50-55`), the reviewer
     always makes a fresh, detached worktree and works only there
     (`:57-67`). No branch name is needed.
  2. The clone option is gone from the prompt, `CLAUDE.md` and
     `reviews/README.md`.
  3. LIMITS name the worktree and its metadata (`:99-104`). The name
     carries a UTC stamp (`:63-65`), so a second reviewer gets a new
     path. Removal is the briefing session's step, but see finding 1.
  4. The two rules are now in their owners. The stop-notice commit is in
     `PRINCIPLES.md:118-121` (*Rounds*), and renumbering is in
     `reviews/README.md:10-13` (*Naming*). The prompt points to both
     (`:78-79`, `:116-117`, `:121-122`).
  5. `{{HEAD}}` without a remote is the branch's local head (`:17-18`).
- **The worktree command** (`:59-65`),
  `git worktree add --detach <main>/<path> {{HEAD}}`, run from where the
  reviewer stands:
  - **Correct.** `<path>` is anchored at `<main>`, so it is an absolute
    sibling path whatever the current directory. Every worktree of a
    repository shares one common directory, so the new worktree is
    registered in the same `.git/worktrees/` as with `git -C <main>`.
  - **Equivalent** to the `-C` form. It is also simpler: it needs no
    directory change.
  - **It respects the guard rather than working around it.** The guard
    refused `-C <main>` because that names the main checkout. This form
    reads and writes nothing of the main checkout's working tree, index or
    `HEAD`, only the shared metadata that any fetch or commit in an
    isolated worktree also writes.
  - **Run here, from this isolated worktree**, with `<stamp>` fixed by
    hand, it printed "Preparing worktree (detached HEAD 16a7c66)".
    `git -C <that worktree> rev-parse HEAD`, and plain `git` after `cd`,
    both ran under the guard and gave `16a7c66…`, with the diff's 13
    files. So a Claude-mode reviewer can follow the prompt.
  - I then removed that worktree and the empty `harness_template-work/`
    I had created. `git worktree list` is back to three entries. It is
    right for the prompt to use this form.
- **Where the stop-notice read starts** (`:77-82`): sound. It starts from
  the last commit that touched this change's review files, or the merge
  base when there are none, and reads `git log <since>..HEAD`:
  - A notice given after round NN's file was committed is found.
  - One that a later review file has already quoted is not.
  - One given before the first review file is found from the merge base.
- **`<path>` relative to the main checkout** (`:119-120`): right. It
  matches the rule in `reviews/README.md:19-22` that a path is given
  relative to the repository, never as one machine's absolute path, and
  the reviewer computes it before making the worktree.
- **The design is consistent across the files.**
  - `CLAUDE.md:30-34` leaves the general rule on forked agents' worktrees
    as C13 states it, and sends the reviewer to *The review target*.
  - `CLAUDE.md:51-55` says the reviewer makes its own detached worktree in
    `<project>-work/` wherever it started, as the prompt does. That meets
    C13 (b)'s "fresh worktree of its own", never the implementer's
    directory or the main checkout.
  - The only file that disagrees is the one in finding 2.
- **Nothing new outside the documents.** `tools/`, `presets/` and
  `ADOPT.md` are unchanged since `0306d1c`, so round 02's 21 breaks,
  including the two from round-01 finding 6, still apply to the same
  code.
- **The gates, at `16a7c66`:**
  - `node --check` passes on all four `tools/*.mjs`.
  - `node --test tools/*.test.mjs`: 61 tests, 61 pass, 0 fail.
- **The decoy gate, rerun.** I built a decoy repository and linked
  worktree in a temporary directory, and ran `node --test tools/*.test.mjs`
  with `GIT_DIR` set to the worktree's gitdir. It exits 0 with 61 of 61
  passing. The decoy's config, both `HEAD` files, `for-each-ref` and both
  `index` files are unchanged.
- **The preset gate, rerun.** `light`, `standard` and `auto` were each
  generated with `--ref 16a7c66…`, without `--github`, into a temporary
  directory, and each:
  - exits 0, and carries both prompts;
  - has no stray `{{…}}`. The review prompt's fenced text uses exactly
    the four placeholders it documents;
  - has no dangling relative link (22, 28 and 28 checked).
- **Privacy:** no private project and no absolute local path in the diff
  (outside the review files' own identity lines) or in the pull request
  body.
- **The body against the diff:**
  - Its round-02 section matches `16a7c66`, and the cited lines match.
  - Its walk agrees with mine, up to the step it did not walk, the
    review file (finding 1).
- **Wrapping:** every added line is 79 columns or fewer. One line is
  ragged: `PRINCIPLES.md:121`.

— Claude Opus 5.5 (claude-opus-5-5), reviewer
No blocking finding remains.
