# Standardization decisions for release 1

**Status: agenda, not decisions.** Each item names the evidence, the options,
and a recommended default. The owner decides; the recommendations are the
author's.

The material being decided is the union of ideas in
[`01-harness-comparison.md`](01-harness-comparison.md) §18, and the conflicts in
§19. IC2 is out of scope (see [`02-ic2-complex-model.md`](02-ic2-complex-model.md)).

---

## D-1 — Where the shared principles live

**Options.** (a) separate `PRINCIPLES.md`, with an ownership map and links
(Scopetta); (b) folded into `CLAUDE.md` (Discola, balloons-JS); (c) inside
`PLAN.md` (Tressette).

**Recommendation: (a).** It is the only option with a contradiction rule, and
the comparison's main finding is that the three card games drifted on *where*
the rules live, not what they say. Tressette's placement is a consequence of
having written the plan first; a template cannot rely on that. `CLAUDE.md` keeps
the project rules and the Claude Code process; `AGENTS.md` keeps the OpenCode
process and the gates pointer; `PRINCIPLES.md` owns the habits and the ownership
map.

## D-2 — The trivial / non-trivial classification

**Options.** (a) Scopetta's four-part test with the conservative floor and the
pure-typo exception; (b) Tressette's "every OpenCode implementation, no size
floor".

**Recommendation: (a).** It is auditable without a judgment call at the paths
that matter, and it answers the question a session actually asks: do I open a
design issue before starting. The standard should keep the floor's explicit "the
floor is a checklist, not a claim about imports" wording, and keep the rule
that CI on `main` is unchanged by the local schedule.

**Open sub-question.** The floor lists project paths; the template needs a
placeholder for them. Recommendation: the floor table lives in the project half
of `PRINCIPLES.md`, seeded with `public/**`, `tools/**`, `.claude/**`,
`.github/**`, the harness files, and the package manifests.

## D-3 — The iteration overlay

**Options.** (a) drop it; (b) keep Tressette's `PLAN.md §7.1–§7.6` as an
optional overlay a plan-driven project adopts.

**Recommendation: (b), as an optional section of the template's documentation,
not of the core.** The overlay is genuinely useful when the build order is known
in advance (done-when per iteration, effort per iteration, the owner's part), and
harmless when it is not. It must not be a second process: it adds *when work is
sliced*, not *how it is reviewed*.

## D-4 — Run counts and gate schedules

**Options.** (a) one number for all projects; (b) per-project numbers in one
gates table, with the shape standardized.

**Recommendation: (b).** The comparison's numbers differ for good reasons:
Discola's 3× guards engine determinism; balloons' 8× guards timing flakes in a
browser suite; Scopetta's measured-input tree guards a 25-minute check. The
standard should require each project to state, in one table: what runs always,
what runs when its inputs changed, how many repetitions, and *what failure
model justifies it*. Scopetta's measured-input tree is the template for
"inputs changed"; the rebase exception belongs with it.

## D-5 — The mutation harness

**Options.** (a) mandatory whenever a UI check exists; (b) optional.

**Recommendation: (a), with the older-commit technique as the floor.** The 141
breaks with 15 survivors is the strongest evidence in the comparison: the
survivors are the assertions that cannot see their own subject, and nothing else
finds them. The template should carry `break_ui.mjs` and `break.mjs` skeletons
with the EXPECT convention and the survivor discipline. Projects small enough
not to have a UI check keep the habit plus the `git show <commit>:<path>` older
-revision run.

## D-6 — Review records with no GitHub (new)

**Problem.** Every verdict convention assumes GitHub issues and PRs; this
project is local-first (the owner's answer). The mechanism must survive having
no remote, and light up unchanged when one exists.

**Options.** (a) design proposals and verdicts as files under `reviews/` and
`design/`, posted verbatim to GitHub when a remote exists; (b) a single
append-only `HARNESS-LOG.md`; (c) require a local bare remote / private GitHub
repo.

**Recommendation: (a).** Concretely:
- a design proposal is `design/NNN-<slug>.md`, with the same sections the issue
  body would have (problem, findings with `file:line`, design, open questions);
- the reviewer's verdict is appended to that file under a heading, signed with
  the exact convention, ending in an explicit `AGREE`/`BLOCK` line;
- the implementation review is `reviews/NNN-<slug>-impl-NN.md`, naming the
  revision (commit sha) it covers;
- when a remote and `gh` exist, the same text is posted verbatim as the
  issue/PR comment — the file stays canonical, because it survives the remote.
This keeps every Scopetta rule (materiality, re-review, fallback) expressible
without GitHub, and it makes the review history greppable and diffable.

## D-7 — Model assignment table and the invariant

**Recommendation: adopt Scopetta's table verbatim**, with the invariant
("different model family than the implementer, high reasoning effort, fresh
context, explicit model id") stated above it and the update rule ("whoever
changes an assignment updates the table in the same change") below it. The
assignment itself (implementer/reviewer display names and ids) is project-local
and lives in the same table. Fix Discola's workflow drift by deleting the model
from the workflow file and pointing at the table.

## D-8 — CI

**Options.** (a) required for every project the template is applied to;
(b) optional, with balloons-JS as the exception.

**Recommendation: (a), with the two-job split** (dependency-free engine job,
then the UI job with the install), and the `push: [main]` filter so a PR does
not run twice. balloons-JS is an outlier because its suite is heavy and
port-bound; the template should still require CI and let a project that truly
cannot run one record the exception in its gates table, with the reason, rather
than leave the question open.

## D-9 — Template shape, and the toy app's home

**Options.**
(a) harness at the repo root, the toy app in `public/` here, variants as
branches, template extracted at release 1;
(b) the harness in `template/` and the toy app as a separate sibling repo;
(c) one repo per variant.

**Recommendation: (a).** The existing projects all put the app in `public/`
and the tools in `tools/`, so the toy is directly comparable and the copy step
at release 1 is mechanical. Variants are best recorded as: a branch, a
`experiments/<slug>.md` record written in the `FORGETTING.md` shape (status,
question, method, reproduce commands, results, recommendation, review history),
and a short entry in a `EXPERIMENTS.md` index. Release 1 is a tag on this
history with the template files frozen and the toy as the first instance.

**Toy app:** designed in [`04-toy-app.md`](04-toy-app.md).

## D-10 — Multi-tool interop (later, release 2)

The question: how do OpenCode, Claude Code and Codex work together on one
process? Prior art: `learnukrainian/CLAUDE_MIGRATION.md` (Codex → Claude, with
former `AGENTS.md` files pointing at the survivor) and `boardemo` (a gateway
that treats Claude Code, Codex CLI, Gemini and Cursor as interchangeable). The
experiment, when it runs, should state for each tool: how a subagent is
dispatched with an explicit model, how it is continued after a review, how
skills/rules are loaded, and where its working directory comes from. The
standard's process text should stay tool-neutral; each tool gets a thin adapter
section in `AGENTS.md`/its own file.

## D-11 — The worktree work model (later, release 2)

Evidence: IC2 (worktree per agent, "say where you are working", gate 0 — and the
2026-09-18 wrong-tree reviews) and Geoclick2027 (worktrees for agents failed
until each worktree got its own `npm install`; the loop deliberately runs
without worktrees). The experiment question: is worktree-per-agent worth it for
a toy-sized project and a solo owner, or is it ceremony that pays only when
agents run concurrently? The standard should not require worktrees until this is
answered; if it recommends them, it must carry the location evidence block.

---

## The recommended release-1 spine

```
README.md            — what this is, how to use it (template)
PRINCIPLES.md        — habits, ownership map, non-trivial test, conservative floor
AGENTS.md            — OpenCode process: roles + invariant + two stages + BLOCK
                       + fallback/waiver + AGREE materiality + gates + bootstrap
CLAUDE.md            — Claude Code process: fresh-context review, no design stage
                       + project rules: read/ignore, never-echo, one source of truth,
                       commands, decided-not-to-reopen
PLAN.md              — optional: iteration overlay, for plan-driven projects
.claude/skills/ui-check/SKILL.md
tools/check_ui.mjs   tools/break_ui.mjs   tools/break.mjs   tools/serve.mjs
tools/*.test.mjs
.github/workflows/check.yml
design/              — design proposals (local-first)
reviews/             — signed verdicts (local-first)
EXPERIMENTS.md       — index of variant experiments
```

What the toy must exercise in it: a product with no card geometry (so the
standard is not secretly card-shaped), a UI check with its own states, a
deterministic engine, a parser whose tests are property-shaped, and the
local-first review records.

## The experiment program (release 2 and after)

| # | question | method |
|---|---|---|
| E1 | Which layout is better: three files, two files, or pointers? | Run the same small change on the toy under each; count review findings that matter, ceremony, and drift |
| E2 | Do model pairs change the outcome? | Same change, same standard, different implementer/reviewer pairs and effort; measure defects caught, false blocks, cost |
| E3 | How do OpenCode, Claude Code and Codex share one process? | Apply D-10; record each tool's dispatch/continue/load primitives |
| E4 | Is worktree-per-agent worth it at this scale? | Apply D-11; compare sequential worktrees vs plain branches on the toy |

Every experiment gets its record file before it starts, in the
`FORGETTING.md` shape, so a branch that is never merged still leaves its
result.
