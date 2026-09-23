# Backlog

The harness's own next items. A change to a harness file (`PRINCIPLES.md`,
`AGENTS.md`, `CLAUDE.md`, `PLAN.md`, `ROADMAP.md`, `design/`, `reviews/`,
`verification/`) or to the tool takes the review its mode requires through the
bootstrap (`PRINCIPLES.md`). There is no roadmap mechanism for the harness
itself — this file is it.

## Release 5 candidates

**Posting to GitHub is not optional — and it was done after the fact.** This
repository has a remote and the protocol says the same text is posted there,
but releases 1–4 opened no design issue before implementation: the design
records were posted as issues after the fact — #6–#8 once releases 1–3 had
merged, #5 just before release 4 merged — with their verdicts as comments, and
the implementation reviews were posted to PRs #1–#4 (after merge for #1–#3,
just before it for #4). The posted bodies were mis-encoded: issues #5–#8
turned `—` and `·` into `ÔÇö` and `┬À`, PR #4 lost its dashes outright, and
issue #5 and PR #4 started with a byte-order mark; the comments were intact.
All five bodies were re-posted clean on 2026-09-23 — the issues decoded back
to the design records at their first reviewed revisions, PR #4's dashes
restored by hand, and its stale "Closes nothing" line removed.

1. **Assume a remote.** Reword the protocol: a remote is assumed; the design
   record is opened as the issue before implementation; each verdict is posted
   as a comment; the implementation review is posted on the pull request;
   without a remote the files stand alone. Reconsider the scaffold's `--github`
   default in the same change.
2. **Make it mechanical.** A small `tools/post-record.mjs` — given a design
   record, create the issue and post its verdict sections; given a pull request
   and review files, post them — so the step cannot be forgotten.
3. **The PR mechanics the field prompts already had**: the pull request links
   the design issue and names the revision the AGREE was given on; `Closes #N`
   on its own line; the four-part PR body; **no merge while a review is
   running**.

**Adoption.** Rebuild [`ADOPT.md`](ADOPT.md) by mining the six bootstrap prompts
in `harness_prompts` (interview first; demonstrate once on a real change; the
handover file; the PR mechanics; dry-run outward tooling).

**Planning.** An optional planner layer: a task catalogue (id, scope, `Owns`,
done-when, dependencies) with a planner session that proposes and maintains
tasks from a goal, and the owner approving the plan — the model for a project
whose builder does not know how to build it. Geoclick's plan-per-release
(Why / tasks with DoD / Order / a progress ledger / a product-decisions table)
is the middle shape; IC2's catalogue is the heavy end.

## Smaller items

- **Guard the `--test` value.** Reject a value with an unbalanced double quote
  or an embedded newline, with a hint about shell quoting.
- **A quoting note in `--help`.**
- **A review rule: reviews never execute a creation path.** A reviewer's fake
  CLI was bypassed and created a stray public repository.
- **Scratch-repository deletion** needs the token's `delete_repo` scope.
- **`design: none` gives a design bypass two homes.** The Waiver bullet in
  `PRINCIPLES.md` records it in the design record, which `design: none`
  resolves to the implementation review file, while the `design: none` bullet
  records it in the project slot; and no file places the completion note of an
  OpenCode `design: none` run. (r4 milestone review, #10, DeepSeek finding 1.)
- **The `light` preset links a file it does not ship.** Its `AGENTS.md` stage 1
  points at `design/README.md`, which `presets/light.json` leaves out.
  (#10, DeepSeek finding 2.)
- **Restatements left after PR #9** (its round-05 review): `ROADMAP.md`'s
  `in design` status assumes a design stage; `README.md` gives OpenCode "the
  design agreed before code" unconditionally and says the modes differ only in
  how the reviewer is obtained; this file's preamble lists the harness files
  itself.

## Notes

- Adoption into an existing project is prompt-driven: [`ADOPT.md`](ADOPT.md). An
  `--into` adopt mode was considered and dropped — the project's own session
  knows the project, and a copy tool cannot reconcile the collisions.
- The root `PLAN.md` and `ROADMAP.md` are the *templates* a run receives, not
  this repository's own plans.
- **Owner decision (2026-09-23): the rules apply going forward.** A record is
  held to the rules in force when it was written, and a later rule is not
  applied to it: the reviews before r4 carry no Gate 0 target proof and are not
  backfilled. The recommended default, taken; the reason: a backfill would
  append to verdicts signed by other models a proof they never made. From the
  r4 milestone review ([#10](https://github.com/diegoami/harness_template/issues/10),
  finding 2); for finding 1 the owner chose to complete `design/001` anyway.
- Releases: `r1` (the consolidation), `r2` (field-test fixes), `r3` (the
  parametrizable scaffold), `r4` (the four lessons). Records in `design/` and
  `reviews/`.
- The r4 milestone review (#10) is copied verbatim into `reviews/`:
  `006-r4-milestone-01.md` by DeepSeek V4.1 Flash, r4's implementer — not
  independent, kept as input — and `006-r4-milestone-02.md` by GPT-5.6 Luna,
  the milestone verdict.
