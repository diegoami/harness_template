# Review: Orchestrated Claude mode, no owner sessions (PR #31), round 02

- **Revision covered:** `5b6f97e7fe6628935c7519c3944dadab7a350df2`
  (branch `r6/orchestrated-mode`, base `main` at
  `c023b59e51a4cb9ebdaf1c262c303041d73b42d4`). The range holds three
  commits: `301d461` (the change), `a2b06d8` (round 01's file) and
  `5b6f97e` (the answer to round 01).
- **Files reviewed:** `CLAUDE.md` (+36 −9), `PLAN.md` (+9 −4),
  `PRINCIPLES.md` (+11 −5) and `reviews/025-orchestrated-mode-impl-01.md`
  (+220 −0), the four files in the change. I got the list from
  `gh pr view 31 --json files`, and from `git diff --stat c023b59..5b6f97e`,
  which gives the same four.
- **Target proof:** `git remote get-url origin` is
  `git@github.com:diegoami/harness_template.git`. The PR head from
  `gh api repos/diegoami/harness_template/pulls/31` is `5b6f97e7…`, open,
  with base `main` at `c023b59e…`. `git ls-remote origin
  refs/heads/r6/orchestrated-mode` gives `5b6f97e7…`. The local checkout is
  detached at `5b6f97e7…`, and `git merge-base HEAD origin/main` is
  `c023b59e…`. All four agree. The round-01 file at `a2b06d8` is
  byte-for-byte the file I wrote, apart from line endings.
- **Read for context, not in the change:** `BACKLOG.md` (*Release 6*: C1,
  C2, D2, D11, *Not in r6*, *The promise*), `AGENTS.md`,
  `reviews/README.md` and the updated PR body.
- **Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`), the round-01 reviewer
  subagent, resumed as `CLAUDE.md:32-33` now requires. It has not seen the
  implementation.
- **Mode:** Claude Code, per-change review. There is no marker.

## Findings

1. **blocking. *The owner's part* now says the owner opens sessions, which
   C2's text says it no longer includes.**
   - C2: "`PLAN.md`'s *The owner's part* no longer includes starting or
     stopping sessions". `PLAN.md:43-46`, rewritten for round-01 finding 5,
     now says: "The owner opens only the main session, their own
     conversation; the agent opens every other session the iteration needs,
     outside a mode's fallback". Read literally, the owner's part now does
     include starting sessions: the main session, and by the words "outside
     a mode's fallback", a fallback session as well. A milestone reviewer
     testing C2's exact text can grade it PARTLY MET. *The promise* in
     `BACKLOG.md` ("Claude mode runs without the owner opening sessions")
     reads the same way.
   - The fix also left the counts inconsistent. `CLAUDE.md:45-46` calls the
     owner-opened fallback session "the one case in a change where the owner
     opens a session". `PLAN.md:43-44` names another, the main session, and
     `PRINCIPLES.md:316-318` names two more: "only where a mode's fallback
     says so, or for a prompt to paste".
   - In round 01 I suggested either of two edits: "one implementer session"
     at `PLAN.md:10`, or rewording `PLAN.md:44-45`. The implementer made
     both. The first is enough, together with the habit's "the main
     session is the owner's own conversation" (`PRINCIPLES.md:309`).
   - *Fix:* keep sessions the owner opens out of *The owner's part*. For
     example: "**Give the go-ahead** for each iteration, in the main session.
     The agent opens every session the iteration needs (`PRINCIPLES.md`,
     *Sessions and handoff*)." Finding 2 removes the fallback case, which
     is the only thing that forces an exception here. If the owner wants to
     keep an owner-opened fallback session anyway, record it once, in
     `CLAUDE.md`, as an exception to C2 that the owner decides, and make
     "the one case" true of every file.

2. **non-blocking. Without subagents, the fallback leaves out a new session
   the main session could start itself.**
   - `CLAUDE.md:42-46`: "the review comes from the external process, which
     the main session runs. Where neither a subagent nor the external
     process is available, the review comes from a new session the owner
     opens". `CLAUDE.md:35` defines the external process as "from another
     family". So a same-family reviewer, the default in `CLAUDE.md:33-34`,
     is available in this fallback only if the owner opens a session.
   - Yet the main session can usually start a same-family session itself
     without the subagent tool, for example a headless `claude -p` run in
     the review's worktree. That was round 01's suggestion for finding 4.
     It keeps the default family and needs no owner-opened session.
   - *Fix:* for example, "the review comes from a new session the main
     session starts (such as a headless `claude -p`) or from the external
     process". Where neither can be started, the review is unavailable
     (`PRINCIPLES.md`, *Fallback*), and the owner decides how it is
     obtained. Then `CLAUDE.md:52-54` needs no owner-opened session either.

3. **non-blocking. "The agent starts it from the main session, not the
   owner" is ambiguous.**
   - `PRINCIPLES.md:311` can be read as "from the main session, not from
     the owner". The sentence means "the agent, not the owner, starts it".
   - *Fix:* "The agent, not the owner, starts it, from the main session."

## Round 01's findings

- **1 (merge under `merge: auto`): fixed.** `CLAUDE.md:19-21` now reads "It
  asks the owner for the merge, or, where the slot records `merge: auto`,
  merges when the slot's conditions hold". It agrees with `CLAUDE.md:58-59`,
  `PLAN.md:49-50` and *Merge policy*. The scaffold's "the implementer
  merges" (`tools/scaffold.mjs:264`, `:362`) is recorded in *Left out* for
  C6/C7, as suggested.
- **2 (the reviewer's brief): fixed.** `CLAUDE.md:30-31` makes the reviewer
  "a separate, fresh forked subagent". `CLAUDE.md:38-39` says "Every forked
  brief, the implementer's and the reviewer's". The opening line's "a
  forked implementer and a fresh reviewer" (`CLAUDE.md:11-12`) still
  contrasts the two, but the explicit list settles it.
- **3 (the identity check only in `CLAUDE.md`): the triage holds.** D11
  covers only the default way to start a session, so adding the check to
  OpenCode would be a rule no owner decision covers. Round 01 left the
  choice to the owner, and *Left out* records it. The new wording at
  `CLAUDE.md:38`, "the implementer's and the reviewer's", also ties "every
  forked brief" to Claude mode's two roles, which answers the literal
  reading I raised.
- **4 (who opens the fallback's new session): answered, but the answer is
  finding 1 and finding 2 above.** The text now names who opens it. Naming
  the owner is what makes C2's text fail.
- **5 (the main session's lifetime): fixed, with finding 1 as a side
  effect.** `PLAN.md:10-12` now says "one implementer session" and "the same
  implementer session", and `PRINCIPLES.md:309` says "The main session is
  the owner's own conversation". The implementer's first flag was the
  `PLAN.md:10-12` edit, outside *The owner's part*. It is in scope, since it
  resolves a tension this change created (`PRINCIPLES.md:27-28`) and
  touches neither the slot nor another claim. *Left out* notes that the
  heading *One iteration per session* stays; that is acceptable.
- **6 (Claude Code's `fork` type): fixed.** `CLAUDE.md:12-14` says a forked
  subagent "is not a subagent type that copies the main session's
  conversation, such as Claude Code's `fork`". This is a Claude-specific
  warning; it does not restate the definition at `PRINCIPLES.md:312-313`.

## Verified

- **The implementer's other two flags.**
  - A fallback in which the owner opens a session, beside C2's title: see
    findings 1 and 2. D2 allows a recorded fallback. But C2's text and
    *The promise* leave no room for an owner-opened session, and the case
    can be avoided.
  - "The main session is the owner's own conversation" is not stated only
    in `PRINCIPLES.md`. `PLAN.md:43-44` repeats it ("their own
    conversation"). The habit is the right owner: it uses "the main
    session" for both modes, and `CLAUDE.md:16` agrees with it. The copy in
    `PLAN.md` goes away with finding 1's fix.
- **C1, re-read clause by clause at `5b6f97e`:**
  - the shape: `CLAUDE.md:11-12`;
  - talks to the owner and asks the owner decisions: `:16`;
  - commits and posts the review files: `:17-19`;
  - asks for the merge and writes the completion notes: `:19-21`;
  - forked implementer in its own worktree: `:22`;
  - briefed from the repository's records: `:23-25`;
  - findings go back to the same implementer, resumed: `:27-29`;
  - a separate fresh reviewer subagent in its own worktree, which neither
    commits nor posts its file: `:30-32`;
  - a re-review resumes the same reviewer: `:32-33`;
  - the external process stays an option: `:34-37`;
  - the fallback, recorded in the review: `:42-47`, but see findings 1
    and 2;
  - the definition, once and word for word: `PRINCIPLES.md:312-313`;
  - the identity check: `CLAUDE.md:38-41`.
  - All met.
- **C2, re-read:** "Start each iteration" is gone. The go-ahead
  (`PLAN.md:43`), the owner decisions (`:47-48`), the merge (`:49-50`),
  playing the result (`:51-52`) and filing (`:53`) are all present. For
  "no longer includes starting", see finding 1. The habit names a forked
  subagent as the default in both modes (`PRINCIPLES.md:311-313`), makes
  the handoff the brief (`:314-316`), and limits paste prompts to another
  repository or model (`:318-319`).
- **New contradictions.** None beyond finding 1. The change still
  contradicts neither `AGENTS.md` nor *Not in r6*, and restates nothing
  that `PRINCIPLES.md` owns. The project slot (`CLAUDE.md:65-93`) is
  untouched.
- **PR body.** It matches the diff. Every `file:line` it cites matches
  `5b6f97e`. It has the four parts, a *Rounds* note, "pending" as the
  reviewed revision, and one *Done when* item per clause. Its *Left out*
  records finding 3's triage, the scaffold's merge wording and the
  owner-opened fallback. Its *What was built* for C2 quotes the
  `PLAN.md:43-46` text that finding 1 is about.
- **Wrapping.** None of the 264 added lines in the four files exceeds 79
  columns (`awk` over the `-U0` diff, counting bytes).
- **Gates, at `5b6f97e`:**
  - `node --test tools/*.test.mjs` runs 43 tests: 43 pass, 0 fail.
  - `node --check` passes on all four `tools/*.mjs`.
  - `light`, `standard` and `auto`, generated with
    `--ref 5b6f97e7fe6628935c7519c3944dadab7a350df2` into the scratchpad
    and without `--github`, each exit 0.
  - They have 19, 28 and 28 relative links, none dangling.
  - `{{…}}` occurs only in `reviews/milestone-prompt.md`.
  - In each run, `PRINCIPLES.md` and the first 64 lines of `CLAUDE.md`
    equal the root files. For `standard` and `auto`, `PLAN.md` equals the
    root file too.
  - The temporary directories were deleted afterwards.

— Claude Opus 5.5 (claude-opus-5-5), reviewer
One blocking finding remains (1).
