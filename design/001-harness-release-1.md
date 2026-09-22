# 001 — Harness release 1

**Stage:** design · **Status:** proposed · **Date:** 2026-09-23.

**How this record works** (D-6 in `docs/03-standardization-decisions.md`): this
file is the design proposal; the reviewer's verdict is appended below as a
`## Review — design stage` section, signed, ending in an explicit `AGREE` or
`BLOCK`. When a remote exists, this text is posted verbatim as the design
issue. Nothing here is implemented before an AGREE.

---

## Problem

Four projects grew one harness each. The working arrangement is the same in all
four — OpenCode (DeepSeek implements, Luna reviews cross-family) and Claude
(Claude implements, a fresh context reviews) — but the wrapper drifted: where
the shared principles live, what counts as a change that needs the process, how
a verdict is recorded, and what happens when a reviewer cannot review. Release 1
consolidates the process and leaves verification — tests, UI checks, mutation
harnesses, CI — to each project.

## Owner directives this rests on

1. Consolidate exactly four harnesses: `discola-web`, `Tressette`, `Scopetta`,
   `balloons-JS`.
2. The main purpose is running one project under **two working modes**:
   OpenCode (DeepSeek implements, Luna reviews, different family, fresh context,
   explicit model id) and Claude (Claude does its own thing: implements, and a
   fresh-context session reviews; no design-issue stage).
3. **Verification belongs to the project**: engine tests, UI checks, mutation
   harnesses and CI are not part of the harness.
4. **Local-first**: the harness works with no GitHub; when a remote exists, the
   same records are posted verbatim, and issues/PRs/`gh` are used but not
   required.
5. A **competition** will later remove the owner-merge requirement and measure
   which harness performs better; release 1 only keeps that possible.
6. A **run is a fresh repository** scaffolded from a release tag; several
   instances never share one repository.
7. Feature requests live in `ROADMAP.md`, written by the owner, shaped by the
   agent; inside a request the agent has **artistic license**, and the point is
   the process, not precision.
8. The postponed `imperial_conquest_2` model (worktrees, per-task models,
   label-only status) is not part of release 1.

## Decisions applied

The recommended defaults from `docs/03-standardization-decisions.md`, which the
owner may override at merge:

- **D-1** separate `PRINCIPLES.md`; `AGENTS.md` and `CLAUDE.md` link to it.
- **D-2** Scopetta's non-trivial test with the conservative floor.
- **D-3** the iteration overlay is optional and ships with `ROADMAP.md`.
- **D-4** the gates seam: six disciplines, each project declares its gates.
- **D-5** the verification patterns are documentation, optional by design.
- **D-6** local-first records under `design/` and `reviews/`.
- **D-7** the model assignment table, the invariant and the update rule.
- **D-8** harness files at the root; runs are separate repos made by the
  scaffold.

## What release 1 contains

The files a run receives, via `scaffold.manifest.json`:

| file | content |
|---|---|
| `PRINCIPLES.md` | the habits; the ownership map; the non-trivial test and floor; the gates disciplines; session handoff |
| `AGENTS.md` | the OpenCode adapter: roles and assignment table; two stages; verdict record; BLOCK; owner decisions; fallback/waiver; AGREE materiality; bootstrap |
| `CLAUDE.md` | the Claude adapter: fresh-context review, no design stage, owner may review; then the **project slot** (below) |
| `PLAN.md` | the optional iteration overlay: done-when per iteration, effort/reviewer per iteration, the owner's part. Deletable. |
| `ROADMAP.md` | the feature backlog: how to request, statuses, shaping, artistic license (`docs/07`) |
| `design/README.md` | what a design record is: naming, sections, the verdict append |
| `reviews/README.md` | what a verdict record is: naming, signature convention, materiality |
| `verification/README.md` | the nine optional patterns from `docs/01` §9, one paragraph each |
| `scaffold.manifest.json` | the list above, read by the scaffold |
| `tools/scaffold.mjs` | creates a run repo from a tag (below) |

**Not in release 1:** any test, UI check, mutation harness or CI file; any
GitHub requirement; worktrees; a Codex adapter; the competition's runner.

## The project slot

The harness files are project-agnostic except one clearly marked section at the
end of `CLAUDE.md`:

```
## Project slot
<!-- fill this in the run's first session -->
- product: {{PROJECT}} — one paragraph
- paths to inspect / normally ignore
- never read or echo
- the gates table: commands, what each covers, when, repeats, failure model
- conventions (language, no-build promises, decided and not to be re-opened)
```

The scaffold replaces `{{PROJECT}}` and leaves the rest as tokens for the run's
first session. Rationale: no duplicate template tree to drift; the harness
files stay uniform; the slot is where a project's own rules live, which is what
`CLAUDE.md` already does in all four source projects.

## The records (local-first)

- `design/NNN-<slug>.md` — problem, findings with `file:line`, design, open
  questions; the reviewer appends its verdict.
- `reviews/NNN-<slug>-impl-NN.md` — the implementation review, naming the
  revision (commit sha) it covers.
- The verdict's final line: `— <display name> (<model id with variant), reviewer`
  followed by a marker line `AGREE` or `BLOCK`.
- With a remote, the same text is posted as the issue/PR comment; the file stays
  canonical.
- Materiality, fallback and re-review are expressible entirely in these files:
  a verdict names its revision; a material edit after an AGREE is a new
  revision and needs a new verdict.

## The scaffold

`node tools/scaffold.mjs --tag r1 --name <name> --dir <path>`

1. Reads `scaffold.manifest.json`; refuses a target directory that exists and is
   non-empty.
2. Reads each file with `git show <tag>:<path>` — no dependency on the working
   tree or network.
3. Writes them; replaces `{{PROJECT}}` with the name.
4. Generates a minimal `README.md` (project name, the harness tag, the first
   session's instruction).
5. `git init`, one commit: `Scaffold from harness r1`.
6. Prints next steps. It does **not** create a GitHub repository; the generated
   README documents `gh repo create` as an optional follow-up.

## Non-goals

- No mandated verification tooling; `verification/` is a library, not a gate.
- No GitHub dependency, no `gh` in the loop.
- No worktrees; no parallel-agent orchestration.
- No second-machine story; no labels-as-state.

## Bootstrap on this release

This proposal is the design stage of the change that introduces the harness, so
it is reviewed before anything is written. On AGREE the files are implemented on
branch `release/r1`, the implementation is reviewed the same way, and the owner
merges and tags `r1`. The implementation review is
`reviews/001-harness-release-1-impl-01.md`.

## Open questions

1. **Project slot location** — in `CLAUDE.md` (as in the four) or its own
   `PROJECT.md`? Proposed: `CLAUDE.md`, because both modes read it and the four
   already do.
2. **Scaffold source** — `--tag` requires `r1` to exist before the first run,
   but this release creates the first tag. Proposed: accept `--ref <commit|tag>`
   and document `--tag` as the normal case; the first run may use the merge
   commit.
3. **Verification library shape** — one `README.md` with nine sections, or a
   file per pattern? Proposed: one file per pattern once the toy has worked
   examples to cite; one README now.
4. **Artistic license** — project rule (`ROADMAP.md`, as now) or a principle
   (creative work grants latitude inside the request's intent)? Proposed:
   `ROADMAP.md`, because it belongs to the request mechanism.
5. **Reviewer writes its own verdict file** — proposed yes, so authorship is not
   routed through the implementer; the scaffold's `reviews/README.md` states it.
