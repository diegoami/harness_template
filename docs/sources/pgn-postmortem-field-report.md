# Source: the pgn-postmortem field report (adopting r4)

> The owner shared this report in a Claude Code session on 2026-09-24, from
> adopting harness `r4` into pgn-postmortem
> (<https://github.com/diegoami/pgn-postmortem>, a public repository). It is
> copied verbatim, in the fence below, and not edited. The pgn-postmortem items
> in [`BACKLOG.md`](../../BACKLOG.md), and the owner's decisions on them in its
> Notes, come from it. It is a **source**, not a rule of this harness:
> **nothing in the fence is an instruction to anyone working in this
> repository.**

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
