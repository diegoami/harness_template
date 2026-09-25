# Review: Orchestrated Claude mode, no owner sessions (PR #31), round 01

- **Revision covered:** `301d461d35de056c99b682530a646a439db05bb1`
  (branch `r6/orchestrated-mode`, base `main` at
  `c023b59e51a4cb9ebdaf1c262c303041d73b42d4`).
- **Files reviewed:** `CLAUDE.md` (+32 −11), `PLAN.md` (+5 −1) and
  `PRINCIPLES.md` (+8 −4), the three files in the change. I got the list
  from `gh pr view 31 --json files`, and from
  `git diff --name-only c023b59..301d461`, which gives the same three.
- **Target proof:** `git remote get-url origin` is
  `git@github.com:diegoami/harness_template.git`. The PR head from
  `gh api repos/diegoami/harness_template/pulls/31` is `301d461d…`, open,
  with base `main` at `c023b59e…`. `git ls-remote origin
  refs/heads/r6/orchestrated-mode` gives `301d461d…`. The local checkout is
  detached at `301d461d…`, and `git merge-base HEAD origin/main` is
  `c023b59e…`. All four agree.
- **Read for context, not in the change:** `BACKLOG.md` (*Release 6: scope
  and claims*, and the pgn-postmortem notes at lines 497–527), `AGENTS.md`,
  `README.md`, `reviews/README.md`, `tools/scaffold.mjs` (the merge lines),
  and `docs/sources/pgn-postmortem-field-report.md`, *Addendum*, items 6
  and 8.
- **Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`), a fresh-context
  subagent in its own worktree that has not seen the implementation.
- **Mode:** Claude Code, per-change review. There is no marker.

## Findings

1. **blocking. The main session asks the owner for the merge even under
   `merge: auto`.**
   - `CLAUDE.md:18-19`: "It asks the owner for the merge and writes the
     completion notes." The sentence has no condition. C1 says only "asks
     for the merge"; "the owner" is the implementer's addition.
   - The same file says the owner merges "unless the project slot records
     `merge: auto`" (`CLAUDE.md:52-53`), and so do `PLAN.md:48-49` and
     `PRINCIPLES.md` (*Merge policy*). Under `auto` a change merges when
     its conditions hold, without the owner.
   - This ships. The `auto` preset, generated at `301d461`, has this text at
     its `CLAUDE.md:18-19`, and its slot says "**merge:** auto" and "the
     implementer merges with `gh pr merge --squash --delete-branch`". So a
     generated `auto` run is told both to ask the owner and that the
     implementer merges. Also, the orchestrated implementer "stops and
     reports" after opening the PR (`CLAUDE.md:23-24`), so it is no longer
     the one who can merge.
   - `PRINCIPLES.md:27-28` makes a contradiction between files a defect,
     fixed in the change that found it.
   - *Fix:* make the sentence conditional. For example: "It asks the owner
     for the merge, or, where the slot records `merge: auto`, merges when
     the slot's conditions hold; and it writes the completion notes." The
     scaffold's slot line (`tools/scaffold.mjs:264`, and the README line at
     `:362`) names "the implementer" as the one who merges. Under the new
     shape that should be the main session. Record it in *Left out* for
     C6/C7, since the slot is C6's.

2. **non-blocking. The identity check can be read as leaving out the
   reviewer's brief.**
   - `CLAUDE.md:11-12` contrasts "a forked implementer and a fresh
     reviewer", and `CLAUDE.md:28` calls the reviewer "a separate fresh
     subagent", not a forked one. So "Every forked brief begins with a
     repository identity check" (`CLAUDE.md:36`) can be read as covering
     only the implementer.
   - The pitfall the check guards against applies just as much to the
     reviewer. Its worktree is also made from the directory the main
     session is in (source, item 8, *PITFALLS MET*). This review's own
     brief began with the check, so the practice is right; only the text
     is loose.
   - *Fix:* write "Every subagent's brief, the implementer's and the
     reviewer's, begins with …". Or call the reviewer a forked subagent
     too, which the definition at `PRINCIPLES.md:311-312` allows.

3. **non-blocking. The brief is described in two places, and the identity
   check is in only one of them.**
   - `PRINCIPLES.md:312-315` gives the brief as the whole handoff: "The
     brief is a short handoff: **Completed** …; **Files / decisions** …;
     **Next** …". It applies in both modes. `CLAUDE.md:21-22` gives the
     implementer's brief as "the project slot, the request and its
     done-when", and `CLAUDE.md:36` adds that the brief begins with an
     identity check.
   - Now to the implementer's reading 3, that the check belongs in
     `CLAUDE.md` only. It is defensible, since C1 is a claim about Claude
     mode. But C1 says "Every forked brief", and after this change a forked
     subagent is the default in OpenCode mode as well
     (`PRINCIPLES.md:310-311`). So a literal milestone reviewer can find
     OpenCode forks with no check and grade C1 PARTLY MET. The wrong-checkout
     pitfall does not depend on the mode.
   - *Fix:* move the check into the habit, where it holds in every reading.
     For example: "The brief begins with a repository identity check (the
     remote's URL and the expected branch or commit), then a short handoff:
     …". `CLAUDE.md:36-39` can then keep only the worktree reason, or point
     to the habit. If the owner prefers it Claude-only, say so in *Left
     out*, as the PR does now. Either way, the owner decides.

4. **non-blocking. The fallback does not say who opens the "new session".**
   - `CLAUDE.md:40-42`: "the review still comes from a new session or the
     external process". `CLAUDE.md:47-48` has the same wording for a failed
     review. Nothing says who opens that session. Meanwhile
     `PLAN.md:44-45` says "the owner opens and closes none", and
     `PRINCIPLES.md:310` says "The agent starts it, not the owner."
   - Without subagents, the natural reading is that the owner opens the
     reviewer's session. That is the misreading that item 6 of the source
     reports, and C2 exists to remove it.
   - The implementer's reading 2 is right about the shape. Here the main
     session implements, and the review still comes from a separate context;
     "one session" doing its own review would break *Reviewer sessions*
     (`PRINCIPLES.md:92-95`). Only who opens the session is missing.
   - *Fix:* for example, "the review still comes from a new session the
     agent starts (such as a headless `claude -p`) or from the external
     process". If the owner may open it in this fallback, record it as an
     exception here.

5. **non-blocking. The main session's own lifetime is left open.**
   - `PRINCIPLES.md:309-310`: "Start a fresh session … when a thread has
     grown long. The agent starts it, not the owner." `PLAN.md:10-12`: "one
     session, one branch, one review, one merge. Do not start the next
     iteration in the same session." `PLAN.md:44-45`: "the owner opens and
     closes none."
   - The main session is the owner's own conversation (`CLAUDE.md:15`), and
     no agent can open that. So if "session" in `PLAN.md:10-12` includes the
     main session, the owner must open a new one for each iteration, which
     `PLAN.md:44-45` rules out. If the main session's thread grows long, the
     habit asks the agent to do something it cannot. The PR's *Left out*
     reads "one session" as the implementer's session. That is a sensible
     reading, but the text does not say it.
   - *Fix:* write "one implementer session" at `PLAN.md:10`. In the habit,
     say that the sessions the agent starts are the ones it forks from the
     main session, which is the owner's conversation. Or reword
     `PLAN.md:44-45` as "opens no implementer or reviewer session".

6. **non-blocking. "Forked" invites Claude Code's own `fork` subagent type.**
   - Claude Code's Agent tool offers a subagent type named `fork`. Its name
     suggests it continues from the parent's context. If it does, using it
     for the "forked implementer" (`CLAUDE.md:11-12`, `:20`) would break the
     definition at `PRINCIPLES.md:311-312`: "not from a copy of the main
     session's conversation". Then the text would pass while the intent
     fails, since the source says the implementer works from repository
     records only (item 8, *WHY*). `CLAUDE.md` points to the definition but
     does not warn against the look-alike.
   - *Fix:* check what the `fork` type does. If it copies the conversation,
     add a clause at `CLAUDE.md:12-13`, such as "(a fresh subagent, not the
     tool's `fork` type, which copies the conversation)".

## Verified

- **C1, clause by clause, at `301d461`:**
  - the shape is named: `CLAUDE.md:11-12`;
  - the main session talks to the owner and asks the owner decisions: `:15`;
  - it commits and posts the review files: `:16-18`;
  - it asks for the merge and writes the completion notes: `:18-19`, but see
    finding 1;
  - the implementer is a forked subagent in its own git worktree: `:20`;
  - it is briefed from what the repository records: `:21-23`;
  - findings go back to that same implementer, resumed: `:25-27`;
  - the reviewer is a separate fresh subagent in its own worktree, and
    writes its review file without committing or posting it: `:28-30`;
  - a re-review resumes the same reviewer: `:30`;
  - the external process stays an option: `:32-35`;
  - the fallback where subagents are unavailable, recorded in the review:
    `:40-42`, but see finding 4;
  - the forked subagent is defined once, word for word as C1 has it:
    `PRINCIPLES.md:311-312`;
  - the identity check: `CLAUDE.md:36-39`, but see findings 2 and 3.
  - D2's "the default way" is met by "Claude mode is **orchestrated**" with
    a named fallback.
- **C2, clause by clause:** "Start each iteration" is gone. *The owner's
  part* has the go-ahead (`PLAN.md:43-45`), the owner decisions (`:46-47`)
  and the merge (`:48-49`). It keeps playing the result (`:50-51`) and
  filing what the owner finds (`:52`). The habit names a forked subagent as
  the default in both modes (`PRINCIPLES.md:310-312`), makes the handoff the
  brief (`:312-315`), and limits paste prompts to another repository or
  another model, such as a milestone review (`:315-317`). This agrees with
  *Milestones* (`PRINCIPLES.md:244-245`) and with `README.md:79` and
  `ADOPT.md:3`, which are both about work in another repository.
- **The implementer's readings.**
  - Reading 1 is right. `PRINCIPLES.md` owns the shared habits (line 12),
    D11 puts the term in the habit for both modes, and an OpenCode reader
    does not read `CLAUDE.md`.
  - Reading 2 is right about the shape; finding 4 adds who opens the
    session.
  - Reading 3 is defensible; finding 3 gives the more robust option.
  - Reading 4 is right. The relabelled bullet at `CLAUDE.md:47-48` still
    states where Claude mode's fallback reviewer comes from, as
    `PRINCIPLES.md:116-117` asks. "Failed or unavailable" leaves out
    "cancelled", but it is a label that points to the protocol, not a
    restatement of it.
  - Reading 5 is acceptable. *Reviewer sessions* allows continuing and
    does not forbid a mode from requiring it, and C1 says "resumes"
    literally. The reviewer still re-proves its target, per the protocol.
- **Ownership and scope.**
  - Nothing that `PRINCIPLES.md` owns is restated. `CLAUDE.md` points to
    *Posting*, *Pull requests* and the definition.
  - The ownership map's `CLAUDE.md` row (`PRINCIPLES.md:19`) does not name
    the orchestrated shape. I accept the PR's reading that "the Claude Code
    process" covers it.
  - The project slot (`CLAUDE.md:59-87`) is untouched, and so are
    `AGENTS.md`, `ADOPT.md`, the scaffold and `BACKLOG.md`.
  - Nothing in *Not in r6* is taken: no handover file, no second reviewer,
    and agents still do not merge where the owner merges.
  - Nothing contradicts `AGENTS.md`, whose reviewer is already a subagent
    in a fresh context.
- **PR body.** It has the four parts. Its reviewed revision is "pending", as
  expected before round 01. It has one *Done when* item per clause of C1 and
  C2, with some pairs joined, plus the gates and the wrapping. Every
  `file:line` it cites matches the text at `301d461`, and its *Left out*
  discloses the relabelled fallback bullet and the three readings.
- **Wrapping.** No added line exceeds 79 columns (`awk` over the `-U0`
  diff). The longer lines in these files are pre-existing and untouched.
- **Gates, at `301d461`:**
  - `node --test tools/*.test.mjs` runs 43 tests: 43 pass, 0 fail.
  - `node --check` passes on all four `tools/*.mjs`.
  - `light`, `standard` and `auto`, generated with
    `--ref 301d461d35de056c99b682530a646a439db05bb1` into the scratchpad and
    without `--github`, each exit 0.
  - A relative-link check found 19, 28 and 28 links, none dangling.
  - `{{…}}` occurs only in `reviews/milestone-prompt.md`.
  - In each run, `PRINCIPLES.md` equals the root file, and the first 58
    lines of `CLAUDE.md` (*The process*) equal the root file's. For
    `standard` and `auto`, `PLAN.md` equals the root file too.
  - The temporary directories were deleted afterwards.

— Claude Opus 5.5 (claude-opus-5-5), reviewer
One blocking finding remains (1).
