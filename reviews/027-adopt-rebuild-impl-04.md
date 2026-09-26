# Review: the `ADOPT.md` rebuild (PR #33), round 04

- **Revision covered:** `81fd35bc243416a125467e608f278cab4d3ac2e4`
  (branch `r6/adopt-rebuild`, base `main` at
  `1829302cddac5e5ad102ff5458dd5c74310ff150`).
- **Files reviewed:** the five files in the change:
  - `ADOPT.md` (+349 −105);
  - `BACKLOG.md` (+10 −0);
  - `reviews/027-adopt-rebuild-impl-01.md` (+271 −0);
  - `reviews/027-adopt-rebuild-impl-02.md` (+208 −0);
  - `reviews/027-adopt-rebuild-impl-03.md` (+211 −0).

  I got the list from `gh pr view 33 --json files`, and from
  `git diff --stat 1829302..81fd35b`, which gives the same five with the
  same counts. The round-03 file at `81fd35b` is byte-identical to the
  one I wrote. The fix commit, `4ca4323..81fd35b`, changes `ADOPT.md`
  and `BACKLOG.md`.
- **Target proof:**
  - `git remote get-url origin` is
    `git@github.com:diegoami/harness_template.git`.
  - The PR head from `gh api repos/diegoami/harness_template/pulls/33`
    is `81fd35bc…`, open, with base `main` at `1829302c…`.
  - `git ls-remote origin refs/heads/r6/adopt-rebuild` gives
    `81fd35bc…`.
  - The local checkout is detached at `81fd35bc…`, and
    `git merge-base HEAD origin/main` is `1829302c…`, which is also
    `origin/main`.

  All four agree. The PR has three comments, the reviews of rounds 01 to
  03.
- **Read for context, not in the change:** the same files as round 01.
  Re-read for this round:
  - `PRINCIPLES.md` (*The ownership map*, *Owner decisions*);
  - `AGENTS.md` and `CLAUDE.md` in full;
  - `BACKLOG.md`'s *Notes* around the new entry;
  - the current PR body.
- **Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`), the reviewer of
  rounds 01 to 03, resumed. It has not seen the implementation.
- **Mode:** Claude Code, per-change review. There is no marker. This is
  round 04, counted on under the ceiling.

## Findings

1. **non-blocking — a kept rule that puts project rules in an adapter
   breaks one done-when clause, and the Scopetta walk misses one
   sentence.** `ADOPT.md:351` still requires that "the adapters carry
   only their mode-specific text". Two lines earlier, `:349-350` accepts
   the gates table "where a rule the owner kept puts it". For `Scopetta`
   that place is `AGENTS.md`, an adapter, so the two clauses cannot both
   hold.

   Kept, that rule also needs `AGENTS.md:7` adapted: "This file adds the
   OpenCode-specific process and nothing else." Step 6.2's rule already
   covers this sentence, as "every sentence in another adopted file that
   states the opposite" (`ADOPT.md:233-234`). But the PR body's Scopetta
   walk lists only `CLAUDE.md:101` and `AGENTS.md:71`, and concludes "no
   two adopted files contradict".

   *Fix:* say "the adapters carry only their mode-specific text, apart
   from the slot and what a rule the owner kept puts there". Add
   `AGENTS.md:7` to the walk. This is not blocking. The neighbouring
   clause states the intent, and the rule itself would catch
   `AGENTS.md:7`.

2. **non-blocking — the review exception covers the first real change,
   but not the adoption PR.** With `Tressette`'s rule kept ("A PR gets no
   review of its own"), the adapted `CLAUDE.md` says a change has no
   review. Step 8.2 then says "Have it reviewed as the mode requires:
   `CLAUDE.md` (*The process*)" (`ADOPT.md:301-303`), which points at the
   file that now says no review. Two places cover only the first real
   change:
   - the exception at step 9.2 (`:318-319`);
   - question 6's warning (`:182-183`).

   The implementer's reading, that the adoption PR is reviewed too, is
   right, and C5 needs it: the done-when has the adoption PR "reviewed,
   posted and merged" (`:355-356`). But the text states it for one of
   the two changes. *Fix:* put the same sentence in step 8.2, and make
   question 6 say "the adoption PR and the first real change are still
   reviewed".

3. **non-blocking — "update the links to it" does not bound the edit.**
   The rename option (`ADOPT.md:244-247`) moves a companion document and
   updates the links to it.
   - In `discola-web`, the links are in `DESKTOP.md` and `ANDROID.md`
     (19 mentions). Those are documents, and editing them is fine.
   - But `ROADMAP.md` is also named in `tools/make_icons.py:53` and
     `netlify.toml:4`, in comments. Editing those runs into "The adoption
     PR changes no product code" (`:272-273`).
   - Leaving a document link unchanged would be worse than a dangling
     link. After the rename, it resolves to the harness's `ROADMAP.md`,
     so step 7.3's link check passes while the link points to the wrong
     file.

   *Fix:* "update every link to it in the project's documents. A mention
   in code or config is listed in the pull request, not edited."

## Verified

- **Round 03's findings are fixed:**
  1. The kept rule (blocking in round 03), by the owner's decision.
     - The harness file that owns a kept rule, and every sentence
       elsewhere that states the opposite, is adapted. The slot's
       conventions record the decision (`ADOPT.md:229-236`).
     - Question 6 says so (`:178-183`).
     - Step 9.3 no longer treats a kept rule as a defect, and changes it
       only by a new owner decision (`:322-325`).
     - The done-when now requires that no two adopted files contradict
       (`:351-353`), instead of "nothing contradicts `PRINCIPLES.md`".

     Fixed. Findings 1 and 2 are wording at the edges.
  2. The `ROADMAP.md` option. The third option, a rename for a file of
     another kind, is added (`:244-247`). Fixed; finding 3 bounds it.
  3. "Record it". Step 4.1 now says "take it as the owner's answer; step
     6.4 writes it into the slot" (`:140-141`). Fixed.
- **The owner's decision in `BACKLOG.md:802-811`.** Its form matches the
  neighbouring *Notes* entries:
  - it opens with a bold, dated owner-decision mark;
  - it says where the decision was asked: in conversation, under
    *Rounds*' ceiling;
  - it gives the decision, its reason and the two alternatives;
  - it says "the recommended default, taken";
  - it gives its evidence, the owner's merge of PR #33.

  This is the form *Owner decisions* requires. The evidence is the
  merge, so before the merge the decision is pending, not a finding. The
  entry wraps at 79 columns. Two things in `ADOPT.md` go further than
  the entry's text, both the implementer's reading within its reason:
  adapting the sentences elsewhere, and exempting the first real change
  from a kept no-review rule.
- **The four readings:**
  - **Every sentence elsewhere that states the opposite is adapted.**
    Accepted, and necessary for "no two adopted files contradict". The
    Scopetta walk shows it must reach `AGENTS.md:7` (finding 1).
  - **The adoption PR and the first real change are still reviewed.**
    Accepted, since C5 needs both. The text says it only for the first
    real change (finding 2).
  - **The gates table may sit where a kept rule puts it.** Accepted,
    with the adapter clause fixed (finding 1).
  - **The rename updates links.** Accepted, bounded to documents
    (finding 3).
- **Walk 1,** read-only, against `Tressette`, with "A PR gets no review
  of its own" kept. Nothing was changed.
  - The rule is owned by `CLAUDE.md` (*The process*, `PRINCIPLES.md:19`).
  - These sentences state the opposite, and are adapted by step 6.2:
    - `PRINCIPLES.md:51`, `:149`, `:158-162`, `:175-177`, `:197-200`,
      `:206-208` and `:222`;
    - `CLAUDE.md`'s review bullets (`CLAUDE.md:27-37`).
  - `AGENTS.md` states two stages only for OpenCode mode, so as a
    mode-specific text it does not contradict a Claude-mode rule.
  - `reviews/README.md` still fits the milestone and step-9 records.
  - Once adapted, no two adopted files contradict. Step 8.2 is the one
    gap (finding 2).
- **Walk 2,** read-only, against `Scopetta`, with "the verification
  gates … `AGENTS.md`" kept. Nothing was changed.
  - The rule is owned by `PRINCIPLES.md`'s ownership map, row
    `PRINCIPLES.md:20`.
  - These sentences state the opposite, and are adapted:
    - `CLAUDE.md:101`, the slot's gates-table item;
    - `AGENTS.md:71`, the *Mode-specific pointers*;
    - `AGENTS.md:7`, "nothing else", which the PR body's walk misses
      (finding 1).
  - Discipline 1 (`PRINCIPLES.md:57`) still holds, since there is one
    table.
  - Once adapted, no two adopted files contradict, but the done-when's
    adapter clause fails as written (finding 1).
- **Walk 3,** read-only, against `discola-web`, for the rename option.
  Nothing was changed.
  - Its `ROADMAP.md` is a companion document, so the rename applies.
  - The links to update are in `DESKTOP.md` and `ANDROID.md`.
  - The mentions in code and config are finding 3.
- **Nothing else new was introduced.**
  - The new text restates nothing that `PRINCIPLES.md` or `CLAUDE.md`
    owns.
  - The cross-references hold: 4.2, 6.2, 6.4, 6.5, 9.2 and 9.3.
  - C3, C4 and C5 still hold literally at `81fd35b`, at the line numbers
    the PR body gives: `:132-194` before `:196`; `:5`, `:22`, `:62`,
    `:70-89`, `:171-174`, `:268-271`; `:357-358`, `:272-273`,
    `:327-338`.
  - Nothing in it contradicts *Not in r6*. A project's owner may keep a
    project rule, such as a cross-family review. That is not the harness
    taking one of the five bootstrap-prompt practices.
- **Gates at `81fd35b`:**
  - `node --test tools/*.test.mjs` gives 60 pass, 0 fail.
  - `node --check` passes on all four `tools/*.mjs`.
  - `light`, `standard` and `auto` were each generated with
    `--ref 81fd35bc243416a125467e608f278cab4d3ac2e4` into a scratch
    directory, without `--github`. Each exits 0.
  - A walk of each run (8, 10 and 10 files) found 0 `{{…}}` outside
    `reviews/milestone-prompt.md`'s own, and 0 dangling relative links.
  - The temporary directories were deleted.
- **Wrapping.** No line of `ADOPT.md` exceeds 79 columns, and neither do
  the new lines of `BACKLOG.md` (`:802-811`). Its older wide lines are
  outside this diff.
- **The PR body** matches the diff: `ADOPT.md` and `BACKLOG.md` edited,
  and three review files committed by the main session. I spot-checked
  its line references (`:140-141`, `:178-183`, `:229-236`, `:244-247`,
  `:301-304`, `:318-325`, `:349-353`; `BACKLOG.md:802-811`) and they
  hold. The Scopetta walk's result is overstated (finding 1).
- **Clean-up.** Nothing was posted, committed or pushed, and nothing was
  changed in `Tressette`, `Scopetta`, `discola-web` or
  `harness_prompts`. Before the checkout, I removed my untracked copy of
  the round-03 file; it was identical to the committed one.

— Claude Opus 5.5 (claude-opus-5-5), reviewer
No blocking finding remains.

## Completion

Landed by PR #33, merged by the owner on GitHub on 2026-09-25 at 14:52 UTC
as `83a62ff`, after its last review comment and with GitGuardian green. The
note is non-material and transcribes the evidence for the done-when items.

- C3: `ADOPT.md` states its steps as a numbered sequence. Before any file is
  written, step 4 asks the owner the three roles first, then the premise,
  `merge:`, `design:` in OpenCode mode only, what to take from `main`, and
  each conflicting project rule, as owner decisions with recommended
  defaults. The answers go into the slot, and the mode follows the roles.
- C4: `ADOPT.md` names the release tag. The adopter records the tag's
  commit, lists what the harness's `main` holds beyond it (read from git,
  never the working tree), asks the owner, and records what it took in the
  provenance.
- C5: the done-when includes the first non-trivial real change after the
  adoption PR, reviewed, posted and merged as the slot says. The adoption PR
  changes no product code, and adoption ends with a report to the owner.
- The owner decision of 2026-09-25 on round 03 ("Adapt the harness file"),
  made under the round ceiling, is recorded in `BACKLOG.md`'s *Notes*. Its
  evidence is this merge.
- Gates at `81fd35b`: `node --test tools/*.test.mjs`, 60 of 60 pass;
  `node --check` passes on every `tools/*.mjs`; `light`, `standard` and
  `auto` generate cleanly. Read-only walks against Tressette, Scopetta and
  discola-web changed nothing there.
- Four review rounds. Rounds 01–03 each had blocking findings, and round 03
  went to the owner. Round 04 was clean on `81fd35b`, and its three
  non-blocking findings go to the next r6 text PR, as the PR body says.
  `c7e0499` only adds round 04's record.

— Implementer (Claude Opus 5.5)
