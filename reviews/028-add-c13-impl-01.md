# Review: claim C13 added to r6 (PR #34), round 01

- **Revision covered:** `7018a38f9373895c49521e1d37e0bbc50c638185`
  (branch `r6/add-c13`, base `main` at
  `f52bc9e4c8073716c04ac7ea551bf4ec67a57e08`).
- **Files reviewed:** `BACKLOG.md` (+46 −2),
  `docs/sources/hook-git-env-report.md` (+42, new) and
  `docs/sources/ic2-worktrees.md` (+40, new). I got the list from
  `gh pr view 34 --json files`, and from `git diff --stat f52bc9e..7018a38`,
  which gives the same three files with the same counts.
- **Target proof:** `git remote get-url origin` is
  `git@github.com:diegoami/harness_template.git`. The PR head from
  `gh api repos/diegoami/harness_template/pulls/34` is `7018a38f…`, open,
  with base `main` at `f52bc9e4…`. `git ls-remote origin
  refs/heads/r6/add-c13` gives `7018a38f…`. The local checkout is detached
  at `7018a38f…`; `git merge-base HEAD origin/main` is `f52bc9e4…`, which
  is also `origin/main`. All four agree. The branch holds three commits,
  `c89a674`, `b580ee2` and `7018a38`.
- **Read for context, not in the change:** `PRINCIPLES.md` in full,
  `CLAUDE.md`, `reviews/README.md`, the r6 section of `BACKLOG.md` and its
  *Notes*, r5's C12 and its "Added on" paragraph, PR #24's body,
  `tools/scaffold.mjs`, `tools/post-record.mjs`, `tools/post-record.test.mjs`,
  `tools/scaffold.test.mjs`, Imperial Conquest 2's `docs/build-process.md`
  §7 (read-only, in the sibling checkout), and the PR body.
- **Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`), a fresh-context
  subagent in its own worktree that has not seen the implementation.
- **Mode:** Claude Code, per-change review. There is no marker.

## Findings

1. **blocking — the recorded decision leaves out C13's worktree half.**
   The Notes entry (`BACKLOG.md:845-855`) paraphrases the question as
   "where the git-environment fix goes": the tools' git calls plus a test,
   a clause in *Creation paths*, and the two sources. It does not name the
   worktree guidance: `CLAUDE.md` saying how a forked agent's worktree is
   obtained, and every forked agent reporting where it worked, checked by
   the main session (`BACKLOG.md:188-195`). Yet C13 carries that half "by
   the owner's decision" (`BACKLOG.md:198-199`). As the orchestrator
   reports the question, the second option's description said the
   *Creation paths* clause and the worktree guidance would wait for r7, so
   the owner's "Join r6" does cover both halves. The record should show
   that; as written, a later reader sees half a claim that the recorded
   decision does not name, and cannot tell the owner's scope from the
   implementer's (PR #24's *Left out* corrects the same confusion).
   *Fix:* name the worktree guidance in the paraphrased question, for
   example "…, a clause in *Creation paths*, the worktree guidance in
   `CLAUDE.md` (how a forked agent's worktree is obtained, and its report
   of where it worked), and as sources …", and say what the alternative
   "defect fix now, rule in r7" deferred (the clause and the worktree
   guidance). While there, reflow `:850`, which ends after "it".

2. **blocking — the GitHub step's environment is not testable, and it
   leaves out `gh repo create`.** C13 says every git call
   `tools/scaffold.mjs` makes in the new project clears the `GIT_*`
   variables, "(its push to GitHub keeps only what reaching GitHub needs)"
   (`BACKLOG.md:185-187`). Two problems:
   - "What reaching GitHub needs" names no variable, so a milestone
     reviewer cannot decide whether the push is MET: `GIT_SSH_COMMAND`,
     `GIT_ASKPASS` or `GIT_CONFIG_*` may be needed or not, and nothing says
     which repository-locating ones must go.
   - Before the push, `tools/scaffold.mjs:773-786` runs
     `gh repo create <owner>/<name> --source <target> --remote origin` in
     the new project. `gh` adds the `origin` remote by running git there,
     with the environment the scaffold hands it, so under an inherited
     `GIT_DIR` the remote lands in the other repository's config. That is
     not a "git call `tools/scaffold.mjs` makes", so the claim as worded
     can be MET while that write still happens. Not reproduced: it is a
     creating path (*Creation paths*); it follows from the decoy result
     under *Verified*.

   The decoy test cannot reach this step either, since it runs only
   against fakes (C8's dry run is not landed yet). *Fix:* reword to cover
   every child process the scaffold starts in the new project, `git` and
   `gh` alike, and state the rule for the GitHub step exactly: either it
   clears the same named repository-locating variables as the rest (for
   example the seven the report lists, `hook-git-env-report.md:31-33`),
   or it clears every `GIT_*` except a named list. Add to the proof: a
   fake `gh` (as C8's test uses) records the environment it receives, and
   holds none of the cleared variables.

3. **non-blocking — the proof checks writes only.** The proof
   (`BACKLOG.md:195-198`) shows "the decoy's config and refs unchanged".
   Reads that go to the wrong repository pass it. The tests call
   `tools/post-record.mjs`'s own git, not a test helper:
   `defaultCommitted` at `tools/post-record.test.mjs:515-520` and `:631`,
   `:643` runs `git -C <dir> ls-files` and `diff` (`post-record.mjs:272`,
   `:275`). If the fix clears the variables only in the tests' helpers,
   those calls still read the decoy under a hook, and the test goes red
   (or passes by chance). The claim's "every throwaway repository in
   `tools/*.test.mjs`" can be read to cover that, but only if the test
   process itself drops them. *Fix:* say that the tests clear the `GIT_*`
   variables from their own process environment, so all they spawn,
   the tools included, is cut off; and make the proof "the gate,
   `node --test tools/*.test.mjs`, run with `GIT_DIR` pointed at a decoy,
   passes and leaves the decoy's config, `HEAD`, refs and index
   unchanged". A decoy that is a linked worktree's gitdir also reproduces
   the `core.bare` write (*Verified*); a plain `.git` does not.

4. **non-blocking — the "reports where it worked" sentence reads as
   behaviour, but its proof is the text.** `BACKLOG.md:192-195` says
   "Every forked agent reports where it worked … and the main session
   checks that before it acts" as a sentence of its own, not under
   "`CLAUDE.md` says". The proof is "the text". A milestone reviewer who
   reads it as behaviour finds no record of those reports, since they go
   only to the main session, and must answer COULD NOT TEST. *Fix:* scope
   it, "`CLAUDE.md` says that every forked agent reports …"; or, if the
   behaviour is meant, name where the report is recorded (for example the
   review file's opening lines) and add that to the proof.

5. **non-blocking — the IC2 source's reading date is wrong.**
   `docs/sources/ic2-worktrees.md:5-6` says §7 was "read at commit
   `d8b4e50` on its `main` on 2026-09-25". `d8b4e50` is on IC2's `main`,
   but its commit date is 2026-09-26 10:40 +0200, so it cannot have been
   read on 2026-09-25. The file is unchanged since `7b644d3`
   (2026-09-23), so the summary's content is right. *Fix:* "on
   2026-09-26", or cite `7b644d3`, the last commit to touch the file.

6. **non-blocking — the contrast contradicts itself.**
   `docs/sources/ic2-worktrees.md:36-40`: "Imperial Conquest 2's sessions
   run from the command line" and then "The owner's projects run from
   Claude Desktop", while `:3` calls Imperial Conquest 2 "the owner's
   repository". `7018a38` changed a neutral "In Claude Desktop, …" into
   this statement about all of the owner's projects, under a heading that
   attributes it to the owner. *Fix:* "The owner's other projects run from
   Claude Desktop, …", or restore "In Claude Desktop, …".

## Verified

- **The latent defect**, reproduced in the scratchpad only, never in a
  real repository:
  - With `GIT_DIR` pointed at a decoy repository's `.git`,
    `git -C <scratch> init` printed "Reinitialized existing Git repository"
    for the decoy, and `git -C <scratch> config user.email x@y` added
    `[user] email = x@y` to the decoy's config. The scratch directory stayed
    empty, with no `.git`. So `GIT_DIR` overrides `-C`, as C13 says.
  - With `GIT_DIR` pointed at a linked worktree's gitdir
    (`<decoy>/.git/worktrees/wt`), the same two commands set
    `core.bare = true` and added the `[user]` block in the main
    repository's config. That is the report's mechanism exactly, including
    its "the push was made from a worktree".
  - On `main`, `tools/scaffold.mjs:750-756` runs `git init`, `add` and
    `commit` with `cwd: target` and no `env`, and the throwaway repositories
    at `tools/post-record.test.mjs:508` and `:613-614` do the same.
    *Creation paths* (`PRINCIPLES.md:182-192`) does not mention the git
    environment. The PR body's line references hold.
- **C13's form.** It is numbered after C12, has a title, a proof that can
  be run or read, and an "**Added on 2026-09-25** by the owner's decision
  (PR #34), a scope change:" paragraph with its sources linked and its
  reason, in the form of r5's C12 (`BACKLOG.md:445-450`). The proof asks
  for the test to fail before the fix, as gates discipline 3 does. Apart
  from findings 2–4, it is not weaker than its intent.
- **Within the owner's decision.** Taking the options as the orchestrator
  reports them, "Join r6" covers both halves: the git isolation (the
  tools, the test, the *Creation paths* clause) and the worktree rule with
  its report-and-check. The reason in C13 (`:209-211`) and in the Notes
  (`:851-853`) matches the recommended option's description. Nothing else
  is presented as the owner's. The evidence, the owner's merge of PR #34,
  is pending, which is not a finding (*Owner decisions*).
- **The Notes entry's form** follows *Owner decisions* and the entries
  before it: a bold dated mark, "asked in conversation", the question
  paraphrased and said to be, the choice, the reason, the two
  alternatives, "The recommended default, taken", and the evidence.
- **Scope.** The diff touches only `BACKLOG.md` and the two new sources.
  In `BACKLOG.md` it changes the *In r6* paragraph (`:40-43`), adds C13
  (`:181-211`) and adds the Notes entry (`:845-855`); C1–C12, D1–D11 and
  the *Not in r6* list are unchanged.
- **The sources.** Both carry a source header, say they are a summary and
  "a **source**, not a rule of this harness", and link C13 and each other;
  the relative links resolve. Neither holds a secret, an absolute path or
  an identity value; IC2 is named by the relative `../imperial_conquest_2`.
  The IC2 summary matches §7 at IC2's `main`: where an agent starts, the
  quoted "the whole cause of the 2026-09-18 review failures", sibling
  `ic2-work\T<nn>` worktrees, the detached reviewer checkout, and the
  four-line "say where you are working" block the main session checks. It
  leaves out the inline sweep and the detach-before-finishing step, which
  C13 does not use. boar_life does hold worktrees under
  `.claude/worktrees/`, as `:39-40` says.
- **Private detail.** The current tree's two sources and C13, and the PR
  body, name no private project, no file name or path of it, no commit id
  of it and no identity value; the report says "a placeholder identity".
  The earlier commits `c89a674` and `b580ee2` still name it, which the
  owner accepted (no history rewrite). Out of scope, flagged for the
  owner: the project's name was already public on `main` before this PR,
  not only in the *Planning* candidate (`BACKLOG.md:588`) but in
  `docs/archive/` (one file is named after it), `design/002`, `design/003`,
  `design/004`, `reviews/006-r4-milestone-01.md` and three
  `reviews/007-*` files, some with its file paths. This PR removes its
  details from the new material, but not the name's public presence.
- **The PR body** matches the diff: three files, 128 insertions and 2
  deletions, the three commits as described, C13's contents, the sources'
  contents, and the line references above. Its done-when items are
  unticked and its reviewed revision is "pending", as expected before a
  clean round.
- **Wrapping.** No added line exceeds 79 columns.
- **Gates at `7018a38`:** `node --test tools/*.test.mjs` gives 60 pass,
  0 fail; `node --check` passes on all four `tools/*.mjs`. The working
  tree was clean after the tests.
- **Clean-up.** Nothing was posted, committed or pushed; nothing changed
  in Imperial Conquest 2 or boar_life, which were only read.

— Claude Opus 5.5 (claude-opus-5-5), reviewer
Two blocking findings remain (1 and 2).
