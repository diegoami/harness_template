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

**Milestone reviews in Claude mode.** On 2026-09-23 five Claude-mode projects
(Scopetta, Tressette, balloons-JS, Geoclick2027, discola-web) adopted an
independent review at milestones, which blocks nothing. Their per-change
review differs: only Scopetta keeps one, and it ends in a marker and lets
Claude merge. The proposal keeps this harness's per-change review as it is in
`CLAUDE.md`, and adds the milestone half, drawing on each project:

- **at a milestone**, Claude opens an issue requesting a review by any model
  that is not Claude (the owner's rule), holding the prompt and the commit
  range (Scopetta, Tressette, balloons-JS; Geoclick and discola-web use the
  milestone's existing thread instead). The design picks where a range
  starts: at the last reviewed end (Scopetta, balloons-JS), or at the previous
  issue's head, run or not, so ranges never overlap (Tressette). Only one
  review issue is open at a time (Scopetta, balloons-JS);
- **the prompt is a fixed template** the author only fills in, so the author
  does not steer what the reviewer looks for (balloons-JS);
- **the reviewer posts** from a file written as UTF-8 without a byte-order
  mark, passed with `--body-file` (Geoclick). The design picks between one
  comment (Tressette, balloons-JS) and one issue per finding (Scopetta,
  Geoclick, discola-web);
- **when it arrives**, Claude reproduces each finding and replies on the
  thread per finding (Tressette, Geoclick, discola-web), and copies it into
  `reviews/` (this repository's own practice).

Open for the design: what a milestone is — here, perhaps a release tag — and
whether scaffolded runs get it. Run by hand twice so far, ad hoc: #10 on `r4`,
and on PR #11 for `r4..756696b`, which ends at no tag.

**Protocol gaps found by the milestone reviews**
([#10](https://github.com/diegoami/harness_template/issues/10) and PR #11),
routed to this design:

- **`design: none` gives a design bypass two homes.** The Waiver bullet in
  `PRINCIPLES.md` records it in the design record, which `design: none`
  resolves to the implementation review file, while the `design: none` bullet
  records it in the project slot; and no file places the completion note of an
  OpenCode `design: none` run. (#10, DeepSeek finding 1.)
- **The `light` preset links a file it does not ship.** Its `AGENTS.md` stage 1
  points at `design/README.md`, and the ownership map in `PRINCIPLES.md` names
  it as an owner, but `presets/light.json` leaves it out. (#10, DeepSeek
  finding 2.)
- **State whether rules apply to earlier records.** `PRINCIPLES.md` is silent,
  which is why the two milestone reviews disagreed on Gate 0 for pre-r4
  records; the owner decision in the Notes settles it for this repository only.
- **Rounds after a clean round.** The Rounds rule sends a third round that does
  not end clean to the owner, but does not say whether a material extension
  after a clean round restarts the count or adds to it. PR #9 went on to
  rounds 04 and 05 after a clean round 03 without saying which. (The
  independent review on PR #11.)

## Smaller items

- **Guard the `--test` value.** Reject a value with an unbalanced double quote
  or an embedded newline, with a hint about shell quoting.
- **A quoting note in `--help`.**
- **A review rule: reviews never execute a creation path.** A reviewer's fake
  CLI was bypassed and created a stray public repository.
- **Scratch-repository deletion** needs the token's `delete_repo` scope.
- **Restatements left after PR #9** (its round-05 review): `ROADMAP.md`'s
  `in design` status assumes a design stage; `README.md` gives OpenCode "the
  design agreed before code" unconditionally and says the modes differ only in
  how the reviewer is obtained; this file's preamble lists the harness files
  itself, and omits the bootstrap rule's trigger and its typo exception.
- **Name milestone reviews.** `reviews/README.md` names only implementation
  rounds; the milestone reviews use `006-r4-milestone-NN.md` and
  `007-milestone-since-r4-01.md` as a stopgap, where `NN` counts separate
  reviews, not rounds. Also settle whether a milestone copy and the change
  that records it share a number: `006` has one slug, `007` has two.

## Notes

- Adoption into an existing project is prompt-driven: [`ADOPT.md`](ADOPT.md). An
  `--into` adopt mode was considered and dropped — the project's own session
  knows the project, and a copy tool cannot reconcile the collisions.
- The root `PLAN.md` and `ROADMAP.md` are the *templates* a run receives, not
  this repository's own plans.
- **Owner decision (2026-09-23): the rules apply going forward.** A record is
  held to the rules in force when it was written, and a later rule is not
  applied to it: the verdicts written before Gate 0 landed (`80702f8`) — the
  implementation reviews of releases 1–3 and the design verdicts of 001–004 —
  carry no target proof and are not backfilled. The recommended default,
  taken; the reason: a backfill would append to verdicts signed by other
  models a proof they never made. From the r4 milestone review
  ([#10](https://github.com/diegoami/harness_template/issues/10), finding 2).
- **Owner decision (2026-09-23): `design/001` is completed, the one exception
  to the decision above.** Its status is corrected to `landed` and a
  completion note appended, although both rules arrived with r2, and both are
  written by Claude although `design/README.md` gives the status and the note
  to the record's implementer. The recommended default, taken; the reason:
  its status line pointed at review round 01 although round 02 existed when
  r1 was tagged — stale, not a broken rule, since release 1 had no status
  rule — and correcting it leaves every landed release findable by status.
  The original line is kept, and the additions are signed as not the
  implementer's. From #10, finding 1.
- Releases: `r1` (the consolidation), `r2` (field-test fixes), `r3` (the
  parametrizable scaffold), `r4` (the four lessons). Records in `design/` and
  `reviews/`.
- The r4 milestone review (#10) is copied verbatim into `reviews/`:
  `006-r4-milestone-01.md` by DeepSeek V4.1 Flash, r4's implementer — not
  independent, kept as input — and `006-r4-milestone-02.md` by GPT-5.6 Luna,
  the milestone verdict.
- The independent review of the work since r4 (`r4..756696b`, on PR #11) is
  copied verbatim into `reviews/007-milestone-since-r4-01.md`: DeepSeek V4.1
  Flash, `AGREE`.
