# Review — harness release 4, implementation round 01

**Revision reviewed:** 80702f8c066ebfae0be458d8dc919efd135d3dfe
**Files reviewed:** `ADOPT.md`, `CLAUDE.md`, `PRINCIPLES.md`, `design/004-release-4.md`, `design/README.md`, `reviews/README.md`, `tools/scaffold.mjs`, and `verification/README.md`; obtained from the local diff after `git merge-base main 80702f8` (`8e5dba14e39ccc66a8e10ce9a28a90c219369af7`) and `git diff --name-only 8e5dba14e39ccc66a8e10ce9a28a90c219369af7..80702f8c066ebfae0be458d8dc919efd135d3dfe`. The held `HEAD` equaled the target.
**Reviewer:** GPT-5.6 Luna (opencode/gpt-5.6-luna#high), OpenCode mode

### Findings

1. **The generated canonical-source field is incomplete** — blocking. `CLAUDE.md:45-46` and `ADOPT.md:35-37` require the canonical source to be the one place to read and edit and require mirrors, copies, or generated artifacts to be named as things that must never be edited or cited. But `tools/scaffold.mjs:204-205` generates only “the source root; name mirrors, copies or generated artifacts here as they appear,” omitting both the one-place read/edit instruction and the must-never-edit-or-cite boundary. The generated `standard` slot therefore does not implement the agreed context-budget guard consistently across the template, scaffold, and adoption instructions.

### Verified

- Gate 0 is implemented in `PRINCIPLES.md:75-83`: it specifies the PR head/file-list path, the local `git merge-base main <revision>` and `git diff --name-only <merge-base>..<revision>` proof, equality of held revision and file list with the target, and stopping on an empty or mismatched target. `reviews/README.md:6-10` requires the checked list and acquisition method, and `design/README.md:27-30` applies that format to appended design verdicts.
- The rounds rule is present in `PRINCIPLES.md:94-99`, including per-stage counting, design verdicts and `-NN` implementation files, the third non-clean round escalation, and implementation-only waiver; `reviews/README.md:3-5` records the ceiling and `design/README.md:28-30` counts appended design verdicts.
- Discipline 3 was extended in place at `PRINCIPLES.md:58-61`; the six-discipline ownership/count references remain six at `PRINCIPLES.md:14,53` and `verification/README.md:4`. `verification/README.md:34-36` adds the fresh-copy/rebuild re-take without contradicting the mutation wording or the completion-note boundary in `PRINCIPLES.md:119-125`.
- The slot fields and per-path ignore-reason wording are present in `CLAUDE.md:44-49` and `ADOPT.md:35-40`, including “Ignoring a path never means deleting or gitignoring it.” I ran `node --check tools/scaffold.mjs` successfully. I generated `standard` from `80702f8` with `--yes --ci no` into a temporary directory, read its slot, and removed the directory; generation reported `8 files from 80702f8 ... preset standard ... ci no`.
- The ownership map assigns target proof and rounds to the protocol in `PRINCIPLES.md:14-15`; the implementation adds no competing owner or restatement. The implementation commit itself changes only the seven files required by the design; the eight-file local branch diff also includes the agreed design record.

### Not verified

- Pull-request head/file-list evidence was not used; this review used the required local merge-base proof.

— GPT-5.6 Luna (opencode/gpt-5.6-luna#high), reviewer
BLOCK
