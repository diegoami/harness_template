# Review — milestone reviews queued in the backlog, implementation round 01

**Revision reviewed:** `19181b9280d05ab6dd6b30c5247eafeb42c10520` (`19181b9`,
branch `backlog/milestone-reviews`; `git rev-parse backlog/milestone-reviews`
returns the same sha).
**Files checked:** `BACKLOG.md`, `reviews/007-milestone-since-r4-01.md` —
obtained locally: `git merge-base main 19181b9` = `365f0fe`, then
`git diff --name-only 365f0fe..19181b9`. One commit in range (`19181b9`). The
list equals the expected list; no pull request exists for this branch.
**Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`), a fresh-context session that
has not seen the implementation.
**Mode:** Claude — no design stage, no marker.

Taken as given, per the owner (2026-09-23): each change gets a fresh-context
Claude review; at milestones Claude requests a review from any model that is
not Claude, DeepSeek included.

## Findings

1. **"Scopetta's form, which already matches `CLAUDE.md`" is not true**
   (blocking). `BACKLOG.md:50`. Scopetta's per-change review does share this
   harness's core: a fresh-context subagent, same family fine, fixes in the
   same pull request, a disagreement goes to the owner, and the owner "is not
   automatically a fresh context" (`Scopetta/CLAUDE.md:44-61`). It differs on
   two points that this harness's `CLAUDE.md` states outright:
   - Scopetta's verdict is "ending in `AGREE` or `BLOCK`"
     (`Scopetta/CLAUDE.md:50-51`); this `CLAUDE.md` has "no AGREE/BLOCK marker".
   - In Scopetta, "Claude merges on an `AGREE`" (`Scopetta/CLAUDE.md:54-55`);
     here the owner merges (`CLAUDE.md` process, and `merge: owner` in the
     slot).

   It also can't "already match" on the milestone half, because this
   `CLAUDE.md` says nothing about milestones. Either drop the clause, or limit
   it to the part that holds, for example: "whose per-change review already
   matches `CLAUDE.md` except for its marker and who merges".

2. **The four bullets are not Scopetta's form. They combine all five projects
   and this repository's own practice** (blocking). `BACKLOG.md:53-60`. Checked
   against the sources:
   - "a fixed prompt" comes from balloons-JS: "Fill in the `{braces}` and
     change nothing else" (`balloons-JS/docs/review-prompt.md:9-12`).
     Scopetta's prompt is written for each milestone: it "names the
     milestone, the range, what to read and what to question"
     (`Scopetta/CLAUDE.md:94-95`).
   - "the reviewer posts one comment" is balloons-JS and Tressette. Scopetta's
     reviewer files "each finding as a GitHub issue" and then posts a summary
     (`Scopetta/CLAUDE.md:98-101`). Geoclick and discola-web work the same way:
     "one issue per reproduced finding" plus "one verdict comment".
   - "written to a file as UTF-8 without a byte-order mark and passed with
     `--body-file`" comes only from Geoclick's skill
     (`Geoclick2027/.claude/skills/review-handoff/SKILL.md:114-115`, `:155`).
     It isn't in Scopetta's `CLAUDE.md`, and discola-web's adapted copy of the
     skill doesn't have it either (a grep for `body-file`/`BOM` finds nothing).
   - "replies on the thread per finding" is Tressette ("comments on the issue
     with a verdict on each", `Tressette/CLAUDE.md:48-52`) and Geoclick
     (`SKILL.md:154`). Scopetta instead records the reviewed end, closes the
     issue and works the filed issues (`Scopetta/CLAUDE.md:104-106`).
   - "copies the review into `reviews/`" is this repository's own practice
     (#10, PR #11). None of the five projects does it.

   The "reviewed end" range and "only one review issue open at a time" are
   Scopetta's (`Scopetta/CLAUDE.md:74-92`), and balloons-JS also has "only one
   review waits at a time". "Blocks nothing" and "any model that is not Claude"
   hold for all five. A composite is a fine proposal, but it should not be
   credited to Scopetta. Either call it "drawn from the five, plus this
   repository's `reviews/` copy", or keep only what Scopetta actually does.

3. **"Five … converged on this" is true of the milestone half only**
   (non-blocking). `BACKLOG.md:48-49`. Only Scopetta also has a per-change
   fresh-context review. The other four don't:
   - Tressette: "A PR gets no review of its own" (`Tressette/CLAUDE.md:20-21`).
   - balloons-JS: "Claude works on its own" (`balloons-JS/CLAUDE.md:139`).
   - Geoclick2027 "never spawns its own reviewer" (`Geoclick2027/CLAUDE.md:167`),
     and discola-web "does not spawn its own reviewer".

   Geoclick and discola-web also don't open an issue. Claude hands the owner a
   prompt, and the review is recorded "on the thread the milestone already
   has", meaning the proposal issue, the PR or the release PR
   (`Geoclick2027/CLAUDE.md:167-180`). The bullet "each change … as now"
   describes this harness, so it isn't wrong. But the sentence reads as if
   all five converged on the whole list. All five share four things: a
   milestone review, a non-Claude model, never blocking, and reproducing a
   finding before acting on it. That is what they converged on.

4. **"A milestone is a release tag" doesn't cover one of the two hand runs it
   cites** (non-blocking). `BACKLOG.md:62-65`. "Run by hand twice" is accurate
   in substance. #10 matches the proposal closely: Claude opened the issue at
   tag `r4`, requested a model from another family, and replied per finding in
   comment 4. PR #11's run is different on two counts:
   - Its range was `r4..756696b`, which ends at no tag.
   - It was posted as a PR comment, not on an issue Claude opened.

   Also, "For this repository a milestone is a release tag" is written as a
   settled fact, but no owner decision records it. Suggest "proposed: a
   release tag", and name PR #11 as a run at a non-tag point, posted on the PR.

5. **"The Rounds rule caps a stage at three" paraphrases an owned rule, and
   the paraphrase is loose** (non-blocking). `BACKLOG.md:82-85`. The rule itself
   (`PRINCIPLES.md:94-99`) says: "Rounds 1 and 2 may rework; a third round
   that does not end clean … goes to the owner". It limits the rounds that
   don't end clean. It doesn't limit how many files a stage can have once a
   round is clean. The gap is still real, and the item describes PR #9
   accurately:
   - `-04` and `-05` each open with "Round 0N ended clean; this round reviews a
     material edit made after it" (`reviews/005-stale-text-impl-04.md:16-17`,
     `-05.md:15-16`). Neither says whether the count restarts or keeps adding
     up.
   - Round 03 still called itself "the last before the ceiling"
     (`-03.md:14-15`).
   - The completion note records "Five review rounds" (`-05.md:114`).

   A pointer is safer than a paraphrase, for example: "`PRINCIPLES.md`,
   *Rounds*, does not say …". The item could also mention the
   self-contradiction (round 03 called itself the last, and five rounds
   followed), since that is the core of the independent review's finding.

6. **"DeepSeek finding N" is now ambiguous** (non-blocking). `BACKLOG.md:67-78`.
   The heading now covers "#10 and PR #11", and both reviews are by DeepSeek
   V4.1 Flash. So "(DeepSeek finding 1.)" and "(DeepSeek finding 2.)" no longer
   say which review they mean. Suggest "(#10, DeepSeek finding 1.)".

7. **Naming** (non-blocking). `reviews/007-milestone-since-r4-01.md`:
   - The name follows the 006 stopgap: `NNN-<slug>-NN`, no `-impl-`, with `NN`
     counting separate reviews. That is outside `reviews/README.md:3-5`, which
     names only `-impl-NN` rounds, but the "Name milestone reviews" smaller
     item already records the stopgap. That item (`BACKLOG.md:100-102`) still
     cites only `006-r4-milestone-NN.md` and could add 007.
   - `007` now carries two slugs: `milestone-since-r4` for the copied review
     and `milestone-reviews-backlog` for this change's review, this file. 006
     used one slug (`r4-milestone`) for both. `design/README.md:3` gives one
     `NNN` per change, and `reviews/README.md` doesn't say whether `NNN`
     identifies a change or a record. That question belongs in the same
     smaller item. It is not a defect in this change.

## Verified

- **Gate 0.** `git rev-parse backlog/milestone-reviews` = `19181b9…`;
  merge-base `365f0fe` (= `main` = `origin/main`); the diff lists exactly
  `BACKLOG.md` and `reviews/007-milestone-since-r4-01.md`. Working tree clean
  before this file was written.
- **The copy is verbatim.** Read-only
  `gh pr view 11 --json comments`: four comments, exactly one starting with
  `# Independent review` (comment 4, 2026-09-23T14:08:14Z). Compared with
  `git show 19181b9:reviews/007-milestone-since-r4-01.md` after normalising
  CRLF and trailing newlines, they are equal: 6,908 characters each, 9 em
  dashes each. The file has no byte-order mark, uses LF, and ends in a
  newline. The comment has no BOM and no CR. The literal `ÔÇ`/`┬À`/U+FFFD in
  it is quoted text inside the review's own Verified section, not
  mis-encoding.
- **The Notes line (`BACKLOG.md:136-138`) is accurate.**
  `git rev-parse "r4^{commit}"` = `39c29e3…`, so the review's
  `39c29e3..756696b` is `r4..756696b`. `756696b` is PR #11's `headRefOid`.
  The review is signed DeepSeek V4.1 Flash
  (`opencode/deepseek-v4.1-flash`) and ends `AGREE`. Calling it independent
  is consistent: the work under review was Claude's, and under the owner's
  rule DeepSeek counts. That is unlike #10, where DeepSeek had implemented
  r4 (`BACKLOG.md:132-135`, unchanged).
- **The Rounds gap** checks out against `PRINCIPLES.md:94-99` and
  `reviews/005-stale-text-impl-03.md:14-15`, `-04.md:16-17`, `-05.md:15-16`
  and `:114` (see finding 5). All five `005-…` files belong to one
  implementation stage of PR #9.
- **Issue #10**, read-only with `gh issue view 10`: "Cross-family milestone
  review requested: harness release r4", opened by Claude at tag `r4`,
  closed. Comment 4 answers each finding. This supports the first "by hand"
  run.
- **Dates.** Each of the five projects changed its review text on 2026-09-23
  (`git log -- CLAUDE.md …`: Scopetta #52, Tressette #49/#50, balloons-JS
  `f7e17cf`, Geoclick2027 #26, discola-web `c7f7cd4`…`84cfbb5`), so "on
  2026-09-23" holds.
- **Scope and restatement.** The edits stay within the stated aim: one
  release-5 candidate, one protocol-gap bullet, the heading widened to
  "#10 and PR #11", one Notes line, and the copy. Apart from finding 5's
  paraphrase, the bullets read as a proposal rather than a rule. Nothing
  contradicts a current file (`CLAUDE.md`'s "owner may also ask for a review
  by OpenCode's process" is compatible).
- `git diff --check 365f0fe..19181b9` is clean. No added line of
  `BACKLOG.md` is over 80 characters; lines 18 and 114 are over, but they
  were already.
- Not done: no git or GitHub write of any kind; nothing run in the other
  repositories beyond reading files and `git log`.

— Claude Opus 5.5 (claude-opus-5-5), reviewer
Two blocking findings remain (1 and 2).
