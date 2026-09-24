# Milestone r5 review — round 1

## Where I reviewed

- **Commit:** `f22685d884c08381c5c4d6dcc3786aa394467c00` in a detached worktree; `git rev-parse HEAD` returned that exact SHA.
- **Target proof:** after `git fetch --tags origin`, `git merge-base --is-ancestor f22685d884c08381c5c4d6dcc3786aa394467c00 origin/main` exited 0 and `git cat-file -t r4` printed `tag`.
- **Files:** the 75-path review list came from `git diff --name-only r4..HEAD`; it was non-empty. I reviewed that range and followed the changed files into the rules, templates, tests, PRs and milestone issue they rely on.
- **Reviewer:** Codex.
- **Model:** `gpt-5` (Codex desktop variant), an OpenAI model. `git log r4..f22685d884c08381c5c4d6dcc3786aa394467c00` names Diego Amicabile as author and Claude Opus 5.5 in the `Co-Authored-By` trailers; no OpenAI model implemented the range.
- **Tool:** Codex desktop.
- **Mode:** milestone review.

## Verdict table

| Claim | Verdict | Evidence |
|---|---|---|
| C1. Records are posted when written | MET | `PRINCIPLES.md:195-207` states the remote/no-remote and posting-timing rules. `git log --first-parent 427749c1764ef634db11a4392e5560a02800dea0..f22685d884c08381c5c4d6dcc3786aa394467c00` contained 26 commits: 13 r5 PR merges and 13 completion-note commits, with no other first-parent commit. For PRs #15–#27, each PR added 1–4 implementation-review files; every one matched exactly one PR comment after normalization of line endings and final newlines (27/27), and each matching comment was dated before the next commit and before merge. |
| C2. Posting is mechanical and intact | MET | `node --check` passed on all four `tools/*.mjs` files. `node tools/post-record.mjs review reviews/010-post-record-impl-01.md --pr 15` printed a `gh pr comment 15 --body-file ...` command and said nothing was posted. `node --test tools/*.test.mjs` passed all 43 tests, including byte identity, BOM refusal, all four posting kinds against fakes, read-back mismatch detection, posting from a subdirectory, the named break cases, and the real-git directory-link PR check. Independent GitHub comparison found all 27 r5 review comments equal to their files at each PR head. In a throwaway copy, removing `realpathSync.native` from `checkPrHolds` made the linked-checkout test fail with `../real/reviews/r.md is not one of PR #15's files`. |
| C3. PR mechanics are written and followed | MET | `PRINCIPLES.md:209-220` states the reviewed-revision, four-part body, standalone `Closes #N`/`closingIssuesReferences`, and no-merge-while-reviewing rules. PRs #15–#27 each name the clean reviewed revision and contain `What was built`, `Done when`, `Check output`, and `Left out`; no done-when checkbox was unticked. None used a closing line and all had zero `closingIssuesReferences`, so there is no mismatched closer. Each merged after its final review comment. |
| C4. A milestone is a tag and waits for independent review | MET | `PRINCIPLES.md:226-280` defines the annotated tag, candidate, issue fields, independent reviewer, verdict, tagger, owner override, triage, and completion record. Issue #28 contains the proposed tag `r5`, full candidate SHA, previous annotated tag `r4`, plan and claims-fix commit, PRs since `r4`, and gate results. No `r5` tag existed during review, as required before this verdict. The post-tag `cat-file`, `rev-parse` and completion-note checks are correctly deferred until after `AGREE`. |
| C5. Claims come before the work | MET | `PRINCIPLES.md:231-256` requires pre-work numbered claims/proofs, the not-in-release list, four claim verdicts, AGREE/BLOCK mapping, finding grading, and four-way triage. `427749c1764ef634db11a4392e5560a02800dea0` is the two-parent merge of PR #14 and fixes the original r5 claims. I audited `git log -p 427749c1764ef634db11a4392e5560a02800dea0..HEAD -- BACKLOG.md`: later claim changes are visible and dated with their reason in the same commit; C8 and C11 identify their “claim was wrong” corrections, while the C2, C8, C10 and C5-to-C12 extensions are identified as extensions. C12 was added as a dated scope change in PR #24 before its implementation in PR #27. The supplied prompt’s promise, C1–C12 and not-in-release list match `BACKLOG.md:34-239`. |
| C6. Milestone verdicts fit Claude mode | MET | `CLAUDE.md:20-24` limits the no-marker rule to a change review and says milestone verdicts carry a marker. `reviews/README.md:24-30` says the same and requires a milestone marker in both modes. `PRINCIPLES.md:96-116` counts milestone rounds per milestone and sends a third non-AGREE verdict to the owner. |
| C7. Four protocol gaps are closed | MET | `PRINCIPLES.md:163-176` gives `design: none` a single home for the bypass amendment and completion note, and makes rules apply going forward; `PRINCIPLES.md:96-116` defines continued round counting after a clean round. A generated `light` preset had zero dangling relative links. |
| C8. Every preset generates cleanly | MET | I ran `node tools/scaffold.mjs --yes --name gate-<p> --dir <temp> --preset <p> --ref f22685d884c08381c5c4d6dcc3786aa394467c00` without `--github` for `light`, `standard` and `auto`; all exited 0. Across all three generated trees, the dangling-relative-link scan returned 0; every `{{...}}` occurrence was in `reviews/milestone-prompt.md` and belonged to its documented placeholder set; each tree contained the milestone rule and prompt, and both `PRINCIPLES.md` and `reviews/README.md` contained `vX.Y.Z`. The auto preset’s slot/README name posted reviews. Syntax checks passed for all four `tools/*.mjs`. |
| C9. Scaffold input is guarded | MET | `--help` printed the quoting note. An unbalanced double-quote value and an embedded-newline value both exited 1 with a shell-quoting hint and created no target directory. The corresponding tests passed. In a committed mutation in a throwaway repository, disabling the newline branch made `--test with an embedded newline is refused before anything is written` fail because the scaffold accepted it. |
| C10. Smaller rules landed | MET | `PRINCIPLES.md:182-193` forbids reviewers from exercising creating paths except their own review output and constrains builders to fakes, throwaway local repositories or dry runs. `reviews/README.md:3-9` names milestone reviews. `ROADMAP.md:15-17` makes `in design` conditional; `README.md:12-21` makes OpenCode’s design stage conditional and distinguishes the modes by design stage, reviewer and marker; `BACKLOG.md:1-5` no longer enumerates harness files in its preamble. |
| C11. Milestone loop is complete and independent | MET | `PRINCIPLES.md:239-280` and `reviews/milestone-prompt.md:1-130` cover the fixed fill-only prompt, target proof, range, claims/table, exclusions, limits, one issue per finding, `--body-file`, automatic re-review prompt after BLOCK, per-finding reproduction/reply/triage, independent family, post-tag verdict copies and completion note. The supplied r5 prompt follows the fixed template with its documented placeholders filled; its excluded family, candidate, range, claims and lists match the repository and issue #28. |
| C12. Conversation decisions leave checkable evidence | MET | `PRINCIPLES.md:121-146` names owner-merge and signed-comment evidence, handles the shared account, covers PR/design/milestone records and no-remote evidence, and tells reviewers to check rather than re-raise it; `PRINCIPLES.md:170-174` applies rules prospectively. The first decisions held to the rule are recorded in `BACKLOG.md:597-608`; PR #27 was merged by GitHub user `diegoami` (Diego Amicabile) at `2026-09-24T17:11:16Z`, providing the evidence the record names. |

## Findings

None. I reproduced no defect, so I opened no finding issue.

## Not checked

- I did not create or inspect an `r5` tag or its completion note because the tag must wait for this verdict; those checks become applicable only after tagging.
- I did not exercise `--github`, `post-record.mjs --confirm`, or any other creating path merely as a test. That is forbidden by the review limits and `PRINCIPLES.md`; I instead tested dry-run/fake paths and audited the real existing GitHub records read-only.
- I did not independently rerun GitGuardian because it is an external service result, not a repository-local gate. This does not leave a claim partly tested: none of C1–C12 depends on GitGuardian.

— Codex (gpt-5, Codex desktop), reviewer
AGREE

## Completion

The verdict above is copied verbatim from its comment on the milestone issue
(https://github.com/diegoami/harness_template/issues/28#issuecomment-5819149935),
posted on 2026-09-24 at 17:43:20 UTC. The copy was checked with `cmp`
against `gh api …/issues/comments/5819149935 --jq .body`. It is round 1, the
only verdict on the milestone.

The implementer created the tag on 2026-09-24, on the commit the `AGREE`
names (D3):

```
$ git cat-file -t r5
tag
$ git rev-parse 'r5^{commit}'
f22685d884c08381c5c4d6dcc3786aa394467c00
$ git ls-remote origin refs/tags/r5 'refs/tags/r5^{}'
a16d97083c0f7449cec85a08be009e7082203700	refs/tags/r5
f22685d884c08381c5c4d6dcc3786aa394467c00	refs/tags/r5^{}
```

The tag message names the milestone issue, the reviewer and its model id
(Codex, `gpt-5`, Codex desktop), and no accepted gap. The verdict raised no
finding, so no finding was triaged and the milestone issue needs no reply
per finding. Work merged after `f22685d` belongs to the next milestone.

— Implementer (Claude Opus 5.5)
