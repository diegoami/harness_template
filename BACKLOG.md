# Backlog

The harness's own next items. Which changes take which review is the
bootstrap's and the non-trivial test's to say (`PRINCIPLES.md`). There is no
roadmap mechanism for the harness itself — this file is it.

## Release 6: scope and claims

**Status:** proposed on 2026-09-25. The owner decisions below were given in
conversation on 2026-09-24: each is the recommended default, taken, except
D4 and D10, where none was offered and the owner chose. Under *Owner decisions* (`PRINCIPLES.md`), their evidence is the
owner's merge of the pull request that lands this section. The claims are
fixed when it lands.

**The promise.** After r6, Claude mode runs without the owner opening
sessions: the main session orchestrates a forked implementer and a fresh
reviewer. A project adopts the harness by being asked, not guessed at:
adoption asks the owner the roles and the premise before it writes a file,
takes a tag knowing what `main` holds beyond it, and ends with one real
change through the loop. As in r5, a release is tagged only after a model
independent of its implementer has checked it against claims written before
the work, unless the owner overrides that on the record.

**Where r6 starts.** The milestone range is `r5..<candidate>`, and the
milestone reviewer reviews all of it. It opens with PR #29 (`README.md`
names `r5`) and the change that lands this section. The claims about how
work is done (C12) hold only for the **r6 PRs**: those opened after that
change has merged. After that merge, every first-parent commit on `main` is
an r6 PR's merge, a completion-note commit that changes only a
`## Completion` section, or a trivial change as `PRINCIPLES.md` defines it.

**In r6:** the orchestrated Claude mode (pgn-postmortem, second version,
items 8 and 6); the `ADOPT.md` rebuild, mined from the six bootstrap prompts
in `harness_prompts`, with boar_life items 1, 2 and 5 and pgn-postmortem
items 1, 2, 3 and 5; the verification pattern from the boar_life report
(item 6); and a dry run for the scaffold's `--github`.

**Release step:** before the candidate is frozen, `ADOPT.md` names `r6`.

**Not in r6:**
- the planner layer, a release of its own (r5's D1);
- moving the conservative floor's path list into the slot (boar_life item
  3), and making `ROADMAP.md`'s "a comparison run copies a frozen subset"
  conditional (boar_life item 4): the owner declined both for r6 (D10);
- a handover file (D9);
- pinning an exact commit in `ADOPT.md` (D6);
- the `post-record.mjs` follow-ups from PR #18: pinning the call sites of
  `shellQuote` and `repoPath`, the junction test's live `tools/` link, and
  two stale comments (D4);
- scratch-repository deletion, which is a token scope, not a harness change;
- from Imperial Conquest 2: the never-merged review PR, the `review/` and
  `review-base/` branches, GitHub milestone objects, and a second reviewer;
- from the bootstrap prompts: a design stage on every change, a
  cross-family reviewer on every change, agents merging, milestones as
  phases, and verdicts kept only as comments. Each contradicts a current
  rule of `PRINCIPLES.md`, so the rebuild does not take it.

**Owner decisions** (🧑 each with its recommended default and the owner's
answer):

| # | decision | default | reason | owner |
|---|---|---|---|---|
| D1 | r6's scope | both themes, the orchestrated Claude mode and the `ADOPT.md` rebuild, with the verification pattern | the orchestrated mode changes who opens sessions, and adoption is where a project learns it | accepted |
| D2 | the orchestrated shape in `CLAUDE.md` | the default way Claude mode works; one session is the fallback where subagents are unavailable, recorded | it is how the owner's projects already work (pgn-postmortem PR #6, this repository's r5 reviews) | accepted |
| D3 | does adoption end with a real change | yes: the first real change after the adoption PR goes through the loop, and the adoption report names it | "the documents are downstream of the practice" (the Scopetta prompt); boar_life and pgn-postmortem did it unasked | accepted |
| D4 | smaller items not yet routed | none offered: the owner chose between the scaffold's `--github` dry run and the `post-record.mjs` follow-ups | without a dry run nobody may test `--github` (*Creation paths*); the follow-ups are polish | the dry run joins r6; the follow-ups do not |
| D5 | `design:` in Claude mode | OpenCode-only: `CLAUDE.md`'s slot drops it, the scaffold asks it only for OpenCode, and `CLAUDE.md` names shaping plus its review as Claude mode's planning gate | in a Claude-mode slot it does nothing yet reads like that gate (pgn-postmortem item 2) | accepted |
| D6 | what an adopter takes | the tag, plus a check of `main`: record the tag's commit, list what `main` holds beyond it, and ask the owner whether the project needs any of it now | both adoptions needed fixes that lived only on `main`; a pinned commit goes stale at every release | accepted |
| D7 | where the roles are asked | in `ADOPT.md` and in the scaffold: who implements, who reviews each change, who reviews releases, recorded in the slot before a mode is chosen | the mode follows the roles, not one wanted feature (pgn-postmortem item 1) | accepted |
| D8 | the testbed premise | a `premise:` slot field, `testbed` or `product`, asked at adoption and in the scaffold; `ROADMAP.md`'s "the project exists to exercise the process" holds only under `testbed` | a product's content is the deliverable (boar_life item 1) | accepted |
| D9 | a handover file | none: the repository's records are the handover, and the Sessions handoff becomes the forked session's brief | the orchestrated mode never needs a session cleared | accepted |
| D10 | the reports' smaller suggestions | none offered: the owner chose which of four to take | each removes a mismatch an adopter met | two taken: paths outside the repository described relative to it (boar_life item 5), and planning is not building (pgn-postmortem item 5); the floor's path list and the comparison-run line declined |
| D11 | the Sessions habit | `PRINCIPLES.md` names a forked subagent as the default way to start a fresh session, in both modes; `CLAUDE.md` names the full shape | OpenCode has subagents too, and the habit is shared | accepted |

**Claims** (each with how it is proved; the milestone reviewer tests every
one itself, at the candidate commit):

- **C1. Claude mode is orchestrated.** `CLAUDE.md` names the shape (D2): the
  main session talks to the owner, asks the owner decisions, commits and
  posts the review files, asks for the merge and writes the completion
  notes; the implementer is a forked subagent in its own git worktree,
  briefed from what the repository records; the reviewer is a separate
  fresh subagent in its own worktree, which writes its review file and
  neither commits nor posts it; a re-review resumes the same reviewer; and
  one session is the fallback where subagents are unavailable, recorded in
  the review. Every forked brief begins with a repository identity check.
  *Proof:* the text, quoted by `file:line`.
- **C2. The owner does not open sessions.** `PLAN.md`'s *The owner's part*
  is the go-ahead, the owner decisions, the merge and playing the result,
  not starting sessions; the Sessions habit in `PRINCIPLES.md` names a
  forked subagent as the default way to start a fresh session, in both
  modes, with the handoff as its brief (D11); and a prompt for the owner to
  paste is only for work in another repository or by another model, such as
  a milestone review. *Proof:* the text.
- **C3. Adoption asks before it writes.** `ADOPT.md` states its steps as a
  numbered sequence. Before it writes any file, it asks the owner, as owner
  decisions with recommended defaults: the three roles (D7), the premise
  (D8), `merge:`, and `design:` where the mode is OpenCode. It records the
  answers in the slot, and the mode follows the roles. *Proof:* the text;
  in `ADOPT.md`, the questions come before the first step that writes a
  file.
- **C4. Adoption takes a tag and checks `main`.** `ADOPT.md` names the
  release tag. The adopter records the tag's commit, lists what the
  harness's `main` holds beyond the tag, asks the owner whether the project
  needs any of it now, and records what it took in the provenance (D6).
  *Proof:* the text; at the candidate, `ADOPT.md` names `r6`.
- **C5. Adoption ends with a real change, and a report.** `ADOPT.md`'s
  done-when includes the first real change after the adoption PR, taken
  through the loop: reviewed, posted and merged as the slot says (D3). The
  adoption PR itself changes no product code. Adoption ends with a report
  to the owner: what was built, every collision, the real change, and what
  was left undecided. *Proof:* the text.
- **C6. The slot fits a product.** Both adapters' slots carry `premise:`
  (D8) and the three roles (D7); `ROADMAP.md`'s testbed sentences say they
  hold only under `premise: testbed`; `CLAUDE.md`'s slot has no `design:`
  line, and `CLAUDE.md` names shaping plus its fresh-context review as
  Claude mode's planning gate (D5); and the never-echo item says a path
  outside the repository is described relative to it (D10). *Proof:* the
  text.
- **C7. The scaffold asks the roles and the premise.** `tools/scaffold.mjs`
  asks the three roles and the premise, as flags and interactively, and
  writes them into the slot; it asks `design` only for OpenCode; and a
  generated run's `.gitignore` lists `.claude/worktrees/`. *Proof:*
  `node --test tools/scaffold.test.mjs` covers each; a run generated with
  `--ref <candidate>` shows them.
- **C8. `--github` has a dry run.** The scaffold's `--github` has a dry run
  that prints the `gh repo create` and push commands it would run, and
  creates nothing (D4). *Proof:* a test runs it against a fake `gh` that
  records every call, and no creating call is made; `--help` names it.
- **C9. Every preset generates cleanly from the candidate.** `light`,
  `standard` and `auto`, each generated with `--ref <candidate>` into a
  temporary directory and without `--github`, exit 0, leave no `{{…}}`
  other than the placeholders `reviews/milestone-prompt.md` documents, and
  leave no dangling relative link. `node --check` passes on every
  `tools/*.mjs`. *Proof:* the commands.
- **C10. The verification pattern lands.** `verification/README.md` says a
  gate on a tool that exits 0 on failure reads the tool's log, not its exit
  code, and that a check which runs only what a scene loads misses what no
  scene loads, with boar_life's Godot gate as the example. *Proof:* the
  text.
- **C11. Planning is not building.** A habit in `PRINCIPLES.md` says that a
  design discussion is not a request to build, and that building starts
  only on the owner's go (D10). *Proof:* the text.
- **C12. Every r6 PR follows the loop.** r5's rules hold for every r6 PR:
  each review file is posted on the PR before the next commit and the
  merge, one comment equal to the file; the body names the reviewed
  revision and has the four parts; and every owner decision recorded in an
  r6 PR has its evidence where *Owner decisions* says. *Proof:*
  `git log --first-parent <landing merge>..<candidate>` shows only r6 PR
  merges, completion-note commits and trivial changes; for every r6 PR,
  `gh pr view N --json body,comments,commits,mergedAt` shows the rest.

## Release 5: scope and claims

**Status:** decided on 2026-09-23: the owner accepted the scope and every
decision below as proposed, recorded in the "owner" column. This section
landed with PR #14 (`427749c`), after four review rounds: its third did not
end clean, and the owner decided to fix the findings and run a fourth.

**Progress (2026-09-24):** C1–C11 have landed, each through its pull request
and the completion note in its last review file: C2 (PR #15, and its two
extensions by #18 and #20), C1 and C3 (#17), C4, C5, C6 and C11 (#19), C7
(#21), C8 and C9 (#22), and C10 (#23). C12 was added by PR #24. PR #27
takes what remained before the candidate is frozen:
- C12's rule in `PRINCIPLES.md` (*Owner decisions*);
- the release step below;
- the owner's answers to two questions that earlier pull requests left open
  (Notes): C5's proof extends to C12 (PR #24's *Left out*), and without a
  remote a stop notice is a line in the change's next review file (PR #21,
  round 02, finding 4, listed "to settle before the r5 milestone").

When PR #27 has landed, the milestone review follows `PRINCIPLES.md`
(*Milestones*), with the prompt filled in from `reviews/milestone-prompt.md`.

**Tagged (2026-09-24):** `r5` is on `f22685d`, after round 1's `AGREE` on
milestone issue #28 by Codex (`gpt-5`, Codex desktop): every claim MET and
no finding. The verdict and its completion note are in
`reviews/r5-milestone-01.md`.

The claims are written before the work, as
[Imperial Conquest 2's process](docs/sources/ic2-milestone-review.md) does. A
claim changes only here, visibly, dated and with its reason in the same
commit, and is never weakened to pass (`PRINCIPLES.md`, *Milestones*).

**The promise.** After r5, the review loop happens on GitHub as it happens:
every record the implementer posts is posted when it is written, by a tool
that cannot mangle it, and a release is tagged only after a model
independent of its implementer has checked it against claims written before
the work, unless the owner overrides that on the record (D4).

**Where r5 starts.** The milestone range is `r4..<candidate>`, and the
milestone reviewer reviews all of it. It opens with PRs #9 and #11–#14, the
cleanup after r4 and this scope. They are reviewed as diffs, but the claims
about how work is done (C1, C3) hold only for the **r5 PRs**: those opened
after the PR that lands this section has merged. After that merge, every
first-parent commit on `main` is an r5 PR's merge, a completion-note commit
that changes only a `## Completion` section, or a trivial change as
`PRINCIPLES.md` defines it.

**In r5:** posting (candidates 1–3 below), milestone reviews, the four
protocol gaps, and the smaller items except scratch-repository deletion, the
verification pattern from the boar_life report, the `post-record.mjs`
follow-ups from PR #18 other than the linked-checkout defect, and the dry
run for the scaffold's `--github`; and, from the pgn-postmortem report,
item 4 (C12).

**Release step:** before the candidate is frozen, `ADOPT.md` names `r5`,
so the tag does not repeat `r4`'s stale release name (boar_life report,
item 2; the owner decided that pinning an exact commit waits for r6).

**Not in r5:**
- rebuilding `ADOPT.md` from `harness_prompts`: a candidate for r6;
- the planner layer;
- scratch-repository deletion, which is a token scope, not a harness change;
- from Imperial Conquest 2: the never-merged review PR, the `review/` and
  `review-base/` branches, GitHub milestone objects, and a second reviewer;
- the verification pattern from the boar_life report (r6);
- the `post-record.mjs` follow-ups from PR #18 other than the linked-checkout
  defect: pinning the call sites of `shellQuote` and `repoPath`, the
  junction test's live `tools/` link, and two stale comments;
- a dry run for the scaffold's `--github` (PR #23);
- the pgn-postmortem report's items 1, 2, 3 and 5 (r6, PR #24: items 2 and
  5 by the owner's decision, items 1 and 3 by the implementer's routing;
  Notes), and its second version's items 6 and 8 (r6, the owner's decision,
  PR #25).

**Owner decisions** (🧑 each with its recommended default and the owner's
answer):

| # | decision | default | reason | owner |
|---|---|---|---|---|
| D1 | the scope above | take it | one theme, the review loop on GitHub; adoption and planning are each a release of their own | accepted |
| D2 | where the milestone rule lives, and who reviews | `PRINCIPLES.md`, for both modes; the reviewer is of a family that implemented none of the range, which for a Claude-mode range means any model that is not Claude | the owner's definition holds for all projects | accepted |
| D3 | who creates the tag after `AGREE` | the implementer | the verdict names the SHA, so the tag is mechanical | accepted |
| D4 | may the owner tag without a review | yes, as an owner override recorded on the milestone issue, never the implementer's call | the tag waits for the review, and only the owner may skip it; "waiver" stays the implementation-stage term | accepted |
| D5 | do scaffolded runs get milestone reviews | yes, tagged `vX.Y.Z`; the harness keeps `rN` | the owner's rule is the same for all projects | accepted |
| D6 | rounds after a clean round | rounds count on through a stage, and any round from the third that does not end clean goes to the owner | what PRs #9 and #12 did, now stated | accepted |
| D7 | `design: none` homes | the bypass amendment goes in the project slot; the completion note in the last implementation review file | one home each; the second is Claude mode's rule | accepted |
| D8 | the scaffold's `--github` default | stays `none` | a default must not create a repository | accepted |
| D9 | milestone review file names | `reviews/<tag>-milestone-NN.md`, `NN` counting the verdicts on that milestone in order | fits `rN` and `vX.Y.Z`; one number per verdict | accepted |
| D10 | milestone rounds | each verdict on the milestone issue is one round; a third that is not `AGREE` goes to the owner | the same ceiling as a stage, counted per milestone | accepted |
| D11 | "rules apply going forward" for every project | yes, stated in `PRINCIPLES.md` | this repository's decision in Notes, made general | accepted |

**Claims** (each with how it is proved; the milestone reviewer tests every
one itself, at the candidate commit):

- **C1. Records are posted when they are written.** `PRINCIPLES.md` assumes a
  remote: in OpenCode mode the design record opens as an issue before
  implementation and each verdict is posted as it is written; in both modes
  each implementation review is posted on the PR before the next round; with
  no remote, the files stand alone. *Proof:* the text;
  `git log --first-parent <landing merge>..<candidate>` shows only r5 PR
  merges, completion-note commits and trivial changes; every r5 PR adds at
  least one review
  file, and each has exactly one PR comment equal to the file as the PR's
  head holds it, dated before the next commit and before the merge
  (`gh pr view N --json comments,commits,mergedAt`).
- **C2. Posting is mechanical and keeps the text intact.**
  `tools/post-record.mjs` posts a review file on a PR, a design record as an
  issue with its verdicts, a milestone issue, and a reply on an issue,
  through `--body-file`. It
  is a dry run unless given `--confirm`. *Proof:* `node --check`; a dry run
  prints the `gh` command and posts nothing; the body file it writes is
  byte-identical to the source (`cmp`), with no byte-order mark; every
  record an r5 PR posted reads back (`gh … --json body`) equal to its file
  as the PR's head holds it, apart from line endings and the final newline.
  **Extended on 2026-09-24** by the owner's decision (PR #16): the test gaps
  PR #15's round 03 left are closed, since they belong to r5's own tool.
  *Proof:* a test posts a review file from a subdirectory of the checkout,
  and each break named in the "post-record.mjs test gaps" item turns a test
  red. **Extended again on 2026-09-24** by the owner's decision (PR #19): a
  checkout reached through a directory link is no longer refused, since that
  is a defect in r5's own tool and blocks posting where the temp directory
  is a link (macOS). *Proof:* a test with real `git` in a repository reached
  through a directory junction or symlink passes the PR check. **Worded more
  exactly on 2026-09-24** (PR #21, meaning unchanged): "the PR check" is the
  tool's `checkPrHolds`, and the test runs in
  `node --test tools/post-record.test.mjs`; the repository has no CI.
- **C3. The PR mechanics are written down and followed.** The rules state:
  the PR names what it implements and the revision its clean review covers;
  `Closes #N` stands on its own line and is checked with
  `closingIssuesReferences`; the body has four parts (what was built, the
  done-when ticked, the check output, what was left out); no merge while a
  review is running. *Proof:* the text; for every r5 PR, its body names the
  reviewed revision and has the four parts, every issue it closes appears in
  `closingIssuesReferences`, and it merged after its last review comment.
- **C4. A milestone is a tag, and the tag waits for an independent review.**
  The rule (D2) defines a milestone as an annotated tag on `main`, on the
  commit the release is built from; lists what the milestone issue holds
  (proposed tag, candidate SHA, previous tag, PRs since, gate results); has
  the reviewer post one verdict on it, with one issue per reproduced finding;
  and says who tags (D3) and how the owner overrides (D4). *Proof:* the text;
  `r5`'s milestone issue holds those fields. After tagging, anyone can check
  `git cat-file -t r5` (`tag`) and that `git rev-parse r5^{commit}` equals
  the SHA the `AGREE` verdict names; the completion note records both.
- **C5. Claims come before the work.** The rule requires numbered claims,
  each with its proof, written when a release is scoped, with a "not in this
  release" list; one verdict per claim (MET, NOT MET, PARTLY MET, COULD NOT
  TEST); `AGREE` only when no claim is NOT MET and no finding blocks, and a
  PARTLY MET or COULD NOT TEST is a finding the reviewer grades as blocking
  or not; and four-way triage. *Proof:* the
  text; `git log -p <landing merge>..<candidate> -- BACKLOG.md` shows every
  change to C1–C11 with its reason written here in the same commit, and none
  weakens a claim except as a visible "the claim was wrong" correction.
  **Extended on 2026-09-24** by the owner's decision (PR #27): the proof
  covers C12 as well: read "C1–C11" above as "C1–C12". The reason: C12 was
  added after C5 was written (PR #24), and a claim outside C5's proof could
  change without its reason.
- **C6. Milestone verdicts fit Claude mode.** `CLAUDE.md` and
  `reviews/README.md` scope "no marker" to per-change reviews, and the
  Rounds rule in `PRINCIPLES.md` names milestone rounds as D10 sets them.
  *Proof:* those three passages, quoted by `file:line`.
- **C7. The four protocol gaps are closed.** `design: none` has one home for a
  bypass amendment and one for an OpenCode completion note (D7);
  `PRINCIPLES.md` says a record is held to the rules in force when written
  (D11); the Rounds rule says how a round after a clean round counts (D6);
  and the `light` preset links no file it does not ship. *Proof:* the text;
  a `light` run generated from the candidate has no dangling relative link.
- **C8. Every preset generates cleanly from the candidate.** `light`,
  `standard` and `auto`, each generated with `--ref <candidate>` into a
  temporary directory and without `--github`, exit 0 and leave no `{{…}}`
  placeholder outside `reviews/milestone-prompt.md` and no dangling relative
  link, and a generated run carries the milestone rule and
  `reviews/milestone-prompt.md`, with its own `vX.Y.Z` scheme in the rule
  and in its `reviews/README.md` (D5, D9), and its `merge: auto` slot line
  names posted reviews. `node --check` passes on every `tools/*.mjs`.
  *Proof:* the commands. **Corrected on 2026-09-24** (PR #19), as "the claim
  was wrong": the milestone prompt ships with its placeholders by design, so
  "no `{{…}}`" now excepts it. Shipping the prompt and naming posted reviews
  in the `auto` line are an extension, not a correction, added in the same
  change, from PRs #19 and #17 (this sentence's labels were reworded on
  2026-09-24 in PR #21, which gave no date; the date is added in PR #23).
  **Narrowed on 2026-09-24** (PR #21): the exception covers only the
  placeholders the prompt documents, so any other `{{…}}` in it, such as an
  unfilled `{{PROJECT}}`, still fails.
- **C9. The scaffold guards its input.** A `--test` value with an unbalanced
  double quote or an embedded newline exits non-zero with a hint about shell
  quoting, and `--help` carries a quoting note. *Proof:* run both, showing the
  guard fails before the fix and passes after.
- **C10. The smaller rules land.** `PRINCIPLES.md` rules that a review never
  runs the code or tools under review on a path that creates something
  outside a temporary directory (no `--github`, no creating command inside
  the code under review); the reviewer's own verdict and finding issues are
  its output and are exempt. `reviews/README.md` names milestone reviews
  (D9); and these restatements are gone: `ROADMAP.md`'s `in design` status
  assuming a design stage, `README.md` giving OpenCode "the design agreed
  before code" unconditionally and saying the modes differ only in how the
  reviewer is obtained, and this file's preamble listing the harness files
  itself. *Proof:* the text. **Extended on 2026-09-24** by the owner's
  decision (PR #23): the rule covers builders too — a builder tests a
  posting or creating path only against fakes, a throwaway git repository in
  a temporary directory (never one on GitHub, the owner's decision on round
  01), or a dry run, and runs it for real only to post or create the real
  thing. The reason: a builder's `--confirm` test against PR #15 posted a
  stray comment.
- **C11. The milestone loop is complete and independent.** The rule has a
  fixed milestone review prompt, kept as a file, that the implementer only
  fills in. It holds the target proof on the candidate SHA, the range
  `<previous tag>..<candidate>`, the claims with a verdict table of one row
  per claim, the "not in this release" list, the reviewer's limits, one
  issue per reproduced finding, the verdict comment, and `--body-file`. On
  `BLOCK` the implementer gives a re-review prompt unasked;
  every body is posted through `--body-file`; and when a verdict arrives the
  implementer reproduces each finding, replies on the milestone issue per
  finding, and copies the verdict into `reviews/` (D9). *Proof:* the text
  and the template file; `r5`'s milestone prompt differs from the template
  only in its filled placeholders, and its verdict is signed with a model id
  of a family that implemented none of the range (D2). **Corrected on
  2026-09-24** (PR #23), as "the claim was wrong" about timing: since PR #21
  every verdict's copy lands in `reviews/` after the tag, not when the
  verdict arrives, so that the range under review holds only pull requests
  (C1); reproducing each finding and replying per finding still happen when
  it arrives.
- **C12. A decision made in conversation leaves checkable evidence.**
  `PRINCIPLES.md`'s *Owner decisions* says where the evidence of an owner
  decision given in conversation lives — for example the owner's merge of the
  change that records it, or a comment the owner signs on its pull request —
  so a reviewer checks that evidence instead of re-raising the decision as
  unverifiable. The rule says that the act it names counts as the owner's
  confirmation, although the owner and the agents post from one GitHub
  account, and it covers a decision recorded on a milestone issue (D4's
  override) as well as one on a pull request. *Proof:* the text; for each
  owner decision recorded after the rule lands, the milestone reviewer finds
  its evidence where the rule says. Decisions recorded before it are not
  held to it (*Rules apply going forward*, D11). **Added on 2026-09-24** by
  the owner's decision (PR #24), a scope change: every fresh-context
  reviewer of pgn-postmortem's PRs #1, #3, #4 and #5 flagged some owner
  decision as resting only on the implementer's report, and the reviews of
  r5's PRs #16, #19 and #23 took an owner decision as given
  (pgn-postmortem report, item 4).

## Candidates

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

**From the first real adoption** (boar_life, a Godot game, adopting r4 in
Claude mode, its PR #1, 2026-09-23; the report is
[`docs/sources/boar-life-field-report.md`](docs/sources/boar-life-field-report.md)).
Four template problems a real product meets, routed to r6 with the ADOPT
rebuild by the owner's decision (Notes):

- **The artistic license assumes a testbed.** `ROADMAP.md` says "The project
  exists to exercise the process; its content is not the deliverable" and
  "The point is the process". That holds for a testbed, not for a product;
  boar_life's reviewer flagged it against the slot's product line. Ask it as
  an owner decision at adoption and in the scaffold, or move the sentence
  into the slot. (Also pgn-postmortem, item 6: it narrowed the premise in its
  adopted `ROADMAP.md`.)
- **The conservative floor names web paths.** `PRINCIPLES.md` lists
  `public/**`, `mobile/**`, `netlify.toml` and "the package manifests", which
  is project knowledge in a shared file, so every adopter must edit
  `PRINCIPLES.md` and diverge. Keep the rule there; the slot owns the path
  list. (Also pgn-postmortem, item 6: it replaced the web paths with its own
  in its `PRINCIPLES.md`.)
- **"A comparison run copies a frozen subset"** in `ROADMAP.md` applies only
  to projects that test the harness.
- **Never-echo versus paths outside the repository.** "Paths to ignore" names
  things outside the repository (a sibling clone, a download cache), and the
  never-echo rule forbids one machine's paths. One line: describe them
  relative to the repository.
- **`ADOPT.md` names only a tag** (item 2): at the `r4` tag it still said
  `r3`, and the fixes lived only on `main`. The report suggests having
  `ADOPT.md` name the exact commit to take; considered with the rebuild.
  Also pgn-postmortem, items 3 and 6: at `r4`, `ADOPT.md` still said `r3`
  and asked for a design record in every mode (fixed on `main` by PR #9).
  The adopted `r4` also lacked the owner's own practice, milestone reviews,
  which existed only on untagged `main`. That project recorded an intention
  to adopt `r5`, and had to fix a release's claims after the fact. Its
  suggestion: `ADOPT.md` tells the adopter to list what `main` holds beyond
  the tag, and to ask the owner whether the project needs any of it now.

**From the second adoption** (pgn-postmortem, a Python chess tool, adopting
r4 in Claude mode, its PRs #1–#6, 2026-09-24; the report is
[`docs/sources/pgn-postmortem-field-report.md`](docs/sources/pgn-postmortem-field-report.md),
with a second version's new parts in its *Addendum*). Routed to r6 (Notes):
items 2 and 5, and the second version's items 6 and 8, by the owner's
decision, and item 1 with the ADOPT rebuild, by the reason of boar_life
decision (a). Item 8 leads r6's Claude-mode work. An item number without
"second version" is the first version's (its item 6 is the second
version's item 7).

- **An orchestrated Claude mode** (second version, item 8, the report's main
  proposal). The main session orchestrates: it talks to the owner, asks the
  owner decisions, commits and posts the review files, asks for the merge
  and writes the completion notes, and holds only reports. The implementer
  is a forked subagent in its own git worktree, briefed from what the
  repository records. The reviewer is a separate fresh subagent in its own
  worktree; it writes its review file and neither commits nor posts it.
  Re-reviews resume the same reviewer, and the round ceiling and the
  owner's merge apply unchanged. The owner's main reason is context
  economy: the main session never needs clearing across an iteration.
  pgn-postmortem's PR #6, at its round-01 revision `e273589`, shows 53
  assertions failing first, among them a real defect (the output depended
  on the worker without a per-game `ucinewgame`). Its round-01 review
  applied nine breaks of its own (R1–R9) and found a blocking defect. This
  repository's r5 PRs already work like the reviewer half: a fresh-context
  reviewer writes the review file, and the implementer commits it and posts
  it with `post-record.mjs`. The suggestions: `CLAUDE.md` names the shape
  and who commits and posts review files; every forked brief begins with a
  repository identity check (the first fork there landed in the wrong
  repository, which the report says the check caught); the scaffold's
  `.gitignore` lists `.claude/worktrees/`, a file the scaffold does not
  write today; and the Sessions habit names subagents as
  the default way to start a fresh session.
- **Who opens the fresh session** (second version, item 6). `PLAN.md`'s *The
  owner's part* says "Start each iteration and stop the session at its end"
  (at `r4` and on `main`), and the Sessions habit says to start a fresh
  session. The adopting agent read both as the owner's job, and twice ended
  a unit with a prompt for the owner to paste; the owner corrected it. The
  suggestion: the owner's part is the go-ahead and the merge, the
  implementer opens the fresh session (item 8), and the handoff becomes that
  session's brief. Paste prompts remain for work in another repository.
- **Roles before modes** (item 1). The adopting agent chose OpenCode mode for
  the one feature it wanted, a design stage, which by `AGENTS.md`'s
  assignment table made DeepSeek the implementer (its PR #4). The owner
  corrected it, and PR #5 went back to Claude mode. `ADOPT.md` presents the
  modes as symmetric ("keep both … if both tools work here") and never asks
  who implements, who reviews each change, and who reviews releases. Ask
  those three as owner decisions, in `ADOPT.md` §3 and the scaffold, and
  record them in the slot before any mode is chosen.
- **Name Claude mode's planning gate** (item 2). In Claude mode, shaping (a
  request is not a request to implement, the block's runnable done-when, owner
  decisions asked first) plus a fresh-context review of the shaping is the
  plan-before-build gate. Its PR #3 took three rounds and caught a re-opened
  decided item. No harness text names this gate, so an adopter reaches for
  OpenCode's design stage. Say it in one line in `CLAUDE.md`. Also,
  `design: required` in a Claude-mode slot does nothing but reads like that
  gate: explain it at adoption and in the scaffold, or apply the field only
  with OpenCode. The second version adds that the F-1.1 implementer flagged
  the same inconsistency independently; neither PR #6's body nor its review
  file shows it.
- **Planning is not building** (item 5, minor). Before any request exists,
  the agent twice started building during a design discussion; the owner
  stopped it. `ROADMAP.md` guards a request once one exists. Consider a line
  among the habits; pgn-postmortem put the convention in its slot.

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
ceiling on re-reviews, is the proposal, adapted from the definition the owner
shared ([`docs/sources/milestone-definition.md`](docs/sources/milestone-definition.md)).
It departs from that text where the owner decided otherwise: per-change
reviews are kept, and the reviewer is any model that is not Claude. The
`--body-file` rule and the handling of an arriving verdict are this
repository's own practice. Open for the design:

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
- **A dry run for the scaffold's `--github`.** It has no dry run and no fake,
  so under the creation-path rule builders cannot test it; a dry run that
  prints the `gh repo create` and push commands would let them (not in r5).
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
- **A verification pattern: a tool that exits 0 on failure.** Gate on its
  log, not its exit code: Godot exits 0 after `SCRIPT ERROR`, so boar_life's
  gate greps the log, and it also parses every script with `--check-only`,
  since running the main scene misses scripts no scene loads. For
  `verification/README.md`. (boar_life field report, item 6; not in r5 by
  the owner's decision, for r6.)
- **`post-record.mjs` test gaps** (PR #15, review round 03; the code is right
  in each case): the fake `git` never places a file in a subdirectory, so the
  `\` to `/` path conversion is untested; three breaks survive (a lone
  backslash in the quoting set, an info string on a closing fence line, a
  hard-coded PR number); and the entry point through a symlink is untested
  (a directory junction needs no admin rights). In r5, through C2; closed by
  PR #18.
- **`post-record.mjs` follow-ups** (PR #18, review round 01). In r5, through
  C2 (the owner's decision, PR #19): a checkout reached through a junction or
  symlink is refused, because `git` reports the physical path while the tool
  keeps the link path (macOS's `/var` is one), so resolve the real path first
  and test it with real `git` through a junction. Not in r5: the tests pin
  `shellQuote` and `repoPath` but not their call sites (assert the printed
  dry-run line); the junction test links the live `tools/` folder rather than
  a copy; and two comments are stale.

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
  parametrizable scaffold), `r4` (the four lessons), `r5` (the review loop on
  GitHub). Records in `design/` and `reviews/`.
- **Owner decisions (2026-09-23), on the boar_life field report.** (a) Its
  items 1, 3, 4 and 5 go to r6 with the ADOPT rebuild, and r5's claims stay as
  decided. The recommended default, taken; the reason: they are adoption
  problems, and r6 rebuilds adoption. (b) No point release `r4.1`, although
  `ADOPT.md` at the `r4` tag still names `r3` and lacks the Claude-mode steps.
  The recommended default, taken; the reason: a tag is a milestone and waits
  for an independent review, and `r5` carries the fixes. boar_life took
  `r4` plus `main`'s fixes and recorded both SHAs. (c) The test gaps join
  r5 through C2, and item 6 does not; (d) pinning an exact commit in
  `ADOPT.md` waits for r6, and `ADOPT.md` names `r5` as a release step. Both
  recommended defaults, taken, on 2026-09-24 (PR #16); the reasons: the gaps
  belong to r5's own tool, and the pattern and the pin are adoption work.
- **Owner decision (2026-09-24), on PR #18's `post-record.mjs` follow-ups.**
  The linked-checkout defect joins r5, extending C2 again; the other three
  follow-ups do not. The recommended default, taken (PR #19); the reason: the
  defect is in r5's own tool and blocks posting where the temp directory is
  a link, while the rest are test and comment polish.
- **Owner decision (2026-09-24): the creation-path rule covers builders
  too.** A builder tests a posting or creating path only against fakes, a
  scratch repository or a dry run, and runs it for real only for the real
  record; C10 is extended to say so (PR #23). The recommended default, taken;
  the reason: the tool's own checks cannot stop a reply or a milestone issue
  from being posted in error, as the stray comment on PR #15 showed. On PR
  #23's round 01 the owner decided that a builder's scratch repository is
  local only: a throwaway git repository in a temporary directory, never one
  on GitHub. The recommended default, taken; the reason: the rule's first
  sentence forbids creating a GitHub repository only to test, and an earlier
  test created a stray public one.
- **Owner decisions (2026-09-24), on the pgn-postmortem field report**
  (PR #24). (a) Item 4 joins r5 as claim C12. The reason: it is review-loop
  work, and three r5 reviews so far (PRs #16, #19, #23) took an owner
  decision as given. (b) Item 2 goes to r6. The
  reason: it concerns how an adopter picks a mode and reads the slot, which
  r6 rebuilds with item 1. (c) Item 5 goes to r6. The reason: a small habit
  line, taken with r6's adoption work. Each is the recommended default,
  taken. Items 1 and 3 go to r6 with the ADOPT rebuild. This is the
  implementer's routing, not an owner decision: the owner was asked only
  where placement was unclear, and these take the reason of boar_life
  decision (a) of 2026-09-23 (they are adoption problems, and r6 rebuilds
  adoption). The owner's merge of PR #24 confirms it. The report marks
  item 3 NEW; it is kept as a second source on boar_life's "`ADOPT.md`
  names only a tag", because both concern what an adopted tag holds, and
  its suggestion is recorded there. Item 6 adds a second source to
  boar_life items that are already routed.
- **Owner decisions (2026-09-24), on the report's second version** (PR
  #25). (a) Its item 8, the orchestrated Claude mode, goes to r6 as the lead
  of r6's Claude-mode work. The reason: it is a new shape for Claude mode
  that needs its own claims, and its evidence so far is one pull request
  (PR #6) still in review. (b) Its item 6 goes to r6 with item 8. The
  reason: who opens the fresh session depends on item 8's shape, and r5's
  claims are fixed. (c) The new parts go into a second pull request based
  on PR #24's branch, so PR #24's clean review stands. Each is the
  recommended default, taken. The second version's other items restate the
  first's, and the sentence it adds to item 2 is a second source on that
  item.
- **Owner decisions (2026-09-24), on the two questions left open before the
  r5 candidate** (PR #27). (a) C5's proof extends to C12. The reason: C12
  was added after C5 was written, and a claim outside C5's proof could
  change without its reason. (b) Without a remote, a stop notice is a line
  in the change's next review file. The reason: records are files, and
  without a remote a stop would otherwise leave no record. Each is the
  recommended default, taken. Two points in the rule that carries (b) are
  the implementer's, added on review round 01 within (b)'s reason, and not
  an owner decision: at the design stage the line goes in the design
  record, and the next reviewer writes it, quoting the notice. Decisions (a)
  and (b) are the first held to C12's rule, which lands in the same pull
  request: their evidence is the owner's merge of PR #27.
- The r4 milestone review (#10) is copied verbatim into `reviews/`:
  `006-r4-milestone-01.md` by DeepSeek V4.1 Flash, r4's implementer — not
  independent, kept as input — and `006-r4-milestone-02.md` by GPT-5.6 Luna,
  the milestone verdict.
- The independent review of the work since r4 (`r4..756696b`, on PR #11) is
  copied verbatim into `reviews/007-milestone-since-r4-01.md`: DeepSeek V4.1
  Flash, `AGREE`.
