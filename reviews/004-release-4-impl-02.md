# Review — harness release 4, implementation round 02

**Revision reviewed:** 8cbcea5
**Files reviewed:** `ADOPT.md`, `CLAUDE.md`, `PRINCIPLES.md`, `design/004-release-4.md`, `design/README.md`, `reviews/004-release-4-impl-01.md`, `reviews/README.md`, `tools/scaffold.mjs`, and `verification/README.md`; obtained from the local diff after `git merge-base main 8cbcea5` (`8e5dba14e39ccc66a8e10ce9a28a90c219369af7`) and `git diff --name-only 8e5dba14e39ccc66a8e10ce9a28a90c219369af7..8cbcea51651993175b9991495df705df07d81341`. The held `HEAD` equaled the target.
**Reviewer:** GPT-5.6 Luna (opencode/gpt-5.6-luna#high), OpenCode mode

### Findings

None.

### Verified

- The round-01 blocker is resolved: `tools/scaffold.mjs:204-205` now exactly carries the one-place read/edit instruction and says mirrors, copies, or generated artifacts must never be edited or cited. This matches `CLAUDE.md:45-46` and the corresponding canonical-source instruction in `ADOPT.md:35-37`.
- I ran `node --check tools/scaffold.mjs` successfully. I generated `standard` from `8cbcea5` with `--yes --ci no` into a temporary directory, read the generated slot, and removed the directory. The output contained the corrected canonical-source text and the preserved reason-bearing ignore text, including “Ignoring a path never means deleting or gitignoring it”; generation reported `8 files from 8cbcea5 ... preset standard ... ci no`.
- The target proof showed `target=8cbcea51651993175b9991495df705df07d81341`, `held=8cbcea51651993175b9991495df705df07d81341`, and the non-empty nine-file list in the header. `git diff --check main...8cbcea5` passed.
- No regression or new contradiction was found in the surrounding implementation: the target diff after `80702f8` contains only the historical round-01 review record and the focused `tools/scaffold.mjs` correction. The Gate 0 and rounds rules, six-discipline count, negative-result re-take, completion-note boundary, ownership map, and design/review record formats remain consistent at `PRINCIPLES.md:14-15,53-61,75-107,119-125`, `reviews/README.md:3-10`, `design/README.md:27-30`, and `verification/README.md:27-36`.

### Not verified

- Pull-request head/file-list evidence was not used; this review used the required local merge-base proof.

— GPT-5.6 Luna (opencode/gpt-5.6-luna#high), reviewer
AGREE
