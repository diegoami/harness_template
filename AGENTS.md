> Guidance for OpenCode. Claude Code uses [`CLAUDE.md`](CLAUDE.md); the shared
> principles and the verdict protocol are in [`PRINCIPLES.md`](PRINCIPLES.md).
> **Read it before implementing.**

# The OpenCode mode

This file adds the OpenCode-specific process and nothing else.

## Roles and the assignment

| role | who |
|---|---|
| implementer | DeepSeek — `opencode/deepseek-v4.1-flash` |
| reviewer | GPT-5.6 Luna, high effort — `opencode/gpt-5.6-luna#high` |

- The **implementer** writes the design, the code and the tests, and answers
  the review in the record, signed `— Implementer (DeepSeek V4.1 Flash)`.
- The **reviewer** is invoked as a **subagent**, in a **fresh context**, with an
  **explicit model id**, at **high reasoning effort**, from a **different model
  family than the implementer**. It verifies against the real code rather than
  trusting the description, and signs its verdict
  `— <display name> (<model id with variant>), reviewer`.
- **The invariant is the different model family; the table above is the current
  assignment, not the rule.** Whoever changes an assignment updates the table in
  the same change.
- The implementer never reviews its own change; the reviewer never shares the
  implementer's context.

## The two stages

1. **Design.** Before any implementation, write the design record
   (`design/NNN-<slug>.md`; format in [`design/README.md`](design/README.md)):
   the problem, findings grounded in the code with `file:line`, the design, and
   explicit open questions. The reviewer appends a signed verdict. Iterate —
   reply, the reviewer re-reviews — until an explicit **AGREE**. Do not
   implement before that.
2. **Implementation.** Implement the agreed design on a branch and open a pull
   request when a remote exists. The reviewer writes
   `reviews/NNN-<slug>-impl-NN.md` naming the revision it covers. Fix and
   iterate until an explicit **AGREE**. The owner merges.

This applies to every non-trivial change (`PRINCIPLES.md`). A trivial change
takes neither stage. A defect fix may skip the design stage only under the four
conditions in the protocol.

## BLOCK

- A BLOCK is not overridden by the implementer; it goes to the owner.
- Every required change must be **necessary to the change as proposed** —
  directly required for its stated aim, its correctness, or its verification —
  not merely useful, preferred, or unrelated cleanup.
- A requirement that is really a **separate concern** is filed as its own record
  and linked; the reviewer may require the split.
- If the required changes would turn the change into a different, larger one,
  the implementer may withdraw and re-scope it with the owner; the withdrawal
  and the re-scope are recorded, and any AGREE is invalidated.

## Mode-specific pointers

- **Fallback:** another reviewer from a different model family; record its model
  id and who selected it. The rest of the fallback rules are in the protocol.
- **Waiver:** implementation stage only — the protocol.
- **Records and signature:** [`reviews/README.md`](reviews/README.md). The
  verdict's *meaning* and materiality: `PRINCIPLES.md`.
- **Project rules and the gates table:** the project slot in `CLAUDE.md`.

## Bootstrap

A change to a harness file that changes what a builder must do or how the
process works takes both stages, to a signed AGREE on each. A pure typo takes
neither. **The process reviews its own amendment.**

## When a remote exists

The design record's text is posted verbatim as the issue, verdicts as comments;
the pull request links the design record. the file stays canonical, and the
comment is never an approval action (`PRINCIPLES.md`).
