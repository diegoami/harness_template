# Review: Scope release 6 and write its claims (PR #30), round 01

- **Revision covered:** `bc51911f7b2a4c5073f4542eb7298e85a607c193`
  (branch `r6/scope`, base `main` at
  `05a9b4baeeb2eb4141f07d4a03b463f7c660a966`).
- **Files reviewed:** `BACKLOG.md`, the only file in the change. I got the
  list from `gh pr view 30 --json files`, which gives `BACKLOG.md` +146 −0,
  and from `git diff --stat 05a9b4b..bc51911`, which gives the same.
- **Target proof:** `git remote get-url origin` is
  `git@github.com:diegoami/harness_template.git`. The PR head from
  `gh api repos/diegoami/harness_template/pulls/30` is `bc51911f…`, open, with
  base `main`. `git ls-remote origin refs/heads/r6/scope` gives `bc51911f…`.
  The local checkout is detached at `bc51911f…`.
  `git merge-base HEAD origin/main` is `05a9b4b…`, which equals `origin/main`.
  All four agree.
- **Read for context, not in the change:** `PRINCIPLES.md`, `CLAUDE.md`,
  `AGENTS.md`, `reviews/README.md`, `ADOPT.md`, `PLAN.md`, `ROADMAP.md`,
  `verification/README.md`, `tools/scaffold.mjs` (and its `--help`),
  `presets/*.json`, `docs/sources/boar-life-field-report.md`,
  `docs/sources/pgn-postmortem-field-report.md` (with its *Addendum*), and
  a skim of `../harness_prompts/*.md`.
- **Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`), a fresh-context
  subagent that has not seen the implementation.
- **Mode:** Claude Code, per-change review. There is no marker.

## Findings

1. **blocking. C6 assumes each adapter has its own slot, but the harness has
   one slot, in `CLAUDE.md`.**
   - `BACKLOG.md:113` says "Both adapters' slots carry `premise:` … and the
     three roles". But `AGENTS.md` has no slot.
     `AGENTS.md:65` says "Project rules and the gates table: the project
     slot in `CLAUDE.md`". The ownership map (`PRINCIPLES.md:20`) gives the
     project rules to "`CLAUDE.md`, the project slot". The scaffold fills
     only `CLAUDE.md`'s slot (`tools/scaffold.mjs:525`).
   - `BACKLOG.md:115-116` says "`CLAUDE.md`'s slot has no `design:` line".
     But that one slot is also where OpenCode reads `design:`
     (`AGENTS.md:44`, "A project whose slot records `design: none`", and
     `PRINCIPLES.md:163-164`). Every preset ships both adapters
     (`presets/*.json`).
   - So as written, C6 has two outcomes. It cannot be met, because
     `AGENTS.md` has no slot to carry the fields. Or it is met by removing
     the only place an OpenCode project records its design policy. The
     second passes the text while breaking OpenCode's `design: none`.
   - D5 (`BACKLOG.md:67`) carries the same wording, "`CLAUDE.md`'s slot
     drops it", and it is the owner's answer. Choosing among the readings is
     therefore not the reviewer's call.
   - *Fix:*
     - State the reading and put it to the owner if it changes D5's
       recorded text.
     - Read "the slot" as the single project slot in `CLAUDE.md`.
     - Say where `design:` lives when OpenCode is used. For example: the
       slot's `design:` line is marked "OpenCode mode only", and it is
       omitted from a run or an adoption whose roles give Claude mode.
     - Reword C6 to match, so a reviewer can check one concrete text.

2. **blocking. C7's "asks `design` only for OpenCode" has no defined
   trigger.**
   - The scaffold has no mode. `--help` has no mode flag. Every preset
     copies both `AGENTS.md` and `CLAUDE.md`. The design question is always
     asked, labelled "Design stage (OpenCode mode)"
     (`tools/scaffold.mjs:447-455`).
   - C7 (`BACKLOG.md:120-123`) and D5 (`BACKLOG.md:67`) require the
     question only "for OpenCode". Neither says how the scaffold learns the
     mode.
   - D7 (`BACKLOG.md:69`) records the roles "before a mode is chosen". C3
     says "the mode follows the roles" for `ADOPT.md`
     (`BACKLOG.md:99`). No claim says the scaffold chooses a mode, from the
     roles or from a new flag.
   - A candidate could therefore meet C7 in incompatible ways: a new
     `--mode`, a mode derived from `--implementer`, or dropping the
     question. A reviewer cannot tell which one the claim meant.
   - *Fix:* name the trigger in C7, for example "the scaffold derives the
     mode from the roles (Claude implements → Claude mode) and asks
     `design` only when the mode is OpenCode". Name the test that pins it.
     If this adds a mode choice the owner did not decide, record it as the
     implementer's reading or ask the owner.

3. **non-blocking. "Forked" could pass while the fresh-context intent
   fails.**
   - C1 makes the implementer "a forked subagent … briefed from what the
     repository records" (`BACKLOG.md:81-82`). C2 and D11 make "a forked
     subagent" the default way to start a fresh session, "with the handoff
     as its brief" (`BACKLOG.md:91-92`, `BACKLOG.md:73`).
   - In Claude Code, a fork can mean a subagent that inherits the parent's
     conversation. Such a subagent is not a fresh session. It would also
     defeat the context economy that the source gives as the owner's main
     reason (pgn-postmortem *Addendum*, item 8, "WHY").
   - A `CLAUDE.md` that says "forked subagent" meets C1's text either way.
   - *Fix:* in C1 and C2, define the term once. For example: "a new
     subagent that starts from its brief, not from a copy of the main
     session's conversation". The owner's word "forked" can stay.

4. **non-blocking. C1 could drop two things without failing.**
   - CLAUDE.md's external-process reviewer (`CLAUDE.md:15-18`) is not
     mentioned. A rewrite of *The process* that drops it would still meet
     C1.
   - The source's step that sends findings back to the same implementer,
     resumed, is also absent (pgn-postmortem *Addendum*, item 8). C1 names
     only the resumed reviewer.
   - *Fix:* add a clause to C1: "the external-process reviewer remains an
     option, and findings return to the same implementer". Or list both
     under *Not in r6* if they are meant to go.

5. **non-blocking. C2 is loose in two places.**
   - It says the owner's part "is the go-ahead, the owner decisions, the
     merge and playing the result" (`BACKLOG.md:88-90`). That would also
     remove `PLAN.md:48`, "File what you find", which no decision drops.
   - The paste-prompt rule ("only for work in another repository or by
     another model", `BACKLOG.md:92-94`) names no file, so "the text" has
     no fixed place to check.
   - *Fix:* write "includes", or list filing defects too. Name the file
     that holds the paste-prompt rule, probably `CLAUDE.md` or
     `PRINCIPLES.md`'s Sessions habit.

6. **non-blocking. "`ROADMAP.md`'s testbed sentences" is not specific
   enough to check.**
   - C6 (`BACKLOG.md:114-115`) does not say which sentences. The source
     names two: "The project exists to exercise the process…"
     (`ROADMAP.md:57`) and "The point is the process…" (`ROADMAP.md:70`).
     The comparison-run line (`ROADMAP.md:80-81`) is testbed-only too, but
     D10 declined changing it.
   - *Fix:* name the two sentences, and say the comparison-run line stays
     as it is.

7. **non-blocking. The range leaves out one commit.**
   - "Where r6 starts" (`BACKLOG.md:24-26`) says the range "opens with PR
     #29 … and the change that lands this section".
   - `git log --first-parent r5..origin/main` also shows `e208762`, "Copy
     the r5 milestone verdict and its completion note", a direct commit of
     `reviews/r5-milestone-01.md`. It is legitimate (`PRINCIPLES.md:278-281`),
     but it falls in `r5..<candidate>`, which the milestone reviewer
     reviews.
   - r5's section listed every opening PR (`BACKLOG.md:192-193`).
   - *Fix:* name `e208762` as the r5 verdict copy that opens the range.

8. **non-blocking. Two items from the *Adoption* candidate are not placed.**
   - `BACKLOG.md:420-422` lists five things to mine: interview first
     (C3), demonstrate once (C5), the handover file (*Not in r6*, D9), the
     PR mechanics, and dry-run outward tooling.
   - The PR mechanics landed in `PRINCIPLES.md` in r5, and the dry-run
     item maps only implicitly to C8. Neither appears in a claim or under
     *Not in r6*.
   - *Fix:* add one line saying where each one went: "the PR mechanics are
     r5's rule, which the rebuilt `ADOPT.md` points to", and "dry-run
     outward tooling is C8 for this repository's own tools".

9. **non-blocking. D4's row reads as a single choice.**
   - `BACKLOG.md:66` says "the owner chose between the scaffold's
     `--github` dry run and the `post-record.mjs` follow-ups".
   - As reported, it was a multi-select. D10 words the same kind of
     question as "chose which of four to take".
   - *Fix:* write "chose which of the two to take".

10. **non-blocking. "Status: proposed" will be stale once this merges.**
    - `BACKLOG.md:9` says "proposed". The owner column already says
      "accepted", and the claims are fixed on landing.
    - r5's status read "decided on …" (`BACKLOG.md:155`).
    - *Fix:* write "decided in conversation on 2026-09-24, recorded
      2026-09-25". Or state that the line is updated in the completion
      note, which is allowed only if that stays non-material.

## Verified

- **Milestone structure.** The section follows `PRINCIPLES.md`
  (*Milestones*, lines 231-238). It has a promise (`BACKLOG.md:15-22`), a
  range, *In r6*, a release step, and a *Not in r6* list
  (`BACKLOG.md:40-56`). Claims C1–C12 each name a proof that can be run or
  read. C3, C4, C5, C8, C9, C10, C11 and C12 are concrete enough to test at
  a candidate. C1, C2, C6 and C7 are subject to the findings above.
- **No r5 text changed.** The diff adds 146 lines above `## Release 5` and
  deletes none (`git diff 05a9b4b..bc51911`, zero `-` lines).
- **Routing.** Everything routed to r6 elsewhere is placed, apart from
  finding 8. I checked the item numbers against the source reports.
  - boar_life items 1 and 5 → C6, item 2 → C4, item 6 → C10, and items 3
    and 4 are declined (D10). Item 6 is at the report's lines 44-47, and
    its items 1-6 are at lines 18-47.
  - pgn-postmortem items 1 → C3/C7, 2 → C6/C7, 3 → C4, and 5 → C11. Item 4
    was r5's C12. The second version's item 6 → C2, and item 8 → C1 and
    C7. Item 8's suggestions (identity check, `.claude/worktrees/`,
    subagents in the Sessions habit) are each in C1, C7 or C2.
  - The Smaller items are placed: the `--github` dry run → C8, the
    verification pattern → C10, and the `post-record.mjs` follow-ups and
    scratch deletion → *Not in r6*.
  - The Notes are placed: the pin (boar_life (d)) → *Not in r6*, D6, and
    the planner layer → *Not in r6*, r5's D1.
- **Owner decisions against the reported answers.**
  - D1 (both themes), D2 (the default shape with a single-session
    fallback), D3 (yes, as the last step), D5 (OpenCode-only, with the
    reported description), D6 (tag plus a main check), D7 (ADOPT and
    scaffold), D8 (slot field), D9 (no file), and D11 (both files) each
    record the recommended default as "accepted".
  - D4 records the dry run in and the follow-ups out. D10 records the
    never-echo line and planning-is-not-building as taken, and the floor
    path list and comparison-run line as declined. Both say no default was
    offered, and neither claims one.
  - D1's "with the verification pattern" agrees with the earlier routing
    of boar_life item 6 to r6 (`BACKLOG.md:647-648`, `BACKLOG.md:701-704`).
  - `PRINCIPLES.md:121` asks for a recommended default. The honest "none
    offered" is the right record for D4 and D10, and no default should be
    invented after the fact.
  - The evidence named, the owner's merge (`BACKLOG.md:11-13`), is what
    `PRINCIPLES.md:127-130` requires. Before the merge it is pending, not a
    finding.
- **Additions beyond the decisions.** They are not attributed to the owner:
  - the identity check in C1;
  - the `.gitignore` line in C7;
  - C9's regression claim;
  - C5's "the adoption PR itself changes no product code".

  Each comes from a routed source item or restates a current rule.
- **Range and C12.** The range is `r5..<candidate>`, and C12 applies from
  the landing merge on (`BACKLOG.md:27-30`, `BACKLOG.md:144-151`). This
  mirrors r5's handling (`BACKLOG.md:191-198`, and C1/C3). PR #29 is on
  `main` as `e68dca5`, with its completion note `05a9b4b`.
- **The PR body matches the diff.** It has one file with +146. It lists
  claim titles C1–C12 and decisions D1–D11 as in the section, and says "nine
  with a default, D4 and D10 without". It has the four parts, and the
  reviewed revision is "pending", as expected before round 01.
  - Its note on the bootstrap prompts is consistent with a skim: Scopetta's
    "Merge on green", IC2's "one milestone per phase", and
    `TRESSETTE_PROMPT.md` ending mid-sentence at line 166.
- **Wrapping.** No line in `BACKLOG.md:7-151` outside a table exceeds 79
  columns (checked with `awk`).
- **Tests.** `node --test tools/*.test.mjs` gives 43 tests, 43 pass, 0 fail.

— Claude Opus 5.5 (claude-opus-5-5), reviewer
Two blocking findings remain (1 and 2).
