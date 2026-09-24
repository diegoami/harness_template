# Review: the pgn-postmortem report's second version, round 01

**Revision covered:** `b510b3f198d015847e7f9a185b44d20cfa94575b` (PR #25,
branch `r5/pgn-postmortem-addendum`, one commit on `a2ef546`, PR #24's head).

**Files reviewed:** `BACKLOG.md`, `docs/sources/pgn-postmortem-field-report.md`.
The base moved during the review, so the target was proven twice.
- Against PR #24's branch, as briefed:
  `gh api repos/diegoami/harness_template/pulls/25 --jq .head.sha` =
  `b510b3f…`, and so do `git ls-remote origin r5/pgn-postmortem-addendum` and
  the local `HEAD`. `gh pr view 25 --json files` lists the two files, and
  `git diff --name-only r5/pgn-postmortem-report...HEAD` (base `a2ef546`) gives
  the same two.
- After PR #24 merged (`a0c7442`, 2026-09-24T13:22:56Z), and its completion
  note landed on `main` as `4619968`, the PR was retargeted:
  `.base.ref` = `main`, `.base.sha` = `4619968…` = `git ls-remote origin main`
  = `origin/main` after a fetch. The head is still `b510b3f…`.
  `git merge-base origin/main HEAD` = `a2ef546`, and
  `git diff --name-only origin/main...HEAD` gives the same two files (2 files
  changed, 171 insertions, 9 deletions, as against `a2ef546`). `a0c7442` has
  the same tree as `a2ef546`, and `4619968` touches only
  `reviews/019-pgn-postmortem-report-impl-04.md`, which is outside this
  change.

Target proven.

**Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`), a fresh-context session.

**Mode:** Claude. No design stage, no marker.

**Owner decisions taken as given** (given in conversation; not verifiable
here): item 8 goes to r6 as the lead of r6's Claude-mode work; item 6 goes to
r6 with item 8; the addendum goes in a new PR based on PR #24's branch. The
owner's framing that the second version "supersedes" the first is also taken
as given.

**Method:** read-only. In this repository: `git show r4:<file>`, `main` and
`HEAD`, and `gh pr view` and `gh api` GETs. pgn-postmortem was read with
`gh pr view -R diegoami/pgn-postmortem 6` and `gh api` GETs of
`repos/diegoami/pgn-postmortem/contents/…?ref=iteration-1-read-and-analyze`,
`…/commits` and `…/issues/6/comments`, saved to the session scratch directory.
The excerpts were compared with the owner's second version
(`pgn-report-v2.txt` in the scratch directory, 9417 bytes, UTF-8, LF, no BOM)
by a script. Nothing was posted, created, edited, pushed or committed; the
only file written in the repository is this one.

## Findings

1. **non-blocking.** PR #6's evidence has moved since it was quoted.
   - The PR body's table quotes PR #6's done-when as "53 breaks, one at a
     time, each red on its intended line". The current body of PR #6 (head
     `a82bb82`, round 03) does not contain that text. It now reads "round 01
     has 53 breaks, round 02 adds 19, and round 03 adds 12. At head
     `a82bb82` all 84 were re-run, one at a time". Its fail-first section
     still says "**53 of 53 red**" at `e273589` and `cbe3b31`.
   - The same table says "one comment on it holds that review". PR #6 now
     has two review comments (rounds 01 and 02) and two review files.
   - The substance holds: round 01 had 53 breaks, each red on its intended
     assertion. `BACKLOG.md:308` ("PR #6 shows 53 assertions failing first")
     is true of round 01. But a reader in r6 will find 84, and PR #6 may
     still change.
   - **Suggest:** in the item 8 bullet or its Notes entry, pin the evidence
     to a revision: PR #6 at round 01 (`e273589`), or its round-01 review
     file. The PR body's quote can say which version of the body it was.

2. **non-blocking.** The statement that r5's PRs "already use the reviewer
   half" is the implementer's account, not a record.
   - `BACKLOG.md:311-313`: "This repository's r5 PRs already use the
     reviewer half: the review subagent writes the file, and the implementer
     commits and posts it."
   - No r5 review file says "subagent". Reviews `013`–`019` each call the
     reviewer "a fresh-context session". The commits named "Record the …
     review, round NN" show that the implementer commits the file. That the
     reviewer was a subagent that did not commit is not in the records.
   - This round is consistent with the statement: it was written by an agent
     launched for the review, which does not commit or post. That is one
     round, and it attests nothing about earlier ones.
   - This is a note in an r6 candidate, not a claim, so it does not block.
   - **Suggest:** "r5's reviews are written by a fresh-context session, and
     the implementer commits and posts them", or mark the subagent part as
     the implementer's account.

3. **non-blocking.** "Item 6" now names two different items.
   - The first version's item 6 (confirms boar_life items 1-3) is the second
     version's item 7. The new routing uses the second version's numbers.
   - Unqualified, first-version numbering: `BACKLOG.md:265`, `:271`
     ("Also pgn-postmortem, item 6"), `:282` ("items 3 and 6") and `:561`
     ("Item 6 adds a second source").
   - Second-version numbering: `:58`, `:294`, `:319`, `:567`. These lines
     all say "second version", so they are unambiguous by themselves.
   - The addendum says the second version supersedes the first
     (`docs/sources/pgn-postmortem-field-report.md:96-97`), so a reader who
     opens the current report meets a different item 6.
   - **Suggest:** one sentence in the *From the second adoption* heading
     (`BACKLOG.md:290-296`) saying that item numbers without "second
     version" are the first version's.

4. **non-blocking.** The fence labeled "The sentence added to item 2" holds
   more than the added part.
   - `docs/sources/pgn-postmortem-field-report.md:117-123` and the header
     (`:100`) say "a sentence added to item 2".
   - The fence holds the second version's whole three-line *Suggest*
     paragraph (source lines 26-28). Its first sentence restates the first
     version's suggestion in other words. The only new content is the
     parenthetical "(the F-1.1 implementer flagged the same inconsistency
     independently)".
   - It is verbatim and nothing is lost. The label overstates the new part.
   - **Suggest:** "Item 2's suggestion, whose closing parenthesis is new",
     and the same in the header.

5. **non-blocking.** Two wording and wrapping points.
   - The rewrapped top header leaves a short line:
     `docs/sources/pgn-postmortem-field-report.md:9` is "> decisions on them
     in its", and the next line starts with "Notes". It renders fine, but the
     paragraph should be reflowed to the file's width.
   - `BACKLOG.md:316-317`: "the scaffold ignores `.claude/worktrees/`,
     although it writes no `.gitignore` today". This is in the list of
     suggestions, but it reads as a present fact.
   - **Suggest:** "a scaffolded `.gitignore` lists `.claude/worktrees/` (the
     scaffold writes none today)".

## Verified

- **Gate 0.** Head, remote branch, local `HEAD` and the file list match,
  against both the briefed base and the retargeted `main` (above).
- **(a) Every fenced excerpt is verbatim.** The Addendum has five `text`
  fences. A script took each fence's content and found each one to be an
  exact substring of the owner's second version: the opening paragraph
  (531 characters, source lines 1-6), item 2's *Suggest* (269, lines 26-28),
  item 6 (793, lines 53-61), item 8 (3985, lines 69-123), and "What worked"
  with "Evidence" (390, lines 125-130).
  - The file is UTF-8 with no BOM and LF endings, and has no trailing
    spaces. The only non-ASCII character is the existing `§` (`:33`).
  - Fence lines keep the source's wrapping (up to 100 columns).
- **(b) Nothing new was left out.** The script found that the only uncovered
  non-blank lines of the second version are items 1, 3, 4, 5 and 7 and item
  2's first paragraph (lines 8-25, 30-51, 63-67). Compared item by item with
  the first version:
  - Item 1: the same account, shorter. The suggestion is the same ("those
    three roles as owner decisions").
  - Item 2 (lines 21-25): the same, shorter.
  - Item 3: the same. It names "F-1's claims" where the first said "a
    release's claims". This is the same fact, already in `BACKLOG.md:286`.
  - Item 4: the same four PRs, the same resolution and the single-account
    remark.
  - Item 5: the same, without the archive's size.
  - Item 7: the first version's item 6, point for point, shorter.
  - Every change in these items drops or rewords material. None adds any.
  - The new parts are all copied: the opening paragraph (PR #6, the round
    counts, items 1-7 as misreadings and item 8 as the result), item 2's
    parenthetical, items 6 and 8, "What worked" and "Evidence".
  - "What worked" changes "they caught real defects in every PR" to "a real
    defect found in nearly every pull request" and drops the round-ceiling
    remark. It is copied, and nothing in `BACKLOG.md` cites the stronger
    wording.
- **(c) The restatement claim holds.** Items 1, 3, 4, 5 and 7 restate the
  first version's items 1, 3, 4, 5 and 6, as the Addendum header says (`:97-98`).
- **The handling matches `boar-life-field-report.md`.** The Addendum has a
  dated heading and its own blockquote source header, with the provenance, a
  pointer to the Notes, and the bold "source, not a rule" disclaimer. Then it
  has `text` fences. The top header points to the Addendum.
- **The PR body's claims table:**
  - Item 6. `PLAN.md:41-43` *The owner's part*, "**Start each iteration**
    and stop the session at its end", is the same at `r4` and on `main`. The
    Sessions habit, "Start a fresh session after a completed logical unit",
    is at `r4:PRINCIPLES.md:175` and `main:PRINCIPLES.md:289`. The owner's
    correction is a conversation quote and cannot be checked.
  - Item 8, fail-first. PR #6's body has the `d3` row, "**no `ucinewgame`
    per game** (the real defect)", verbatim. On 53, see finding 1.
  - Item 8, the reviewer. `reviews/006-f1-1-read-and-analyze-impl-01.md` on
    `iteration-1-read-and-analyze` has breaks R1–R9 (`:95-103`). Its finding
    1 is **blocking**, "The incremental skip treats any file with a
    library-style name as analyzed" (`:110`). It ends "One blocking finding
    remains".
  - Item 8, the subagent and the virtualenv. The review file says "a
    fresh-context Claude Code subagent" (`:29`) and "I made a fresh `.venv`
    in the worktree" (`:38`). PR #6's check output says "in a fresh `.venv`
    inside the worktree".
  - Item 8, the review comment. The first comment on PR #6 equals the
    round-01 review file, apart from a trailing newline.
  - Item 8, `.gitignore`. `tools/scaffold.mjs` writes the preset's files,
    `README.md` and an optional workflow. The presets list no `.gitignore`,
    and the repository tracks none, so the scaffold writes no `.gitignore`.
    PR #6's `.gitignore` has eight lines, none of them `.claude/worktrees/`.
  - Item 8, the wrong-repository fork, cannot be checked from the
    repositories.
  - Item 2's added sentence. `design:` required is in the slot template at
    `r4:CLAUDE.md:53` and `main:CLAUDE.md:56`. Neither PR #6's current body
    nor its review files 01 and 02 mention "design".
- **Routing matches the owner's decisions.**
  - Item 8 is the first new r6 bullet, and the heading says "Item 8 leads
    r6's Claude-mode work" (`BACKLOG.md:296`). Item 6 is the next bullet and
    points to item 8.
  - Item 2's addition is a second source on "Name Claude mode's planning
    gate" (`:343-345`), as the owner's instruction for a repeat asks.
  - The Not-in-r5 list (`:56-59`) and the heading (`:290-296`) name items 6
    and 8 as r6, by the owner's decision.
  - The Notes entry (`:563-573`) records (a)–(c), each with its reason and
    "the recommended default, taken", in the form of the entries above it.
    The second-source routing is stated there, not claimed as a decision.
  - The bullets are faithful to the fences. The pitfalls and part of the
    "why" are left to the linked source. Nothing is added beyond findings 1,
    2 and 5.
- **No r5 claim changed (C5).** The diff's four `BACKLOG.md` hunks are the
  Not-in-r5 list (`:55`), the second-adoption heading and bullets (`:287`),
  item 2's bullet (`:308`) and the Notes (`:526`). The in-r5 line, the
  release step and C1–C12 are untouched.
- **Wrapping.** The added `BACKLOG.md` lines are at most 79 columns, except
  the link line (93). That matches the existing link lines. Outside the
  fences the source file stays within 79 columns (finding 5 aside).
- **Scope.** The two files only: the Addendum, its pointer in the header, and
  the routing. The r6 items themselves are left out, as the PR body says.
- **What cannot be checked from the repositories:**
  - the second version being the owner's text, and its superseding the
    first;
  - the owner's quote in item 6 and the owner's reasons in item 8;
  - the wrong-repository fork and the identity check that caught it;
  - PR #6's body as it read when the table was written (finding 1).

— Claude Opus 5.5 (claude-opus-5-5), reviewer
No blocking finding remains.
