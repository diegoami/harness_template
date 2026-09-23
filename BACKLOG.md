# Backlog

The harness's own next items. A change to a harness file (`PRINCIPLES.md`,
`AGENTS.md`, `CLAUDE.md`, `PLAN.md`, `ROADMAP.md`, `design/`, `reviews/`,
`verification/`) or to the tool takes both stages through the bootstrap: a
design record, reviewed to AGREE, then the implementation, reviewed to AGREE.
There is no roadmap mechanism for the harness itself — this file is it.

## Release 4 candidates

From the `scaffold-e2e` run (its record is in the git history, deleted in the
descope):

1. **Guard the `--test` value.** Reject a value with an unbalanced double quote
   or an embedded newline, with a hint about shell quoting. PowerShell mangled
   the value in the run and the scaffold wrote it faithfully.
2. **A quoting note in `--help`** for the same reason.
3. **A review rule: reviews never execute a creation path.** A reviewer tried to
   exercise the GitHub step with a fake CLI, it was bypassed, and it created a
   stray public repository. State the rule in `PRINCIPLES.md`.
4. **Scratch-repository deletion** needs the token's `delete_repo` scope;
   without it, deleting a test repository falls to the owner.

## Notes

- The root `PLAN.md` and `ROADMAP.md` are the *templates* a run receives, not
  this repository's own plans.
- Earlier releases: `r1` (the consolidation), `r2` (four field-test fixes),
  `r3` (the parametrizable scaffold). Records in `design/` and `reviews/`.
