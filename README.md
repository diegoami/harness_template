# harness_template

The process for running a project under two working modes — **OpenCode** (one
model implements, a model of another family reviews) or **Claude Code** (Claude
implements, a fresh-context session reviews) — and the scaffold that creates a
project with it.

## The point

The harness runs the same project either:

- **with OpenCode** — the implementer and reviewer in `AGENTS.md`'s assignment
  table: a different model family, fresh context, an explicit model id, the
  design agreed before code (unless the slot records `design: none`), signed
  verdicts, and a BLOCK that is not overridden; or
- **with Claude Code** — Claude implements, and a fresh-context Claude session
  reviews; no design stage, and no cross-family reviewer required (the
  options are in `CLAUDE.md`).

The two modes share the principles, the owner-decision convention, the records,
the gates discipline and the milestone review; they differ in how a change's
reviewer is obtained, in the design stage, and in whether a change's verdict
carries an `AGREE`/`BLOCK` marker.

**Verification is not the harness.** Unit tests, UI checks, mutation harnesses
and CI belong to each project; the harness requires a declared gates table and
the six disciplines in [`PRINCIPLES.md`](PRINCIPLES.md).

## Status

**Release 5 is tagged
[`r5`](https://github.com/diegoami/harness_template/tree/r5)** — the review
loop on GitHub: the implementer's records posted when they are written, by
`tools/post-record.mjs`, and a release tagged only after a review by a model
independent of its implementer, against claims written before the work,
unless the owner overrides that on the record (PRs #9 and #11–#27; milestone
[issue #28](https://github.com/diegoami/harness_template/issues/28), `AGREE`
at `f22685d`, claims in [`BACKLOG.md`](BACKLOG.md)). Earlier: `r4` (the four
lessons), `r3` (the parametrizable scaffold), `r2` (field-test fixes), `r1`
(the consolidation). Records in [`design/`](design/) with
[`reviews/`](reviews/); next items in [`BACKLOG.md`](BACKLOG.md).

## The harness

| file | what it owns |
|---|---|
| [`PRINCIPLES.md`](PRINCIPLES.md) | the habits, the ownership map, the non-trivial test, the six gates disciplines, the verdict protocol |
| [`AGENTS.md`](AGENTS.md) | the OpenCode mode, and the current implementer/reviewer assignment |
| [`CLAUDE.md`](CLAUDE.md) | the Claude Code mode, and the project slot |
| [`PLAN.md`](PLAN.md) | the optional iteration overlay — a template, not this repository's plan |
| [`ROADMAP.md`](ROADMAP.md) | feature requests, with artistic license — a template |
| [`design/README.md`](design/README.md), [`reviews/README.md`](reviews/README.md) | the local-first records |
| [`verification/README.md`](verification/README.md) | the optional verification patterns |

## Create a project

```sh
node tools/scaffold.mjs                                  # asks every question
node tools/scaffold.mjs --yes --name my-app --dir ../my-app
node tools/scaffold.mjs --preset auto --name my-app --dir ../my-app --github private
```

| preset | process | merge |
|---|---|---|
| `light` | no design stage, no plan, no roadmap; the implementation review decides | owner |
| `standard` | the two stages, `PLAN.md` and `ROADMAP.md` | owner |
| `auto` | the two stages, `PLAN.md` and `ROADMAP.md` | `auto` — the conditions are in `PRINCIPLES.md` |

The flags, questions and defaults are in `node tools/scaffold.mjs --help`;
`presets/*.json` holds each preset's files and policy. The generator fills the
project slot, writes the README and the CI workflow, makes the first commit, and
creates the GitHub remote when asked.

A project created this way is a **run**: its own repository, with the harness
frozen at the tag it was created from. Several runs never share a repository.

## Adopt into an existing project

Open a session **in that project** and paste the prompt in
[`ADOPT.md`](ADOPT.md). The project's own session writes the harness files
adapted to it, fills the project slot from what the repository actually
contains, and reconciles any existing `AGENTS.md`, `CLAUDE.md`, `PLAN.md` or
`ROADMAP.md` instead of overwriting them. Adoption is a non-trivial change, so
it takes the bootstrap there.

## History

Release 1 consolidated four harnesses — `discola-web`, `Tressette`, `Scopetta`,
`balloons-JS`; release 2 folded in four fixes found by running the harness on a
small testbed; release 3 added the scaffold. The analysis behind the rules is
archived in [`docs/archive/`](docs/archive/); a toy testbed was used for the
first field test and then parked (its history is in the git log).
