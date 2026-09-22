# The Imperial Conquest 2 model — postponed, recorded for later

**Status: out of scope for release 1.** This document exists so the knowledge is
not lost and so the release-1 standard can leave room for it. It describes the
most elaborate of the user's harnesses — `imperial_conquest_2` — and what it
would take to run it outside Claude Code.

Sources: `imperial_conquest_2/CLAUDE.md` (60 lines),
`docs/build-process.md` (494), `docs/operating-guide.md` (152),
`docs/task-catalogue.md` (1520), `.claude/skills/run-task/SKILL.md` (52),
`.github/pull_request_template.md`, `.github/ISSUE_TEMPLATE/build-task.yml`.

---

## 1. What it is

A **contract-and-dispatch** build system for a project with ~50 planned tasks
(Godot/C# reimplementation), where the process itself is a reviewed artifact:

- **Main session** (the user's session, Opus): plans, runs tasks via `/run-task`,
  triages bugs, talks to the user. It never implements. There is no orchestrator
  agent.
- **Implementer** (subagent, model per task): one task, one branch, one PR, in
  its own worktree.
- **Reviewer** (subagent, a *different* model per task): independently re-runs
  the DoD, posts findings, applies `status:approved` or `status:rework`.
- **Researcher** (Opus subagents): evidence work in a separate research repo.

The **task catalogue** is the contract: each task carries Scope, an **Owns**
list of files, a Definition of Done with runnable checks, and dependencies.
Documents are the intent; GitHub is the state. **Status lives only on labels**
(`status:ready/in-progress/in-review/rework/approved/blocked/escalated/merged`,
`review-round:1|2`, `triage:needed`), never in a document — so an interrupted
session resumes from labels and PRs with nothing to reconcile.

## 2. The task loop (`/run-task`)

1. CHECK — triage queue, dependencies merged, task ready.
2. IMPLEMENT — dispatch implementer with a brief; it works in its worktree,
   runs the DoD, pushes, opens the PR (with a fenced DoD-evidence block and a
   "Docs affected" list), detaches its worktree.
3. REVIEW — dispatch reviewer with the PR and the task entry.
4. DECIDE on the reviewer's label — `approved` → wait for green CI, update
   branch if behind, merge (squash), unblock dependents, file follow-ups, apply
   doc claims, remove worktrees, report. `rework` → check the review is about
   *this* PR, relay **the full findings**, next round; round 2 is the last.
5. ESCALATE or BUG — stop the run and bring evidence plus options to the user.

## 3. The review gates — the part worth stealing

**Gate 0: prove you are looking at the right code.** Before reading anything,
the reviewer prints five commands: worktree root, HEAD, the PR's `headRefOid`,
`git diff --name-only origin/main...HEAD`, and the PR's own file list. The two
SHAs must match and the two file lists must match; an empty diff means the
wrong tree ("almost always the main checkout"). **Every finding must name a file
from that diff.**

Five gates, in order: (1) DoD independently reproduced at the PR head; (2)
provenance of every constant to a fixture, report, or investigation, with the
`[designed]` tag only valid when the document says what was searched and came
up empty; (3) determinism — no `System.Random`, wall clock, `Guid.NewGuid`,
order-dependent iteration; all draws through `IRng`; (4) scope — every changed
file inside the Owns list, any diff to `docs/*.md` is automatic rework; (5) a
correctness sweep in the reviewer's own context, hunting a named list of bug
classes, **proving a candidate before reporting it** (run it, or delete the
behaviour and watch which test fails), and labelling unverified findings as
unverified.

The mutation discipline is unusually sharp: a mutation result is only
admissible after `touch` and an explicit clean rebuild; `--no-build` and
incremental builds are never admissible after a mutation cycle; a *stale clean*
binary produces a phantom **green** — a false "no test caught this" — which is
the dangerous direction, so **negative results carry the same burden as
positive ones** and are the entries a reviewer re-takes rather than reads.

Reviews are a comment plus a label, not a native GitHub review — every agent
shares one account, and GitHub forbids approving your own PR.

## 4. Worktrees, and the evidence that stops a wrong-tree review

- One task in flight at a time; its implementer, then its reviewer, then any
  rework.
- Agents never work in the main checkout. They create worktrees under
  `C:\Users\diego\projects\ic2-work\`; the main session removes them after the
  merge.
- **A subagent does not inherit its parent's shell directory**, so a skill or
  agent it forks starts back in the main checkout — where `origin/main...HEAD`
  is empty. That single mechanism caused four review passes to produce confident
  findings about an unrelated merged commit on 2026-09-18; the harness now
  passes `git -C <worktree>` explicitly and requires every agent to **say where
  it is working** — four lines, in its first tool call and its final report —
  which the main session checks before relaying a review or merging.
- Local-only and single-instance tasks are labelled; requirements that cannot
  run in CI skip explicitly so CI stays green.

## 5. Why it was postponed outside Claude

The pieces that are Claude-specific today:

- **In-process agent dispatch** with a per-task model and `run_in_background`,
  plus `SendMessage` to continue a live implementer across rework rounds.
- **Skills loaded at session start** (`.claude/skills/`), with the fork/cwd
  behaviour that broke `/code-review` and is documented as a trap.
- **Labels plus `gh` as the only state**, checked at session start and driven
  by the skill.
- **Worktree orchestration** driven by the main session's Agent calls.

None of that is intrinsically Claude-only — it is a set of behaviours OpenCode
and Codex also have (subagents with explicit models, plugins/skills, `gh`), but
each has different primitives for continuing an agent, for background dispatch,
and for per-task model choice. Porting it means building a **thin adapter per
tool** over one process document, which is exactly the multi-tool question
release 2 should answer.

## 6. What release 1 should take from it (candidates)

Not the full model — the four harnesses in
[`01-harness-comparison.md`](01-harness-comparison.md) are the scope. These are
cheap, tool-neutral ideas worth folding into the standard:

1. **"Say where you are working"** — the four-line location block, whenever more
   than one working tree exists.
2. **Gate 0** — a reviewer proves its target before judging it; findings name
   files in the diff.
3. **One task in flight per worktree**, with the main checkout reserved for the
   coordinator.
4. **Round limits and escalation conditions** — Scopetta has BLOCK but no round
   limit; IC2's "round 3 would be needed → escalate" is the missing piece.
5. **Bug discipline** — suspend, file, plan, resume; never patch another
   change's files inline.
6. **Excerpt-carrying briefs** — the single highest-leverage cost rule: paste
   the contract into the subagent brief instead of pointing at a big file.
7. **Negative-result discipline** — a "nothing caught this" claim is re-taken,
   not trusted.
8. **Status as a small set of labels** — the local-first template can keep the
   same idea with a `STATUS.md` or a per-change state file until GitHub exists.

## 7. Multi-tool notes (for the later experiment)

- **Prior art in the user's own projects**: `learnukrainian` records a
  Codex/ChatGPT → Claude migration (`CLAUDE_MIGRATION.md`), including former
  `AGENTS.md` files that now only point at `CLAUDE.md`; `boardemo`'s Unity AI
  gateway names Claude Code, Codex CLI, Gemini and Cursor as interchangeable
  agents behind one MCP interface. Neither is a review harness, but both are
  evidence about how the tools coexist.
- **Geoclick2027** is the other worktree evidence source: a recorded worktree
  experiment where parallel background work failed until each worktree ran its
  own `npm install` (`ROADMAP.md`), and an orchestration doc that deliberately
  chose "no worktrees — for the loop" after the investigation. The worktree
  question is not settled by IC2 alone; the two evidence sets must be read
  together when the work-model experiment runs. It is analysed in full in
  [`08-geoclick2027-harness.md`](08-geoclick2027-harness.md), which also records
  that it runs an automerging loop — running evidence for the competition's
  central rule.
