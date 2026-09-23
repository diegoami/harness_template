# Review — harness release 3, implementation round 02

**Revision reviewed:** 18be6a0
**Reviewer:** GPT-5.6 Luna (opencode/gpt-5.6-luna#high), OpenCode mode

### Findings

1. **`--owner` is not included in default question detection** — blocking. The
   interactive detector's `askedFlags` list omits `owner`
   (`tools/scaffold.mjs:322-339`), although the owner question exists at
   `tools/scaffold.mjs:414-417` and the design says every absent flag is a
   question (`design/003-parametrizable-scaffold.md:87-103`). If all other
   flags are supplied, `--owner` absent, `--github public` selected, and
   `--yes` omitted, `interactive` is false and the owner question is skipped;
   the default is silently taken from `gh login`. The piped-answer and
   all-flags runs below pass, but this absent-`--owner` path remains outside the
   contract.

2. **Successful GitHub creation reports an undefined owner** — blocking. The
   main-scope `owner` is initialized at `tools/scaffold.mjs:414`, but the remote
   block redeclares and updates a shadowing `owner` at
   `tools/scaffold.mjs:500-507`; the success message at `tools/scaffold.mjs:540`
   reads the unchanged outer value. When `--owner` is omitted and `gh api user`
   succeeds, the required reported URL is therefore
   `https://github.com/undefined/<name>` rather than the authenticated owner.

### Verified

- `node --check tools/scaffold.mjs` passed. `AGENTS.md:37-41` and
  `CLAUDE.md:28-30` now contain only the pointer-bearing merge sentence; grep
  found no clean-review, green-gates or `gh pr merge` restatement in either
  adapter. `PRINCIPLES.md:110-114` contains the full merge rule, including the
  slot and pull-request recording clauses.
- A non-TTY piped run without `--yes` consumed the supplied answers, generated
  the requested light project, exited 0 in about 0.33 seconds, and did not
  hang. A run with every value flag supplied but without `--yes` also exited 0
  without reading stdin. The generated auto slot contained the merge-conditions
  line with clean-review, green-gate and pull-request-recording text.
- With a failing fake `gh.exe` placed first on `PATH`, `--github public`
  exited 1 after the local commit and generated a README containing
  `gh repo create <owner>/public-fake --public --source . --push`; no remote was
  created in that corrected run. `--github none --ci yes` generated the
  documented `--private --source . --push # or --public` placeholder.
- Re-generated light, standard and auto from `18be6a0` with `--yes --ci yes`:
  all exited 0, had the expected source-file counts, workflows and first
  commits, and auto emitted its no-remote warning. A standard `--ci no` run
  omitted the workflow, CI slot row and README remote step. `{{PROJECT}}` was
  absent from generated output.
- `--help` now lists `--interactive`. Non-empty target, both `--ref` and
  `--tag`, invalid preset, and `--tag r2` refusals still exited 1; the invalid
  preset printed `light, standard, auto`, and the pre-r3 refusal named the r3
  requirement. All temporary directories were removed.

### Not verified

- No further successful GitHub run was made, as instructed. During a preliminary
  fake `.cmd` attempt, Windows selected the installed `gh.exe` instead and
  created `diegoami/public-project`; deletion was attempted but the token lacks
  the `delete_repo` scope, so that remote could not be removed from this
  session. The corrected fake-executable run created no remote.

— GPT-5.6 Luna (opencode/gpt-5.6-luna#high), reviewer
BLOCK
