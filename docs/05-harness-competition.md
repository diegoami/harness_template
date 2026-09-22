# The harness competition

**Status: proposal** (decision D-9 in
[`03-standardization-decisions.md`](03-standardization-decisions.md)).

**Premise.** All four harnesses end the same way: "the owner merges." That gate
has never been tested — it is inherited from every project at once. The
competition removes it, and measures which harness performs better without it.

---

## 1. The questions

Primary:

- **Which working mode catches more real defects per unit of cost**, with the
  owner's merge gate removed: OpenCode mode (DeepSeek implements, Luna reviews,
  different family) or Claude mode (Claude implements, a fresh-context Claude
  session reviews, no design stage; the external acquisition of §7 is a later
  run)?

Secondary:

- Does the **design stage** pay for itself, or are defects it would catch caught
  in the implementation review anyway? (OpenCode has it; Claude does not.)
- Does a **full-ceremony variant** (Scopetta-style: classification,
  materiality, fallback rules) outperform a **light one** (Discola/Tressette
  prose) once the owner gate is gone?
- Does a **cross-family reviewer obtained by shelling out** (`codex exec`,
  `opencode run -m`, or the symmetric `claude -p` from the OpenCode side) beat a
  fresh same-family session, for the mode that cannot spawn one natively? (E6)

## 2. The rules

1. **Contestants.** First run: the two modes under release 1, each with its
   current reviewer acquisition (OpenCode: a subagent with an explicit model;
   Claude: a fresh-context session). Later runs, one variable at a time: the
   ceremony variants; or Claude mode with an external cross-family reviewer
   (E6) held against the same mode with its fresh session.
2. **The task list is fixed before the run and identical for both sides.** The
   tasks are the toy's iterations, split into small units ("parser",
   "movement and items", "the lamp and the grue", "the vault and the win", "the
   page", "the UI check", …), each with its own done-when.
3. **The project gates are identical for both sides** — the toy's tests and, in
   time, its UI check. The competition measures the process, not the tooling; if
   one side gets a better check, the run is void.
4. **The owner-merge gate is removed.** A change lands when its reviewer posts
   a signed AGREE (OpenCode mode) or a clean signed review (Claude mode) and CI
   is green. The owner does not merge, and does not steer mid-run.
5. **The design stage is part of each mode as it stands** — OpenCode runs it,
   Claude does not. That asymmetry is one of the things being measured, not a
   bug to fix.
6. **No gate is weakened to win.** A BLOCK or a rework round runs its course;
   repeated failure is recorded as a failed run, not merged around.
7. **Any rule change is recorded and applies to both sides**, or the run is
   void. Pre-register each task and its interpretation before starting.
8. **Every run is played afterwards.** The owner plays the toy and files real
   defects found; those are the primary metric, and playing is cheap because it
   is a toy.

## 3. The metrics

**Primary**

- **Escaped defects** — real defects found *after* a merge, by the owner
  playing, by a later task, or by a check added later. Severity-rated
  (cosmetic / wrong behaviour / unfinishable).
- **Caught in review** — findings that were reproduced and fixed before merge.

**Secondary**

- review rounds to merge; rework loops; withdrawn or false findings;
- cost proxies: wall-clock per task, agent invocations, tokens where the tool
  reports them;
- process health: owner interventions required (the design says zero), material
  changes made after an AGREE (an AGREE that did not hold), steps that produced
  nothing.

**Judgment.** The owner rates each landed change at play time with one line
("finished the vault, no visible defects"), so the scoreboard has a human
reading beside the counters.

## 4. The scoreboard

`experiments/competition/scoreboard.md`, one row per task × contestant:

| task | mode | rounds | findings | escaped | cost | owner note | links |
|---|---|---|---|---|---|---|---|

Rules for it:

- written **before** the run for the row's definition (task, base commit, done
  when), and **after** for the numbers — no retro-fitted criteria;
- every escaped defect links to the diff that introduced it and the finding that
  missed it;
- the run's conclusion, whichever way, is written into the standard's decision
  record.

## 5. Fairness and limits

- Same task text, same base commit, same gates for both sides.
- Alternate the order between tasks (A first on task 1, B first on task 2) so
  novelty and warm-up land on both.
- Both sides run with fresh contexts, no shared state, and their own reviewer
  (Luna, a fresh Claude session, or the external process of §7) — the
  competition compares the modes, not the reviewer models.
- **n is small and says so.** The first run's job is to expose rules that are
  obviously wrong, not to crown a winner; a tie is a result.
- If a merge breaks the toy, the next task includes the repair, and the defect
  is scored against the mode that landed it.
- The toy is the only subject until the rules survive a run; no source project
  is ever a contestant.

## 6. What the outcome changes in the standard

- **If autonomous merge survives** without a quality loss: the standard gains a
  fast path — auto-merge on a signed AGREE plus green gates for low-stakes
  changes — and the owner gate becomes a project decision rather than an axiom.
- **If it fails**, and escaped defects cluster where the owner would have
  caught them: the owner gate is vindicated, and the record says which defects
  and why, so the rule stops being inherited and becomes earned.
- Either way, the result is written into `PRINCIPLES.md`/`AGENTS.md` with the
  competition record as its evidence.

## 7. The reviewer acquisition variable (E6)

The modes differ in how they obtain a reviewer, and that difference is
measurable in the same protocol:

- **OpenCode mode** — a subagent with an explicit model id (today: Luna).
- **Claude mode, current** — a fresh-context Claude session: fresh, but the same
  family, and with no model choice.
- **Claude mode, proposed** — the same mode, with its reviewer obtained as an
  external process from a different family: `codex exec` (installed; has a
  `review` subcommand and stdin prompts) or `opencode run -m
  <provider>/<model>` (headless `run` in both CLI lines). The process reads the
  design and the diff from the repository, writes its verdict to `reviews/…`,
  and the orchestrator relays findings exactly as it would relay a subagent's.
- **The symmetric direction** — OpenCode mode shelling out to `claude -p` for a
  Claude review.

The comparison holds everything else constant and swaps only the acquisition:
same task, same gates, same owner-less merge. The expected finding is not
"external wins" but *which class of defect each acquisition catches* — the
OpenCode mode exists precisely because a same-family reviewer shares the
implementer's blind spots.

## 8. When it can start

After release 1 is frozen and the toy's first iteration exists. The engine-only
tasks can run before the toy's page and UI check exist (the gates are the toy's
tests); the page and check tasks join a later run, once both sides can be held
to the same gates.
