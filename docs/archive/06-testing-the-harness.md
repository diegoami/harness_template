# Testing the harness: runs, releases and the notebook

**Status: proposal** (decided as D-8 in
[`03-standardization-decisions.md`](03-standardization-decisions.md)). This is
the answer to "how do we test a process in practice?"

---

## The problem

A harness is a process; it has no unit tests. It is tested the only way a
process can be: by running real changes through it, and comparing runs. That
needs three things decided — where runs happen, how one is created from a
release, and where what they teach is kept.

## The three layers

| layer | what it is | where |
|---|---|---|
| **the harness repo** | develops the harness; its own changes go through the process it defines (the bootstrap rule); releases are tags, `r1`, `r2` | `harness_template` |
| **the run** | one project built with one harness under test: a field test, an experiment arm, or a competition contestant | **its own repository**, scaffolded from a tag |
| **the notebook** | what was asked, what ran, what happened, what the standard learns | this repo: `experiments/`, the scoreboard, the decisions |

## Creating a run

One command, from the harness repo:

```sh
node tools/scaffold.mjs --tag r1 --name toy-r1 --dir ../toy-r1
```

It exports the manifest's files from the tag, fills the placeholders (project
name, gates table), runs `git init` and makes the first commit, "Scaffold from
harness r1". Publish with `gh repo create` if a remote is wanted — local-first
means it is optional.

Rules:

1. **A run starts from a tag, not from a branch and not from a fork.** A fork
   carries the harness's history and its identity; a branch of the harness repo
   is not a project; both make "what did release 1 actually produce"
   unanswerable. A snapshot with fresh history is a new project — and the copy
   step is itself part of what is being tested, so it must be explicit.
2. **The manifest decides what is copied.** `scaffold.manifest.json` lists the
   harness files and nothing else — never `docs/`, `experiments/` or the
   comparison.
3. **One run repo per contestant.** Two contestants need two parallel `main`s;
   a shared repo has one.
4. **The harness is frozen for the life of the run.** If a run needs a harness
   change, the change goes back to the harness repo as a candidate for the next
   release; the run continues as it started, or restarts from the next tag as a
   new run.
5. **A run writes its own records.** The run repo gets the harness's local-first
   records (`design/`, `reviews/`); the notebook gets the summary.

## Why not several instances in one repository

- The harness's rules address **the project repository**: one `main`, one
  read/ignore list, one set of paths, one gates table. Several apps in one repo
  break every one of them.
- The competition needs **two parallel mains**; branches share one, and the two
  contestants' merges contaminate each other's history.
- **The harness under test must be frozen.** In-place runs either share one
  harness with all runs — variants impossible — or duplicate it per directory,
  which is a repository in disguise with worse tooling.
- **The run's git history is evidence**: commits, branches, timestamps, the
  moment of each merge. Interleaving several apps into one history makes the
  comparison meaningless.
- **CI**, where a run has it, is a per-project workflow; one repository cannot
  host two projects' gates without path filters the harness does not assume.
- **Worktrees** belong *inside* a run (one per agent, IC2-style); mixing them
  across runs makes any location evidence meaningless.
- **Cleanup**: a run is disposable — archive or delete it once its record is
  written. One repo holding several runs is one repo you cannot throw away.

Where the pieces do live together is the **notebook**: `experiments/<run>/record.md`
in the `FORGETTING.md` shape, `experiments/competition/scoreboard.md`, the
escape log, and the decisions that graduate into the standard. The run repo is
disposable; the notebook is durable. A run without a record is a story, not
evidence.

## The harness repo dogfoods

The harness repo is its own first user: every change to the harness files
follows the process the harness defines (bootstrap). Its gates table is honest
about having none — document-only changes, reviewed under the process. This is
the cheapest continuous test there is: a harness that cannot govern its own
repository is not ready to govern another.

## Release flow

```
tag r1 ──→ runs ──→ records + scoreboard in the notebook ──→ decisions ──→ tag r2
```

A release with no runs is untested. A run without a record is a story. Mapping
runs to the experiments:

| run | what it tests | arms |
|---|---|---|
| **field test** | does r1 generalize beyond the card games? | one: the toy, built in iterations 0–4 and then grown from its `ROADMAP.md` ([`07`](07-feature-requests.md)) |
| **E1 layout** | which adapter layout is better | one run per layout |
| **E2 models** | does the implementer/reviewer pair change outcomes | one run per pair |
| **E5 competition** | which mode performs better with the owner gate removed | two, one per mode, same task list and gates |
| **E6 acquisition** | fresh same-family session vs external cross-family process | arms of E5's protocol |
| **E4 worktrees** | worktree-per-agent vs plain branches | inside the arms |
| **E3 interop** | how OpenCode / Claude / Codex share one process | cross-cutting; each arm records who did what |

## Cost and housekeeping

- Runs are small: a toy app and a handful of sessions. The expensive run in the
  set is E5, because it duplicates the task list.
- Naming: `toy-<tag>[-<arm>]` — `toy-r1`, `toy-r1-claude`, `toy-e5-a`.
- Keep a run while it is active; when its record is written, archive or delete
  it. If a toy is worth playing later, that is a new decision, not a reason to
  keep the experiment alive.
- The scaffold and the manifest are part of release 1. A template that cannot
  create a project from itself has not been tested at all.
