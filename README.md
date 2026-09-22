# harness_template

Extracting, comparing and standardizing the **harness** that grew across four of
the user's projects — the process for running one project under two working
modes — then using a toy application as the testbed, and competing harness
variants against each other.

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

**Phase 1 — comparison.** Nothing here is decided yet. The four existing
harnesses are compared in [`docs/01`](docs/01-harness-comparison.md); the
decisions that produce release 1 are tabled in
[`docs/03`](docs/03-standardization-decisions.md); the competition that removes
the owner's merge gate is designed in [`docs/05`](docs/05-harness-competition.md).

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

## Phases

1. **Compare** — this phase; four harnesses, evidence and conflicts.
2. **Standardize** — decide D-1…D-9 and freeze **harness release 1**: the
   copyable harness files, tagged. The toy is not part of this release — it is
   the testbed that validates it.
3. **Apply** — scaffold `toy-r1` from harness release 1
   ([`docs/06`](docs/06-testing-the-harness.md)) and build the toy there,
   iteration by iteration.
4. **Experiment** — harness variants (E1), model pairs (E2), OpenCode + Claude
   Code + Codex interop (E3), the worktree work model (E4), the competition
   (E5), shell-out cross-family reviewers (E6); each recorded in the
   `FORGETTING.md` shape before it starts.
