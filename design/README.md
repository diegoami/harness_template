# Design records

- **Naming:** `NNN-<slug>.md`, numbered in order (`001-...`), one per change.
- **Owner:** the implementer, in OpenCode mode. Claude mode has no design stage
  and writes no design records (`CLAUDE.md`).
- **Sections:** the problem; findings grounded in the code with `file:line`; the
  design; explicit open questions, with the owner's decisions marked as such.
- **The reviewer appends a verdict section.** Its format and signature are in
  [`reviews/README.md`](../reviews/README.md); the meaning of a verdict is in
  [`PRINCIPLES.md`](../PRINCIPLES.md).
- **Earlier verdicts stay in place as history**; materiality is in
  `PRINCIPLES.md`.
- **With a remote**, the protocol's posting rule applies (`PRINCIPLES.md`).
