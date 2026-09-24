# Review: Scope release 6 and write its claims (PR #30), round 03

- **Revision covered:** `eeb03fa25475ff97ffa6ab019f0d5ea5bc75a97c`
  (branch `r6/scope`, base `main` at
  `05a9b4baeeb2eb4141f07d4a03b463f7c660a966`).
- **Files reviewed:** `BACKLOG.md` (+173 −0),
  `reviews/024-r6-scope-impl-01.md` (+228 −0) and
  `reviews/024-r6-scope-impl-02.md` (+134 −0). I got the list from
  `gh pr view 30 --json files` and from `git diff --stat 05a9b4b..eeb03fa`.
  The two agree.
- **Target proof:**
  - `git remote get-url origin` is
    `git@github.com:diegoami/harness_template.git`.
  - The PR head from `gh api repos/diegoami/harness_template/pulls/30` is
    `eeb03fa2…`, open, with base `main`.
  - `git ls-remote origin refs/heads/r6/scope` gives `eeb03fa2…`.
  - The local checkout is detached at `eeb03fa2…`.
  - `git merge-base HEAD origin/main` is `05a9b4b…`.

  All four agree.
- **Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`). This re-review
  continues the round-01 and round-02 reviewer session (`PRINCIPLES.md`,
  *Reviewer sessions*), and I re-read the current revision.
- **Mode:** Claude Code, per-change review. There is no marker.

## Round 02 findings

1. **Fixed.** C7 no longer attributes the mapping to D7. It says "How it
   does so is the implementer's reading, not an owner decision"
   (`BACKLOG.md:140-141`).
   - It also says how the answer is matched. The implementer role is asked
     as a tool, Claude Code or OpenCode, with its model id. The mode is
     that tool's, "since the harness has one mode per tool"
     (`BACKLOG.md:141-144`).
   - The test wording follows (`BACKLOG.md:147-151`): a run whose
     implementer's tool is Claude Code has no `design:` line and gets no
     question, and an OpenCode run has both.
   - The mapping is now by tool, not by model. That also handles a Claude
     model running under OpenCode, which `AGENTS.md:23-24` does not
     forbid: it is OpenCode mode. The round-02 wording would have called
     it Claude mode.
2. **Fixed.** D5's row now ends "The recommended reading, taken; the
   alternative was the line always present, labelled OpenCode-only"
   (`BACKLOG.md:76`). That matches the reported question.

## Findings

1. **non-blocking. C7's edited lines are not re-wrapped.**
   - `BACKLOG.md:144` ends at "It asks `design`," (24 columns), and
     `BACKLOG.md:150` holds only "both, and". The rest of the paragraph is
     filled close to 79.
   - No line exceeds 79 columns, so the rule holds. The ragged lines are
     only cosmetic, but this branch already had a re-wrap commit
     (`bc51911`).
   - *Fix:* re-fill C7's paragraph. The change is whitespace only, and
     non-material (`PRINCIPLES.md:86-87`).

## New text checked

- **The fixes add no new rule or claim.** They change only C7 (the mapping
  and its tests) and the end of D5's row (`git diff d80951d..eeb03fa`: two
  hunks, in `BACKLOG.md` only).
- **The owner's words.** The mapping is explicitly not the owner's. D5's
  addition records the reported recommended option and its alternative.
  D7's row is unchanged since round 02.
- **The round-02 file** in the diff is identical to the file I wrote
  (`cmp` against the committed blob). It was committed as `ae648c4` at
  22:28:49Z. It was posted as the PR's second comment at 22:28:58Z, before
  `eeb03fa` at 22:29:17Z.
  - The comment equals the file apart from line endings and the final
    newline. I checked with `diff --strip-trailing-cr`, because the
    checkout converts to CRLF.

## Verified

- **The PR body matches the diff.**
  - It adds a *Round 02 fixes* entry, citing `eeb03fa` and two
    non-blocking findings.
  - It adds the round-02 sentence to the C7 item.
  - Its check output shows three files, +173, +228 and +134, 535
    insertions, which matches `git diff --stat`.
  - It still says "Reviewed revision: pending". After this round it should
    name `eeb03fa…` as the revision the last clean round covered
    (`PRINCIPLES.md`, *Pull requests*).
- **No r5 text changed.** The diff from the base has no deletions, and the
  r5 section now starts at `BACKLOG.md:180`.
- **Wrapping.** No line in `BACKLOG.md:1-179` outside a table exceeds 79
  columns, counted in characters.
- **Tests.** `node --test tools/*.test.mjs` gives 43 tests, 43 pass, 0 fail.
- **The round-01 and round-02 findings** (twelve in all) are each fixed at
  this revision.

— Claude Opus 5.5 (claude-opus-5-5), reviewer
No blocking finding remains.
