# Review: C12's rule, the release step and the two open answers, round 02

**Revision covered:** `0e7a405897bc8250a81c865c0ac2f52f6a29e02a` (PR #27,
branch `r5/c12-release-step`, three commits on `main` at `ff59870`:
`498eed0`, the round-01 record `9132524`, and the fix `0e7a405`).

**Files reviewed:** `ADOPT.md`, `BACKLOG.md`, `PRINCIPLES.md`,
`reviews/022-c12-release-step-impl-01.md`, `reviews/README.md`. Obtained
from `gh api repos/diegoami/harness_template/pulls/27 --jq .head.sha`
(`0e7a405…`, base `ff59870…`), `gh pr view 27 --json files` (the five
files), and `git ls-remote origin refs/heads/r5/c12-release-step`
(`0e7a405…`); the worktree's `HEAD` is `0e7a405…`. Checked equal to the
local diff: `git merge-base HEAD origin/main` = the PR's base = `ff59870`,
and `git diff --stat ff59870 HEAD` names the same five files. Target
proven.

**Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`), the reviewer of round 01,
continuing that session (`PRINCIPLES.md`, *Reviewer sessions*), and
re-reading the current revision.

**Mode:** Claude. No design stage, no marker.

**Method:** read-only. `git log`, `git show` and `git diff` in the PR's
worktree, and read-only `gh pr view` and `gh api` GETs.
`node --test tools/*.test.mjs`, `node --check` on every `tools/*.mjs`, and
`node tools/scaffold.mjs --yes --ref 0e7a405… --preset <p>` for `light`,
`standard` and `auto` into a scratch directory, without `--github`. Nothing
was posted, created, pushed or committed; the only file written in the
repository is this one.

## Round 01's findings

1. **The design record as an evidence home: fixed.** The rule now reads
   "For a decision a pull request or a design record records", with the
   comment "on the pull request or the design issue"
   (`PRINCIPLES.md:127-131`). See new finding 1 for one phrase in it.
2. **The no-remote case: fixed.**
   - The first sentence no longer says "on GitHub". It now reads "leaves
     evidence of an act of the owner's" (`:126-127`).
   - Without a remote, "the owner's merge commit of the change stands for
     the merge, and a line the owner signs in the change's record stands
     for the comment" (`:135-137`). That covers `auto` and pre-merge
     decisions.
   - See new finding 2 for "the change's record".
3. **Who writes the stop-notice line: fixed.**
   - The rule now says "which the next reviewer writes, quoting the
     notice", and names the design record at the design stage
     (`:107-109`).
   - `reviews/README.md:31-34` places the line "after its file's opening
     lines", beginning `STOP NOTICE:`.
   - See new findings 3 and 4.
4. **The owner's signature: fixed.** `reviews/README.md:35-37` gives
   "a final line `— <name>, owner`. Only the owner writes it."
   `PRINCIPLES.md:140-141` points to it rather than restating it. This
   fits the ownership map, which gives the signature convention to
   `reviews/README.md` (`PRINCIPLES.md:24`).
5. **The ragged line: fixed.** `PRINCIPLES.md:104-112` is re-flowed. The
   paragraph's lines are 69-76 columns, and the short one ends it.

## Findings

1. **non-blocking, wording. "A design stage" reads as the whole project.**
   - The line is `PRINCIPLES.md:131-132`: "which `merge: auto`, a design
     stage and a decision that must hold before the merge all need".
   - The other two are a project setting and a kind of decision. Read
     alongside them, "a design stage" can mean any project with
     `design: required`. On that reading, every owner decision in such a
     project, including one recorded only in an implementation pull
     request, would need a signed comment and could never rest on the
     merge.
   - The intent appears to be a decision in a design record. That decision
     must hold before the design `AGREE`, so it is already a decision "that
     must hold before the merge".
   - **Suggest:** "which `merge: auto`, a decision in a design record, and
     any other decision that must hold before the merge all need".
2. **non-blocking, wording. "The change's record" has no fixed referent
   without a remote.**
   - The line is `PRINCIPLES.md:136-137`: "a line the owner signs in the
     change's record stands for the comment".
   - In Claude mode a change's records are its review files, which are the
     reviewer's and signed by it. The decision itself is recorded where
     "its record names" (`:127`), in this repository `BACKLOG.md`'s Notes.
     A reader cannot tell which of these the owner signs in.
   - Signing inside a reviewer's file would also put two authors' lines in
     one signed record.
   - **Suggest:** "a line the owner signs under the decision's record".
3. **non-blocking. The design-stage stop line has no format home.**
   - `PRINCIPLES.md:108` sends a design-stage stop notice to "the design
     record". But the new `reviews/README.md` bullet places the line in
     "its file's opening lines" (`reviews/README.md:31-34`). That describes
     a review file.
   - The design-record format belongs to `design/README.md` (ownership
     map, `PRINCIPLES.md:23`), and the fix did not touch that file. A
     design reviewer is not told where its verdict carries the line.
   - The case arises only in OpenCode mode with a design stage and no
     remote. The `standard` and `auto` presets ship `design/README.md`;
     `light` is `design: none`.
   - **Suggest:** one clause in `design/README.md` ("a stop notice without
     a remote opens the next appended verdict, as `reviews/README.md`
     gives"), or widen the `reviews/README.md` bullet to "its file's, or
     its design verdict's, opening lines".
4. **non-blocking. The record credits the owner with more than decision
   (b).**
   - The owner's recorded decision (b) is "Without a remote, a stop notice
     is a line in the change's next review file" (`BACKLOG.md:600-601`),
     and *Progress* repeats it (`:22-24`).
   - The fix adds two things the owner did not decide: the design-record
     home at the design stage, and the next reviewer as the line's author
     (`PRINCIPLES.md:107-109`).
   - Both are within (b)'s reason ("records are files, and without a
     remote a stop would otherwise leave no record"), and neither
     contradicts it. But `BACKLOG.md` is unchanged since round 01.
   - The PR body lists them under "**Stop notice without a remote** (the
     owner's decision)", as "Since round 01, …".
   - The milestone reviewer, checking C12's evidence for each decision
     after the rule, would find the owner's merge of PR #27 as evidence
     for text the owner never chose. The earlier precedent separates the
     two: "This is the implementer's routing, not an owner decision"
     (`BACKLOG.md:577-578`).
   - **Suggest:** one sentence after (b) in Notes: "The design-stage home
     and the line's author were added on review round 01 (PR #27), within
     (b)'s reason; they are the implementer's, not an owner decision." Or
     put the two to the owner.

## Verified

- **Gate 0.** The PR head on GitHub, the remote branch and the worktree's
  `HEAD` are `0e7a405…`. The PR's five files equal the local diff from
  `ff59870`. `git diff --stat ff59870 HEAD` gives 5 files, 263 insertions
  and 17 deletions. That equals the PR body's *Check output*.
- **The round-01 record.**
  - `9132524` adds only `reviews/022-c12-release-step-impl-01.md`, and the
    file is identical to the one this session wrote.
  - It was committed at 15:55:04 UTC and posted as the PR's only comment
    at 15:55:20 UTC. The fix `0e7a405` followed at 15:56:07 UTC.
  - The comment equals the file apart from the final newline.
- **The fix's scope.**
  - `git diff 9132524 0e7a405` touches only `PRINCIPLES.md` (*Rounds*,
    *Owner decisions*) and `reviews/README.md` (two bullets).
  - `ADOPT.md` and `BACKLOG.md` are unchanged since round 01. Round 01's
    *Verified* items on them still hold: C5's extension, `r5` in all three
    places, *Progress* and *Notes*.
- **C12, re-read in full** (`PRINCIPLES.md:121-143`):
  - Where the evidence lives: `:127-137`.
  - The act counts despite one account: `:137-140`.
  - A milestone issue as well as a pull request: `:132-134`.
  - The reviewer checks and does not re-raise: `:141-143`.
  - All of C12 (`BACKLOG.md:223-239`) is still met.
  - The fit with *Merge policy*, D4, *Rules apply going forward* and
    *Posting* holds as in round 01. Without a remote, the files stand
    alone (`:204`), and the new no-remote evidence lives in files.
- **The `STOP NOTICE:` prefix** matches `reviews/milestone-prompt.md:43-44`
  ("one comment … that begins "STOP NOTICE:" and says why"). The bullet
  cites the prompt with a relative link, `milestone-prompt.md`. That file
  ships in all three presets, so the link does not dangle.
- **The *Rounds* rule is otherwise intact.** The stop is still "no review
  … and not a round", it gets "no `-NN` file" (`:105-106`), and the line
  lives inside a later round's file. The milestone clause is unchanged.
- **Gates.**
  - `node --test tools/*.test.mjs` gives 43 tests, 43 pass, 0 fail.
  - `node --check` passes on all four `tools/*.mjs`.
  - `light`, `standard` and `auto`, generated from `0e7a405`, exit 0.
  - Each generated `PRINCIPLES.md` and `reviews/README.md` equals the root
    file apart from line endings (`diff --strip-trailing-cr`). So the new
    *Rounds* and *Owner decisions* text, the `STOP NOTICE:` bullet and the
    owner's signature ship in all three.
- **The PR body.**
  - The *Round 01 fixes* bullet matches `0e7a405` item by item.
  - *Check output* equals the diff stat.
  - *Left out* now names only `CLAUDE.md` and `AGENTS.md`, which refer to
    these rules by reference only (`CLAUDE.md:31-32`, `AGENTS.md:40`). It
    records why `reviews/README.md` changed.
  - The first C12 bullets still describe the round-00 wording ("a comment
    the owner signs on the pull request"). The fixes bullet below them
    corrects that, so nothing in the body is false. Finding 4 covers the
    stop-notice bullet's label.
- **Wrapping.** Every added or re-flowed line in `PRINCIPLES.md` and
  `reviews/README.md` is 79 columns or fewer.

— Claude Opus 5.5 (claude-opus-5-5), reviewer
No blocking finding remains (four non-blocking findings, 1–4).
