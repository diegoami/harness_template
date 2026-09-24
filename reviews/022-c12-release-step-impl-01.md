# Review: C12's rule, the release step and the two open answers, round 01

**Revision covered:** `498eed08b82febb0471715c7dc325d11643f54af` (PR #27,
branch `r5/c12-release-step`, one commit on `main` at `ff59870`).

**Files reviewed:** `ADOPT.md`, `BACKLOG.md`, `PRINCIPLES.md`. Obtained
from `gh api repos/diegoami/harness_template/pulls/27 --jq .head.sha`
(`498eed0…`, base `main` at `ff59870…`), `gh pr view 27 --json files` (the
three files), and `git ls-remote origin refs/heads/r5/c12-release-step`
(`498eed0…`); the worktree's `HEAD` is `498eed0…`. Checked equal to the
local diff: `git merge-base HEAD origin/main` = `origin/main` = the PR's
base = `ff59870`, and `git diff --stat ff59870 HEAD` names the same three
files. Target proven.

**Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`), a fresh-context session.

**Mode:** Claude. No design stage, no marker.

**Method:** read-only. `git log`, `git show` and `git diff` in the PR's
worktree, and read-only `gh pr view` and `gh api` GETs.
`node --test tools/*.test.mjs`, `node --check` on every `tools/*.mjs`, and
`node tools/scaffold.mjs --yes --ref 498eed0… --preset <p>` for `light`,
`standard` and `auto` into a scratch directory, without `--github`. Nothing
was posted, created, pushed or committed; the only file written in the
repository is this one.

## Findings

1. **non-blocking. The rule names no evidence home for a decision in a
   design record.**
   - The new text names two places: "For a decision a pull request records"
     and "For a decision recorded on a milestone issue"
     (`PRINCIPLES.md:126-132`).
   - In OpenCode mode a design record holds "the owner's decisions marked
     as such" (`design/README.md:7`), and it "opens as an issue before any
     implementation" (`PRINCIPLES.md:190-192`), so before any pull request
     exists. Its decisions must hold before the design `AGREE`, which is a
     decision "that must hold before the merge". The rule sends that case
     to "a comment the owner signs on it", where "it" is the pull request.
     At the design stage there is none.
   - C12 names only the pull request and the milestone issue
     (`BACKLOG.md:229-231`), so C12 is met. But `PRINCIPLES.md` serves both
     modes, and a design reviewer has no rule to check such a decision
     against.
   - **Suggest:** "For a decision a design record or a pull request
     records, … or else a comment the owner signs on its design issue or
     pull request".

2. **non-blocking. The no-remote sentence covers only the owner-merge
   case.**
   - "Without a remote, the evidence is the owner's merge commit of the
     change that records it" (`PRINCIPLES.md:138-140`). Two lines earlier,
     `merge: auto` and "a decision that must hold before the merge" both
     need a signed comment (`:129-130`). Without a remote there is no
     comment, and under `auto` the owner makes no merge commit. So neither
     case has a home.
   - The case is real: `presets/auto.json:16` sets `"merge": "auto"`, and
     `--github` defaults to `none` (`tools/scaffold.mjs:166`). A
     `--preset auto` run without `--github` is a no-remote `auto` project.
     I generated one, and its slot reads `- **merge:** auto`.
   - The first sentence also says the evidence is "on GitHub"
     (`:125-126`), without a condition. The last sentence then gives a
     no-remote case. That reads as a contradiction until the reader reaches
     the end.
   - The underlying gap is older than this change. `auto`'s merge
     conditions already need "its reviews posted on the pull request"
     (`tools/scaffold.mjs:263`), which also has no remote form. This PR
     inherits the gap and does not create it.
   - **Suggest:** open with "leaves evidence on the remote (GitHub)". Then
     either name the no-remote evidence for `auto` and pre-merge decisions
     (for example a line the owner signs in the change's record, committed
     by the owner), or say that without a remote the owner merges. The
     second is an owner decision, so it may go to the owner.

3. **non-blocking. A stop notice without a remote has a place, but not
   an author.**
   - The addition is "(without a remote, a line in the change's next
     review file)" (`PRINCIPLES.md:107-108`). It is the owner's recorded
     answer, and its wording matches PR #21's round-02 finding 4
     (`reviews/016-protocol-gaps-impl-02.md:146-154`). Where the line goes
     is settled.
   - Who writes it is not. The stopped review "gets no `-NN` file"
     (`:106`), so it cannot write the next one. That file belongs to a
     later reviewer, who is often a fresh session that never saw the stop.
     With a remote, the stopped reviewer posts its own comment. Without
     one, the line survives only if someone passes it on. The rule does
     not say who.
   - In OpenCode mode, a stop at the design stage has no "review file" of
     its own. Design verdicts are appended to the design record (`:96-97`).
   - `reviews/README.md` owns the record format (ownership map,
     `PRINCIPLES.md:24`). It does not say where in a review file this line
     goes (`reviews/README.md:11-15`). The PR's *Left out* says
     `reviews/README.md` "do[es] not restate … stop notices, so none of
     them changes". That is true, but the new line is a format item.
   - **Suggest:** "(without a remote, a line in the change's next review
     file, or in the design record at the design stage, which the next
     reviewer copies from the notice the stopped review returned)". Also
     add one line to `reviews/README.md` placing it, for example after the
     opening lines. If the owner's wording should stay as given, send the
     design-stage case to the owner.

4. **non-blocking. "A comment the owner signs" has no signature form.**
   - The rule's evidence under `auto`, before the merge, and on a milestone
     issue is "a comment the owner signs" (`PRINCIPLES.md:129`, `:132`). It
     also says "the account tells nobody apart" (`:133-134`). So the
     signature is the only mark a reviewer can check. *Comment, not
     approval* agrees: "the signature is the only marker of authorship"
     (`:176-177`).
   - The signature convention belongs to `reviews/README.md` (ownership
     map, `PRINCIPLES.md:24`). It gives only the reviewer's line
     (`reviews/README.md:19-24`). Nothing says how an owner signs. A
     reviewer checking D4's override on a milestone issue cannot tell a
     signed comment from an unsigned one.
   - **Suggest:** add one line to `reviews/README.md`, for example "an owner
     comment ends `— <name>, owner`, and only the owner writes it". This
     also touches the PR's *Left out* (finding 3).

5. **non-blocking, wording.** `PRINCIPLES.md:108` is 58 columns in the
   middle of a paragraph ("the change's next review file). A milestone's
   rounds are"). It is a ragged rewrap left by the insertion. Re-flowing
   `:107-111` fixes it. This is non-material (*Materiality*).

## Verified

- **Gate 0.** The PR head on GitHub, the remote branch and the worktree's
  `HEAD` are `498eed0…`. The PR's three files equal the local diff from the
  merge base `ff59870`. `git diff --stat ff59870 HEAD` gives `ADOPT.md | 6`,
  `BACKLOG.md | 30`, `PRINCIPLES.md | 20`, 42 insertions and 14 deletions.
  That equals the PR body's *Check output*. The PR has one commit and no
  comments yet.
- **C12's text against the new rule** (`BACKLOG.md:223-239` against
  `PRINCIPLES.md:125-140`):
  - Where the evidence lives, with the owner's merge and an owner-signed
    comment as examples: `:126-130`.
  - The act counts despite one account: `:132-134`.
  - A milestone issue (D4's override) as well as a pull request:
    `:130-132`.
  - The reviewer checks and does not re-raise: `:136-137`.
  - The record names where the evidence is: "its record names where"
    (`:126`). The new Notes entry does this: "their evidence is the owner's
    merge of PR #27" (`BACKLOG.md:604-605`).
  - Every requirement is met.
- **Fit with the rest of `PRINCIPLES.md`.**
  - *Merge policy* (`:154-158`): "where the owner merges" and `merge: auto`
    split the same way. Letting a merge the owner orders count as the
    owner's matches how PRs #25 and #26 were merged ("at the owner's
    instruction", `reviews/021-progress-status-impl-02.md:94-96`).
  - *Milestones* and D4: the override "recorded on the milestone issue"
    (`:259-261`) now has its evidence form, and no other rule changes.
  - *Rules apply going forward* (`:166-170`): C12 exempts earlier
    decisions (`BACKLOG.md:233-234`). The Notes entry holds PR #27's own
    decisions to the rule explicitly (`:603-605`), so the milestone reviewer
    has no doubt about records written in the same change as the rule.
  - "Before the merge … pending, not a finding" (`:137-138`): under this
    rule, this round does not raise PR #27's two decisions.
- **The *Rounds* addition** (`PRINCIPLES.md:107-108`) agrees with "Records
  are files" (`:73`) and "Without a remote, the files stand alone"
  (`:201`). The stop notice is still "not a round" and gets "no `-NN`
  file" (`:105-106`), and the line lives inside a file that is a round.
  The milestone clause is unchanged.
- **C5's extension** (`BACKLOG.md:154-157`):
  - It is dated ("Extended on 2026-09-24", commit dated 2026-09-24).
  - Its reason is in the same commit `498eed0`.
  - It widens the proof from C1–C11 to C1–C12 and weakens nothing.
  - It keeps "C1–C11" and appends, as C2's and C10's extensions do
    (`:116`, `:198`).
  - No other claim line changed. The diff's `BACKLOG.md` hunks are
    `:14-27`, `:154-157` and `:597-605`.
- **`ADOPT.md` names `r5`** in all three places: `:5`, `:17`, `:101`. No
  `r[0-9]` release reference is left in it. Outside `reviews/`, `design/`
  and `docs/`, the only remaining `r4`-as-current text is `README.md:31-32`
  ("Release 4 is tagged"). The PR's *Left out* keeps that until the tag,
  which is correct. The scaffold's `--ref` default is "newest r* tag"
  (`tools/scaffold.mjs --help`), so it needs no edit.
- ***Progress* and *Notes*** (`BACKLOG.md:14-27`, `:597-605`):
  - Both open questions trace to their sources. PR #24's body says "C5's
    proof still names C1–C11 … Extending it is the owner's call, in a later
    change". PR #21's body lists "Round 02's non-blocking findings, to
    settle before the r5 milestone", and finding 4 is the stop notice.
  - Each Notes decision has the dated owner-decision label, "the
    recommended default, taken", and a reason. That meets *Owner decisions*
    (`PRINCIPLES.md:120`).
  - The brief says the owner chose both recommended options. The record
    matches that.
- **The PR body.**
  - Its *What was built* matches the diff item by item, and it quotes the
    *Rounds* parenthetical exactly.
  - Its done-when items are accurate, and are left unticked for this
    round.
  - Its *Left out* is accurate on `README.md` and on the milestone issue.
    On the other agent files, see findings 3 and 4.
  - A grep of the repository shows no restatement of *Owner decisions* or
    of stop notices. The one non-stale restatement is
    `reviews/milestone-prompt.md:40-51`, whose stop notices are milestone
    comments and need a remote anyway. `AGENTS.md` and `CLAUDE.md` refer
    to the merge rule only by reference (`AGENTS.md:40`, `CLAUDE.md:31-32`).
- **Gates.**
  - `node --test tools/*.test.mjs` gives 43 tests, 43 pass, 0 fail.
  - `node --check` passes on all four `tools/*.mjs`.
  - `light`, `standard` and `auto`, generated from `498eed0`, exit 0.
  - Each generated `PRINCIPLES.md` equals the root file apart from line
    endings (`diff --strip-trailing-cr`), so the new rule and the stop-notice
    line ship.
- **Wrapping.** Every added line is 79 columns or fewer. The one short line
  is finding 5.

— Claude Opus 5.5 (claude-opus-5-5), reviewer
No blocking finding remains (five non-blocking findings, 1–5).
