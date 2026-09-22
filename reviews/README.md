# Review records

- **Naming:** `reviews/NNN-<slug>-impl-NN.md`. `NN` starts at `01` and
  increments per review round of the same implementation stage.
- The file opens with **the revision it covers** (the commit sha), the
  reviewer's display name and model id, and the mode (OpenCode or Claude).
- **Findings** are numbered, each marked `blocking` or `non-blocking`, each with
  `file:line` or a short quote as evidence. A finding is blocking only if it
  must be fixed before approval: directly required for the change's stated aim,
  its correctness, or its verification.
- **The final lines** are:

  ```
  — <display name> (<model id with variant>), reviewer
  AGREE
  ```

  in OpenCode mode — the marker line contains only `AGREE` or only `BLOCK`. In
  Claude mode, replace the marker with one line stating whether any blocking
  finding remains; there is no marker and no design stage.
- **A comment, not an approval:** the verdict is written here and posted as the
  issue or pull-request comment when a remote exists; it is never an approval
  action. The file stays canonical.
- **The meaning of the verdict** — what it covers, materiality, fallback,
  waiver — is owned by [`PRINCIPLES.md`](../PRINCIPLES.md). The revision a
  verdict covers is named in the file, and a material change after it asks for a
  new verdict.
