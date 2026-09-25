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

## The iteration table

Fill this table as the plan becomes clear; it is a plan, not a contract. Every
column is required: the request with the roadmap id and the owner's wording, the
done-when, what is out of scope, the mode, the design record the iteration
starts from, the effort, and the reviewer.

An iteration may be a **build-order step** with no roadmap request — a step the
project's own plan fixes (a scaffold, an engine, a check). Its request cell says
so; the exception is recorded, never improvised.

| iteration | request | done when | out of scope | mode | design record | effort | reviewer |
|---|---|---|---|---|---|---|---|
| 0 | <the first step> (build order 0; not a roadmap request) | <the runnable checks that complete it> | <what is deferred> | OpenCode | written when the iteration starts | medium | the assignment table |
| 5+ | the first unblocked roadmap request, in the owner's order | that request's block in `ROADMAP.md` | the other requests | OpenCode | written when the request is shaped | per request | the assignment table |

## The owner's part

- **Give the go-ahead** for each iteration. The agent opens every session the
  iteration needs (`PRINCIPLES.md`, *Sessions and handoff*); the owner opens
  and closes none.
- **Answer owner decisions** when they are raised, with the recommended default
  in hand.
- **Merge** each change, unless the project slot records `merge: auto`
  (`PRINCIPLES.md`, *Merge policy*).
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
