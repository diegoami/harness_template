# Review — release 5 scope and claims, implementation round 01

**Revision reviewed:** `c28ec6f59aa8cde5b240f9411c32d314e07710d6` (`c28ec6f`,
branch `plan/r5-scope`). Three sources agree on this SHA: PR #14's
`headRefOid` (`gh pr view 14 --json headRefOid,files`),
`git ls-remote origin plan/r5-scope`, and `git rev-parse HEAD`.

**Files checked:** `BACKLOG.md` — PR #14's file list (one file, +102 −1),
equal to the local diff: `git merge-base HEAD origin/main` = `d67c94b`
(= `origin/main`), then `git diff --stat d67c94b..c28ec6f`. The list equals
the expected list.

**Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`), a fresh-context session
that has not seen the implementation.

**Mode:** Claude. No design stage, no marker.

**Read for context:** `CLAUDE.md`, `PRINCIPLES.md`, `AGENTS.md`,
`reviews/README.md`, `docs/sources/ic2-milestone-review.md`,
`docs/sources/milestone-definition.md` (sources, not rules), `presets/*.json`,
`tools/scaffold.mjs`, the review files of PRs #9, #11–#13, and those PRs'
comments and merge times on GitHub.

## Findings

1. **blocking — "r5 PR" and "the first r5 implementation commit" are
   undefined, and under the natural reading C1 and C5 are NOT MET by
   construction.** The milestone reviewer reviews `r4..<candidate>`
   (`BACKLOG.md:165`, `:212`), and the milestone issue lists "the PRs merged
   since" `r4` (`:162`). That range already holds PRs #9, #11, #12, #13 and
   this PR #14. Their reviews were posted in batches, after the fact: PR #9's
   first three review comments are dated 10:10:57, 10:10:59 and 10:11:00Z;
   PR #11's three at 13:51:38–41Z; PR #12's at 14:51:22–24Z and 15:21:17–18Z;
   PR #13's two at 16:47:09–10Z (`gh pr view N --json comments`). So "on every
   r5 PR, each review comment is dated before the next fix commit"
   (`BACKLOG.md:54-56`) fails on those PRs, and "this section is committed
   before the first r5 implementation commit" (`:84-85`) fails because #9's
   and #11–#13's commits precede it. A reviewer either reports NOT MET for a
   rule that did not exist yet, or draws the boundary itself — which is the
   claim being written after the fact. Separately, C1's proof is vacuous: a PR
   with no review comment satisfies "each review comment is dated before…".
   **Fix:** define the set explicitly (for example, "r5 PRs are the PRs opened
   after this section lands; #9 and #11–#14 are held to the rules of their
   time, per the owner decision in Notes, and carry no claim"), say where that
   pre-scope work stands in the review (reviewed, not claimed; or listed as
   out of scope), and make C1's proof count: one PR comment per review file
   in the PR (`reviews/NNN-*-impl-NN.md`), each dated before the next commit
   and the merge. Note also that commit dates are author-set; the PR
   timeline's push events are the stronger evidence if one is wanted.

2. **blocking — decisions D3 and D4 and half of the milestone item have no
   claim, so a weak implementation passes every claim without them.** C4
   (`BACKLOG.md:72-79`) checks the definition, the issue's fields, one verdict
   and one issue per finding. Nothing checks that the landed rule says who
   tags after `AGREE` (D3, `:39`), whether and how the owner may tag without a
   review (D4, `:40`), that Claude gives the owner **one fixed review prompt**
   for a non-Claude model in a fresh session (`:163-164`), the re-review prompt
   given unasked on `BLOCK` (`:169-172`), the `--body-file`, UTF-8-without-BOM
   rule for the reviewer's bodies (`:167-168`), or the handling of an arriving
   verdict — reproduce, reply per finding, copy into `reviews/` (`:174-175`).
   The independence requirement itself, the core of the promise (`:19-20`), is
   only implied through "The rule (D2)"; no proof checks that r5's verdict is
   signed by a model id that is not Claude's. **Fix:** extend C4 (or add a
   claim) so each of these is named in the rule text, and add to its proof
   that r5's milestone issue carries the fixed prompt and that r5's verdict
   names a non-Claude model id.

3. **blocking — D9's default contradicts D5 for scaffolded runs.** D5 gives
   runs milestone reviews tagged `vX.Y.Z` (`BACKLOG.md:41`); D9 names the
   files `reviews/rN-milestone-NN.md` (`:45`), and C10 lands that name in
   `reviews/README.md` (`:106-107`), which every preset ships
   (`presets/light.json:7`, `standard.json:10`, `auto.json:10`). A run would
   receive a naming rule for a tag scheme it does not use. **Fix:** a default
   such as `reviews/<tag>-milestone-NN.md`, and C8's "carries the milestone
   rule" (`:99`) should require that the run's copy names its own tag scheme
   and no harness-only `rN`. While there: "`NN` counting rounds" collides when
   one round has two reviews, as r4's did (`006-r4-milestone-01.md` as input,
   `-02.md` as the verdict, `BACKLOG.md:286-289`); and D9 should say in words
   that it settles the "share a number" question (`:254-256`) and that the
   existing `006-`/`007-` milestone files keep their names (going forward).

4. **non-blocking — C10's new rule can make C7 and C8 unprovable.** "A
   review never executes a creation path" (`BACKLOG.md:105-106`) is to land
   as a rule, while C7 (`:94-95`) and C8 (`:96-100`) require the milestone
   reviewer to run the scaffold, which writes a directory, runs `git init` and
   commits (`tools/scaffold.mjs:459-494`), by default into `../<name>`, outside
   the checkout. If the rule is worded broadly, those claims become COULD NOT
   TEST. State in C10 what a creation path is (remote side effects:
   repositories, issues, comments, pushes, the `--confirm` path of
   `post-record.mjs`) and have C8 name `--dir` into a scratch directory.

5. **non-blocking — two proofs rest on the reviewer's own output or the
   builder's word.** C4's tag check (`BACKLOG.md:78-79`) is only the
   completion note, written by the implementer. Name the commands
   (`git cat-file -t r5` gives `tag`; `git rev-parse r5^{commit}` equals the
   verdict's SHA) so the owner can re-run them, and have r6's milestone
   reviewer check `r5` as its baseline. C5's "`r5`'s verdict has one row per
   claim" (`:85`) is satisfied by the reviewer writing it; it describes the
   process, not the candidate. Check the fixed review prompt's text instead.

6. **non-blocking — C6 leaves an open question with no default and has a
   negative proof.** The milestone item asks to scope the Rounds rule to
   per-change reviews and to say how milestone rounds count
   (`BACKLOG.md:201-204`, `PRINCIPLES.md:94-99`). C6 names only the no-marker rule and says the
   counting "is stated" (`BACKLOG.md:86-89`), without saying what it is. Its
   proof, "has no contradiction", passes any wording. Add a decision (for
   example: each milestone verdict is a round, counted per milestone across
   candidate moves, and a third not ending in `AGREE` goes to the owner, as
   the source says), name the Rounds rule in the claim, and state how the
   per-claim verdicts map to `AGREE`/`BLOCK`. C4's post-tag half, for one, is
   COULD NOT TEST for every reviewer by design.

7. **non-blocking — C2's proofs need a method, and the promise outruns it.**
   "Read back identical" (`BACKLOG.md:62-63`) should say how to compare
   (`gh api … --jq .body` against the file, and what is normalized: CRLF and
   the trailing newline). "Posts nothing" (`:61`) should say how it is shown
   without a fake CLI (reading the code path, or a read-only listing before
   and after), given the stray-repository incident (`:243-244`). The promise
   says every record is posted by the tool (`:17-18`), but C2 covers review
   files and design records only; the milestone issue body, the per-finding
   replies, and completion notes, which land on `main` after the merge, are
   not covered. Narrow the promise or widen C2.

8. **non-blocking — C3's proof skips two of the four rules it states.** It
   checks `closingIssuesReferences` and the four-part body (`BACKLOG.md:69-71`)
   but not that each r5 PR names the revision its clean review covers, nor
   that no r5 PR merged while a review was running. Add both. C1's timing
   check covers the second only partly.

9. **non-blocking — C7 and C10 point at lists the work will edit.** "The
   four protocol gaps" and "none of the restatements listed under 'Smaller
   items'" (`BACKLOG.md:90`, `:107-108`) become vacuous once those items are
   removed as done. Enumerate them or pin them to `c28ec6f`. Also: C7 moves
   the going-forward rule into `PRINCIPLES.md` for all projects, where the
   Notes decision settled it "for this repository only" (`:229-231`,
   `:265-272`). That extension deserves its own decision row. The light-run
   dangling-link proof (`:94-95`) catches `AGENTS.md:32`'s link, but not the
   ownership map still naming `design/README.md` as an owner
   (`PRINCIPLES.md:21`); say whether that is acceptable.

10. **non-blocking — terms and marks in the decisions.** D4 calls the owner's
    exception a "waiver" (`BACKLOG.md:40`), a term `PRINCIPLES.md:105-107`
    restricts to "an implementation-stage exception only". Name it
    differently, or extend the Waiver bullet in the same claim. With D4 the
    promise's "tagged only after a model independent of its implementer has
    checked it" (`BACKLOG.md:19-20`) needs "unless the owner waives it". D2's
    "not of the implementer's family" (`:38`) is ambiguous for a range with
    implementers from both modes; "of no implementer's family in the range"
    closes it, and the ownership map (`PRINCIPLES.md:15-17`) needs a row for
    the milestone rule. Finally, the owner-decision mark is a single 🧑 in the
    lead sentence (`BACKLOG.md:32`), a mark used nowhere else in the
    repository (Notes use "Owner decision (date)", `:265`; design records
    "_Owner decision._", `design/003-parametrizable-scaffold.md:203`). It
    meets `PRINCIPLES.md:108` minimally, but say how each confirmation will be
    recorded, for example a column or a dated line per row.

## Verified

- Gate 0: head, remote ref and local HEAD agree; PR files = local diff =
  `BACKLOG.md` only.
- Nothing outside the stated aim changed: the only removed line is the old
  heading `## Release 5 candidates`, now `## Candidates` (`BACKLOG.md:110`).
  No file links to the old heading's anchor; the two historical mentions in
  `reviews/006-r4-milestone-impl-01.md:98` and
  `reviews/007-milestone-since-r4-01.md:34` are records, not links.
- Wrapping: every new line outside the D1–D9 table is at most 80 characters.
  The only other lines over 80 (`:182`, `:192`) predate the change.
- Links: `docs/sources/ic2-milestone-review.md` resolves from the root.
- Tool names: `node tools/scaffold.mjs --help` lists `--ref | --tag`,
  `--test`, `--github` (default `none`), `--preset` (light | standard | auto)
  and `--yes`. `--ref` accepts a commit (`tools/scaffold.mjs:164`, `:169-173`),
  so `--ref <candidate>` works. `tools/post-record.mjs` does not exist yet, as
  expected for a scoping change. `reviews/README.md` naming is
  `NNN-<slug>-impl-NN`, as D9 says.
- Coverage: candidates 1–3 map to C1–C3; the milestone item to C4–C6; the
  four gaps to C7; `--test` guard and `--help` note to C9; creation-path rule,
  restatements and milestone naming to C10; scratch deletion is out, as
  stated. No claim covers a "not in r5" item. Every open question of the
  milestone item (`BACKLOG.md:188-205`) is addressed by a decision or a claim,
  though with the gaps in findings 2 and 6.
- Decisions against the owner's settled rules: D2 reads "not Claude" in
  Claude mode, admits DeepSeek, and adds no other exclusion; D3 matches the
  source's default; D5 and D2 keep each repository's per-change review and
  merge setting; D8 matches the scaffold's recorded default
  (`design/003-parametrizable-scaffold.md:203`). D6 matches the record: PR #9
  (`005-`, rounds 02–04 clean) and PR #12 (`007-`, rounds 02–05 clean)
  counted on past round 03 with no unclean round after it. D7's completion
  home is `reviews/README.md:27-33`'s existing Claude-mode rule. No default
  contradicts the Notes decisions.
- Each D row carries a default and a reason (`BACKLOG.md:37-45`).

— Claude Opus 5.5 (claude-opus-5-5), reviewer
Three blocking findings remain (1: the undefined r5 boundary and C1's vacuous proof; 2: D3, D4 and the milestone mechanics without a claim; 3: D9's name contradicts D5 for runs).
