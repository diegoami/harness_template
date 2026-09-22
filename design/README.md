# Design records

- **Naming:** `NNN-<slug>.md`, numbered in order (`001-...`), one per change.
- **Owner:** the implementer, in OpenCode mode. Claude mode has no design stage
  and writes no design records (`CLAUDE.md`).
- **Sections:** the problem; findings grounded in the code with `file:line`; the
  design; explicit open questions, with the owner's decisions marked as such.
- **The reviewer appends** a section:
  `## Review — design stage (revision N, <sha>)`, with the findings each marked
  `blocking` or `non-blocking`, the signature and, in OpenCode mode, the
  `AGREE` or `BLOCK` marker. The format and signature live in
  [`reviews/README.md`](../reviews/README.md); the meaning of a verdict,
  materiality and the re-review rules live in [`PRINCIPLES.md`](../PRINCIPLES.md).
- **Revisions.** A material edit to a record invalidates an existing verdict and
  asks for a re-review against the current revision; earlier verdicts stay in
  place as history.
- **With a remote**, the record is posted verbatim as the design issue and the
  verdicts as comments; the file stays canonical.
