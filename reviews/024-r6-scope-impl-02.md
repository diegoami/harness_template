# Review: Scope release 6 and write its claims (PR #30), round 02

- **Revision covered:** `d80951dac517cdbdd4d96f6e319d562136f36303`
  (branch `r6/scope`, base `main` at
  `05a9b4baeeb2eb4141f07d4a03b463f7c660a966`).
- **Files reviewed:** `BACKLOG.md` (+169 −0) and
  `reviews/024-r6-scope-impl-01.md` (+228 −0). I got the list from
  `gh pr view 30 --json files` and from `git diff --stat 05a9b4b..d80951d`.
  The two agree.
- **Target proof:**
  - `git remote get-url origin` is
    `git@github.com:diegoami/harness_template.git`.
  - The PR head from `gh api repos/diegoami/harness_template/pulls/30` is
    `d80951da…`. The PR is open, with base `main`.
  - `git ls-remote origin refs/heads/r6/scope` gives `d80951da…`.
  - The local checkout is detached at `d80951da…`.
  - `git merge-base HEAD origin/main` is `05a9b4b…`.

  All four agree.
- **Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`). This re-review
  continues the round-01 reviewer session (`PRINCIPLES.md`, *Reviewer
  sessions*), and I re-read the current revision.
- **Mode:** Claude Code, per-change review. There is no marker.

## Round 01 findings

1. **Fixed.** C6 now names the one slot, in `CLAUDE.md` for both modes
   (`BACKLOG.md:128-129`). The `design:` line is OpenCode-only, and a
   Claude-mode slot has none (`BACKLOG.md:133-134`).
   - The D5 row keeps its original default text. It appends the
     clarification (`BACKLOG.md:76`), which matches the owner's chosen
     option as the coordinator reports it, word for word in substance.
   - The Status paragraph (`BACKLOG.md:9-15`) names the clarification.
     It names the merge as its evidence, which `PRINCIPLES.md:127-130`
     allows.
2. **Fixed, with one residue (new finding 1 below).** C7 now names the
   trigger: the scaffold picks the mode from the roles
   (`BACKLOG.md:140-142`).
   - It asks for and writes `design:` only in OpenCode mode.
   - Its proof names one test per case (`BACKLOG.md:144-148`): the role and
     premise flags, a Claude-implementer run with no `design:` line and no
     question, an OpenCode-implementer run with both, and the `.gitignore`
     line.
   - D7's row adds "the scaffold picks the mode from the answers"
     (`BACKLOG.md:78`). That is D7's option description as reported.
3. **Fixed.** C1 defines a forked subagent as "a new subagent that starts
   from its brief, not from a copy of the main session's conversation"
   (`BACKLOG.md:97-99`).
4. **Fixed.** Findings go back to the same implementer, resumed, and the
   external-process reviewer stays an option (`BACKLOG.md:91-95`).
5. **Fixed.** C2 now keeps playing the result and filing what the owner
   finds (`BACKLOG.md:101-104`). It places the paste-prompt rule in the
   Sessions habit in `PRINCIPLES.md` (`BACKLOG.md:105-108`).
6. **Fixed.** C6 quotes both sentences. They match `ROADMAP.md:57` and
   `ROADMAP.md:70`. C6 also keeps the comparison-run line, per D10
   (`BACKLOG.md:129-133`).
7. **Fixed.** The range now opens with `e208762`, then PR #29 and its
   completion note, then this change (`BACKLOG.md:26-30`). This matches
   `git log --first-parent r5..origin/main`.
8. **Fixed.** *In r6* places all five mining items (`BACKLOG.md:40-45`).
9. **Fixed.** D4 reads "chose which of two to take" (`BACKLOG.md:75`).
10. **Fixed.** Status reads "decided in conversation on 2026-09-24, and
    recorded on 2026-09-25" (`BACKLOG.md:9-10`).

## Findings

1. **non-blocking. C7 presents its implementer-to-mode mapping as D7's
   choice.**
   - C7 says "It picks the mode from the roles (D7): Claude mode when
     Claude implements, OpenCode mode otherwise" (`BACKLOG.md:140-142`).
   - D7, as reported, decided only that the scaffold "uses the answers to
     pick the mode". The mapping is the implementer's.
   - I find the "otherwise" to be within the decision's reach, not beyond
     it:
     - the harness has two modes;
     - Claude Code runs only Claude;
     - `CLAUDE.md` has Claude implement;
     - `AGENTS.md:23-24` makes the table an assignment, whose invariant is
       a different family for the reviewer.

     So a non-Claude implementer can only mean OpenCode mode. But the
     citation "(D7)" attributes the rule to the owner.
   - C7 also does not say how the scaffold recognises "Claude implements".
     The role could be free text, a model id, or a choice. The claim's own
     tests depend on that, so a reviewer at the candidate must infer it.
   - *Fix:* mark the mapping as the implementer's reading within D7, with
     its reason (Claude Code runs only Claude, so any other implementer
     means OpenCode). Say how the implementer answer is matched, for
     example a `claude-` model id or a `claude | other` choice.

2. **non-blocking. The D5 clarification is not recorded as a recommended
   default.**
   - `PRINCIPLES.md:121` records an owner decision "with a recommended
     default, the reason, and an owner-decision mark".
   - The clarification in D5's row (`BACKLOG.md:76`) and in the Status
     (`BACKLOG.md:11-12`) gives the reason. It does not say that the
     reading taken was the recommended option, or that the alternative was
     "always present, labelled".
   - *Fix:* append to the row: "the recommended reading, taken; the other
     option was a `design:` line always present and labelled".

## New text checked

- **Nothing in the fixes contradicts a current rule.** The one new
  commitment in *In r6* is that the rebuilt `ADOPT.md` points to the PR
  mechanics and does not restate them (`BACKLOG.md:43-44`). It agrees with
  the ownership map (`PRINCIPLES.md:8-15`). It is not a claim; a candidate
  that restated them would contradict the ownership map anyway.
- **The owner's words.** The only new text attributed to the owner is D5's
  clarification, which matches the reported answer, and D7's "picks the
  mode from the answers", which matches the reported option description.
  C7's mapping is finding 1.
- **The round-01 file** in the diff is byte-identical to the file I wrote
  (`cmp`). It was committed as `05aa99b` at 22:12:36Z. It was posted as the
  PR's only comment at 22:12:45Z, before `d80951d` at 22:25:15Z. The
  comment body equals the file apart from the final newline.

## Verified

- **The PR body matches the diff.**
  - Its *Round 01 fixes* list covers findings 1–10.
  - Its range line names `e208762`.
  - Its check output shows the two files with +169 and +228, 397
    insertions, which matches `git diff --stat`.
  - It still says "Reviewed revision: pending", as expected before a clean
    round.
- **No r5 text changed.** The diff from the base has no deletions, and the
  r5 section now starts at `BACKLOG.md:176`.
- **Wrapping.** No line in `BACKLOG.md:1-175` outside a table exceeds 79
  columns, counted in characters. Line 30 is exactly 79.
- **Tests.** `node --test tools/*.test.mjs` gives 43 tests, 43 pass, 0 fail.

— Claude Opus 5.5 (claude-opus-5-5), reviewer
No blocking finding remains.
