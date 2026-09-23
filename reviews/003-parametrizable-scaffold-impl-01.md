# Review — harness release 3, implementation round 01

**Revision reviewed:** 4408191
**Reviewer:** GPT-5.6 Luna (opencode/gpt-5.6-luna#high), OpenCode mode

### Findings

1. **Absent flags do not become setup questions** — blocking. The agreed
   contract says every flag is also a question when absent and not `--yes`
   (`design/003-parametrizable-scaffold.md:87-103`). The implementation only
   enters interactive mode when the name is absent (`tools/scaffold.mjs:300-301`),
   asks only for name, directory, preset, description, GitHub, merge and design
   (`tools/scaffold.mjs:302-345`), and silently defaults ref, plan, roadmap, test,
   CI and owner (`tools/scaffold.mjs:309-353`). Reproduction with
   `node tools/scaffold.mjs --ref 4408191 --name refused --dir <empty-dir>`
   exits 1 with `scaffold: --description is required unless --yes` instead of
   asking the setup questions.

2. **Mode adapters restate the shared merge rule** — blocking. The shared rule
   is owned by `PRINCIPLES.md:110-113`, but both adapters repeat the clean-review,
   green-gates and `gh pr merge` mechanics in `AGENTS.md:37-43` and
   `CLAUDE.md:28-32`. The agreed design requires the adapters to add only their
   mode-specific “who merges” sentence (`design/003-parametrizable-scaffold.md:54-60`),
   so this violates the stated ownership discipline and creates duplicate sources
   of the rule.

3. **Public GitHub setup is documented as private** — blocking. `--github public`
   is an accepted value (`tools/scaffold.mjs:29-36`), but `readmeText` does not
   receive that selection and hardcodes `--private` in the generated owner step
   (`tools/scaffold.mjs:215-240`). A public setup therefore gives the owner a
   command that creates the wrong visibility, contrary to the designed
   `--private|--public` remote behavior (`design/003-parametrizable-scaffold.md:147-149`).

4. **The agreed auto-merge recording clause is missing** — blocking. The design
   requires an auto project to state its merge conditions in the slot and the
   pull request to record the merge (`design/003-parametrizable-scaffold.md:48-52`).
   `PRINCIPLES.md:110-113` contains only the general condition and does not state
   either required recording rule; the generated slot contains only `merge: auto`
   and the gates row (`tools/scaffold.mjs:175-197`). The implementation therefore
   omits part of the agreed protocol needed to make the auto policy auditable.

5. **`--interactive` is absent from help** — blocking. The parser accepts the
   flag (`tools/scaffold.mjs:75-78`), and the design includes it as a supported
   command (`design/003-parametrizable-scaffold.md:82-85`), but the help text at
   `tools/scaffold.mjs:102-123` never lists it. The reproduced `--help` output
   lists the other flags and defaults but has no `--interactive` entry, so it does
   not meet the requested complete help contract.

### Verified

- `node --check tools/scaffold.mjs` passed.
- `presets/light.json`, `presets/standard.json` and `presets/auto.json` match the
  agreed file sets and policies; `scaffold.manifest.json` is absent. The source
  protocol row, merge policy, `design: none` scoping, and root
  `CLAUDE.md` slot markers are present.
- Generated all three presets from `4408191` with `--yes --ci yes`. Light emitted
  five source files plus README/workflow, standard and auto emitted eight plus
  README/workflow; slots contained `TBD`, the expected merge/design values and
  unit/CI gates; `{{PROJECT}}` was absent; README policy and OpenCode-only design
  wording were correct; and each had the expected first commit. Auto emitted the
  designed warning when no remote was selected.
- Repeated generation with `--ci no`: the workflow, CI slot row and README remote
  step were absent. `--preset light --plan yes --design required` added
  `PLAN.md` and `design/README.md` while retaining the light policy's other
  omissions.
- Reproduced refusal of a non-empty target (exit 1), simultaneous `--ref` and
  `--tag` (exit 1), invalid preset with `light, standard, auto` accepted values
  (exit 1), and `--tag r2` with the message that the parametrizable scaffold
  needs r3 or later (exit 1). The generated targets and temporary directory were
  removed.
- Claude remains the no-design-stage adapter with no design-stage marker, while
  the generated README scopes the design-record instruction to OpenCode mode.

### Not verified

- No GitHub repository was created, as instructed; the GitHub path was inspected
  statically. The end-to-end remote/CI/auto-merge run was therefore not exercised.

— GPT-5.6 Luna (opencode/gpt-5.6-luna#high), reviewer
BLOCK
