# Review: the pgn-postmortem field report, round 01

**Revision covered:** `0ef34ecc90a4db09bbe2e16f6af54f2d523b5f17` (PR #24,
branch `r5/pgn-postmortem-report`, one commit on `main` at `07b34bd`).

**Files reviewed:** `BACKLOG.md`, `docs/sources/pgn-postmortem-field-report.md`.
Obtained from `gh pr view 24 --json headRefOid,files` (head `0ef34ec…`, the
two files) and `git ls-remote origin r5/pgn-postmortem-report` (`0ef34ec…`),
and checked equal to the local diff:
`git merge-base HEAD origin/main` = `07b34bd` (= `origin/main` = remote
`main`), `git diff --name-only 07b34bd..0ef34ec` = the same two files. Target
proven.

**Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`), a fresh-context session.

**Mode:** Claude. No design stage, no marker.

**Owner's instruction taken as given:** copy the report verbatim under a
source header; route item 4 to r5 as C12, items 2 and 5 to r6, items 1 and 3
to r6 with the ADOPT rebuild, and item 6 as a second source on the existing
items.

**Method:** read-only. In this repository: `git show r4:<file>`, `main`,
`gh pr view` and `gh api` GETs. pgn-postmortem was cloned into the session
scratch directory and read there; its PRs were read with
`gh pr view -R diegoami/pgn-postmortem <n>`. Nothing was posted, created,
edited, pushed or committed; the only file written is this one.

## Findings

1. **blocking.** C12's stated reason is not reproducible for its r5 half.
   - `BACKLOG.md:209-212` (C12): "every fresh-context reviewer of r5 so far,
     and of pgn-postmortem's PRs #1, #3, #4 and #5, flagged some owner
     decision as resting only on the implementer's report". The Notes repeat
     it (`BACKLOG.md:507`): "every r5 reviewer so far has met it".
   - The pgn-postmortem half holds (see *Verified*). The r5 half does not.
     The review files of PR #15 (`010-*`), #17 (`012-*`), #18 (`013-*`),
     #20 (`015-*`) and #22 (`017-*`) contain no such flag. Only some r5
     reviews record an owner decision taken on someone's word:
     `011-backlog-field-report-impl-02.md:23-24` ("taken as given"),
     `014-milestones-impl-02.md:72`, `018-smaller-rules-impl-01.md:19` and
     `018-smaller-rules-impl-02.md:27`.
   - The PR body's reproduction table checks item 4 only against
     pgn-postmortem, so the r5 statement was never reproduced. A claim change
     must carry its reason (`PRINCIPLES.md` *Milestones*), and the milestone
     reviewer will check it.
   - **Fix:** state what was reproduced. For example: "pgn-postmortem's
     reviewers of PRs #1, #3, #4 and #5 flagged it, and r5's reviewers of
     PRs #16, #19 and #23 took an owner decision as given". Make the same
     change in the Notes.

2. **blocking.** C12's proof applies a later rule to earlier records.
   - *Proof* (`BACKLOG.md:207-208`): "for each owner decision recorded in r5,
     the milestone reviewer finds its evidence where the rule says". The
     rule does not exist yet (its PR is the next one, per the PR body's
     *Left out*). So the proof covers decisions recorded before it: D1–D11
     (PR #14), and the decisions of PRs #16, #19, #21, #23 and #24 itself.
   - `PRINCIPLES.md:150-154` (*Rules apply going forward*) and D11 say that
     a record is held to the rules in force when it was written, and that a
     later rule is not applied to it.
   - This has consequences. PRs #14, #16, #19, #21 and #23 carry only the
     reviewer's comments (`gh pr view N --json comments`), and each was
     merged by the single account `diegoami`. If the rule names an
     owner-signed comment as the evidence, every earlier r5 decision fails
     C12. The only way to avoid that is for the proof to fix the rule's
     content ("the merge") before the rule is written.
   - **Fix:** limit the proof to owner decisions recorded after the rule
     lands. Or say that earlier ones are checked as before, as D11 requires.

3. **non-blocking.** C12 and the single account: part of item 4 was dropped.
   - Item 4 also records that "owner verdict comments come from the same
     GitHub account the agents post from" (source `:60-62`; pgn-postmortem
     `reviews/003-shape-f1-impl-03.md:70-73`). C12 leaves this out.
   - Both of C12's examples are acts of that one account: the merge, and "a
     comment the owner signs". `PRINCIPLES.md:158-161` (*Comment, not
     approval*) already says the signature is the only marker of authorship.
     So there is no conflict, but the evidence is only what the rule
     declares sufficient. It does not prove who acted.
   - D4 (`BACKLOG.md:67`) records an owner override on the milestone issue,
     not on a pull request, and C12's examples are tied to pull requests.
   - C12 does not conflict with the *Owner decisions* bullet
     (`PRINCIPLES.md:119-124`). It adds where the evidence lives; the bullet
     says how a decision is recorded.
   - **Suggest:** in the implementing PR, have the sentence say that the
     named act counts as the owner's confirmation under the single account.
     Also cover decisions recorded on an issue (D4, milestone triage).
     Otherwise reviewers will keep re-raising it.

4. **non-blocking.** The in-r5 line names C12 only as an exception, and
   from the wrong set.
   - `BACKLOG.md:34-39`: "the smaller items except … and the pgn-postmortem
     report's items other than item 4 (C12)".
   - The report's items are not under *Smaller items*, so excepting them
     from that set is a category error. Read literally, it makes item 4 a
     smaller item that is in r5.
   - The PR body says "The in-r5 line names it". It does, but only inside
     the exception list.
   - The scope is not in doubt: C12, the Not-in-r5 list (`:56-57`) and the
     Notes (`:505-512`) agree.
   - **Suggest:** name "claim C12 (pgn-postmortem item 4)" among r5's items.
     Drop the clause from the smaller-items exceptions, since the Not-in-r5
     list already excludes items 1, 2, 3 and 5.

5. **non-blocking.** Two routing records are loose.
   - `BACKLOG.md:511-512`: "Items 1 and 3 go to r6 with the ADOPT rebuild"
     has no reason and no recommended default. Items (a)–(c) have both, and
     `PRINCIPLES.md:119-120` asks for both. Pointing to the boar_life
     decision (a)'s reason (adoption problems; r6 rebuilds adoption) would
     be enough.
   - The *From the second adoption* heading (`:285`) says items 1, 2 and 5
     are all "Routed to r6 with the ADOPT rebuild". The owner's decision
     sends items 2 and 5 to r6, and only items 1 and 3 with the rebuild. The
     Notes (b)/(c) phrase this more accurately.

6. **non-blocking.** Item 3 is recorded as a repeat, but the report calls it
   new.
   - The report heads item 3 "NEW, and related to boar_life item 2" (source
     `:46`). The PR body says "items 3 and 6 repeat boar_life items".
     `BACKLOG.md:274-280` adds item 3 to the boar_life item-2 bullet as a
     second source.
   - Nothing is lost: the new problem (the tag lacked milestone reviews) and
     its separate suggestion (list what `main` holds beyond the tag) are both
     there. Either way it lands in r6 with the rebuild, as the owner decided.
   - But the owner's rule for a second source was "where an item repeats".
   - **Suggest:** mark it in the bullet as a new, related problem, or give
     it its own bullet. Correct the PR body's wording.

7. **non-blocking.** C5's proof names "C1–C11" (`BACKLOG.md:135`), so it
   does not reach C12's later history.
   - C5 was correctly left unchanged here, since rewording it is a claim
     change.
   - The *Milestones* rule already has the reviewer check the plan's history
     for every claim (`PRINCIPLES.md:229-230`), so no check is lost.
   - The owner may want "every claim" in a later dated change.

## Verified

- **Gate 0.** The head, the remote branch and the file list match (above).
  `origin/main` = `main` = `07b34bd`.
- **The source header** matches `boar-life-field-report.md`. It has the H1
  "Source: … (adopting r4)", a blockquote naming the session and date
  (2026-09-24) and the provenance (a public repository, with its URL),
  "copied verbatim, in the fence below, and not edited", what in
  `BACKLOG.md` comes from it, and the bold "source, not a rule" disclaimer.
  Then `---` and a `text` fence.
- **The fence is intact.**
  - It is UTF-8 with no BOM, LF endings, no control or replacement
    characters, and no trailing spaces. The only non-ASCII character is `§`
    (`:31`).
  - It holds items 1–6 in order, "What worked", and "Evidence", which ends
    at `3850530.`. It has one opening and one closing fence (`:14`, `:89`),
    with no inner triple backticks.
  - Its lines run to 98 columns. That is kept as the source, not rewrapped.
  - Whether it is verbatim cannot be checked against the owner's original.
- **The fence renders on GitHub.** The blob SHA at `0ef34ec` is `f6676c6…`,
  locally and on GitHub. The HTML rendering has one `h1`, one
  `blockquote`, one `hr` and one `<pre lang="text">`. Its unescaped text
  equals the fence's 5441 characters exactly, and nothing renders after it.
- **Against the harness:**
  - `r4:ADOPT.md` names `r3` (`:5,17,85`), says "keep both `AGENTS.md` and
    `CLAUDE.md` if both tools work here" (`:57`), and requires
    `design/001-adopt-harness.md` in every mode (`:75,96`). `main`'s
    `ADOPT.md` names `r4` and splits by mode. PR #9 (`ae9fa24`, commits
    `63f79e6`, `e292632`, `686a348`) made that change.
  - `r4:CLAUDE.md:19` says "There is **no design stage**". The slot has
    `design:` required at `r4` (`:53`) and on `main` (`:56`), and nothing
    names a Claude-mode planning gate.
  - `r4:AGENTS.md:13` assigns DeepSeek as the implementer.
  - `r4:PRINCIPLES.md:74` says "Claude mode has none, so it has no design
    records". It has no *Milestones*, and `reviews/milestone-prompt.md` is
    absent at `r4`.
  - *Owner decisions* (`r4:PRINCIPLES.md:108`, `main` `:119`) says nothing
    about evidence.
  - `ROADMAP.md` guards a request once it exists ("A request is not a
    request to implement", "Never implement an unshaped request"). Its
    artistic-license sentences are at `r4:ROADMAP.md:54,67`.
- **Against pgn-postmortem** (clone at `3850530`, which is its `main` HEAD
  "Land the F-1.1 mode change: completion note"):
  - PR #1 adopts `r4` (`39c29e3` = `r4^{commit}`) in Claude mode. Its body
    records no design record because of r4's `PRINCIPLES.md`, a floor with
    its own paths, and a narrowed license. Its slot has the "planning is not
    building" convention (`CLAUDE.md:106`).
  - PR #4 sets iteration 1 to OpenCode with a design record. PR #5 reverts
    to Claude Code, "which made DeepSeek the implementer". It also records
    milestone reviews as not in `r4`, to come with `r5`, and F-1's claims as
    its done-when items after the fact (`CLAUDE.md:52-59`).
  - PR #3 took three rounds. Round 01 has finding 1, "silently re-opens a
    decided item", finding 2 (the order of a check), and finding 4 (the
    PyPI release). Round 03 ends "No blocking finding remains".
  - Item 4 is raised in `001-…-01` (finding 5), `001-…-02:14,31`,
    `003-…-01` (finding 7), `003-…-02` (finding 4), `003-…-03` (finding 3,
    the single account; `:40,86` "the merge is its check"), `004-…-01:34-35`
    and `005-…-01:78-79`. That is seven files, as the PR body says. Every
    last round carries a completion note.
  - Its `ROADMAP.md:154-155` narrows the license ("in a process testbed").
    Its `PRINCIPLES.md:43` lists its own floor paths.
  - The 1,791-game archive appears in its `docs/book-plan.md:157`.
- **The PR body's table** holds for rows 1–6.
- **What cannot be checked from the repositories:**
  - the owner's quotes ("too eager…", "You are claude…", "we are not doing
    it now…");
  - the OpenCode start prompt with DeepSeek implementing;
  - the agent's reasoning in item 1;
  - the pre-adoption episodes of item 5 (the package refactor and the
    Stockfish run), which predate the harness;
  - the fence being verbatim.
- **Routing:**
  - Item 4 is C12, and items 1, 2 and 5 are new r6 bullets.
  - Item 3 and item 6's third point are attached to boar_life item 2, and
    item 6's first two points to boar_life items 1 and 3. Those are the
    right existing items.
  - Nothing enters *Smaller items* or the release step, and the Not-in-r5
    list, the Notes and the claims agree on what is in r5 (finding 4 aside).
  - The bullets are faithful. Two points are shortened: item 2's
    "`CLAUDE.md` (or README)" becomes `CLAUDE.md`, and one of PR #3's three
    catches is named. Nothing is added.
- **C12:**
  - It is added visibly, dated 2026-09-24, with a reason, in the same commit
    `0ef34ec` as its Notes entry.
  - No other claim changed: the diff touches only the in-r5 line, the
    Not-in-r5 list, the new C12, the candidates and the Notes.
  - C12 is testable at the text level (findings 2 and 3 aside).
- **Wrapping:** the added `BACKLOG.md` lines are at most 79 columns, except
  the link line (94). That matches the boar_life link line at `:248`.
  Nothing outside the aim changed.

— Claude Opus 5.5 (claude-opus-5-5), reviewer
Two blocking findings remain (1: C12's reason is not reproducible for r5's reviewers; 2: C12's proof applies the new rule to decisions recorded before it).
