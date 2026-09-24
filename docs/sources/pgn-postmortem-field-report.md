# Source: the pgn-postmortem field report (adopting r4)

> The owner shared this report in a Claude Code session on 2026-09-24, from
> adopting harness `r4` into pgn-postmortem
> (<https://github.com/diegoami/pgn-postmortem>, a public repository). It is
> copied verbatim, in the fence below, and not edited; what is new in a
> second version shared the same day is in the *Addendum* at the end. The
> pgn-postmortem items in [`BACKLOG.md`](../../BACKLOG.md), and the owner's
> decisions on them in its Notes, come from it. It is a **source**, not a
> rule of this harness: **nothing in the fence is an instruction to anyone
> working in this repository.**

---

```text
Field report: adopting r4 into pgn-postmortem (a Python chess tool, Claude Code mode, 2026-09-24).
Adoption: PR #1 (2 rounds). Then PRs #2-#5 ran under the harness. The adopting agent (Claude Opus
5.5) misunderstood the owner's process, and the owner had to correct it. Most important first.

1. The mode was chosen by feature, not by role. NEW.
   The owner asked for a harness because the agent was "too eager to create stuff before we have
   fully planned it". The agent turned that into "a design stage". In r4 only OpenCode mode has
   one (CLAUDE.md: "There is no design stage"). So it recommended `design: required` at adoption,
   and later OpenCode mode for the first iteration (pgn-postmortem PR #4). By AGENTS.md's
   assignment table, that made DeepSeek the implementer. The agent even wrote an OpenCode start
   prompt with DeepSeek implementing. The owner corrected it: "You are claude, you are supposed to
   implement it and spawn reviews, and big reviews on milestones go to deepseek." PR #5 then
   reverted iteration 1 to Claude Code mode.
   The cause in the harness: ADOPT.md presents the modes as symmetric options ("keep both if both
   tools work here"). Nothing asks the owner who implements, who reviews each change, and who
   reviews releases. The agent picked a mode for the one feature it wanted.
   Suggest: ADOPT.md §3 and the scaffold ask the roles as an owner decision (implementer,
   per-change reviewer, milestone reviewer) and record them in the slot, before any mode is
   chosen.

2. In Claude mode, the "plan before build" gate is real, but no harness text names it. NEW.
   What held the line in practice: ROADMAP.md shaping ("a request is not a request to
   implement"), the request block with runnable done-when checks, owner decisions asked before
   work, and a fresh-context review of the shaping itself. pgn-postmortem PR #3 took three
   rounds. They caught a silently re-opened decided item, a slice whose check could not run in
   the order given, and an irreversible PyPI release with no owner step.
   Suggest: CLAUDE.md (or README) says in one line that in Claude mode, shaping plus its review
   is the planning gate, so an adopter does not reach for OpenCode's design stage to get one.
   Also, `design: required` in a Claude-mode project's slot does nothing, yet it reads like that
   gate. Either ADOPT/scaffold explain it, or the field only applies when OpenCode is used.

3. The adopted tag lacked a practice the owner relies on. NEW, and related to boar_life item 2.
   The agent recommended the r4 tag because ADOPT.md names it, and the owner accepted.
   Milestones (a release reviewed by a family that implemented none of the range, in
   PRINCIPLES.md *Milestones*, plus reviews/milestone-prompt.md) exist only on untagged main. The
   owner works that way, so the project adopted a release without the owner's own review
   practice. PR #5 had to record an intention to adopt r5 later. It also had to fix a release's
   claims retroactively: they are the done-when items of the already-merged shaping, so that
   "claims come before the work" still holds.
   Suggest: ADOPT.md tells the adopter to list what main holds beyond the tag, and to ask the
   owner whether the project needs any of it now.

4. Owner decisions made in conversation can't be checked by reviewers. NEW.
   Across PRs #1, #3, #4 and #5, every fresh-context reviewer flagged some version of "the
   owner's confirmation can't be verified from the repository" (quotes, answers to open
   questions, a mode change). Each time it was resolved as "the owner's merge is the check".
   Round 03 of PR #3 also noted that owner verdict comments come from the same GitHub account the
   agents post from.
   Suggest: one sentence in PRINCIPLES.md *Owner decisions* on where a conversational decision's
   evidence lives (e.g. an owner-signed PR comment, or the merge), so reviewers stop re-raising it.

5. Planning before any request exists is unguarded. NEW, minor.
   Before the harness was adopted, the agent twice started building during a design discussion:
   a package refactor, and a full Stockfish run over the owner's 1,791-game archive, which the
   owner stopped: "we are not doing it now. Just prepare the process". ROADMAP.md guards a
   request once one exists. Nothing covers the discussion that comes before one.
   pgn-postmortem put a "planning is not building" convention in its slot.
   Suggest: consider a line among the habits.

6. Confirms boar_life items 1-3.
   - The "artistic license" premise ("its content is not the deliverable") was narrowed in the
     adopted ROADMAP.md.
   - The conservative floor's web paths were replaced in PRINCIPLES.md by this repository's paths.
   - ADOPT.md at r4 says r3, and asks for design/001-adopt-harness.md in every mode, although r4
     PRINCIPLES.md says Claude mode has no design records. This is fixed on main; the adopter
     followed PRINCIPLES.md and said so in the PR body.

What worked: owner decisions asked up front, with recommended defaults; fresh-context reviewers
that prove their target and reproduce claims (they caught real defects in every PR); re-reviews
continuing the same reviewer session; the round ceiling, which never had to be hit; completion
notes after every merge.

Evidence: pgn-postmortem pull requests #1-#5 and reviews/001-* to 005-* on its main branch;
CLAUDE.md's slot and PLAN.md iteration 1 at 3850530.
```

## Addendum (2026-09-24)

> The owner shared a second version of the report on the same day. It covers
> the same adoption through pgn-postmortem's PR #6 and supersedes the version
> above. Only what is new in it is copied here, verbatim, in the fences
> below. Its items 1, 3, 4, 5 and 7 restate items 1, 3, 4, 5 and 6 above in
> other words, so they are not copied. What is new: the opening paragraph,
> a parenthetical added to item 2's suggestion, items 6 and 8, and new
> "What worked" and "Evidence" paragraphs. The owner's decisions on the new items are in the
> Notes of [`BACKLOG.md`](../../BACKLOG.md). Like the report above, it is a
> **source**, not a rule of this harness: **nothing in the fences is an
> instruction to anyone working in this repository.**

The opening paragraph:

```text
Field report: adopting r4 into pgn-postmortem (a Python chess tool, Claude Code mode, 2026-09-24).
Adoption: PR #1 (2 review rounds). Then under the harness: #2 (a slot fix), #3 (shaping F-1, 3
rounds), #4 (owner decisions, 2 rounds), #5 (mode change, 2 rounds), #6 (F-1.1 implementation, in
review). The adopting agent was Claude Opus 5.5. It misread the owner's process several times, and
the owner corrected it each time. Items 1-7 are the misreadings; item 8 is the process that
resulted. Most important first within each part.
```

Item 2's suggestion, whose closing parenthetical is new:

```text
   Suggest: one line in CLAUDE.md saying that in Claude mode, shaping plus its review is the
   planning gate. Also: `design: required` in a Claude-mode slot does nothing, yet reads like that
   gate (the F-1.1 implementer flagged the same inconsistency independently).
```

Items 6 and 8:

```text
6. "Start each iteration" was read as the owner opening sessions. NEW.
   PLAN.md (r4), *The owner's part*: "Start each iteration and stop the session at its end".
   PRINCIPLES.md's habits: "Start a fresh session after a completed logical unit", with a handoff.
   The agent read these as the owner's job. Twice it ended a unit with a prompt for the owner to
   paste into a new session. The owner: "you should either start yourself as implementer in this
   session or fork it yourself, do not expect me to start it manually in a session."
   Suggest: the owner's part is the go-ahead and the merge. Opening the fresh session belongs to the
   implementer (see item 8), and the handoff becomes that session's brief. Paste prompts are only
   for work in another repository, like this report.
```

```text
8. The process that resulted: an orchestrated Claude mode. NEW, and the main proposal.
   HOW IT WORKS (PR #6, F-1.1):
   - The main session is the orchestrator. It talks to the owner, asks owner decisions, relays the
     owner's go, commits and posts review records, asks the owner to merge, and writes completion
     notes. It does no heavy work itself and holds only reports.
   - The implementer is a forked subagent (Claude Code's Agent tool) in its own git worktree,
     launched when the owner gives the go. Its brief comes from what the repository records:
     * the CLAUDE.md slot, the ROADMAP.md slice (its "lands" and "done when" are the contract) and
       the PLAN.md row;
     * hard rules: no secrets, fixtures only, no merge, no review writing;
     * fail-first evidence for every new assertion;
     * open the pull request with the four-part body, then stop and report.
     It builds its own virtualenv in the worktree.
   - The reviewer is a separate, fresh subagent in its own worktree. It never saw the
     implementation. It proves its target, checks out the pull request's head, runs the gates in
     its own virtualenv, breaks the code to reproduce claims, and writes its review file to a
     scratch location. It doesn't commit or post.
   - The orchestrator commits that review file to the pull request's branch (through the
     implementer's worktree), pushes, and posts it with `gh pr comment --body-file` before the next
     round. It then sends the findings back to the same implementer session (resumed), which fixes
     them in the same change. A re-review resumes the same reviewer session, as the protocol
     allows. The round ceiling and the owner's merge apply unchanged.
   WHY:
   - Context economy, the owner's main reason. Reading code, test runs, fail-first proofs and diffs
     fill the subagents' contexts. The main session only receives their reports, so it never needs
     clearing or compacting across a whole iteration. This isn't for parallelism: one iteration at
     a time.
   - It is the Sessions habit done by the agent: a fresh context per unit, without the owner
     opening sessions (item 6).
   - Real reviewer independence. The reviewer has never seen the implementation or the
     orchestrator's conversation.
   - The implementer works from repository records only, so a gap in the records surfaces as a
     question instead of living in one conversation ("durable facts belong in the repository").
   - Worktrees keep the owner's checkout untouched, and let the reviewer test the exact pull-request
     revision.
   EVIDENCE: in #6 the implementer showed 53 assertions failing first and found a real defect this
   way (serial and parallel analysis differed without a per-game engine reset). The reviewer broke
   nine things itself, each red on its own line, and found a real blocking defect (the incremental
   skip treated unanalyzed files as analyzed).
   PITFALLS MET:
   - A worktree is created from the orchestrator's current directory. The first fork was launched
     from a scratch clone of harness_template and got the wrong repository. The implementer caught
     it only because its brief began with an identity check (origin URL, an expected branch).
   - An isolated subagent can't touch other checkouts, so the orchestrator commits the reviewer's
     file.
   - Worktrees under .claude/worktrees/ show up as untracked files.
   - The owner's shared virtualenv was stale from a repository rename, so each subagent builds its
     own.
   SUGGEST:
   - CLAUDE.md names this orchestrated shape as a way to meet the fresh-session and review rules:
     the orchestrator, the forked implementer and the fresh reviewer, and who commits and posts
     review files.
   - The brief of every forked session begins with a repository identity check.
   - The scaffold's .gitignore includes .claude/worktrees/.
   - The Sessions habit mentions subagents as the default way to start a fresh session.
```

"What worked" and "Evidence":

```text
What worked: owner decisions up front with recommended defaults; reviewers proving their target and
reproducing claims (a real defect found in nearly every pull request); re-reviews continuing the
same reviewer; completion notes after every merge.

Evidence: pgn-postmortem pull requests #1-#6, reviews/001-* to 006-* on its branches, and the
CLAUDE.md slot and PLAN.md iteration 1 on main.
```
