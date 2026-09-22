# harness_template

Extracting, comparing and standardizing the review-and-verification harness that
grew across four of the user's projects, so it can be applied to a new project —
and used as a testbed for experiments.

## Status

**Phase 1 — comparison.** Nothing here is decided yet. The four existing
harnesses are compared in [`docs/01-harness-comparison.md`](docs/01-harness-comparison.md);
the decisions that produce release 1 are tabled in
[`docs/03-standardization-decisions.md`](docs/03-standardization-decisions.md).

## What is being consolidated

| project | what it contributes |
|---|---|
| `discola-web` | the origin: two-file split, UI check + skill, the older-revision technique, CI, the `/oc` GitHub action |
| `Tressette` | the plan overlay: iterations with a done-when, effort and reviewer tables, fork provenance, the experiment-record pattern |
| `Scopetta` | the governance depth: ownership map, non-trivial test, measured-input tree, AGREE materiality, mutation harnesses |
| `balloons-JS` | knowing the repository: one source of truth, never-echo secrets, big files, commands and ports, decided-not-to-reopen, old-vs-new discipline |

Out of scope for release 1, recorded for later:
`imperial_conquest_2` — the contract-and-dispatch model with worktrees, per-task
models and label-only status ([`docs/02-ic2-complex-model.md`](docs/02-ic2-complex-model.md)).
Prior art noted for later experiments: `learnukrainian` (a Codex → Claude
migration) and `Geoclick2027` (worktree findings).

## Documents

- [`docs/01-harness-comparison.md`](docs/01-harness-comparison.md) — the four
  harnesses on one schema, a feature matrix, the union of ideas, the conflicts.
- [`docs/02-ic2-complex-model.md`](docs/02-ic2-complex-model.md) — the postponed
  fifth model and what release 1 should take from it.
- [`docs/03-standardization-decisions.md`](docs/03-standardization-decisions.md)
  — the agenda for standardizing: eleven decisions, each with options and a
  recommended default, and the release-1 spine.
- [`docs/04-toy-app.md`](docs/04-toy-app.md) — the text-adventure testbed,
  designed so the standard cannot be card-shaped.

## Phases

1. **Compare** — this phase; four harnesses, evidence and conflicts.
2. **Standardize** — decide D-1…D-9, freeze release 1 as a tag; the template is
   the copyable set of files.
3. **Apply** — build the toy with the standard, one iteration at a time.
4. **Experiment** — harness variants (E1), model pairs (E2), OpenCode + Claude
   Code + Codex interop (E3), the worktree work model (E4); each recorded in the
   `FORGETTING.md` shape before it starts.
