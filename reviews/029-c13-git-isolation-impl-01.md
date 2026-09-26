# Review 029, round 01: C13, git isolation and the review target

- **Revision:** `15a369aae19e583cfe931bd70c8b617a6acdecdd`, the head of pull
  request #35 (`r6/c13-git-isolation`), one commit on `main` at `d830a53`.
  It is the head commit I was given.
- **Target proof.** Fetch: `git fetch origin`, then
  `git fetch origin pull/35/head`. `gh pr view 35 --json headRefOid` gives
  `15a369a…`; `git ls-remote origin refs/heads/r6/c13-git-isolation` gives
  `15a369a…`; `git checkout --detach 15a369a…`, then `git rev-parse HEAD`
  gives `15a369a…`. The merge base with `origin/main` is `d830a53`, and
  `git rev-list --count origin/main..HEAD` is 1.
- **Files:** the pull request's 11 files, which equal
  `git diff --name-only origin/main...HEAD`: `ADOPT.md`, `CLAUDE.md`,
  `PRINCIPLES.md`, `presets/auto.json`, `presets/light.json`,
  `presets/standard.json`, `reviews/README.md`, `reviews/review-prompt.md`,
  `tools/post-record.test.mjs`, `tools/scaffold.mjs`,
  `tools/scaffold.test.mjs`.
- **Where I worked:** `.claude/worktrees/agent-a8209d0659eaaa676` (Claude
  Code's worktree isolation), `HEAD` `15a369a…`, detached, with the file
  list above. Scratch copies, decoys and generated runs were in temporary
  directories outside the repository, all deleted.
- **Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`), a fresh forked
  subagent that has not seen the implementation.
- **Mode:** Claude mode, per-change review, round 01. The brief was the
  main session's own, not `reviews/review-prompt.md`, which this change
  introduces.

## Findings

1. **blocking.** The shared protocol now briefs every change's reviewer
   with a prompt that an OpenCode-mode reviewer cannot pass.
   `PRINCIPLES.md:92-94` ("A change's reviewer is briefed with
   `reviews/review-prompt.md`") sits in *The verdict protocol*, which is
   "Shared across both modes". The prompt's first step
   (`reviews/review-prompt.md:34-39`) stops any reviewer whose `--git-dir`
   equals its `--git-common-dir`, and never lets it use the implementer's
   directory. `AGENTS.md:23-27` invokes OpenCode's reviewer as a subagent
   and says nothing about a worktree of its own, and nothing in the change
   says who creates one in that mode; the prompt names the briefing
   session only "in Claude mode" (`:4-5`). So an OpenCode project that
   follows the protocol as written gets a stop notice on every review.
   `ADOPT.md:216-218` writes the prompt into OpenCode adoptions as well.
   C13 puts (b) and (d) in `CLAUDE.md` only; the cross-mode reach is this
   change's own. **Fix:** scope `PRINCIPLES.md:92-94` to Claude mode ("In
   Claude mode, a change's reviewer is briefed with …"), and say in the
   prompt's preamble that it serves Claude mode. Giving OpenCode a
   reviewer worktree instead would be a new rule in `AGENTS.md`, beyond
   C13, and would need the owner's decision.

2. **non-blocking.** A fill-in-only prompt cannot name the sibling
   worktree. `CLAUDE.md:30-31` says that without the tool's isolation the
   main session creates the worktree in `<project>-work/` "and the brief
   tells the agent to work only there". But the brief is the prompt, and
   it is filled in "only" (`CLAUDE.md:51-52`; `reviews/review-prompt.md:5`)
   with four placeholders, none of them a path. Its own text, "the one
   your brief names (under ../<project>-work/)" (`:35-36`), points at
   nothing. Also, "the one your tool started you in" is limited to
   `.claude/worktrees/`, which leaves out a headless reviewer that the main
   session starts in the sibling directory. **Fix:** make the path follow
   from a placeholder, for example `../<project>-work/review-<first 12 of
   {{HEAD}}>`, which the main session creates and the prompt names. Or
   say "the worktree you were started in", without the parenthesis, and
   have `CLAUDE.md` say that the main session starts the reviewer there.

3. **non-blocking.** The identity check has no stop.
   `reviews/review-prompt.md:28-31` stops the review when "any step of
   WHERE YOU WORK or TARGET PROOF fails". IDENTITY CHECK (`:45-46`) is a
   section of its own, so a wrong `origin` is never named as a reason to
   stop, although `CLAUDE.md` makes it the first check of every brief.
   **Fix:** add IDENTITY CHECK to the STOPPING list, or end `:46` with
   "otherwise stop".

4. **non-blocking.** A stop notice without a remote has no path through
   the prompt. `PRINCIPLES.md:116-118` and `reviews/README.md:36-40` say
   that without a remote the stop notice is a line the next reviewer
   writes in its review file, quoting the notice. The prompt
   (`reviews/review-prompt.md:28-31`, `:90-100`) never tells a reviewer to
   write that line, and a fill-in-only brief cannot hand it the notice.
   **Fix:** add to OUTPUT a line for the no-remote case, for example:
   "Without a remote, if a stop notice on this change reaches you with
   this prompt, write it after your opening lines as reviews/README.md
   says". The prompt's preamble would then allow the briefing session to
   attach the notice.

5. **non-blocking.** The review file's number can collide.
   `reviews/review-prompt.md:93-95` takes "the next free number" when
   `{{HEAD}}` holds no earlier review of the change. Two r6 pull requests
   branched from the same `main` get the same number (this one's reviews
   and C8's, say). **Fix:** "the next number free on both {{HEAD}} and
   origin/{{BASE}}". The briefing session renumbers on a clash when it
   commits the file.

6. **non-blocking.** Two parts of the environment clearing are not pinned
   by any test. I broke each in a scratch copy and ran the `--github`
   test (`tools/scaffold.test.mjs:561-626`). Both breaks stayed green:
   - over-stripping `GIT_CONFIG_SYSTEM`, which C13 names as a variable
     that passes through (adding `|CONFIG_SYSTEM` to `CALLER_GIT`,
     `tools/scaffold.mjs:91-92`). The pass-through list at
     `tools/scaffold.test.mjs:609` checks `GIT_CONFIG_GLOBAL` and
     `GIT_CONFIG_NOSYSTEM` only.
   - dropping the Windows upper-casing (`tools/scaffold.mjs:96`). The test
     sets every name in upper case.

   **Fix:** set `GIT_CONFIG_SYSTEM` to an empty file in the test's `env`,
   and add it to the list at `:609`. On `win32`, set one named variable
   in mixed case, for example `Git_Config_Parameters` in place of
   `GIT_CONFIG_PARAMETERS`; `isNamed` already ignores case.

7. **non-blocking.** When the tag lacks the prompt, adoption mixes
   revisions. `ADOPT.md:261-262` always writes the prompt from `main`, but
   `:260-261` says "An item from `main` is taken with all of its changes,
   in every file it touches". Step 4.4 (`:174-177`) also lets the owner
   decline the item that step 2 marks. If the owner declines it, the
   adopted prompt relies on text that the tag's files lack: the fetch in
   `PRINCIPLES.md`'s target proof, `CLAUDE.md`'s review-target bullet
   (`reviews/review-prompt.md:13-14`), and `reviews/README.md`'s
   target-proof items. Separately, `:67-68` reads the prompt at
   `origin/main` in step 1, before step 2.1 records `main`'s commit,
   against the rule at `:35-37`. **Fix:** when the tag lacks the prompt,
   say in step 4.4 that the item adding it is taken whole and is not
   optional, and read it at `main`'s commit as step 2.1 records it.

8. **non-blocking.** The pull request body leaves its done-when unticked.
   Every box is `- [ ]`, although the body's own check output proves most
   of them, and `PRINCIPLES.md:221` asks for "the done-when, ticked".
   **Fix:** tick what the check output proves. Leave the review-record
   item until the last clean round, as PRs #33 and #34 did.

## Verified

- **Identity:** `git remote get-url origin` names
  `diegoami/harness_template`.
- **The gates, at `15a369a`:**
  - `node --check` passes on all four `tools/*.mjs`.
  - `node --test tools/*.test.mjs`: 61 tests, 61 pass, 0 fail.
- **C9 as extended.** I ran my own script, not the pull request's.
  `light`, `standard` and `auto` were each generated with
  `--ref 15a369aae19e583cfe931bd70c8b617a6acdecdd`, without `--github`,
  into a temporary directory, and each:
  - exits 0, and carries `reviews/milestone-prompt.md` and
    `reviews/review-prompt.md`;
  - has no `{{…}}` except the milestone prompt's documented placeholders
    and, in `reviews/review-prompt.md` only, its four (`REPO`, `PR`,
    `HEAD`, `BASE`). The prompt's fenced text uses exactly those four;
  - has no dangling relative link (22, 28 and 28 links checked).
- **The decoy gate, reproduced.** I built a decoy repository and a linked
  worktree in a temporary directory. I ran `node --test tools/*.test.mjs`
  with `GIT_DIR` set to the decoy worktree's gitdir (under
  `.git/worktrees/`), and compared, before and after, the decoy's
  `config`, both `HEAD` files, `for-each-ref`, and both `index` files:
  - at `15a369a`: exit 0, 61 of 61 pass, all six unchanged;
  - at `d830a53`, in a scratch clone: exit 1, 31 fail. The config went to
    `bare = true` with a `[user]` of `t`, the `wt` ref moved, and the
    worktree's index changed. This matches the source report;
  - at `15a369a` without the clearing loop in `tools/scaffold.test.mjs`:
    exit 1, 31 fail. The decoy is unchanged, because the scaffold strips
    its own children's environment;
  - with the test identity removed from both test files, and `HOME` and
    `USERPROFILE` pointed at an empty directory (no system identity on
    this machine): 20 fail. With the identity in place, 61 pass. So the
    gate does not depend on the machine's git config.
- **The `--github` test fails on its own assertions.** I made each break
  in a scratch copy and ran only that test:
  - The fake `gh` receives the named variables, which trips
    `received them` (`:608`). This happens without `env` on
    `gh api user`, and without `env` on `inTarget`. It also happens when
    the regex drops any one of `CONFIG_PARAMETERS`, `PREFIX`,
    `ALTERNATE_OBJECT_DIRECTORIES`, `INDEX_FILE`, or `KEY`/`VALUE`.
  - Over-stripping every `GIT_*` trips `lost GIT_CONFIG_GLOBAL`
    (`:610`).
  - The exit-0 check (`:612`) trips when the regex drops any one of
    `WORK_TREE`, `COMMON_DIR`, `OBJECT_DIRECTORY` or `CONFIG_COUNT`, or
    when `git init`, `add`, `commit` or `push` loses
    `env`. It also trips when `gitOutput` or `gitShow` loses `env`: the
    ref then resolves in the decoy.
  - With the decoy assertion (`:622`) moved first, it goes red on its own
    for `git init`, `add` and `commit`, and for `inTarget`.
- **Environment clearing.** `tools/scaffold.mjs` starts seven child
  processes, and all seven get `CHILD_ENV`: `gitOutput` and `gitShow` on
  the harness (`:106-117`); `git init`, `add`, `commit`, `gh repo create`
  and `git push` in the new project (`inTarget`, `:772-814`); and
  `gh api user` (`:794-797`). `CALLER_GIT` (`:91-92`) is exactly C13's
  eleven. Everything else passes through, `PATH` and the credential and
  SSH variables among them. The test's pass on Windows shows that `gh` is
  still found on `PATH`.
- **The implementer's readings:**
  1. Sound. Without it, `--ref` resolves in the decoy (see above).
  2. Sound as defence; no test pins it (finding 6).
  3. The test sets all eleven, `KEY_0` and `VALUE_0` included, and
     `core.bare=true` is the injected configuration. The pass-through
     check misses `GIT_CONFIG_SYSTEM` (finding 6).
  4. Sound. The preload acts only when node runs as `gh`, and exits
     before node looks for a script. `GH_HOST=fake-gh.invalid` is a
     reasonable safety net.
  5. Acceptable. The first proof is the gate command itself, and the
     procedure in the body checks both `HEAD` files, `for-each-ref` and
     both index files. I reproduced it.
  6. The detached checkout, the main-checkout check (it prints two lines
     that differ here), the plain `git fetch origin` without a pull
     request, and the shared `{{REPO}}` are sound. See findings 2 to 5.
  7. `reviews/README.md:15-20` requires the fetch, the relative worktree
     and the head commit given.
  8. The text matches the round-03 decision. Leaving the milestone
     prompt's allowance unrestricted matches C9's original wording. See
     finding 7.
  9. Sound.
  10. `tools/post-record.mjs` runs git only in the project's own checkout,
      never in a throwaway repository, so C13's clause does not reach it.
      For `AGENTS.md`, see finding 1.
- **The contract, clause by clause:**
  - *Creation paths:* `PRINCIPLES.md:200-202`, literal.
  - The two test files' clearing and fixed identity:
    `tools/post-record.test.mjs:34-41` and `tools/scaffold.test.mjs:37-44`.
  - The worktree and the report of where the agent worked:
    `CLAUDE.md:28-36`.
  - (a): `PRINCIPLES.md:82-88`.
  - (b) and (d): `CLAUDE.md:26-27` and `:48-58`.
  - (c): four placeholders, fill-in only. The identity check is at `:45`,
    the fetch at `:49-52`, the worktree at `:34-39`, and the report of
    where it worked at `:40-43` and `:101-102`.
  - The prompt ships in every preset, and `ADOPT.md:66-69`, `:216-218`,
    `:261-262` and `:296-298` read it, write it and allow its
    placeholders.
  - The ownership row is `PRINCIPLES.md:18`.
- **Scope:** nothing of C8 (no dry run), C10 (`verification/` untouched)
  or C11. The leftovers of PRs #31 and #33 are not in the diff.
- **Privacy:** no private project, no absolute local path, and no personal
  name in the diff or the pull request body.
- **The body against the diff:** the cited lines match, and its fail-first
  outputs agree with what I reproduced. Every added Markdown line is 79
  columns or fewer.

— Claude Opus 5.5 (claude-opus-5-5), reviewer
One blocking finding remains (finding 1).
