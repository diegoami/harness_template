# Review: Orchestrated Claude mode, no owner sessions (PR #31), round 03

- **Revision covered:** `97fa44aaab43698712a7bebc6504ec4f5ad682b8`
  (branch `r6/orchestrated-mode`, base `main` at
  `c023b59e51a4cb9ebdaf1c262c303041d73b42d4`). The range holds five
  commits: `301d461` (the change), `a2b06d8` (round 01's file), `5b6f97e`
  (the answer to round 01), `7e0f57c` (round 02's file) and `97fa44a` (the
  answer to round 02).
- **Files reviewed:** `CLAUDE.md` (+34 −9), `PLAN.md` (+8 −4),
  `PRINCIPLES.md` (+10 −5), `reviews/025-orchestrated-mode-impl-01.md`
  (+220 −0) and `reviews/025-orchestrated-mode-impl-02.md` (+183 −0), the
  five files in the change. I got the list from
  `gh pr view 31 --json files`, and from `git diff --stat c023b59..97fa44a`,
  which gives the same five.
- **Target proof:** `git remote get-url origin` is
  `git@github.com:diegoami/harness_template.git`. The PR head from
  `gh api repos/diegoami/harness_template/pulls/31` is `97fa44aa…`, open,
  with base `main` at `c023b59e…`. `git ls-remote origin
  refs/heads/r6/orchestrated-mode` gives `97fa44aa…`. The local checkout is
  detached at `97fa44aa…`, and `git merge-base HEAD origin/main` is
  `c023b59e…`. All four agree. The round-02 file at `7e0f57c` is the file I
  wrote, apart from line endings.
- **Read for context, not in the change:** `BACKLOG.md` (*Release 6*: C1,
  C2, D2, D11, *Not in r6*, *The promise*), `AGENTS.md`,
  `reviews/README.md` and the updated PR body.
- **Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`), the round-01 and
  round-02 reviewer subagent, resumed as `CLAUDE.md:32-33` requires. It has
  not seen the implementation.
- **Mode:** Claude Code, per-change review. There is no marker.

## Findings

1. **non-blocking. The fallback reviewer's place and brief are not
   stated.**
   - `CLAUDE.md:42-45`: without subagents, the main session "starts the
     review itself, as a headless same-family session (for example
     `claude -p`) or by running the external process". `CLAUDE.md:50-51`
     adds "a headless session the main session starts" as a fallback for a
     failed review.
   - A forked reviewer runs "in its own worktree" (`CLAUDE.md:30-31`), and
     its brief begins with the identity check (`CLAUDE.md:38-41`). Neither
     is said of the headless session or the external process. A headless
     session runs in the directory it is started from, so the
     wrong-checkout pitfall that `CLAUDE.md:40-41` gives as the reason
     applies to it too. One could read "the reviewer's" at `CLAUDE.md:38`
     as covering any reviewer, but the sentence speaks of forked briefs.
   - C1 is met as written: its fallback clause asks only for one session,
     recorded, and its check clause names forked briefs. This finding only
     narrows a gap in intent.
   - *Fix, if the owner wants it:* add to `CLAUDE.md:42-45` a sentence
     such as "Its brief, too, begins with the identity check, and it runs in
     a worktree of its own." This can also wait for a later change.

## Round 02's findings

- **1 (*The owner's part* said the owner opens sessions): fixed.**
  - `PLAN.md:43-45` now reads "**Give the go-ahead** for each iteration, in
    the main session. The agent opens every session the iteration needs".
    No line in *The owner's part* has the owner start or stop a session, so
    C2's first clause holds literally.
  - The counts now agree. `CLAUDE.md:44-45` says "The owner opens none".
    `PRINCIPLES.md:311` says "The agent, not the owner, starts it". The
    habit no longer names an owner-opened case other than the paste prompt
    for another repository or model (`PRINCIPLES.md:316-318`).
  - A search of every `*.md` for "owner opens", "own conversation" and
    "headless" finds no other hit outside the review records, the sources
    and `BACKLOG.md`. *The promise* ("Claude mode runs without the owner
    opening sessions") now holds.
- **2 (the fallback left out an agent-started same-family session): fixed.**
  `CLAUDE.md:42-45` and `:50-52` now name a headless same-family session
  that the main session starts. The same-family default
  (`CLAUDE.md:33-34`) holds in the fallback too.
- **3 (the ambiguous sentence): fixed.** `PRINCIPLES.md:311` now reads
  "The agent, not the owner, starts it, from the main session."
- **The implementer's note on the exhausted case.** Where no subagent, no
  headless session and no external process can be started, `CLAUDE.md` no
  longer describes the case, and *Fallback* in `PRINCIPLES.md:113-117`
  governs it: "Retry, or select another reviewer; record its model id and
  who selected it". That is enough. A review nobody can start is "no review
  and no approval", and the round ceiling and owner decisions already route
  it to the owner. It is also not a restatement of the protocol, which is
  why `CLAUDE.md:52` points to it ("The rules are in the protocol").

## Verified

- **C1, re-read clause by clause at `97fa44a`:**
  - the shape: `CLAUDE.md:11-12`;
  - talks to the owner and asks the owner decisions: `:16`;
  - commits and posts the review files: `:17-19`;
  - asks for the merge (or merges under `merge: auto`) and writes the
    completion notes: `:19-21`;
  - forked implementer in its own git worktree: `:22`;
  - briefed from the repository's records: `:23-25`;
  - findings go back to the same implementer, resumed: `:27-29`;
  - a separate fresh reviewer subagent in its own worktree, which neither
    commits nor posts its file: `:30-32`;
  - a re-review resumes the same reviewer: `:32-33`;
  - the external process stays an option: `:34-37`;
  - one session is the fallback where subagents are unavailable, recorded
    in the review: `:42-45`;
  - the forked subagent is defined once, word for word as C1 has it:
    `PRINCIPLES.md:312-313`;
  - every forked brief, the implementer's and the reviewer's, begins with
    the identity check: `CLAUDE.md:38-41`.
  - All met.
- **C2, re-read:**
  - *The owner's part* no longer includes starting or stopping sessions:
    `PLAN.md:43-45`.
  - It has the go-ahead (`:43`), the owner decisions (`:46-47`), the merge
    (`:48-49`), playing the result (`:50-51`) and filing what the owner
    finds (`:52`).
  - The habit names a forked subagent as the default in both modes
    (`PRINCIPLES.md:311-313`), makes the handoff the brief (`:314-316`),
    and limits paste prompts to another repository or another model, such
    as a milestone review (`:316-318`).
  - All met.
- **Nothing new beyond finding 1.** The fix commit touches only
  `CLAUDE.md:42-52`, `PLAN.md:43-45` and `PRINCIPLES.md:311-318`. The
  headless session is a same-family session the main session starts, so it
  fits "a fresh-context session" and the same-family default. It is
  resumable (`claude -p --resume`), so "a re-review resumes the same
  reviewer" still holds.
  - The change contradicts neither `AGENTS.md` nor *Not in r6*.
  - It restates nothing that `PRINCIPLES.md` owns.
  - It leaves the project slot (`CLAUDE.md:63-91`) untouched.
- **PR body.** It matches the diff. Every `file:line` it cites matches
  `97fa44a`. It has the four parts, a *Rounds* note for rounds 01 and 02,
  "pending" as the reviewed revision, and one *Done when* item per clause.
  Its statement that only `PRINCIPLES.md` says the main session is the
  owner's own conversation is now true, since the `PLAN.md` copy is gone.
- **Wrapping.** None of the 433 added lines in the five files exceeds 79
  columns (`awk` over the `-U0` diff, counting bytes).
- **Gates, at `97fa44a`:**
  - `node --test tools/*.test.mjs` runs 43 tests: 43 pass, 0 fail.
  - `node --check` passes on all four `tools/*.mjs`.
  - `light`, `standard` and `auto`, generated with
    `--ref 97fa44aaab43698712a7bebc6504ec4f5ad682b8` into the scratchpad
    and without `--github`, each exit 0.
  - They have 19, 28 and 28 relative links, none dangling.
  - `{{…}}` occurs only in `reviews/milestone-prompt.md`.
  - In each run, `PRINCIPLES.md` and the first 62 lines of `CLAUDE.md`
    equal the root files. For `standard` and `auto`, `PLAN.md` equals the
    root file too.
  - The temporary directories were deleted afterwards.

— Claude Opus 5.5 (claude-opus-5-5), reviewer
No blocking finding remains.

## Completion

Landed by PR #31, merged on 2026-09-25 at 10:29 UTC as `0942ca4` at the
owner's instruction ("merge #31"), after its last review comment and with
GitGuardian green. The note is non-material and transcribes the evidence
for the done-when items. It is r6's first implementation PR, built in the
shape it describes: a forked implementer and a fresh reviewer, each in its
own worktree, with the main session committing and posting the reviews.

- C1: every clause holds in `CLAUDE.md` at `97fa44a` (round 03, *C1 and
  C2*). The shape, the main session's part (including `merge: auto`), the
  forked implementer and its resumption on findings, the fresh reviewer
  that neither commits nor posts, the resumed re-review, the
  external-process option, the headless fallback, the definition of a
  forked subagent (`PRINCIPLES.md`, Sessions), and the identity check.
- C2: *The owner's part* in `PLAN.md` has no session the owner opens. It
  keeps the go-ahead, the owner decisions, the merge, playing the result
  and filing findings. The Sessions habit names a forked subagent as the
  default, makes the handoff its brief, and limits paste prompts to another
  repository or another model.
- Gates at `97fa44a`: `node --test tools/*.test.mjs`, 43 of 43 pass;
  `node --check` passes on every `tools/*.mjs`; `light`, `standard` and
  `auto` generate cleanly and ship the new text; no added line is over 79
  columns.
- Three review rounds. Rounds 01 and 02 each had one blocking finding: the
  merge sentence under `merge: auto`, then a fallback in which the owner
  opened a session. Both were fixed. Round 03 was clean on `97fa44a`, and
  its one non-blocking finding (the headless fallback's worktree and
  identity check) is left for a later change, as the PR body says.
  `f9f744f` only adds round 03's record.

— Implementer (Claude Opus 5.5)
