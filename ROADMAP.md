# Roadmap — requests and iterations

> How the project grows. The owner writes requests; the agent shapes them; an
> accepted request is one iteration, one session and one review
> ([`PLAN.md`](PLAN.md), when the overlay is used).

## The queue

| id | request | status | iteration | notes |
|---|---|---|---|---|
| F-1 | <one line, in the owner's words> | requested | | |

## Statuses

`requested` → `accepted` → `in design` → `in review` → `landed`; plus `parked`
and `refused`. `in design` applies only where the project has a design stage;
without one, a request goes from `accepted` to `in review`. The agent sets the
middle states. **Only the owner parks or refuses**, and the reason is
recorded.

## How to request

Add one row to the table, in your own words — or say it in a session ("add to
the roadmap: …") and the agent appends the row and stops. **A request is not a
request to implement**: the shaping still happens — and the design stage, where
the project has one — and the original wording is quoted verbatim in the block
and never silently reworded.

## The block, written when a request is accepted

```
### F-N — <title>
- **Original request:** "<verbatim>"
- **Player value:** why this matters
- **Scope:** what will exist after it lands
- **Done when:** the runnable checks
- **Out of scope:** the temptations deferred, so they are recorded not lost
- **Depends on:** other requests, or none
- **Open questions:** owner decisions marked as such
```

## The agent's job

- **Shape** a request when it is picked up: player value, scope, done-when,
  out-of-scope, dependencies, open questions, recorded as the block above.
  Where the project has a design stage ([`AGENTS.md`](AGENTS.md)), the block
  is where its design record starts.
- **Size it to one iteration.** Split before starting if it does not fit; never
  let a task grow while in flight.
- Take the **first unblocked** request when told "do the next roadmap item",
  and stop after it.
- Never implement an unshaped request; never mark an owner status; never edit
  the original wording.

## Artistic license

The project exists to exercise the process; its content is not the deliverable.
That holds only under `premise: testbed` (the project slot in `CLAUDE.md`);
under `premise: product`, the content is the deliverable. Under either
premise, the agent has **artistic license inside a request**:

- invent the names, the prose, the puzzles, the small mechanics;
- implement the thing that reads best, not the thing that follows the request
  word for word;
- record what was invented, so the choice is visible and reversible;
- do not ask the owner about wording, names, or flavour.

What the license does not cover: **the intent of the request**, **scope**, **the
done-when and the gates** (extendable with the reason recorded, never
weakened), and **owner decisions**.

The point is the process, not precision. That, too, holds only under
`premise: testbed`: there, a puzzle nobody asked for, landed through a review
that caught the right things, is a better result than a literal request landed
through a rubber stamp. Under either premise, the request is a direction; the
done-when is the contract.

## How it plugs into the rest

- **Iterations after the scaffold are the landed requests**, in order.
- **When GitHub exists**, each row becomes an issue, with the block as its body
  and the status as a label; the posting rule is in `PRINCIPLES.md`.
- **A comparison run copies a frozen subset** as its task list: same text, same
  base commit, same gates for every arm.
- The design and review records refer to the request id.
