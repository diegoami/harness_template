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

**Milestone reviews in Claude mode.** **Owner decision (2026-09-23), the same
for all of the owner's projects: a milestone is a release**: an annotated tag
on `main`, on the exact commit the release is built from. Here that is `rN`,
and the next milestone is `r5`. A milestone is not a PR, a proposal, a count
of PRs or a process change. This was also Claude's recommendation; the
reason: a tag is a fixed point, so the review covers exactly
`<previous tag>..<candidate>` and the tag lands on the commit that was
reviewed, whatever the size or number of the PRs in between. To add to
`CLAUDE.md`:

- **between milestones** nothing changes: each change keeps its fresh-context
  Claude review and this repository's merge setting;
- **at a milestone**, Claude opens a milestone issue with the proposed tag,
  the candidate commit on `main` (full SHA), the previous tag, the PRs merged
  since, and the gate results, and gives the owner one fixed review prompt
  for a model that is not Claude, run in a fresh session;
- **the reviewer** reviews `git diff <previous tag>..<candidate>`, opens one
  issue per reproduced finding, and posts one verdict, `AGREE` or `BLOCK`, on
  the milestone issue. Every body is written to a file as UTF-8 without a
  byte-order mark and passed with `--body-file`;
- **the tag waits for the review.** On `BLOCK`, the findings are fixed in
  ordinary PRs, the candidate moves to the new `main` commit, and Claude gives
  a re-review prompt unasked, under the round ceiling. On `AGREE`, the tag
  goes on exactly the reviewed commit, and later work belongs to the next
  milestone;
- **when a verdict arrives**, Claude reproduces each finding, replies on the
  milestone issue per finding, and copies the verdict into `reviews/`.

Decided by the owner: the definition; that the tag waits for the review;
that the reviewer is any model that is not Claude; and that each
repository keeps its own per-change review and merge setting. The rest of
the bullets, including what `BLOCK` and `AGREE` do to the tag and the round
ceiling on re-reviews, is the proposal, taken from the definition the owner
shared ([`docs/sources/milestone-definition.md`](docs/sources/milestone-definition.md)).
Open for the design:

- who creates the tag after `AGREE` (default: the implementer);
- whether the owner may tag without a review, the issue recording it (the
  owner has not decided it here);
- **claims** (from Imperial Conquest 2's milestone process,
  [`docs/sources/ic2-milestone-review.md`](docs/sources/ic2-milestone-review.md)):
  numbered claims written when the release is scoped, before the work,
  each naming the check that proves it, with a "not in this milestone"
  list. The reviewer gives each claim a verdict: MET, NOT MET,
  PARTLY MET or COULD NOT TEST, and any NOT MET blocks the tag. Here the
  claims would be the backlog items chosen for the release;
- **triage four ways** (the same source): a defect; the claim was wrong
  (corrected visibly, never weakened to pass); an accepted gap, noted in
  the tag message; or not a defect, with the reason;
- reconciling the milestone verdict with Claude mode: `CLAUDE.md` and
  `reviews/README.md` have no `AGREE`/`BLOCK` marker, and the Rounds rule in
  `PRINCIPLES.md` counts rounds per stage. Scope those to per-change reviews,
  and say how milestone rounds are counted;
- whether scaffolded runs get this, and with which tag scheme.

Not proposed here, from the same source: a never-merged review PR between
`review/` and `review-base/` branches (the milestone issue and the diff
command do the same), GitHub milestone objects (the backlog holds the
scope), and a second reviewer.

The baseline here is `r4`, reviewed after the fact on
[#10](https://github.com/diegoami/harness_template/issues/10). The review on
PR #11 (`r4..756696b`, ending at no tag) was not a milestone under this rule.

**Protocol gaps found by the r4 milestone review
([#10](https://github.com/diegoami/harness_template/issues/10)) and the review
on PR #11**, routed to this design:

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
  rounds; the r4 milestone reviews use `006-r4-milestone-NN.md`, and the
  review on PR #11 `007-milestone-since-r4-01.md`, as a stopgap, where `NN`
  counts separate reviews, not rounds. Also settle whether a copied review
  and the change that records it share a number: `006` has one slug, `007`
  has two.

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
