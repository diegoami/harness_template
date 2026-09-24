# Review: name r5 as the tagged release, round 01

**Revision covered:** `f82bff9bac5830123d10c923f8e5ee540eb5ab6a` (PR #29,
branch `r6/readme-status`, one commit on `main` at `e208762`).

**Files reviewed:** `BACKLOG.md`, `README.md`. Obtained from
`gh api repos/diegoami/harness_template/pulls/29 --jq .head.sha`
(`f82bff9…`, base `main` at `e208762…`), `gh pr view 29 --json files` (the
two files), and `git ls-remote origin refs/heads/r6/readme-status`
(`f82bff9…`); the worktree's `HEAD` is `f82bff9…`. Checked equal to the
local diff: `git merge-base HEAD origin/main` = `origin/main` = the PR's
base = `e208762`, and `git diff e208762 f82bff9` names the same two files.
Target proven.

**Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`), a fresh-context session.

**Mode:** Claude. No design stage, no marker.

**Method:** read-only. `git log`, `git diff`, `git grep`, `git cat-file`,
`git tag` and `git for-each-ref` in the PR's worktree, after
`git fetch --tags origin`; read-only `gh pr view`, `gh pr list`,
`gh issue view` and `gh api` GETs. `node --test tools/*.test.mjs` and
`node --check` on every `tools/*.mjs`. Nothing was posted, created, pushed
or committed; the only file written in the repository is this one.

## Findings

1. **non-blocking. The summary drops the owner's override.**
   - `README.md:34-36` says "a release tagged only after a review by a
     model independent of its implementer, against claims written before
     the work".
   - The promise it summarises ends "unless the owner overrides that on the
     record (D4)" (`BACKLOG.md:38-42`), and *Milestones* keeps the override
     ("Only the owner may tag without a review", `PRINCIPLES.md:263-265`).
   - "Only after" turns a rule with one recorded exception into an absolute.
     The `r5` tag message uses the same shortening ("tagged only after an
     independent review"), which is fixed text; `README.md` is not.
   - **Suggest:** "…against claims written before the work, unless the
     owner overrides that on the record", or drop "only".

2. **non-blocking. "Records posted … by `tools/post-record.mjs`" is wider
   than the promise.**
   - `README.md:33-34`: "records posted when they are written, by
     `tools/post-record.mjs`".
   - The promise covers "every record the implementer posts"
     (`BACKLOG.md:39`). The milestone reviewer posts its verdict with
     `gh … --body-file` (`PRINCIPLES.md:272`), as round 1 on #28 did, and
     the completion note is not posted at all (`PRINCIPLES.md:201`).
   - A reader of *Status* could take every record, the milestone verdict
     included, to go through the tool.
   - **Suggest:** "the implementer's records posted when they are written,
     by `tools/post-record.mjs`".

3. **non-blocking. The reviewer's model id is given without its variant.**
   - `BACKLOG.md:29-30`: "by Codex (`gpt-5`)".
   - The verdict gives "`gpt-5` (Codex desktop variant)" and signs
     "Codex (gpt-5, Codex desktop)" (#28, round 1); the tag message and the
     completion note (`reviews/r5-milestone-01.md`) both say "gpt-5, Codex
     desktop". `reviews/README.md:22` names the "model id with variant".
   - The fact is correct, and the copy it points to has the variant, so
     this is consistency only.
   - **Suggest:** "by Codex (`gpt-5`, Codex desktop)".

4. **non-blocking, wording.** `README.md:40` is 20 columns in the middle of
   a paragraph ("(the consolidation)."). The hard break before "Records in"
   was already there; the longer sentence pushed "(the consolidation)." onto
   a line of its own. Re-flowing `:38-42` fixes it. This is non-material
   (*Materiality*).

## Verified

- **Gate 0.** The PR head on GitHub, the remote branch and the worktree's
  `HEAD` are `f82bff9…`. The PR's two files equal the local diff from the
  merge base `e208762`. That diff is 16 insertions and 9 deletions
  (`BACKLOG.md` +6/−2, `README.md` +10/−7), which equals the PR body's
  *Check output* and the file list's counts. The PR has one commit and no
  comments yet.
- **The tag.** `git cat-file -t r5` prints `tag`;
  `git rev-parse 'r5^{commit}'` prints `f22685d884c0…`, so "`r5` is on
  `f22685d`" (`BACKLOG.md:29`) and "`AGREE` at `f22685d`"
  (`README.md:37-38`) hold. The tagger date is 2026-09-24 19:55 +0200,
  which matches "Tagged (2026-09-24)". The tag message's title is "r5: the
  review loop on GitHub", matching both new summaries.
- **Issue #28.** One verdict comment, headed "round 1", ending `AGREE`, all
  twelve claims MET and "Findings: None" — so "round 1's `AGREE` … every
  claim MET and no finding" (`BACKLOG.md:29-30`) holds. A second comment
  records the tag and closes the issue.
- **`reviews/r5-milestone-01.md`** holds the verdict and a
  `## Completion` section (the `cat-file`, `rev-parse` and `ls-remote`
  outputs), so `BACKLOG.md:30-31` is accurate.
- **The range's PRs.** `git log --first-parent --merges r4..r5` gives
  exactly 18 merges: #9 and #11–#27. #10 is an issue (the r4 milestone
  review request), not a PR, and `gh pr list --state merged` shows no other
  PR merged in the range. "PRs #9 and #11–#27" (`README.md:36`) holds.
  `r5..origin/main` is one commit, `e208762`, the completion-note copy, so
  this is the first PR after `r5`, as the body says.
- **The summary against the promise.** "The review loop on GitHub" is D1's
  theme (`BACKLOG.md:85`) and the tag's title. Posting when written,
  independence of the implementer and claims before the work are all in the
  promise (`BACKLOG.md:38-42`); findings 1 and 2 are the two places where
  the summary is broader than it.
- **No other stale release name.** `git grep` outside `reviews/`, `design/`
  and `docs/` finds `r4` only in history (the r5 range, the boar_life and
  pgn-postmortem reports, the r4 milestone records, the Notes release list)
  and in the new *Earlier* list. None names `r4` as current. `ADOPT.md`
  names `r5` at `:5`, `:17` and `:101`, as the PR's *Left out* says.
  `BACKLOG.md:388` ("the next milestone is `r5`") sits inside the dated
  owner decision of 2026-09-23, a record, and is correctly left.
- **C5.** The `BACKLOG.md` hunks are `:29-31` (a new paragraph between the
  *Progress* text and the claims preamble) and `:544-545` (the Notes
  release list). Neither touches the promise, a claim (`:97` on), the
  owner-decision table or the *Not in r5* list. No claim changed.
- **The PR body.** *What was built* matches the diff item by item. The
  deferral it cites is real: PR #27's *Left out* says `README.md`'s status
  "stays true until the `r5` tag exists". Its done-when items are
  accurate and unticked for this round; "Reviewed revision: pending" is
  right before a clean round. No issue is closed, so no `Closes` line is
  needed.
- **Gates.** `node --test tools/*.test.mjs`: 43 tests, 43 pass, 0 fail.
  `node --check` passes on all four `tools/*.mjs`.
- **Wrapping.** Every added line is 79 columns or fewer. The short lines
  `README.md:31`, `:33` and `:36` each come before a code span or link that
  would not fit on the line; `:40` is finding 4.

— Claude Opus 5.5 (claude-opus-5-5), reviewer
No blocking finding remains (four non-blocking findings, 1–4).
