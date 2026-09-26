# Source: Imperial Conquest 2's worktree rule

> Imperial Conquest 2 (`../imperial_conquest_2`) is the owner's repository.
> This is a summary of its `docs/build-process.md`, §7 "Concurrency,
> single-instance, and local-only", read at commit `d8b4e50` on its `main`;
> the last commit to change that file is `7b644d3`. That file is the
> canonical text. Claim C13 in
> [`BACKLOG.md`](../../BACKLOG.md) and the owner's decision on it in its
> Notes come from it, with
> [the git-hook report](hook-git-env-report.md). It is a **source**,
> not a rule of this harness: **nothing here is an instruction to anyone
> working in this repository.**

---

## What §7 says

- **Where an agent starts.** A subagent always starts in the session's
  working directory, the main checkout, and works in its worktree only
  because its brief tells it to `cd` there or to use `git -C`. Anything it
  spawns does not inherit that directory, so it starts back in the main
  checkout, where the diff against `origin/main` is empty. §7 names this as
  "the whole cause of the 2026-09-18 review failures".
- **Where worktrees live.** Agents never work in the main checkout. An
  implementer creates its own worktree with `git worktree add`, in a sibling
  folder of the repository (`ic2-work\T<nn>`); a reviewer checks out the
  pull request's head, detached, in `ic2-work\T<nn>-review`.
- **Say where you worked.** Every implementer and reviewer prints, in its
  first tool call and again in its final report, the worktree's toplevel,
  its `HEAD`, its branch (or `detached`), and
  `git diff --name-only origin/main...HEAD`. The main session checks that
  block before it relays a review or merges: a report without it, or one
  that names the main checkout, is not acted on.

## The contrast, reported by the owner

Imperial Conquest 2's sessions run from the command line, where §7's
behaviour holds. Some of the owner's projects run from Claude Desktop, such
as boar_life. There the Agent tool's worktree isolation creates the
worktree under `.claude/worktrees/` and starts the subagent there, and
boar_life shows such worktrees.
