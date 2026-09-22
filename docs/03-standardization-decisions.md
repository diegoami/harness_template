# Standardization decisions for release 1

**Status: agenda, not decisions.** Each item names the evidence, the options and
a recommended default. The owner decides; the recommendations are the author's.

**What release 1 is:** the **harness** — the process layer — in its first
frozen version, the one a new project copies. It is not a release of the toy
application, and it is not the app's tests, UI check, mutation harness or CI:
those are the project's own (§1 of
[`01-harness-comparison.md`](01-harness-comparison.md)), and the standard's only
business with them is the six disciplines in §5 of the same document.

---

## D-1 — Where the shared principles live

**Options.** (a) separate `PRINCIPLES.md` with an ownership map (Scopetta);
(b) inside `CLAUDE.md` (Discola, balloons-JS); (c) inside `PLAN.md` (Tressette).

**Recommendation: (a).** It is the only option with a contradiction rule, and
the comparison's main structural finding is that the projects drifted on *where*
the rules live, not what they say. `PRINCIPLES.md` owns the habits, the
ownership map, the classification; `AGENTS.md` owns the OpenCode adapter;
`CLAUDE.md` owns the Claude adapter and the project rules; each links, none
restates.

## D-2 — The trivial / non-trivial classification

**Options.** (a) Scopetta's four-part test with the conservative floor and the
pure-typo exception; (b) Tressette's "every OpenCode implementation, no size
floor".

**Recommendation: (a).** It is auditable without a judgment call at the paths
that matter, and it answers the question a session actually asks — do I open a
design issue before starting. Keep the floor for what matters and the explicit
"the floor is a checklist, not a claim about imports". The counter-argument
(Tressette) is simpler to state; the answer is that simplicity buys ceremony on
typos.

## D-3 — The iteration overlay

**Options.** (a) drop it; (b) keep Tressette's `PLAN.md §7.1–§7.6` as an
optional overlay.

**Recommendation: (b), as an optional section, clearly marked.** It is useful
when the build order is known before coding (done-when per iteration, effort and
reviewer per iteration, the owner's part) and harmless otherwise. It must add
only *when work is sliced*, never a second review process. Ship it with
`ROADMAP.md`, the feature-request backlog that supplies the iterations and the
"done when" ([`07-feature-requests.md`](07-feature-requests.md)) — the overlay
without an input is a plan with nothing to do.

## D-4 — The gates seam: what the harness requires, what the project declares

**Problem.** The four projects' gates are project-specific, and the harness must
not absorb them. But the harness must require *something*, or "verified" means
whatever the last session felt like.

**Recommendation.** The harness requires each project to keep a **gates table**
in its project rules, stating: the commands, what each covers, when each runs,
how many repeats, and the failure model that justifies the repeats. The harness
states these disciplines over it:

- a red gate does not merge;
- a new assertion is made to fail before it is made to pass;
- a finding or a claim is reproduced before it is acted on;
- what a passing check would have caught is said out loud;
- when a gate is expensive, the project states when it re-runs (Scopetta's
  measured-input tree is the model pattern, not the rule);
- CI, where a remote exists, runs the declared gates and a red CI blocks.

`balloons-JS`'s 8×, Discola's 3× and Scopetta's tree all fit this shape, and a
project with no UI or no remote fits it too — it declares less, not nothing.

## D-5 — The verification library: patterns, deliberately not mandatory

**Recommendation.** Ship the nine patterns of §9 in the comparison as a
**library** under `docs/verification/`, each written as "here is the pattern,
here is what it caught, adopt it if it fits". Explicitly not required by the
harness. The one pattern the standard should keep pointing at when a project
chooses to write assertions is Scopetta's mutation harness, because a passing
assertion that cannot fail is the failure mode nothing else detects.

## D-6 — Review records with no GitHub

**Problem.** Every verdict convention assumes issues and PRs; this project is
local-first. The mechanism must work with no remote and light up unchanged when
one exists.

**Recommendation.** Records as files:
- a design proposal is `design/NNN-<slug>.md` with the same sections the issue
  body would have;
- the reviewer's verdict is appended under a heading, signed with the exact
  convention, ending in an explicit `AGREE`/`BLOCK` line;
- an implementation review is `reviews/NNN-<slug>-impl-NN.md`, naming the
  revision it covers;
- when a remote and `gh` exist, the same text is posted verbatim as the
  issue/PR comment; the file stays canonical.

This keeps every rule (materiality, fallback, re-review) expressible without
GitHub, and makes the history greppable and diffable.

## D-7 — Model assignment table and the invariant

**Recommendation: adopt Scopetta's**, with the invariant stated above the table
("different model family than the implementer, high reasoning effort, fresh
context, explicit model id") and the update rule below it ("whoever changes an
assignment updates the table in the same change"). The assignment itself is
project-local. Discola's workflow file is the drift evidence: delete the pinned
model there and point at the table.

## D-8 — Template shape, and where a run lives

The toy is **not built in this repository**. The harness repo develops the
harness and keeps the notebook; each run — a field test, an experiment arm, a
competition contestant — is a **separate repository scaffolded from a release
tag**, with fresh history. The full strategy, including why several instances
must not share one repo, is in
[`06-testing-the-harness.md`](06-testing-the-harness.md).

**Recommendation.** Harness files at the root (the repo self-hosts its own
process); the scaffold tool and its manifest in `tools/`; runs as sibling
directories under `C:\Users\diego\projects\`, published only if a remote is
wanted; all records here. Release 1 includes the scaffold: a template that
cannot create a project from itself has not been tested.

## D-9 — The competition rules

**Recommendation: run it, on the toy, after release 1.** The full design is in
[`05-harness-competition.md`](05-harness-competition.md); the decision here is
the principle: **the owner-merge requirement is an experimental variable, not an
axiom.** The competition removes it (autonomous merge on a signed AGREE plus
green gates) and measures escaped defects first, cost second. Its outcome is
written back into the standard whichever way it goes.

## D-10 — Multi-tool interop (later, release 2)

How do OpenCode, Claude Code and Codex share one process? Prior art:
`learnukrainian/CLAUDE_MIGRATION.md` (Codex → Claude, with former `AGENTS.md`
files pointing at the survivor) and `boardemo` (a gateway over Claude Code,
Codex CLI, Gemini, Cursor). For each tool the experiment must record: how a
subagent is dispatched with an explicit model; how it is continued after a
review; how rules and skills load; where the working directory comes from.

**The first concrete piece is E6, the shell-out reviewer**, because it gives
Claude mode the cross-family review OpenCode mode has by construction and it is
buildable today: `codex exec` (installed, with a `review` subcommand) and
`opencode run -m <provider>/<model>` (headless `run` in both CLI lines). The
experiment record must pin: the exact command and flags; how the design doc and
the diff reach the process; the timeout and exit-code handling; where the
verdict is written (`reviews/…`); and the signature line with the external
model's display name and id. The symmetric direction — OpenCode mode shelling
out to `claude -p` for a Claude review — runs in the same experiment.

## D-11 — The worktree work model (later, release 2)

Evidence: IC2 (worktree per agent, "say where you are working", gate 0, and the
wrong-tree reviews that motivated them) and Geoclick2027 (worktrees failed for
parallel agents until each ran its own `npm install`; the loop deliberately runs
without them). The question: does worktree-per-agent pay for a toy-sized project
with one owner? Do not require worktrees until it is answered; if recommended,
carry the location evidence block.

---

## The recommended release-1 spine

**The harness (this is release 1):**

```
README.md            — what this is, the two modes, how to adopt it
PRINCIPLES.md        — habits, ownership map, classification, conservative floor
AGENTS.md            — OpenCode adapter: roles + invariant + two stages + BLOCK
                       + fallback/waiver + AGREE materiality + bootstrap
CLAUDE.md            — Claude adapter: fresh-context review, no design stage
                       + project rules template (gates table, read/ignore,
                       never-echo, one source of truth, decided-not-to-reopen)
PLAN.md              — optional: the iteration overlay
ROADMAP.md           — the feature-request backlog; supplies the iterations
design/              — design proposals (local-first records)
reviews/             — signed verdicts (local-first records)
EXPERIMENTS.md       — the variant/experiment index
tools/scaffold.mjs   — creates a run repo from a release tag
scaffold.manifest.json — the files a run receives
```

**Not the harness, shipped separately as a library:** `docs/verification/*` —
the nine patterns, clearly labelled optional, plus the toy's own `tools/` as a
worked example once it exists.

**Deliberately absent from release 1:** any mandated UI check, test framework,
mutation harness or CI file. Those are the project's, and the toy will show one
way to do them.

## The experiment program (release 2 and after)

| # | question | method |
|---|---|---|
| E1 | Which adapter layout is better: three files, two, or pointers? | The same small change on the toy under each; count review findings that matter, ceremony, drift |
| E2 | Do model pairs change the outcome? | Same change, same standard, different implementer/reviewer pairs and effort; measure caught defects, false blocks, cost |
| E3 | How do OpenCode, Claude Code and Codex share one process? | Apply D-10 |
| E4 | Is worktree-per-agent worth it at this scale? | Apply D-11 |
| E5 | Which harness performs better with the owner-merge gate removed? | Apply D-9 and [`05`](05-harness-competition.md) |
| E6 | Can Claude get a cross-family review by shelling out? | `codex exec` / `opencode run -m` as reviewer processes, compared with a fresh Claude session on the same task; symmetric `claude -p` reviewer for OpenCode mode (D-10) |

Every experiment gets its record file before it starts, in the
`FORGETTING.md` shape, so a branch that is never merged still leaves its result.
