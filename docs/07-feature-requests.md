# Feature requests: how a project grows

**Status: proposal** — part of harness release 1 as a **project-file template**,
and the toy's growth mechanism (D-3 in
[`03-standardization-decisions.md`](03-standardization-decisions.md)).

---

## Why

The harness reviews changes; something must supply them. Tressette's iteration
overlay says *how* work is sliced but not *where the work comes from*.
Imperial Conquest 2 solved that with a task catalogue — a contract per task, too
heavy for a toy. The middle is a plain-text backlog file: owned by the human,
shaped by the agent, tracked in the open, no issue tracker required.

## The file

`ROADMAP.md` in the project repo. Two parts: the queue, and one block per
accepted request.

### The queue

| id | request | status | iteration | notes |
|---|---|---|---|---|
| F-1 | three more rooms past the vault | landed | 5 | |
| F-2 | a fuller parser: adjectives, "put X in Y", pronouns | accepted | 6 | |
| F-3 | a riddle gate on the vault door | requested | | three riddles, a wrong answer costs a turn |
| F-4 | save and restore | requested | | |

Statuses: `requested`, `accepted`, `in design`, `in review`, `landed`,
`parked`, `refused`. **Only the owner parks or refuses**; the agent proposes and
records it as a proposal.

### The block, written when a request is accepted

```
### F-2 — A fuller parser
- **Original request:** "the parser should handle real sentences, not just verb noun"
- **Player value:** ...
- **Scope:** what will exist after this lands
- **Done when:** the runnable checks
- **Out of scope:** the temptations deferred, so they are recorded not lost
- **Depends on:** F-1
- **Open questions:** owner decisions marked as such
```

## The owner's request

One line, in your own words. Either edit the table directly, or say in a session
"add to the roadmap: …" and the agent appends the row and stops. A request is
**not** a request to implement: the design stage still runs, and the original
wording is quoted verbatim in the block — the agent must not silently reword it.

## The agent's job

- **Shape** a request when it is picked up: player value, scope, done-when,
  out-of-scope, dependencies, open questions. The shaping *is* the design
  stage — in OpenCode mode it becomes the design proposal, in Claude mode the
  brief.
- **Size it to one iteration**: one block = one session = one review. Split
  before starting if it does not fit; never let a task grow while in flight.
- Take the first unblocked request when told "do the next roadmap item", and
  **stop after it** (Tressette's one-iteration-per-session rule).
- Never implement an unshaped request; never mark an owner status; never edit
  the original wording.

## Order and size

The table is ordered by the owner's priority. There are no estimates — the
done-when is the sizing. Dependencies are explicit; a blocked request is
skipped, never folded into another.

## Artistic license

The project exists to exercise the process; its content is not the deliverable.
So the agent has **artistic license inside a request**:

- invent the rooms and their names, the riddles, the prose, the item
  descriptions, the small mechanics of a puzzle;
- implement the thing that reads best, not the thing that follows the request
  word for word;
- record what was invented — in the block and the design record — so the choice
  is visible and reversible;
- do not ask the owner about wording, names, or flavour. Those are the agent's.

What the license does not cover:

- **the intent of the request** — "more rooms" stays more rooms;
- **scope** — inventing three rooms never adds a fourth feature;
- **the done-when and the gates** — they may be extended, with the reason
  recorded, but never weakened;
- **owner decisions** — anything that is really theirs (§ owner decisions in
  the harness).

The point is **the process, not precision**. A riddle nobody asked for, landed
through a review that caught the right things, is a better result than a
literal request landed through a rubber stamp. The request is a direction; the
done-when is the contract.

## How it plugs into the rest

- **Iterations after the scaffold are the landed requests**, in order; the
  project's history is the roadmap's `landed` rows.
- **When GitHub exists**, each row becomes an issue (`F-2: a fuller parser`),
  the block becomes the issue body, and the status becomes a label; the file
  stays canonical.
- **The competition copies a frozen subset** as its task list: same text, same
  base commit, same gates for every arm ([`05`](05-harness-competition.md)).
- **A run's records** (`design/`, `reviews/`) refer to the request id, so a
  session can pick up any request from the file alone.

## For the toy

The seed list is in [`04-toy-app.md`](04-toy-app.md); the growth order is the
owner's.
