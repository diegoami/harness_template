# Review: the `ADOPT.md` rebuild (PR #33), round 01

- **Revision covered:** `4d7c477ea81451b4a1c23ee5eebc0edf5eaf32f8`
  (branch `r6/adopt-rebuild`, base `main` at
  `1829302cddac5e5ad102ff5458dd5c74310ff150`).
- **Files reviewed:** `ADOPT.md` (+259 −101), the one file in the change.
  I got the list from `gh pr view 33 --json files`, and from
  `git diff --stat 1829302..4d7c477`, which gives the same file with the
  same counts.
- **Target proof:** `git remote get-url origin` is
  `git@github.com:diegoami/harness_template.git`. The PR head from
  `gh api repos/diegoami/harness_template/pulls/33` is `4d7c477e…`, open,
  with base `main` at `1829302c…`. `git ls-remote origin
  refs/heads/r6/adopt-rebuild` gives `4d7c477e…`. The local checkout is
  detached at `4d7c477e…`; `git merge-base HEAD origin/main` is
  `1829302c…`, which is also `origin/main`. All four agree. The branch
  holds one commit, `4d7c477`.
- **Read for context, not in the change:** `BACKLOG.md` (*Release 6*, and
  the *Candidates* *Adoption* paragraph with the boar_life and
  pgn-postmortem items), `PRINCIPLES.md` in full, `CLAUDE.md`,
  `AGENTS.md`, `PLAN.md`, `ROADMAP.md`, `README.md`, `reviews/README.md`,
  `presets/*.json`, `tools/scaffold.mjs` (the role defaults and the
  `.gitignore` it writes), `node tools/scaffold.mjs --help`, the old
  `ADOPT.md` (`git show 1829302:ADOPT.md`), the two field reports in
  `docs/sources/`, the six bootstrap prompts (read-only), and the PR body.
- **Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`), a fresh-context
  subagent in its own worktree that has not seen the implementation.
- **Mode:** Claude Code, per-change review. There is no marker.

## Findings

1. **blocking — a red gate is reported, then the PR merges over it.**
   `ADOPT.md:209-210` says a gate red on the adoption branch "was red
   before", and is reported but not fixed in the adoption PR. Step 8
   then merges the PR as the slot says (`ADOPT.md:228`), and step 9
   waits for that merge. `PRINCIPLES.md:59` says "A red gate does not
   merge", with no exception. So the text leads to a merge over a red
   gate, or to a deadlock: the PR cannot merge, and the fix must wait for
   the merge. The claim "was red before" is also an inference. The
   adoption adds Markdown files and a `.gitignore` line, and a lint or
   format gate over the repository can go red on those. That is the
   case the habit *Run old and new side by side* exists for.
   *Fix:* in step 7, run a red gate on the default branch as well. If it
   is red there too, it goes to the owner as an owner decision before
   step 8. Default: fix it first, in its own change, and merge the
   adoption after it. If it is red only on the adoption branch, the
   adoption broke it, and it is fixed in the adoption PR. Either way,
   point to `PRINCIPLES.md` (*The six gates disciplines*) rather than
   state an exception it does not have. This settles the implementer's
   reading 9. It needs no harness-level owner decision, only the
   per-project one above.

2. **blocking — the orchestrated split is not said, and step 5.1 comes
   before the fork.** `ADOPT.md:156-162`: step 5.1 creates the branch.
   Only then does step 5.2 say the main session forks the implementer,
   "whose brief is this file". Read literally, the main session creates
   the branch in the owner's checkout. In the dry walk, that checkout
   holds three uncommitted changes. Yet the implementer works in its own
   worktree (`CLAUDE.md:22-26`). And a forked implementer whose brief is
   "this file", told to "execute it as written" (`ADOPT.md:5-7`), starts
   at step 1. It meets step 4's "stop, and wait for the answers", which a
   subagent cannot do. Nothing says where it stops, or that the review,
   the posting, the merge request, step 9's go and step 10 belong to the
   main session. *Fix:* keep pointing to `CLAUDE.md`, and add one
   sentence to step 5 without restating it. In Claude mode, the
   implementer's brief starts at step 6, after the identity check
   `CLAUDE.md` requires. It creates the step-5.1 branch in its own
   worktree, does steps 6, 7 and 8.1, then stops and reports. The main
   session does the rest as `CLAUDE.md` (*The process*) assigns it.

3. **non-blocking — `design:` depends on an answer not yet given.**
   `ADOPT.md:107-110` puts all questions in one message.
   `ADOPT.md:132-134` asks `design:` "only where the mode is OpenCode".
   But the mode follows the answer to question 1 (`ADOPT.md:123-124`),
   which the owner has not given yet. If the owner changes the default
   implementer to OpenCode, `design:` was never asked, and step 5 has no
   answer. The same answer can also make the implementer a tool other
   than this session's. Step 5 then assumes this session runs a mode
   whose implementer it is not. *Fix:* ask question 4 conditionally in
   the same message ("if the implementer is OpenCode: `required` or
   `none`"). And say that where the chosen implementer's tool is not
   this session's, the session stops before step 5 and gives the owner
   a prompt for that tool. *Sessions and handoff* allows one for work by
   another model.

4. **non-blocking — step 2 cannot see a file that is new on `main`.**
   `ADOPT.md:54-60` limits the log and the stat to "the files of step
   1", the tag's list. A harness file that `main` adds after the tag
   never shows. C4 asks for what `main` holds beyond the tag. *Fix:* add
   `git -C <harness> diff --name-status <tag>..origin/main` without a
   path filter. Then have the adopter keep, from that list, the harness
   files and any new file the harness files link to.

5. **non-blocking — the default for question 5 is unsafe while
   `ADOPT.md` leads its tag.** Until the release step, `ADOPT.md` names
   `r5` (`ADOPT.md:5`, `:19`), but its steps need r6's slot. Step 6.3
   (`ADOPT.md:181-182`) records the roles and the premise. Step 5.2
   (`ADOPT.md:159-162`) relies on the orchestrated shape. `r5`'s
   `CLAUDE.md` has neither: I checked `git show r5:CLAUDE.md`. The
   default "the tag alone" (`ADOPT.md:137-138`) then produces a slot
   with fields that do not exist. Its exception, "fixes a rule this
   project will use", is a judgement an adopter may not apply to PRs #31
   and #32. This recurs at every release, whenever `main`'s `ADOPT.md`
   leads the tag. *Fix:* in step 2.3 or question 5, mark as taken by
   default any item that adds something this file's steps rely on (a
   slot field, the mode's shape), and say why. The orchestrator's choice
   to keep `r5` until the release step is sound, and *Left out* records
   it. This only makes that interval safe.

6. **non-blocking — the paste prompt reads whatever branch the clone has
   checked out.** `ADOPT.md:5-7` reads the file from the clone's working
   tree. The owner's clone is on `r6/adopt-rebuild` right now, so an
   adopter today would execute an unmerged revision. Step 1's fetch
   comes after the file is read. The old text did the same, but C4's
   intent is to know what is taken. *Fix:* the prompt says to run
   `git -C <harness> fetch origin`, then read
   `git -C <harness> show origin/main:ADOPT.md`. The fallback "paste
   this file's content" stays.

7. **non-blocking — "a file is taken whole" reads as "copy it
   verbatim".** `ADOPT.md:173-174` can be read against
   `ADOPT.md:22-23` ("adapt them; do not copy them blind"). It can also
   be read against the edits of steps 6.3 and 6.4, and against adapting
   the conservative floor's paths in `PRINCIPLES.md`, which D10 leaves
   to adopters for r6. *Fix:* "each file comes from one revision, the tag
   or `main`'s recorded commit, never mixed; an item's files come
   together." The implementer's reading 7 is right in substance.

8. **non-blocking — `.gitignore` differs from the scaffold.**
   `ADOPT.md:186-187` adds `.claude/worktrees/` only in Claude mode.
   `tools/scaffold.mjs:739-742` writes it for every run, in either mode.
   And the Sessions habit makes a forked subagent the default in both
   modes (`PRINCIPLES.md:311-313`). *Fix:* add it in every mode, as the
   scaffold does, or say why OpenCode mode differs. Either way, the
   `.gitignore` collision of step 3.11 covers an existing file.

9. **non-blocking — the first real change can be trivial.**
   `ADOPT.md:148-150` defaults to "the smallest real change that runs the
   gates". A trivial change takes no review and needs no pull request
   (`PRINCIPLES.md:51`, `:210`). Yet the done-when needs the change
   "reviewed, posted and merged" (`ADOPT.md:271-272`). An adopter who
   picks a trivial change meets the default's wording but not D3's
   intent, which is to demonstrate the loop. *Fix:* say that the
   candidate is non-trivial (`PRINCIPLES.md`, *What counts as
   non-trivial*), so the loop applies.

10. **non-blocking — step 5.3 drops the design issue.**
    `ADOPT.md:163-167` writes `design/001-adopt-harness.md` and takes it
    to AGREE. It does not say that the record opens as an issue before
    any implementation, with each verdict posted on it
    (`PRINCIPLES.md:194-197`). Step 8.3's pointer to *Posting* comes only
    after the PR is open. The old text said to post it. *Fix:* add
    "posted as `PRINCIPLES.md` says (*Posting*)" to step 5.3.

11. **non-blocking — the PR body omits the readings that change what an
    adopter may do.** The body does not say three things:
    - that the option to drop one adapter was removed
      (`ADOPT.md:175-176`; old `ADOPT.md:60-62`);
    - that `.gitignore` gains a line only in Claude mode
      (`ADOPT.md:186-187`);
    - that the report is conversation-only (`ADOPT.md:245-246`).

    These are the implementer's readings. The owner's merge covers only
    what the body shows (*Durable facts belong in the repository*).
    *Fix:* list them in *What was built* as readings, each with its
    reason.

## Verified

- **C3, literally.** The steps are a numbered sequence
  (`ADOPT.md:37-243`). The questions (step 4, `:105-152`) come before the
  first step that writes a file, step 5 (`:154`). No file is written in
  steps 1 to 3, and the rule is stated at `:27-29`. The questions are put
  as owner decisions with a default and a reason (`:107-109`). They are
  the three roles (`:112-121`), the premise (`:127-128`), `merge:`
  (`:129-131`), and `design:` only in OpenCode mode (`:132-134`, but see
  finding 3). The answers go into the slot (`:179-182`), and the mode
  follows the roles (`:123-124`).
- **C4, literally.** It names the tag (`:5`, `:19`), and names it nowhere
  else; `r6` is due at the release step. It records the tag's commit
  (`:43`). It lists `main` beyond the tag (`:51-64`, but see finding 4).
  It asks the owner (`:135-138`). It records the provenance with what was
  taken (`:197-200`, `:261-262`). It pins no commit (D6).
- **C5, literally.** The done-when has the first real change, reviewed,
  posted and merged as the slot says (`:271-272`). The adoption PR
  changes no product code (`:201-202`, `:269-270`). The report covers
  its four parts (`:248-254`) and is in the done-when (`:273`).
- **D3, D5 as clarified, D6, D7, D8 and D9** are followed. `design:` is
  written only in OpenCode mode (`:182`, `:259-260`). No handover file is
  written (`:245-246`).
- ***Not in r6*.** The handover file, a pinned commit, the floor's path
  list and the comparison-run line are none of them taken. Nor are the
  five bootstrap-prompt practices: the design stage appears only in
  OpenCode mode with `design: required`, the Claude-mode change reviewer
  is same-family, the merge follows `merge:`, milestones are a tag
  scheme, and the review is a file.
- **The routed items and the five *Adoption* themes** land where the PR
  body's tables say. I spot-checked every line reference in those tables
  against the file, and they hold.
- **Restatement.** `ADOPT.md` points to `PRINCIPLES.md`, `CLAUDE.md` and
  `AGENTS.md`. The short glosses at `:123-126` and `:132-134` each carry
  a citation, and C3 needs them in `ADOPT.md`. I found no rule
  contradicted other than finding 1.
- **The implementer's readings.** I accept 1, 2, 4, 6, 8, 10, 11, 12
  and 13 as written, and none needs an owner decision:
  - 1: a fetch writes only the clone's remote refs;
  - 2: running a gate can write build output, and step 7 corrects the
    table and tells the owner;
  - 4: the defaults match the scaffold's `TOOLS` table
    (`tools/scaffold.mjs:31-52`) and `--help`;
  - 6: `PRINCIPLES.md` links `reviews/milestone-prompt.md`, and every
    preset ships it;
  - 8: `PLAN.md` owns the fork-provenance table;
  - 10: this is `PRINCIPLES.md`'s ownership-map rule;
  - 11: this matches C11;
  - 12: this matches D9; the durable facts are in the PR bodies and the
    reviews;
  - 13: this matches the never-echo rule.

  Of the rest:
  - 3 is right, because the slot lives in `CLAUDE.md` for both modes and
    both adapters link each other, but the PR body should say so
    (finding 11);
  - 5 is findings 8 and 11;
  - 7 is finding 7;
  - 9 is finding 1.
- **The dry walk,** read-only, against `Tressette`. Nothing there was
  changed or opened beyond the files named here.
  - **Steps 1 and 2.** `r5^{commit}` is `f22685d8…`, and all nine files
    exist at `r5`. `origin/main` is `1829302c…`. The path-limited
    first-parent log lists PR #32 (`6f8ee88`) and PR #31 (`0942ca4`), and
    the stat is five files, +89 −29. This matches the PR body.
    `git show r5:CLAUDE.md` has no `premise:`, no roles, and
    `design: required` (finding 5).
  - **Step 3.** Every item was found read-only:
    - the origin is `diegoami/Tressette`, the branch `main`, the newest
      tag `v1.0.4`, and there are three uncommitted changes;
    - the gates are `npm test`, `npm run check` and
      `.github/workflows/check.yml`;
    - the never-echo names come from `.gitignore`
      (`mobile/android/keystore.properties`, `*.jks`, `*.keystore`),
      none of them opened;
    - the collisions are `AGENTS.md`, `CLAUDE.md`, a 2085-line project
      `PLAN.md` and `.gitignore`;
    - `.claude/` already exists.
  - **Step 4** can be asked, except the timing in finding 3.
  - **Step 5.1** would switch the owner's checkout, which holds the
    three uncommitted changes (finding 2).
  - **Step 6.** With `PLAN.md` kept, the provenance goes to the slot's
    conventions (`:199-200`), which works.
  - **Step 7.** Tressette's own `CLAUDE.md` also says "a red check does
    not merge", which bears on finding 1.
  - No step writes before step 4 is answered.
- **Gates at `4d7c477`:**
  - `node --test tools/*.test.mjs` gives 60 pass, 0 fail.
  - `node --check` passes on all four `tools/*.mjs`.
  - `light`, `standard` and `auto` were each generated with
    `--ref 4d7c477ea81451b4a1c23ee5eebc0edf5eaf32f8` into a scratch
    directory, without `--github`. Each exits 0.
  - A walk of each run (8, 10 and 10 files) found 0 `{{…}}` outside
    `reviews/milestone-prompt.md`'s own, and 0 dangling relative links.
  - The temporary directories were deleted.
- **Wrapping.** No line of `ADOPT.md` exceeds 79 columns (the old file
  had four), and it has no relative link to check.
- **The PR body** matches the diff: one file, and the line references
  hold. The body leaves out what finding 11 names.
- **Clean-up.** Nothing was posted, committed or pushed, and nothing was
  changed in `Tressette` or `harness_prompts`.

— Claude Opus 5.5 (claude-opus-5-5), reviewer
Two blocking findings remain (1 and 2).
