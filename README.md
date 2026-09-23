# harness_template

The process for running a project under two working modes — **OpenCode**
(DeepSeek implements, Luna reviews cross-family) or **Claude Code** (Claude
implements, a fresh-context session reviews) — and the scaffold that creates a
project with it.

## The point

The harness runs the same project either:

- **with OpenCode** — DeepSeek implements, Luna reviews: a different model
  family, fresh context, an explicit model id, the design agreed before code,
  signed verdicts, and a BLOCK that is not overridden; or
- **with Claude Code** — Claude implements, and a fresh-context Claude session
  reviews; no design stage and no cross-family reviewer.

The two modes share the principles, the owner-decision convention, the records
and the gates discipline; they differ in how the reviewer is obtained.

**Verification is not the harness.** Unit tests, UI checks, mutation harnesses
and CI belong to each project; the harness requires a declared gates table and
the six disciplines in [`PRINCIPLES.md`](PRINCIPLES.md).

## Status

**Release 3 is tagged
[`r3`](https://github.com/diegoami/harness_template/tree/r3)** — the
parametrizable scaffold (PR #3). Earlier: `r2`, four fixes from the first field
test, and `r1`, the consolidation of four harnesses. The releases' records are
[`design/`](design/) with [`reviews/`](reviews/); the next items are in
[`BACKLOG.md`](BACKLOG.md).

## The harness

| file | what it owns |
|---|---|
| [`PRINCIPLES.md`](PRINCIPLES.md) | the habits, the ownership map, the non-trivial test, the six gates disciplines, the verdict protocol |
| [`AGENTS.md`](AGENTS.md) | the OpenCode mode: DeepSeek implements, Luna reviews cross-family |
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
| `auto` | the two stages, `PLAN.md` and `ROADMAP.md` | the implementer merges on a clean review plus green gates |

The flags, questions and defaults are in `node tools/scaffold.mjs --help`;
`presets/*.json` holds each preset's files and policy. The generator fills the
project slot, writes the README and the CI workflow, makes the first commit, and
creates the GitHub remote when asked.

A project created this way is a **run**: its own repository, with the harness
frozen at the tag it was created from. Several runs never share a repository.

## History

Release 1 consolidated four harnesses — `discola-web`, `Tressette`, `Scopetta`,
`balloons-JS`; release 2 folded in four fixes found by running the harness on a
small testbed; release 3 added the scaffold. The analysis behind the rules is
archived in [`docs/archive/`](docs/archive/); a toy testbed was used for the
first field test and then parked (its history is in the git log).
