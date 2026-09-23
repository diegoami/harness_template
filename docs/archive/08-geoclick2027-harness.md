# The Geoclick2027 harness — the fifth model

**Status: release-2 input.** Release 1 (tag `r1`) consolidated the four projects
in [`01-harness-comparison.md`](01-harness-comparison.md); Geoclick2027 was
found afterwards and is recorded here. It is **not** a silent change to `r1`:
what it teaches goes into release 2 and the experiments.

Sources: `Geoclick2027/CLAUDE.md` (202 lines), `docs/REVIEW_LOOP.md` (69),
`docs/ORCHESTRATION.md` (381), `docs/HANDOVER.md` (307), `docs/tasks.yaml`,
`scripts/task.mjs` (862), `ROADMAP.md`, `DECISIONS.md`.

---

## 1. What it is: two harnesses in one repository

1. **The interactive task harness** — the current default for feature work:
   one task per session, a branch, a PR, an independent review by
   `opencode/gpt-5.6-luna#high` over GitHub, implementer and reviewer
   commenting until they agree (each signing with its model name), then the
   owner's merge OK. `CLAUDE.md` §3–§4, `docs/REVIEW_LOOP.md`.
2. **The remediation loop** — a bounded-programme runner: one agent, one task
   at a time, in the main checkout, **automerging** on green gates and a
   verified DoD, stopping only for release tags and five named conditions.
   `docs/ORCHESTRATION.md`, `scripts/task.mjs`, `docs/tasks.yaml`.

The second is the family of the postponed IC2 model
([`02`](02-ic2-complex-model.md)) — but leaner and **actually running**, which
makes it evidence rather than speculation.

## 2. Compared to release 1

**Shared:** two roles and the cross-family reviewer with an explicit model id
(`REVIEW_LOOP.md:11-18`); implementer and reviewer iterating to agreement;
findings ranked and every one answered; "silence is not agreement"; a
disagreement goes to the owner; the owner as merge authority in the interactive
harness; durable facts in the repo; diffs not files; quiet output with exact
commands; gates before push; one branch per task; the handoff to the next
session.

**Different:**

- the interactive harness is **GitHub-shaped** (`gh pr diff`, `gh pr comment`)
  where release 1 is local-first; its review ends when the reviewer states her
  findings are resolved or explicitly deferred — there is no AGREE marker
  (`REVIEW_LOOP.md:20-39`);
- **no design stage**: work is specified in `tasks.yaml` or a plan, and reviewed
  only on the PR;
- the remediation loop has **no reviewer at all** and automerges — an owner
  decision, with `/code-review` only on the two High-effort tasks
  (`ORCHESTRATION.md:98-118`);
- a **context budget** as the first section: canonical sources and never-read
  tables, because the repo is 637 tracked files, 27 MB of generated map data
  and ~160k tokens of prose (`CLAUDE.md:6-67`);
- a **handoff file** (`docs/HANDOVER.md`) updated in place *before* the session
  checkpoint is posted, carrying the next session's suggested first message
  (`CLAUDE.md:156-190`, `HANDOVER.md:126-128`);
- a **model attribution trailer** on every commit, with the history of which
  model did what (`CLAUDE.md:192-201`);
- a **task state machine** with a transition table, gitignored per-task state,
  and a **committed ledger** the owner reads without running anything
  (`ORCHESTRATION.md:223-271`, `tasks.yaml` header);
- **anti-zombie hygiene**: `doctor` every iteration; one branch, one checkout,
  one fixed port; never remove another session's worktree; never kill a process
  (`ORCHESTRATION.md:299-346`).

## 3. Evidence for the open experiments

**E4 — worktrees.** The fullest recorded answer of the five:

- draft 2 gave every task a worktree, a branch and a port with several agents;
  the owner cut it — "just loop" — and draft 3 has none of it, with the honest
  note that "everything that is gone was removed because it was machinery, not
  because the discipline behind it was wrong" (`ORCHESTRATION.md:8-17`);
- the parallel-worktree attempt failed for a concrete reason: a worktree
  checkout gets no own `node_modules` (npm workspaces hoists it), so the dev
  server could not render a map — and with `npm install` inside the worktree it
  works again (`ROADMAP.md:219-238`);
- `doctor` **reports** extra worktrees and never removes them, after `--fix`
  would have removed another session's live work (`ORCHESTRATION.md:287-294`).

**E5 — the owner-merge gate.** Geoclick is running the experiment:

- since GC-001 the loop automerges on green gates plus verified DoD, with
  deviations stated, and the owner gates release tags only
  (`ORCHESTRATION.md:19-24`, `98-149`);
- what automerge traded away is written down, including the residual risk and
  the revert path (`ORCHESTRATION.md:143-149`);
- the interactive harness deliberately kept the owner's merge OK — "a
  testing/review gate, not a cost gate" (`CLAUDE.md:120-125`).

## 4. What release 2 should take from it (candidates)

1. The **context budget** in the project slot: canonical sources, never-read
   paths, each with its reason — release 1's read/ignore habit is prose;
   Geoclick makes it a table.
2. The **handoff file**: a named destination for the session handoff, updated in
   place before the checkpoint is posted, with the next session's first message.
3. The **model attribution trailer**, sourced from the assignment table.
4. The **task-state shape** for projects bigger than a toy: spec vs machine
   state vs committed ledger; ids that appear in branch, commits and state.
5. The **anti-zombie habit**: a doctor command each iteration; report, never
   kill; one branch, one checkout, one port.
6. The **finding tiers** (`blocking` / `worth doing` / `nit`) as an addition to
   the review record format, and "relay a review verbatim, never paraphrase".
7. The **automerge conditions** as a documented policy option: green gates plus
   verified DoD, the trade-off written down, and the stops that remain —
   releases, two failed attempts, an unverifiable DoD, a wrong spec, anything
   irreversible. This is the competition's central rule, already run in anger.

## 5. Adoption path, if Geoclick moves to release 1

- Add `PRINCIPLES.md` and `AGENTS.md`; the existing `CLAUDE.md` project material
  becomes the project slot.
- Keep the review loop as this project's variant of the review: GitHub-shaped,
  no design stage, no marker — the shape release 1 gives Claude mode — and
  adopt the finding tiers.
- Keep the remediation loop as a **recorded owner amendment**: it bypasses the
  design stage and the reviewer, and automerges under its own conditions. Under
  release 1's protocol, bypassing the design stage is an owner amendment, and
  the exception is recorded in the project slot.
- Leave `tasks.yaml`, `task.mjs` and the ledger in charge of task logistics;
  the harness has no opinion on them beyond the gates disciplines.
