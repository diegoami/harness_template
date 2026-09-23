# The scaffold-e2e run — release 3, end to end

**Status:** complete (2026-09-23). The `auto` preset ran a full change through
both stages on GitHub and auto-merged it.

**Question.** Does the parametrizable scaffold of release 3 work end to end —
generation with a GitHub remote, the honest-green start, the two stages, CI,
and the `merge: auto` policy — under the owner's assumptions (GitHub exists;
the owner auto-approves merges)?

**Method.** Run repository `scaffold-e2e`, generated with the default ref (the
newest `r*` tag, `r3`) and the `auto` preset:

```sh
node tools/scaffold.mjs --preset auto --name scaffold-e2e --dir ../scaffold-e2e \
  --description "..." --github private --merge auto --design required \
  --plan yes --roadmap yes --ci yes
```

The first change is non-trivial: the `hello` module, its test, and the
correction of the gate command the scaffold had written malformed. It ran
through the design stage, the implementation stage, and the project's
`merge: auto` policy. Records live in the run repo
(`design/001-first-change.md`, `reviews/001-first-change-impl-01.md`, PR #2).

## What happened

| step | result |
|---|---|
| generation | 8 files + README + workflow, private repo created, `main` pushed, one commit `62cd210` |
| scaffold CI on `main` | green with zero tests — the honest-green state |
| design record `2d162c6` | posted as issue #1 |
| design review | **BLOCK** — the declared gate command was malformed (`node --test " tools/**/*.test.mjs\ --ci yes` in `CLAUDE.md` and `check.yml`) |
| design revision `2eba38c` | folds in the gate fix; re-review **AGREE** |
| implementation `810b498` | `src/hello.mjs`, `tools/hello.test.mjs`, corrected gate, README; 2 tests pass; fail-before-pass reproduced |
| implementation review `9688af1` | **AGREE**; CI `check` green on the PR (5s) |
| auto-merge | the implementer merged (`gh pr merge 2 --squash --delete-branch`), squash `916a704` |
| completion note `9d6f912` | on `main`, per the release-2 rule |

## What this says

- The r3 scaffold works end to end: presets, questions, slot filling, README,
  CI, GitHub creation, the two stages, and auto-merge exactly as designed.
- The honest-green start is real and useful: the scaffold push is green with no
  tests, and the first change is what makes the gate mean something.
- **The review caught a real defect in the scaffolded project** — the malformed
  gate command. It was *not* a tool bug: the command was passed with mangled
  quoting by the setup shell (PowerShell nested quotes), and the tool wrote it
  faithfully. The design review did its job: the change could not complete
  until the gate was corrected.

## Release-4 candidates found here

1. **Guard the `--test` value**: reject a value with an unbalanced double quote
   or an embedded newline, with a hint about shell quoting; PowerShell is the
   owner's shell and this will recur.
2. **Say it in the help**: a one-line note on quoting the test command per
   shell.
3. **A review rule**: reviews never execute a creation path — a reviewer tried
   to exercise the GitHub step with a fake CLI, it was bypassed, and it created
   a stray public repository. State the rule in `PRINCIPLES.md` (or the review
   briefs) rather than relying on each brief.
4. **Delete scope, or a scratch convention**: deleting a scratch repo needs the
   token's `delete_repo` scope; the owner's token lacks it, and two stray
   repositories exist (`diegoami/fix-public`, `diegoami/public-project`).

## Reproduce

```sh
git -C C:\Users\diego\projects\scaffold-e2e log --oneline
# design/001-first-change.md · reviews/001-first-change-impl-01.md
gh pr view 2 --repo diegoami/scaffold-e2e --json title,state,mergedAt
gh run list --repo diegoami/scaffold-e2e --limit 5
```

**Review history.** The verdicts in the run repository are the data; this
record reads them out.
