# Source: the owner's milestone definition (youtube3)

> The owner shared this text in a Claude Code session on 2026-09-23. It is the
> text they use to redefine "milestone" in youtube3, and they said the same
> definition holds for all of their projects. It is copied verbatim below the
> rule and not edited. The "Milestone reviews in Claude mode" item in
> [`BACKLOG.md`](../../BACKLOG.md) draws on it. It is a **source**, not a rule
> of this harness: its instructions address the repository it is run in.

---

In this repository, "milestone" is being redefined by the owner. Read the
repository's review and merge rules first (CLAUDE.md, AGENTS.md, and any
review-handoff skill under .claude/skills), then adapt them to this
definition. Do not copy it blind: keep every rule that does not conflict.

THE DEFINITION
A milestone is a point in time: an annotated git tag on the main branch
(vX.Y.Z, or the project's existing tag scheme). It is not a branch, not a
pull request, and not a proposal. The independent review happens per
milestone, never per PR.

HOW WORK FLOWS BETWEEN MILESTONES
- Proposals and feature PRs get no independent-review prompt. A PR merges
  when the project's gates are green on its head and the implementer has
  written in the PR how it verified the change (the gates run and what each
  would have caught). Keep whoever merges today (owner or implementer)
  unless the owner says otherwise.
- Nothing waits for a review between milestones.

HOW A MILESTONE HAPPENS
1. The owner calls a milestone, or the implementer proposes one when a
   coherent set of work has landed (e.g. a roadmap group, a breaking change,
   anything that would go into a release).
2. The implementer opens a milestone issue: the proposed tag, the candidate
   commit on the main branch (full SHA), the previous milestone tag, the
   list of PRs merged since then, and the gate results on the candidate.
3. The implementer gives the owner one review prompt, per the project's
   review-handoff template, to run in a different model in a fresh session.
   The reviewer checks out the candidate SHA and reviews
   git diff <previous tag>..<candidate SHA>, following it into any file it
   touches. It opens one issue per reproduced finding and posts one verdict
   comment (AGREE or BLOCK) on the milestone issue.
4. BLOCK: the findings are fixed in ordinary PRs, the candidate moves to the
   new main-branch commit, and the implementer gives a re-review prompt
   unasked. The round ceiling in PRINCIPLES.md (or the project's equivalent)
   applies: a third round that does not end in AGREE goes to the owner.
5. AGREE: the tag is created on exactly the reviewed SHA, never on a later
   commit. Work merged after the candidate belongs to the next milestone.
   Any manual or live check the project requires happens before tagging.
   Publishing (stores, PyPI, releases) stays with the owner unless the
   project already says otherwise.
6. The owner may tag without a review; the milestone issue records that.

THE FIRST MILESTONE
If the repository has no milestone tag yet, propose a baseline: the last
tag or release that matches what was published, or the commit before the
current line of work. Say which commit and why, and let the owner confirm
before tagging it.

WHAT TO DO NOW
- Show the owner the exact edits to the review and merge rules, the
  review-handoff skill's milestone list and template (the diff to review
  becomes <previous tag>..<candidate SHA>, the thread becomes the milestone
  issue), and any PR-body "Review:" lines that no longer apply.
- Ask the owner three things, each with a recommended default: who creates
  the tag after AGREE (default: the implementer), the baseline commit, and
  the next milestone's tag name.
- Make the change on a branch in a PR, following this repository's own
  process for process changes.
