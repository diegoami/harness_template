# The iteration overlay (optional)

> Delete this file if the project does not slice work into iterations. It adds
> *when work is sliced* and the owner's part; it adds no review process — the
> modes and [`PRINCIPLES.md`](PRINCIPLES.md) own that.

## One iteration per session

Work comes from [`ROADMAP.md`](ROADMAP.md). An **iteration** is one shaped
request: one session, one branch (`iteration-N-<slug>`), one review, one merge.
Do not start the next iteration in the same session; do not grow an iteration
while it is in flight.

## The iteration's shape

Every iteration states, before it starts:

- **the request it lands** — the roadmap id, with the owner's original wording;
- **done when** — the runnable checks that make it complete (the gates it runs,
  and any assertion the change adds);
- **out of scope** — what is deliberately deferred, recorded so it is not lost;
- **the mode** — OpenCode or Claude, and for OpenCode the design record it
  starts from.

## Effort and reviewer per iteration

Fill this table as the plan becomes clear; it is a plan, not a contract.

| iteration | request | effort | reviewer |
|---|---|---|---|
| 0 | scaffold | medium | — |
| … | … | … | … |

## The owner's part

- **Start each iteration** and stop the session at its end.
- **Answer owner decisions** when they are raised, with the recommended default
  in hand.
- **Play the result** after an iteration that changes what a person sees. The
  checks measure what they measure; only a player measures whether it is fun.
- **File what you find** — the defect path is in `PRINCIPLES.md`.

## Fork provenance

When this project forks from another, record it — a sibling is a moving
reference, not a fixed one, and anything forked is a snapshot with a date.

| forked | from | at | by |
|---|---|---|---|
| | | | |

## What outlives a session

- a **decision** → the design record that made it, or the project slot in
  `CLAUDE.md`;
- a **rule a builder must follow** → `PRINCIPLES.md`, `AGENTS.md` or
  `CLAUDE.md`, via the bootstrap;
- **everything a stranger needs** → the project's `README.md` and docs.

If a session ends with something only it knows, that is a defect in the
handoff.
