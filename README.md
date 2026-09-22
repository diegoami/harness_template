# harness_template

Extracting, comparing and standardizing the **harness** that grew across the
user's projects — the process for running one project under two working modes —
then using a toy application as the testbed, and competing harness variants
against each other. Four harnesses went into release 1; a fifth, different
model was found afterwards and is release-2 input
([`docs/08`](docs/08-geoclick2027-harness.md)).

## The point

The harness exists to run the same project either:

- **with OpenCode** — DeepSeek implements, Luna reviews: a different model
  family, fresh context, an explicit model id, the design agreed before code,
  signed verdicts, and a BLOCK that is not overridden; or
- **with Claude Code** — Claude implements, and a fresh-context Claude session
  reviews; no design-issue stage and no cross-family reviewer.

The two modes share the principles, the owner-decision convention, the records
and the gates discipline; they differ in how the reviewer is obtained. A third
adapter (Codex) must be addable later without touching the principles.

**Verification is not the harness.** Unit tests, UI checks, mutation harnesses
and CI belong to each project; the harness only requires that a project declare
its gates and keep the disciplines listed in
[`docs/01-harness-comparison.md`](docs/01-harness-comparison.md) §5.

## Status

**Release 1 is merged and tagged
[`r1`](https://github.com/diegoami/harness_template/tree/r1)** — design
`061e576` to AGREE, implementation `2cd33db` to AGREE, all five verdicts in
[`design/001-harness-release-1.md`](design/001-harness-release-1.md) and
[`reviews/`](reviews/). The field test has started: the run repository
`toy-r1` was scaffolded from the tag. The comparison was phase 1, in
[`docs/01`](docs/01-harness-comparison.md); the decisions it applies are in
[`docs/03`](docs/03-standardization-decisions.md).

## The harness, release 1

At the root, ready to copy into a project — or to scaffold a run from:

| file | what it owns |
|---|---|
| [`PRINCIPLES.md`](PRINCIPLES.md) | the habits, the ownership map, the non-trivial test, the six gates disciplines, the verdict protocol |
| [`AGENTS.md`](AGENTS.md) | the OpenCode mode: DeepSeek implements, Luna reviews cross-family |
| [`CLAUDE.md`](CLAUDE.md) | the Claude Code mode, and the project slot |
| [`PLAN.md`](PLAN.md) | the optional iteration overlay |
| [`ROADMAP.md`](ROADMAP.md) | feature requests, with artistic license |
| [`design/README.md`](design/README.md), [`reviews/README.md`](reviews/README.md) | the local-first records |
| [`verification/README.md`](verification/README.md) | the optional verification patterns |

Create a run from a release tag:

```sh
node tools/scaffold.mjs --tag r1 --name toy-r1 --dir ../toy-r1
```

## What is being consolidated

| project | what it contributes to the harness |
|---|---|
| `discola-web` | the origin: the two-file split by tool, the ui-check skill, the older-revision technique, CI |
| `Tressette` | the plan overlay (iterations with done-when), fork provenance, the experiment-record pattern, the explicit Claude mode |
| `Scopetta` | the governance depth: ownership map, non-trivial test, AGREE materiality, fallback/waiver, BLOCK scope |
| `balloons-JS` | knowing the repository: one source of truth, never-echo secrets, big files, decided-not-to-reopen, old-vs-new discipline |

Out of scope for release 1, recorded for later: `imperial_conquest_2` — the
contract-and-dispatch model with worktrees, per-task models and label-only
status ([`docs/02`](docs/02-ic2-complex-model.md)). Prior art noted for later
experiments: `learnukrainian` (a Codex → Claude migration) and `Geoclick2027`
(worktree findings).

**The fifth, found after release 1:** `Geoclick2027` runs **two harnesses in
one repository** — an interactive PR review loop and an automerging remediation
loop. Its evidence on worktrees (E4) and on removing the owner-merge gate (E5)
is the strongest in the set; see
[`docs/08`](docs/08-geoclick2027-harness.md).

## Documents

- [`docs/01-harness-comparison.md`](docs/01-harness-comparison.md) — the point
  of the harness, the two modes in the four, what is process and what is
  project verification, the unions and the conflicts.
- [`docs/02-ic2-complex-model.md`](docs/02-ic2-complex-model.md) — the postponed
  fifth model and what release 1 should take from it.
- [`docs/03-standardization-decisions.md`](docs/03-standardization-decisions.md)
  — eleven decisions with options and recommended defaults, and the release-1
  spine.
- [`docs/04-toy-app.md`](docs/04-toy-app.md) — the text-adventure testbed,
  designed so the standard cannot be card-shaped.
- [`docs/05-harness-competition.md`](docs/05-harness-competition.md) — the
  competition: owner merge removed, escaped defects as the primary metric.
- [`docs/06-testing-the-harness.md`](docs/06-testing-the-harness.md) — how the
  harness is tested: run repos scaffolded from release tags, the notebook here,
  and why several instances must not share one repository.
- [`docs/07-feature-requests.md`](docs/07-feature-requests.md) — how a project
  grows: the `ROADMAP.md` backlog, the owner's one-line request, the agent's
  shaping, and how it feeds iterations and the competition.
- [`docs/08-geoclick2027-harness.md`](docs/08-geoclick2027-harness.md) — the
  fifth model: two harnesses in one repo, running evidence for E4 and E5, and
  the release-2 candidates it brings.

## Phases

1. **Compare** — done; four harnesses, evidence and conflicts.
2. **Standardize** — done; release 1 tagged `r1` after the bootstrap review.
3. **Apply** — in progress: `toy-r1` scaffolded from `r1`
   ([`docs/06`](docs/06-testing-the-harness.md)); the toy is built there,
   iteration by iteration ([`docs/04`](docs/04-toy-app.md)).
4. **Experiment** — harness variants (E1), model pairs (E2), OpenCode + Claude
   Code + Codex interop (E3), the worktree work model (E4, running prior art in
   `Geoclick2027`), the competition (E5, likewise), shell-out cross-family
   reviewers (E6); each recorded in the `FORGETTING.md` shape before it starts.
