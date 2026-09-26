# Review: claim C13 added to r6 (PR #34), round 02

- **Revision covered:** `4e5be57b650119cd7e64ea444b269e5c874acef1`
  (branch `r6/add-c13`, base `main` at
  `f52bc9e4c8073716c04ac7ea551bf4ec67a57e08`).
- **Files reviewed:** `BACKLOG.md` (+105 −2),
  `docs/sources/hook-git-env-report.md` (+42, new),
  `docs/sources/ic2-worktrees.md` (+41, new) and
  `reviews/028-add-c13-impl-01.md` (+202, new: round 01, my own file,
  judged only as posted). I got the list from
  `gh pr view 34 --json files`, and from `git diff --stat f52bc9e..4e5be57`,
  which gives the same four files with the same counts.
- **Target proof:** `git remote get-url origin` is
  `git@github.com:diegoami/harness_template.git`. I ran `git fetch origin`
  and then checked out the head, detached, in this reviewer's own worktree
  (`.claude/worktrees/agent-afb9012c07f4bda14`, relative to the
  repository), the one round 01 used. The PR head from
  `gh api repos/diegoami/harness_template/pulls/34` is `4e5be57b…`, open,
  with base `main` at `f52bc9e4…`. `git ls-remote origin
  refs/heads/r6/add-c13` gives `4e5be57b…`. `git merge-base HEAD
  origin/main` is `f52bc9e4…`, which is also `origin/main`. All four
  agree. The branch holds five commits: `c89a674`, `b580ee2`, `7018a38`,
  `de63e1d` (round 01) and `4e5be57` (the widening and the answers).
- **Read for context, not in the change:** `PRINCIPLES.md` (the ownership
  map, the verdict protocol, *Creation paths*, *Owner decisions*,
  *Milestones*), `CLAUDE.md`, `reviews/milestone-prompt.md` and its
  placeholders, `presets/*.json`, `tools/scaffold.mjs`,
  `tools/scaffold.test.mjs`, `tools/post-record.mjs`,
  `tools/post-record.test.mjs`, and the PR body and its one comment.
- **Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`), the round-01 reviewer
  resumed; it has not seen the implementation.
- **Mode:** Claude Code, per-change review. There is no marker.

## Round 01's findings

1. **Fixed.** The 2026-09-25 entry (`BACKLOG.md:887-898`) now names the
   worktree guidance in the question, says "all of it" joins r6, and says
   that "defect fix now, rule in r7" would have deferred the *Creation
   paths* clause and the worktree guidance.
2. **Fixed.** The scaffold part (`BACKLOG.md:187-193`) covers every child
   process in the new project, `git` and `gh` alike, names
   `gh repo create --source … --remote origin`, and lists the variables.
   The proof adds a fake `gh` that records its environment. See findings 1
   and 2 below for what remains, neither blocking.
3. **Fixed.** The tests clear every `GIT_*` from their own process
   (`:193-196`), and the gate's proof runs under a linked-worktree decoy and
   checks its config, `HEAD`, refs and index (`:223-226`).
4. **Fixed.** "`CLAUDE.md` says that every forked agent reports …"
   (`:201-205`).
5. **Fixed.** `docs/sources/ic2-worktrees.md:5-7` gives `d8b4e50`, drops
   the date, and names `7b644d3` as the file's last change, which is
   correct.
6. **Fixed.** `docs/sources/ic2-worktrees.md:37-41` now says "Some of the
   owner's projects run from Claude Desktop, such as boar_life", which no
   longer contradicts the Imperial Conquest 2 sentence.

## Findings

1. **non-blocking — "every `GIT_CONFIG_*`" is too wide, and it is not
   "repository-locating".** `BACKLOG.md:190-193` clears, for every child
   process in the new project, "the caller's repository-locating git
   variables", including "every `GIT_CONFIG_*`". That family includes
   `GIT_CONFIG_GLOBAL`, `GIT_CONFIG_SYSTEM` and `GIT_CONFIG_NOSYSTEM`,
   which a hook does not export. They are the user's own choice of config
   file, and they can hold the identity the first commit needs and the
   credential helper the push needs. A user whose global config lives
   elsewhere through `GIT_CONFIG_GLOBAL` would get the "first commit
   failed" path (`tools/scaffold.mjs:757-763`) or a push without its
   credentials. The config variables a hook can pass on are
   `GIT_CONFIG_PARAMETERS` (from `git -c`) and `GIT_CONFIG_COUNT` with
   `GIT_CONFIG_KEY_<n>` and `GIT_CONFIG_VALUE_<n>`.

   On the implementer's question: the named list is the right choice for
   the new project, which is a real repository and not a throwaway. Letting
   `GIT_AUTHOR_*` and `GIT_COMMITTER_*` through is acceptable: at worst they
   set the identity of the new project's own first commit, and they write
   nothing in another repository. Clearing every `GIT_*` there would drop
   an identity or credentials that the user set on purpose. The same point
   applies, in reverse, to the tests (`:193-196`). `tools/scaffold.test.mjs`
   sets no identity, so once the tests clear every `GIT_*`, the scaffold's
   commit in the tests depends on the machine's `~/.gitconfig`.

   *Fix:* name the config variables exactly
   (`GIT_CONFIG_PARAMETERS`, `GIT_CONFIG_COUNT`, `GIT_CONFIG_KEY_<n>`,
   `GIT_CONFIG_VALUE_<n>`) instead of "every `GIT_CONFIG_*`". Call the list
   "the variables that locate a repository or inject configuration". Say
   that the tests, after clearing, set a fixed test identity
   (`GIT_AUTHOR_NAME` and the three like it), so the gate does not depend
   on the machine.

2. **non-blocking — the `--github` test leaves the push unspecified.** The
   proof (`BACKLOG.md:226-231`) runs the scaffold with `--github` against a
   fake `gh`, then checks the fake's environment and the decoy. After
   `gh repo create`, the scaffold runs a real `git push -u origin main`
   (`tools/scaffold.mjs:787-790`). A fake `gh` adds no `origin`, so the
   push fails and the scaffold exits 1 whether or not its environment was
   cleared, and the decoy stays unchanged either way. The claim's "every
   child process … `git` and `gh` alike" is then untested for the push,
   and the test must also be sure the push never reaches anything real
   (*Creation paths*). *Fix:* say that the fake `gh` sets `origin` to a
   local bare repository in the temporary directory, that the test checks
   the scaffold exits 0 and the bare repository received `main`, and that
   the decoy is unchanged.

3. **non-blocking — "the worktree it worked in" would put one machine's
   path in public review files.** The new behavioural proof
   (`BACKLOG.md:231-233`) says every later per-change review records "the
   worktree it worked in". A reviewer's worktree is an absolute path on
   one machine, and the slot's never-echo item (`CLAUDE.md`, *Project
   slot*) says one machine's paths are not echoed, and a path outside the
   repository is described relative to it. Review files are posted
   publicly. *Fix:* "the worktree it worked in, as a path relative to the
   repository (for example `.claude/worktrees/<name>` or
   `../<project>-work/<name>`)". The added proof itself is a good one: it
   makes (a), (b) and (d) observable at the candidate, which the text
   alone does not.

4. **non-blocking — whether the scaffold ships `reviews/review-prompt.md`
   is left open, and shipping it would collide with C9.** Part (c)
   (`BACKLOG.md:212-217`) creates a prompt with four placeholders (the
   repository, the pull request, the head commit and the base). C9, which
   is fixed, says a generated run leaves "no `{{…}}` other than the
   placeholders `reviews/milestone-prompt.md` documents"
   (`BACKLOG.md:160-165`). That file documents `{{REPO}}` but no pull
   request, head or base placeholder. Every preset ships
   `reviews/milestone-prompt.md` (`presets/*.json`). So if the per-change
   prompt ships too, C9 fails at the candidate unless C9 changes. If it
   does not ship, no shipped file (`PRINCIPLES.md`, `CLAUDE.md`) may link
   it, or C9's dangling-link check fails. Neither is decided here. Also, the
   ownership map (`PRINCIPLES.md:10-25`) has a row for the milestone prompt
   and would need one for this prompt. *Fix:* settle it in C13 before the
   implementation PR. Either (i) the scaffold ships it in every preset and
   C9's exception covers the placeholders it documents: a visible, dated
   extension of C9 under the 2026-09-26 decision, which the owner should
   confirm, since it changes a fixed claim. Or (ii) it is harness-only in
   r6, no shipped file links it, and shipping it is listed under *Not in
   r6*. Add the ownership-map row to (c).

5. **non-blocking — "the implementer" in (c) and (d) is not the role that
   briefs a reviewer in Claude mode.** `BACKLOG.md:214` says the
   implementer "only fills in" the prompt, and `:217-220` says the
   implementer names the head commit GitHub reports. In Claude mode, the
   forked implementer "opens a pull request, and stops and reports"
   (`CLAUDE.md`, *The process*). The main session holds the reports and
   starts the reviewer, as it did for this round. Read literally, a
   milestone reviewer could find (d) met by the forked implementer's
   report while the main session still hands the reviewer a stale id,
   which is the failure the decision is about. *Fix:* name both roles, for
   example "the implementer reports the head commit GitHub reports
   (`gh pr view <N> --json headRefOid`), after checking it equals the
   commit it pushed, and the main session fills in the prompt from that
   report". In OpenCode mode, the implementer can stay.

6. **non-blocking — the fetch in (a) assumes a pull request.**
   `BACKLOG.md:206-210` has the reviewer fetch `origin` and
   `pull/<N>/head` before a missing revision counts as a wrong target.
   `PRINCIPLES.md`'s target proof also covers a change with no pull
   request, and a project with no remote. *Fix:* "where the change has a
   pull request, it fetches `origin` and `pull/<N>/head`; otherwise
   `origin` where a remote exists".

## Verified

- **The widening matches the decision as reported.** Parts (a) to (d) at
  `BACKLOG.md:206-220` are the four the orchestrator reports: the fetch of
  `origin` and `pull/<N>/head`, the reviewer's own fresh detached
  worktree, a fixed `reviews/review-prompt.md` that is only filled in, and
  the head as GitHub reports it. The heading and the "Widened on
  2026-09-26" sentence (`:247-253`) say C13 becomes "where agents work and
  how they find the target".
- **Not a change to a landed claim.** C13 is fixed only when PR #34 lands
  (*Milestones*), so widening it within the PR is correct. The widening is
  material, and this round reviews it.
- **The 2026-09-26 Notes entry** (`BACKLOG.md:901-914`) has the form of
  *Owner decisions* and the entries before it. It gives the question
  paraphrased, when it was asked, the choice ("Extend C13 in PR #34"), the
  reason, the two alternatives (a new claim C14, and "later, in r7"), "The
  recommended default, taken", and the evidence, the merge of PR #34, which
  is pending (not a finding). Nothing in C13 or the Notes is presented as
  the owner's beyond the two decisions as reported. The PR body flags the
  implementer's own choices as such.
- **Placement of (b) and (d) in `CLAUDE.md`,** which the implementer asked
  about: this is right. The ownership map gives `CLAUDE.md` the Claude Code
  process, the fresh-context review and its reviewer. (a) is a target-proof
  rule for both modes and belongs in `PRINCIPLES.md`, as C13 says. Finding
  5 is about the role (d) names, not about where it lives.
- **The sub-bullet layout** reads well. Each part has an italic label.
  The proof is a sub-bullet of its own. The "Added" paragraph, after a
  blank line and indented two spaces, stays part of C13's list item in
  Markdown. Every other claim is one paragraph, but C13 now has three
  parts, so the layout earns its place.
- **The proof** is runnable or readable part by part: the text by
  `file:line`, the prompt's placeholders, two tests shown to fail before
  the fix, and the review files after C13 lands. Findings 1 to 3 are
  refinements, not gaps that make a part untestable.
- **Scope.** Against round 01, `4e5be57` changes only `BACKLOG.md` (the
  *In r6* clause, C13 and the two Notes entries) and
  `docs/sources/ic2-worktrees.md`. C1–C12, D1–D11 and *Not in r6* are
  unchanged.
- **Round 01's posting.** `reviews/028-add-c13-impl-01.md` at the head
  equals the file I wrote. The PR's one comment equals it, apart from the
  final newline that `--jq` adds. The comment was posted at
  18:45:00Z, after `de63e1d` (18:44:51Z) and before `4e5be57` (18:47:36Z).
- **Private detail.** No file in the change, commit message of
  `de63e1d` or `4e5be57`, or the PR body names the private project or any
  of its file names, paths, commit ids or identity values. The only
  occurrence under `BACKLOG.md` is the pre-existing *Planning* candidate
  (`:630`, moved from `:588` by the added lines), which is out of scope.
- **The PR body** matches the diff: the four files and 390 insertions and
  2 deletions, the five commits, C13's parts and proof, both Notes entries,
  the answers to round 01 (each checked above), and *Left out*. Its
  done-when items are unticked and its reviewed revision is "pending", as
  expected before a clean round.
- **Wrapping.** No added line in `BACKLOG.md` or the sources exceeds 79
  columns. `BACKLOG.md:43` ends short after "the", a reflow nit.
- **Gates at `4e5be57`:** `node --test tools/*.test.mjs` gives 60 pass,
  0 fail; `node --check` passes on all four `tools/*.mjs`.
- **Clean-up.** Nothing was posted, committed or pushed. My untracked copy
  of round 01 was moved aside before the checkout, and it is identical to
  the committed file.

— Claude Opus 5.5 (claude-opus-5-5), reviewer
No blocking finding remains.
