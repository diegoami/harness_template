# Review 029, round 02: C13, git isolation and the review target

- **Revision:** `0306d1c8b22b9a0c463c4468bdaea1924e10939f`, the head of
  pull request #35 (`r6/c13-git-isolation`), three commits on `main` at
  `d830a53`: `15a369a`, the round-01 review `d33fe11`, and `0306d1c`,
  "Answer review round 01 of PR #35 (r6, C13)". It is the head commit I was
  given.
- **Target proof.** Fetch: `git fetch origin`, then
  `git fetch origin pull/35/head`. `gh pr view 35 --json headRefOid` gives
  `0306d1c…`; `git ls-remote origin refs/heads/r6/c13-git-isolation` gives
  `0306d1c…`; `git checkout --detach 0306d1c…`, then `git rev-parse HEAD`
  gives `0306d1c…`. The merge base with `origin/main` is `d830a53`.
- **Files:** the pull request's 12 files, which equal
  `git diff --name-only origin/main...HEAD`: `ADOPT.md`, `CLAUDE.md`,
  `PRINCIPLES.md`, `presets/auto.json`, `presets/light.json`,
  `presets/standard.json`, `reviews/029-c13-git-isolation-impl-01.md`,
  `reviews/README.md`, `reviews/review-prompt.md`,
  `tools/post-record.test.mjs`, `tools/scaffold.mjs`,
  `tools/scaffold.test.mjs`. Round 02 re-read all of them, and diffed
  `d33fe11..0306d1c` for the answer.
- **Where I worked:** `.claude/worktrees/agent-a8209d0659eaaa676` (Claude
  Code's worktree isolation, the same worktree as round 01, resumed),
  `HEAD` `0306d1c…`, detached, with the file list above. My untracked
  round-01 file had the same blob as `d33fe11`'s (`cf04fe7`) and was
  removed before the checkout. Scratch copies, decoys and generated runs
  were in temporary directories outside the repository, all deleted.
- **Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`), the round-01 reviewer
  resumed.
- **Mode:** Claude mode, per-change review, round 02.

## Findings

1. **non-blocking.** The prompt's own-checkout steps can stop a reviewer
   that should make a checkout, and they rely on a branch name the
   reviewer is not given. `reviews/review-prompt.md:50-56` says to make a
   checkout "If you were not started in one". The only way to tell is the
   check at `:57-61`, which says "stop" rather than "make one". An
   OpenCode reviewer, started in the implementer's checkout, that runs the
   check first stops, and finding 1 of round 01 comes back. The check also
   detects the implementer's checkout by "the change's branch" (`:60`),
   which no placeholder names; without a pull request the reviewer cannot
   know it. **Fix:** "Run the check below where you start. If it fails,
   make one now and run it again there; stop only if it fails there." Name
   the branch: `gh pr view {{PR}} --json headRefName`, or, without a pull
   request, any local branch whose tip is `{{HEAD}}`
   (`git branch --points-at {{HEAD}}`).

2. **non-blocking.** The clone option breaks later steps of the prompt.
   `reviews/review-prompt.md:55-56` offers "clone the repository into a
   temporary directory of your own", and does not say from where:
   - A clone of the local repository has `origin` set to a local path. So
     the identity check (`:67-68`) fails: `origin` does not name
     `{{REPO}}`, and without a remote, `git remote` does not print nothing.
   - In a clone, `{{BASE}}` is not a local branch. So without a remote,
     `{{BASE}}...HEAD` (`:65`), the merge base (`:81-82`) and
     `git log {{BASE}}..{{HEAD}}` (`:86`) do not resolve.
   - "Delete your temporary directories" (`:109-110`) deletes the review
     file, which lives in the clone (`:105`), before the briefing session
     has taken it.

   **Fix:** allow a clone only with a remote, and only from
   `https://github.com/{{REPO}}`; without a remote, a worktree only. Keep
   the clone until the briefing session has taken the review file, whose
   path the final reply gives.

3. **non-blocking.** The worktree the reviewer makes is not covered by
   LIMITS and is never removed. `git -C <main> worktree add`
   (`reviews/review-prompt.md:52`) registers the worktree under the
   repository's `.git/worktrees/`. LIMITS says "Your only write in the
   repository is the review file" (`:105`). Nothing says who removes the
   worktree. A second, fresh reviewer of the same pull request, the
   fallback after a stop, gets the same `review-<id>` path (`:54`), and
   `worktree add` fails there. **Fix:** let LIMITS allow making the
   checkout, and have the briefing session remove it
   (`git worktree remove`) once it has committed the file. Or put the
   round, or the first 12 characters of `{{HEAD}}`, in `<id>` as well.

4. **non-blocking.** Two new process rules live only in the prompt, not in
   the files that own them. `reviews/review-prompt.md:21-26` says that
   without a remote a stop notice is quoted in the next commit message on
   the change's branch, if need be an empty commit. Stop notices are
   *Rounds*, owned by `PRINCIPLES.md` (the ownership map, `:15`), and
   `PRINCIPLES.md:116-118` names only the next review file. The same
   lines add renumbering on a collision; naming is owned by
   `reviews/README.md`. `PRINCIPLES.md:3-6` says a non-owning file "links
   to an idea and does not restate it". Separately, `:86-87` would also
   find notices that an earlier review file has already quoted. **Fix:**
   state both rules in their owners (*Rounds*, and *Naming* in
   `reviews/README.md`), and have the prompt point to them. Read only the
   commits after the change's last review file.

5. **non-blocking.** `{{HEAD}}` outside Claude mode has no source without
   a remote. `reviews/review-prompt.md:15-16` gives "the branch's head as
   pushed (with a pull request, the one GitHub reports)", but an OpenCode
   project with no remote pushes nothing. **Fix:** add "or, without a
   remote, the branch's local head".

## Verified

- **Identity:** `git remote get-url origin` names
  `diegoami/harness_template`.
- **Round 01's findings:**
  1. **Fixed, and the triage is sound.** The prompt no longer strands a
     subagent reviewer. It works "in either mode" (`:3-6`), names the
     OpenCode briefer, and lets any reviewer make its own worktree or
     clone (`:45-56`). That is within C13 (b), whose "fresh worktree of its
     own" is not limited by mode, so it needs no owner decision. With
     `PRINCIPLES.md:92-94` kept, `AGENTS.md:23-27` no longer contradicts
     it. What remains is findings 1 to 3 above.
  2. **Fixed.** `CLAUDE.md:31-34` says the prompt names no path, and the
     prompt derives `../<project>-work/review-<id>`. From `-C <main>`, the
     relative path resolves to the sibling directory.
  3. **Fixed.** STOPPING lists the identity check (`:39-42`).
  4. **Fixed, by a route of the implementer's** (`:21-26`, `:86-87`,
     `:126-128`). See finding 4.
  5. **Fixed.** The next free number is taken at both `{{HEAD}}` and
     `origin/{{BASE}}` (`:117-119`).
  6. **Fixed.** Both breaks are now red on their own assertion (below).
  7. **Fixed.** Step 1.3 records `main`'s commit first (`ADOPT.md:68-70`).
     Step 4.4 does not offer the item for declining, and says why
     (`:179-182`). Step 6.3 takes it whole (`:267-269`).
  8. **Not a defect, as triaged.** PRs #33 and #34 were ticked by the time
     they merged.
- **The implementer's readings:**
  - The branch detection works where the branch is known. See finding 1.
  - `--git-dir` against `--git-common-dir` is sound. Here it prints two
    different lines, and a reviewer's own clone is exempted.
  - The stop notice in a commit message is workable. See finding 4.
  - The clone record, "a clone of my own in a temporary directory", is
    fine, and `reviews/README.md:16-21` matches it. See finding 2 for
    the clone itself.
  - `{{HEAD}}` in OpenCode mode is right where there is a remote. See
    finding 5.
- **Nothing new in the code.** `tools/scaffold.mjs` is unchanged since
  `15a369a`. The test change adds only the `GIT_CONFIG_SYSTEM` file and
  its pass-through check, and on `win32` a mixed-case
  `Git_Config_Parameters`.
- **Breaks retried.** I made each break in a scratch clone at `0306d1c`
  and ran only the `--github` test. All 21 breaks are red:
  - Over-stripping `GIT_CONFIG_SYSTEM` fails on
    `lost GIT_CONFIG_SYSTEM` (`tools/scaffold.test.mjs:622`).
  - Dropping the Windows upper-casing fails on `received them`
    (`:614`), with `[ 'Git_Config_Parameters' ]`.
  - The rest, as in round 01, fail on `received them` (`:614`),
    `lost GIT_CONFIG_GLOBAL` (`:622`) or the exit-0 check (`:624`).
    These are: each named variable dropped from `CALLER_GIT`, `DIR`
    included; `env` removed from `gitOutput`, `gitShow`, `gh api user`,
    `inTarget`, `git init`, `add`, `commit` and `push`; and every
    `GIT_*` stripped.
- **The gates, at `0306d1c`:**
  - `node --check` passes on all four `tools/*.mjs`.
  - `node --test tools/*.test.mjs`: 61 tests, 61 pass, 0 fail.
- **The decoy gate, rerun.** I built a decoy repository and linked
  worktree in a temporary directory, and ran `node --test tools/*.test.mjs`
  with `GIT_DIR` set to the worktree's gitdir. It exits 0 with 61 of 61
  passing. The decoy's config, both `HEAD` files, `for-each-ref` and both
  `index` files are unchanged.
- **The preset gate, rerun.** `light`, `standard` and `auto` were each
  generated with `--ref 0306d1c…`, without `--github`, into a temporary
  directory, and each:
  - exits 0, and carries both prompts;
  - has no stray `{{…}}`. The review prompt's fenced text uses exactly
    the four placeholders it documents;
  - has no dangling relative link (22, 28 and 28 checked).
- **Privacy:** no private project, absolute local path or personal name in
  the diff or the pull request body. The public repository's own name
  appears only in the round-01 file's identity line.
- **The body against the diff:**
  - Its round-01 section matches the commit.
  - The cited lines match: `tools/scaffold.test.mjs:570-571`, `:591-594`,
    `:600`, `:614-624`, `:633-634`, and `CLAUDE.md:31-34`.
  - Its two break outputs agree with mine.
- **Wrapping:** every added line is 79 columns or fewer. Two lines are
  ragged: `CLAUDE.md:34`, and `reviews/review-prompt.md:125-126`.

— Claude Opus 5.5 (claude-opus-5-5), reviewer
No blocking finding remains.
