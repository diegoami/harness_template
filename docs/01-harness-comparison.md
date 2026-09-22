# The four harnesses, compared

**Scope.** The four harnesses that have grown in `discola-web`, `Tressette`,
`Scopetta` and `balloons-JS`. This document is the evidence base for
standardization (release 1). Imperial Conquest 2's more complex model is out of
scope here and recorded in [`02-ic2-complex-model.md`](02-ic2-complex-model.md).
The competition that removes the owner's merge gate is designed in
[`05-harness-competition.md`](05-harness-competition.md).

**Method.** Every harness file was read in full: `AGENTS.md`, `CLAUDE.md`,
`PRINCIPLES.md`, the harness sections of `PLAN.md`, the `ui-check` skills, the
CI workflows, `package.json`, and the tools they gate. Line counts are from
2026-09-22. Claims cite paths; where a claim rests on one project's wording,
that project is named.

---

## 0. The point of the harness

The harness exists to run one project under **two working modes**, and to keep
both honest:

- **OpenCode mode — DeepSeek implements, Luna reviews.** The reviewer is from a
  **different model family**, invoked as a **subagent in a fresh context with an
  explicit model id**. The process exists to make that review real: the design
  is agreed before code, the verdict is signed where the work is, a BLOCK is not
  overridden, and implementation is reviewed against the agreed design before
  the owner merges.
- **Claude mode — Claude does its thing.** Claude implements, and the review is
  a **fresh-context Claude session**; there is no cross-family reviewer and no
  separate design-issue stage. Tressette states it in fourteen lines
  (`CLAUDE.md:12-14`); Scopetta adds that the owner may review as an independent
  option, but "an owner is **not automatically a fresh context** — and is not
  one if they directed or wrote the change" (`CLAUDE.md:37-45`).

Everything else in the harness — the principles, the ownership of the rules,
the change classification, the records, the owner-decision convention — exists
to support those two modes or to keep the project honest while they run.

Three consequences shape this whole comparison:

1. **The unit of standardization is the process, not the tooling.** `AGENTS.md`
   and `CLAUDE.md` are two adapters over the same principles; a third adapter
   (Codex) must be addable without touching the principles.
2. **Verification belongs to the project.** Engine tests, UI checks, mutation
   harnesses and CI are how a *project* proves itself; they are not part of the
   harness and must not be standardized as if they were. The harness's business
   is the discipline around them: a project declares its gates, a red gate does
   not merge, a new assertion is made to fail before it is made to pass, and a
   finding or a claim is reproduced before it is acted on. §5 covers the seam.
3. **The four agree on more than they realize, because the modes were copied
   from one project to the next rather than derived.** The drift is in the
   wrapper — where the principles live and who has to be asked — not in the
   working arrangement.

## 0.1 The four at a glance

| | Discola-web | Tressette | Scopetta | balloons-JS |
|---|---|---|---|---|
| product | Briscola (1997 port) | Tressette | Scopa | balloon popper |
| role in the series | the origin | 2nd | 3rd | parallel, different shape |
| harness files | `AGENTS.md` (46), `CLAUDE.md` (143) | `AGENTS.md` (47), `CLAUDE.md` (20), `PLAN.md` §7 (2028 total) | `AGENTS.md` (198), `CLAUDE.md` (575), `PRINCIPLES.md` (141), `PLAN.md` (2004) | `AGENTS.md` (63), `CLAUDE.md` (178) |
| principles live in | `CLAUDE.md` | `PLAN.md` §7.7 | `PRINCIPLES.md` | `CLAUDE.md` |
| project verification (illustration only) | UI check 492, tests 163, CI | UI check 1659, tests 1268, CI | UI check 3616, mutation 1617, tests 1879, CI | browser suite 5389, scores 265, no CI |

The three card games share a lineage; balloons-JS shares the philosophy and the
two-file split, not the code. The verification column is **not** a harness
feature — see §5.

---

## 1. Anatomy: what belongs to the harness, what belongs to the project

| Layer | Contents | Standardizable? |
|---|---|---|
| **Harness** | principles and habits; the two mode adapters; stages and their order; the change classification; reviewer roles, assignment and invariants; verdict records and signature; BLOCK/AGREE semantics; owner-decision convention; fallback and waiver; defect path; session handoff; fork provenance | yes — this is release 1 |
| **Project** | the app; its engine; its tests; its UI check; its mutation harness; its CI workflow; its commands and run counts; its paths to read or ignore; its player-facing conventions | no — each project owns these |
| **Seam** | the declared gates: what runs, when, how many times, what a red result blocks | the harness states the discipline, the project declares the content |

The seam is where the four projects have spent most of their words, and it is
easy to mistake for the harness. It is not: Scopetta's `break_ui.mjs`, Discola's
492-line UI check and balloons' 5,389-line browser suite are three projects'
answers to the same question ("how do I know this works?"), and none of them
belongs in a standard imposed on the next project. What belongs in the standard
is that **every project must have an answer, declared in one place**.

## 2. The two modes, in the four

### 2.1 OpenCode mode

All four name the same arrangement, with the same wording for the critical
part:

| | Discola | Tressette | Scopetta | balloons-JS |
|---|---|---|---|---|
| implementer | DeepSeek `opencode/deepseek-v4.1-flash` | same | same | same |
| reviewer | Luna `opencode/gpt-5.6-luna` `#high` | same | same | same |
| invocation | "subagent in a fresh context and given an explicit model id" | same | same + "the invariant is a different model family; the ids above are the current assignment, not the rule" | same |
| design stage | design issue → AGREE | design issue → AGREE | design issue → AGREE, with the four-condition defect path | design issue → AGREE |
| signature | prose (`— Luna (GPT-5.6, high)`) | prose | exact convention, final line `— <display name> (<model id with variant>), reviewer` | prose |

The mechanism is identical; Scopetta's wrapper is the precise one. The one
piece of drift: `discola-web/.github/workflows/opencode.yml:33` still pins
`model: opencode/deepseek-v4-flash`, a version behind every harness document —
the argument for one assignment table and Scopetta's update rule ("whoever
changes an assignment updates the table in the same change").

### 2.2 Claude mode

| | Discola | Tressette | Scopetta | balloons-JS |
|---|---|---|---|---|
| stated? | no reviewer mechanism ("this file does not spawn a separate reviewer model") | yes | yes | no mechanism stated |
| who reviews | — | fresh-context Claude session | fresh-context session required for non-trivial changes; owner may review, not automatically fresh | — |
| design stage | — | none | none | — |

This is the mode with the least written down, which is exactly why the user's
description — "Claude does its thing" — is the honest one: Claude Code brings
its own session model, its own skills and its own review habits, and the Claude
harness file mostly needs to say **what not to import from the OpenCode mode**
(the design-issue stage, the signed verdict machine) and **what still applies**
(the principles, the owner-decision convention, the gates discipline, the
records).

**The fresh session is the current mechanism, not the definition.** The mode's
definition is: the review happens in a context the implementer cannot see, with
a model whose family and id are recorded. Claude Code cannot spawn a subagent
from another family, so its current mechanism is a new Claude session — but the
mechanism is a slot. A proposed second mechanism is to **shell out to a
different family**: `codex exec` (Codex CLI 0.155.1 is installed on this
machine, with a `review` subcommand and stdin prompts) or
`opencode run -m <provider>/<model>` (headless `run` exists in both the 1.x CLI
on PATH and the 2.0 CLI bundled with the desktop app). The reviewer is then a
separate process, started from the repository, reading the design and the diff
and writing its signed verdict to a file — which also makes it work with no
GitHub at all. This is experiment E6.

### 2.3 What the modes share, and what must never be shared

Shared: the principles; the owner and the owner-decision convention; the
classification of changes; the defect path; the records; the gates discipline;
the session handoff; the bootstrap rule that a change to a harness file is
itself subject to the process.

Mode-specific, and must not leak: **how the reviewer is obtained and invoked**
(§2.4); the design stage (OpenCode has it, Claude does not); the verdict format
(a signed BLOCK/AGREE machine vs a review on the pull request); the model
assignment table.

A third adapter must be able to say "here is where I differ" in the same shape
— this is the test the mode files must pass.

### 2.4 Reviewer acquisition: three mechanisms, one invariant

| mechanism | reachable from | fresh context | different family | status |
|---|---|---|---|---|
| subagent with an explicit model id | OpenCode | yes | yes | in use in all four |
| fresh-context session of the same tool | Claude Code (and OpenCode) | yes | no | Tressette, Scopetta |
| external CLI process (`codex exec`, `opencode run -m`) | any tool that can run a shell command | yes (new process) | yes (model chosen and recorded) | proposed, E6 |

The invariant is the same in all three: a context the implementer never saw, a
different family from the implementer, an explicit model id in the record, and
the verdict signed. Which mechanism a mode uses is an implementation detail of
that mode — which is what makes the shell-out reviewer the first experiment to
run, because it gives Claude mode the property OpenCode mode has by
construction.

## 3. Shared process facts (all four agree)

- **Design before code**, for the OpenCode mode: problem, findings with
  `file:line`, design, open questions; agreed before implementation.
- **Implementation on a branch, one PR**, reviewed against the agreed design.
- **The owner merges.** (The competition in
  [`05`](05-harness-competition.md) makes this rule an experimental variable.)
- **Bootstrap**: a change that introduces or edits a harness file is itself
  reviewed to AGREE ("the process reviews its own amendment").
- **The verdict is posted where the work is and signed**; Luna posts through
  the owner's single GitHub account, so the signature is the only marker of
  authorship.
- **A BLOCK is not overridden by the implementer**; it goes to the owner.
- **The reviewer never shares the implementer's context.**
- **Durable facts live in the repository**, not in a conversation.

## 4. Where the four differ (process)

- **Where the principles live** (Discola/balloons: `CLAUDE.md`; Tressette:
  `PLAN.md §7.7`; Scopetta: `PRINCIPLES.md` with an authoritative ownership map
  and a rule for contradictions: "a non-owning file **links** to an idea and
  does not restate it", `PRINCIPLES.md:12-26`).
- **What needs review**: Scopetta has the only operational test — non-trivial
  if it can change observable behaviour, what a check measures, the design or
  process a builder follows, or player-facing copy, with a conservative floor
  of paths and a pure-typo exception (`PRINCIPLES.md:28-66`). Tressette is the
  direct opposite: "every OpenCode implementation, with no size floor"
  (`AGENTS.md:36`). Discola and balloons state no classification.
- **AGREE materiality**: only Scopetta defines what the verdict covers and what
  invalidates it — current revision; commit message/whitespace/typo edits are
  non-material; a material edit to the issue body always re-opens review; a
  re-review may continue the reviewer's session while the initial verdict comes
  from a new one (`AGENTS.md:119-137`).
- **Owner decisions**: Discola and balloons state the principle; Scopetta
  operationalizes it (recorded with a recommended default and a mark; the
  reviewer may require that it be decided and recorded, but "may not reject it
  merely for differing from the reviewer's preference"; a rejected proposal is
  withdrawn or re-scoped, never merged around).
- **Fallback and waiver**: only Scopetta. Failed review is no review and no
  AGREE; retry or another family, recorded; a waiver is an implementation-stage
  exception only, and bypassing design is an owner amendment.
- **Unit of work**: Tressette is the only one with iterations (`PLAN.md
  §7.1–§7.6`: one iteration per session, done-when, effort per iteration, the
  owner's part, the fork provenance table). The others work change by change.
- **Verdict mechanics**: Scopetta's exact signature and the comment-not-approval
  rule ("GitHub forbids approving your own pull request under one account",
  `AGENTS.md:49-50`).
- **Provenance**: Tressette keeps a fork table with commits and states "Discola
  is a moving reference, not a fixed one" (`PLAN.md:1764-1774`); Scopetta cites
  ancestors in prose.
- **What outlives a session**: Tressette names the three files
  (decision → `PLAN.md §0`, builder rule → `§7.7`, stranger docs → `SPEC.md`);
  Scopetta and Discola carry the three-bullet handoff.

## 5. Project verification, and the seam

This is the layer the harness does **not** own. What the four projects carry,
as illustration:

| | Discola | Tressette | Scopetta | balloons-JS |
|---|---|---|---|---|
| unit tests | `engine.test.mjs` | engine + opponent + release tests, golden fixture | engine + opponent + release tests, golden fixture | scores suite + browser suite |
| UI check | `check_ui.mjs` + `ui-check` skill | bigger, with fan assertions | biggest, 12 passes, states and viewports | none (browser suite instead) |
| mutation harness | — (older-revision technique) | — (habit) | `break.mjs` + `break_ui.mjs` | — |
| CI | 2 workflows | 2 jobs | 2 jobs | none |
| run discipline | full suite 3× for primary logic | none stated | measured-input tree | 8× for game logic, 1 pass otherwise |

None of it is standardizable; all of it is good. The harness's business in this
layer is a **short list of disciplines** every project must express in its own
way:

1. **Declare the gates in one place.** Commands, what each covers, when each
   runs, how many repeats — with the failure model that justifies the repeats
   (`discola`: engine determinism → 3×; `balloons`: browser timing → 8×;
   `scopetta`: a 25-minute check → a measured-input tree).
2. **A red gate does not merge.** Stated by Discola, Tressette and Scopetta;
   balloons runs its gates locally before pushing.
3. **A new assertion is made to fail before it is made to pass.** Stated in all
   three skills; mechanized only by Scopetta's mutation harness, which checks
   that the assertion *written for that defect* goes red, not merely that
   something did. The pattern is optional; the discipline is not.
4. **Reproduce before you act** — a reviewer's finding and your own claim alike
   (`balloons`: "run old and new side by side", because a broken harness shows
   up as both columns agreeing).
5. **Assert what a person would notice, then go and play it.** balloons'
   formulation of the difference between a passing test and a working feature;
   Tressette's checklist and the skills' defect tables are the same idea.
6. **State what the check would have caught had the code been wrong** — the
   rule that stops implementer and reviewer sharing a blind spot.

Everything else is the project's to invent. A project with no UI has no UI
check; a project with no browser has no browser suite; the harness should say
what the project must *state*, not what it must *build*.

## 6. Matrix — the harness (process)

● present and complete 　◐ partial or implicit 　— absent

| | Discola | Tressette | Scopetta | balloons-JS |
|---|---|---|---|---|
| OpenCode mode stated (roles, cross-family, fresh context, model id) | ● | ● | ● | ● |
| Claude mode stated (fresh-context session, no design stage) | — | ● | ● | — |
| design stage before implementation | ● | ● | ● | ● |
| implementation PR stage | ● | ● | ● | ● |
| bootstrap self-amendment | ● | ● | ● | ● |
| verdict signed where the work is | ◐ | ◐ | ● | ◐ |
| exact signature convention | — | — | ● | — |
| AGREE materiality / re-review | — | — | ● | — |
| reviewer fallback / waiver | — | — | ● | — |
| BLOCK not overridden | ● | ● | ● | ● |
| BLOCK scope (only what is necessary) | — | — | ● | — |
| owner-decision convention | ● | ◐ | ● | ● |
| trivial / non-trivial classification | — | — (explicit no floor) | ● | — |
| defect path | ◐ | ● | ● | ◐ |
| iteration overlay | — | ● | — | — |
| principles ownership map | — | ◐ | ● | — |
| fork provenance table | — | ● | ◐ | — |
| session handoff shape | ● | ● | ● | ◐ |
| "decided, not to be re-opened" | — | — | — | ● |

## 7. Matrix — project verification (illustrative, not normative)

| | Discola | Tressette | Scopetta | balloons-JS |
|---|---|---|---|---|
| declared gates table | ● | ● | ● | ● |
| repeat rule with a stated failure model | ● 3× | — | ● tree | ● 8× |
| UI check + skill born with it | ● | ● | ● | — |
| mutation harness (assertion-named EXPECT) | — | — | ● | — |
| CI on every PR | ● | ● | ● | — |
| old-vs-new / reproduce discipline | ◐ | ◐ | ● | ● |
| "decided" outcomes recorded | — | — | — | ● |

## 8. The union of harness ideas worth keeping

Process only; the verification patterns are §9.

1. **The two mode adapters** over one set of principles, with the mode-specific
   parts named and forbidden to leak (all four; the restatement of the point).
2. **One ownership map** for the harness files, with links instead of
   restatements (Scopetta).
3. **Cross-model review**: different family, high effort, fresh context,
   explicit model id, assignment table + update rule (Scopetta's wording).
4. **Two stages** for the OpenCode mode, design → AGREE, implementation →
   AGREE (all four); **no design stage** for Claude (Tressette/Scopetta).
5. **Bootstrap**: the process reviews its own amendment (all four).
6. **Trivial/non-trivial** test with a conservative floor (Scopetta).
7. **The defect path** — the four conditions for skipping design (Scopetta).
8. **Signed verdicts** with the exact convention; comment, not approval
   (Scopetta).
9. **AGREE materiality and re-review** (Scopetta).
10. **Owner decisions** recorded with a recommended default (Scopetta; the
    principle in Discola/balloons).
11. **BLOCK scope** — necessary to the change as proposed (Scopetta).
12. **Fallback and waiver** (Scopetta).
13. **The defect path through work**: an issue, a fix, and the assertion that
    would have caught it (Tressette/Scopetta).
14. **Read/ignore and output economy** (all four), **one source of truth,
    never-echo, big files, decided-not-to-reopen** (balloons).
15. **Session handoff** — completed / files-decisions / next (all four).
16. **Fork provenance table** (Tressette).
17. **Iteration overlay**, optional, for plan-driven projects (Tressette).
18. **Experiment record** pattern for branches deliberately not merged
    (Tressette's `FORGETTING.md`).
19. **Open-work file** for loose ends and one-off flakes (balloons).
20. **The owner-merge rule as a variable, not an axiom** — the competition
    ([`05`](05-harness-competition.md)).

## 9. The union of verification patterns (a library, not a requirement)

Patterns a project may adopt, documented once and chosen per project:

1. Deterministic unit tests over a DOM-free engine.
2. A golden fixture that freezes behaviour, re-recorded in the commit that
   moves it.
3. A UI check that renders *states*, not just screens, and asserts a defect
   table (assertion → the bug it was written for).
4. The mutation harness: one defect at a time, the named assertion must go red,
   `QUICK` for proving an assertion bites and never for clearing a check,
   survivors are the finding; plus assertion-removal and threshold-retune rules.
5. Run counts justified by the failure model; the measured-input tree for an
   expensive check; "no measured input changed → no re-run"; rebase re-runs.
6. The older-revision technique: point the check at a commit that had the bug.
7. Old and new side by side.
8. Assert what a person notices — pixels, contrast, timing — then play it.
9. CI as the merge gate, with the two-job split (dependency-free unit job, then
   the environment-heavy check), and a red CI that blocks.

## 10. Conflicts and gaps standardization must resolve

1. **Where the principles live** — `PRINCIPLES.md` (Scopetta), `CLAUDE.md`
   (Discola/balloons), `PLAN.md` (Tressette). One owner; the others link.
2. **The trivial path** — Scopetta's test and floor, or Tressette's "no size
   floor". Direct opposites.
3. **The iteration overlay** — optional template section, or outside the
   standard.
4. **The gates seam** — what exactly the harness requires of a project that has
   no CI, no UI, or no browser; and how the declared-gates table is shaped.
5. **Verification library** — shipped as patterns, and where they live so they
   are clearly not mandatory.
6. **Review records with no GitHub** — this project is local-first; every
   verdict convention assumes issues and PRs. A local form is needed.
7. **Model assignment** — one table, the invariant, the update rule; Discola's
   workflow file is the evidence.
8. **Template shape and the toy's home** — where the harness ends and the
   project begins.
9. **The competition rules** — autonomous merge, the metric set, and what
   "performs better" means ([`05`](05-harness-competition.md)).
10. **Multi-tool interop** (later) — OpenCode and Claude Code both appear in the
    four; Codex in none of them. The first concrete experiment is E6, the
    shell-out cross-family reviewer for Claude mode (§2.4).
11. **Worktrees** (later) — none of the four uses them; IC2 and Geoclick2027
    are the evidence.
