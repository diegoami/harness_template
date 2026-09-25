# Review: the `ADOPT.md` rebuild (PR #33), round 03

- **Revision covered:** `83883fac31b8b8af890ea0db9c298a8c8d48be07`
  (branch `r6/adopt-rebuild`, base `main` at
  `1829302cddac5e5ad102ff5458dd5c74310ff150`).
- **Files reviewed:** the three files in the change:
  - `ADOPT.md` (+330 −105 from the base);
  - `reviews/027-adopt-rebuild-impl-01.md` (+271 −0);
  - `reviews/027-adopt-rebuild-impl-02.md` (+208 −0).

  I got the list from `gh pr view 33 --json files`, and from
  `git diff --stat 1829302..83883fa`, which gives the same three with
  the same counts. The round-02 file at `83883fa` is byte-identical to
  the one I wrote. The fix commit, `4f054cb..83883fa`, changes
  `ADOPT.md` only (+66 −37).
- **Target proof:**
  - `git remote get-url origin` is
    `git@github.com:diegoami/harness_template.git`.
  - The PR head from `gh api repos/diegoami/harness_template/pulls/33`
    is `83883fac…`, open, with base `main` at `1829302c…`.
  - `git ls-remote origin refs/heads/r6/adopt-rebuild` gives
    `83883fac…`.
  - The local checkout is detached at `83883fac…`, and
    `git merge-base HEAD origin/main` is `1829302c…`, which is also
    `origin/main`.

  All four agree. The branch holds five commits, `4d7c477`, `670297d`,
  `2c904d7`, `4f054cb` and `83883fa`. The PR has two comments, the
  round-01 and round-02 reviews.
- **Read for context, not in the change:** the same files as round 01.
  Re-read for this round: `PRINCIPLES.md` (*The ownership map* and its
  fallback order), `CLAUDE.md` (*The process*, the planning gate) and
  the current PR body.
- **Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`), the round-01 and
  round-02 reviewer, resumed. It has not seen the implementation.
- **Mode:** Claude Code, per-change review. There is no marker. This is
  round 03, so under *Rounds*, a round that does not end clean goes to
  the owner.

## Findings

1. **blocking — "the project's rule kept in the slot's conventions"
   leaves two files contradicting each other.**
   `ADOPT.md:226-228` lets the owner settle a conflict between a project
   rule and a harness rule by keeping the project's rule in the slot's
   conventions. The harness file that states the opposite rule is still
   written in full (6.3, `:242-246`). So the adopted repository holds
   both, and the harness's own rules make that fail three ways:
   - `PRINCIPLES.md:27-31` makes a contradiction between files a defect.
     Its fallback order puts `PRINCIPLES.md` first for the principles
     and the protocol, so a protocol rule "kept" in the slot does not
     hold.
   - The done-when requires that "nothing contradicts `PRINCIPLES.md`"
     (`ADOPT.md:333-334`), which then cannot be met.
   - Step 9.3 (`ADOPT.md:306-308`) tells the first real change to fix
     such a contradiction as a defect. That undoes the owner's decision
     without asking.

   Both walks meet this branch. `Tressette`'s `CLAUDE.md` says "A PR
   gets no review of its own", which the PR body's walk puts to the
   owner as a conflict. `Scopetta` puts its gates in `AGENTS.md`, which
   the body's walk also lists. An owner who keeps either one gets a
   repository that fails its own done-when, and the text says nothing
   about what to do. It is the one outcome of this round's new text that
   does not work.

   *Fix:* where the owner keeps the project's rule, adapt the harness
   file that owns that rule (per `PRINCIPLES.md`'s ownership map) to
   state it. Record the owner's decision and its reason in the slot's
   conventions, so that no two files contradict each other. Or drop that
   option, and offer only the harness rule or a re-scope. Either way,
   say it in the PR body's *Readings* too. Its line on conflicts gives
   only "the owner at step 4, … the harness rule as the default", and
   omits the outcome `ADOPT.md:227-228` offers.

2. **non-blocking — a project's own `ROADMAP.md` that is not a request
   queue has no good option.** `ADOPT.md:232-235` offers two options.
   The project can keep its file and skip the harness one, or move its
   plan into the harness file's shape. `discola-web`'s `ROADMAP.md`
   (296 lines) is a companion document: "roadmap to desktop and
   Android", beside `SPEC.md`. Neither option fits it:
   - Moving it into the request-queue shape would mangle it.
   - Keeping it and skipping the harness file leaves Claude mode's
     planning gate without its home. The gate is shaping as `ROADMAP.md`
     says (`CLAUDE.md:48-50`, and step 9.2 at `ADOPT.md:302-303`).

   *Fix:* add a third option: move the project's file to a name the
   harness does not own, update the links to it, and note the move, then
   take the harness file. Question 5's default could also say that, in
   Claude mode, the planning gate relies on `ROADMAP.md`.

   There is a wider gap: `ROADMAP.md` is optional in `ADOPT.md` and in
   the `light` preset, while `CLAUDE.md` names its shaping as Claude
   mode's gate. That is a harness-wide gap beyond C3–C5. It is flagged
   for `BACKLOG.md`, not for this PR.

3. **non-blocking — "record it" in step 4.1.** `ADOPT.md:140-141` says
   that when the prompt carries the roles, the session will "record it
   and do not ask again". This is under a step whose rule is "Write
   nothing before the answers" (`:136`), and "record" can read as a
   write. *Fix:* "take it as the owner's answer; step 6.4 writes it into
   the slot".

## Verified

- **Round 02's findings are fixed:**
  1. Collisions. Step 3.11 derives them from step 6.1's list, chosen or
     not, plus `.gitignore`, records and a review process
     (`ADOPT.md:126-130`). Step 6.2 reconciles each kind before writing
     (`:215-241`). On `Scopetta`, its `PRINCIPLES.md` is now a
     collision, sorted and never overwritten unread. Fixed, apart from
     the one outcome in finding 1.
  2. Step 7.2 in Claude mode. The implementer stops before 8.1 and
     reports, the main session asks the owner, and the fix-first change
     is reviewed by the step-4 roles (`:271-275`). Fixed.
  3. The fetch. The prompt's fetch carries `-C` (`:7`), and
     `grep -n "git " ADOPT.md | grep -v -- -C` finds nothing. Fixed.
  4. The handover. The stop prints the paste prompt plus the roles as
     answered, with their model ids (`:157-161`). Step 4.1 takes them
     and does not ask again (`:139-141`). Fixed; finding 3 is a wording
     nit.
  5. The count. The PR body now says 12 added files, all under
     `reviews/`, which matches
     `git diff --name-status r5..origin/main`. Fixed.
- **The five readings:**
  - **How a foreign harness-named file is sorted.** Accepted, except
    the "project's rule kept in the slot" outcome (finding 1). Process
    text replaced, project knowledge to the slot, rules the harness
    lacks to the conventions, and the rest to a file the harness does
    not own: this matches the ownership map, and nothing is lost.
  - **The floor's path list goes into the adopted `PRINCIPLES.md`.**
    Accepted. D10 keeps the floor's path list in `PRINCIPLES.md` for r6,
    so it is not moved into the slot and *Not in r6* is respected.
    pgn-postmortem did the same.
  - **The fix-first change is reviewed by the step-4 roles.** Accepted.
    They are the only review arrangement on record before the harness
    lands.
  - **The handover carries the model ids.** Accepted. The owner pastes
    it, so it is the owner's own act, and a prompt for another model is
    allowed by *Sessions and handoff*.
  - **`.gitignore` is created if it is missing.** Accepted. It matches
    the scaffold, and a missing file is not a collision.
- **Nothing else new was introduced,** other than findings 1–3. The
  renumbered cross-references hold: 4.2, 6.1, 6.2, 6.4, 6.5, 8.1 and
  9. The new text restates nothing that `PRINCIPLES.md` or `CLAUDE.md`
  owns, and nothing in it contradicts *Not in r6*.
- **C3, C4 and C5,** re-checked literally at `83883fa`, still hold:
  - C3: the questions (`:132-191`) come before step 5, the first that
    writes (`:193`). The answers go into the slot (`:247-253`), and the
    mode follows the roles (`:152-154`).
  - C4: the tag is named (`:5`, `:22`) and its commit recorded (`:62`).
    `main` is listed beyond the tag (`:70-89`), the owner is asked
    (`:171-174`), and the provenance is recorded (`:256-259`).
  - C5: the done-when has the non-trivial first change through the loop
    (`:338-339`). No product code is changed (`:260-261`, `:336`). The
    report has its four parts (`:315-321`).
- **Walk 1,** read-only, against `Scopetta`. Nothing was changed, and no
  secret-looking file was opened.
  - The checkout is on `start-download-link`, with a clean tree. The
    default branch is `main`.
  - The step-6.1 files that exist: `PRINCIPLES.md` (150 lines: ownership
    map, non-trivial test and floor, the habits, *Read this much*,
    *Sessions and handoff*), `AGENTS.md` (221), `CLAUDE.md` (657),
    `PLAN.md` (2026), and `.gitignore`.
  - Step 6.2 sorts `PRINCIPLES.md` as the PR body says. Its floor paths
    go to the adopted floor, its paths to the slot, and the
    gates-in-`AGENTS.md` rule to the owner (finding 1 if kept).
  - The implementer's worktree branches from `main`.
  - No step writes before step 4 is answered.
- **Walk 2,** read-only, against `discola-web`. Nothing was changed.
  - The origin is `diegoami/discola-web`, the branch `main`, the tree
    clean, and the newest tag `v1.0.5`.
  - The gates are `npm test`, `npm run check`, `npm run verify` and
    `.github/workflows/ci.yml`.
  - The step-6.1 files that exist: `AGENTS.md` (57), `CLAUDE.md` (208:
    a tool-agnostic process, milestones, principles, verification and
    conventions such as "the card size is a budget"), `ROADMAP.md`
    (296, a companion document; finding 2), and `.gitignore` (9).
    There is no `PRINCIPLES.md`, `PLAN.md`, `design/`, `reviews/` or
    `verification/`.
  - Steps 1 to 4 need no write. Step 6.2 sorts `CLAUDE.md`: its process
    text is replaced, and its project rules go to the slot's
    conventions.
- **Steps 1 and 2 on the harness side,** reproduced:
  - `r5^{commit}` is `f22685d8…`, and `origin/main` is `1829302c…`.
  - There are 9 modified files and 12 added, all under `reviews/`.
  - The shipped files are `AGENTS.md`, `CLAUDE.md`, `PLAN.md`,
    `PRINCIPLES.md` and `ROADMAP.md`.
  - PRs #32 and #31 are marked.
- **Gates at `83883fa`:**
  - `node --test tools/*.test.mjs` gives 60 pass, 0 fail.
  - `node --check` passes on all four `tools/*.mjs`.
  - `light`, `standard` and `auto` were each generated with
    `--ref 83883fac31b8b8af890ea0db9c298a8c8d48be07` into a scratch
    directory, without `--github`. Each exits 0.
  - A walk of each run (8, 10 and 10 files) found 0 `{{…}}` outside
    `reviews/milestone-prompt.md`'s own, and 0 dangling relative links.
  - The temporary directories were deleted.
- **Wrapping.** No line of `ADOPT.md` exceeds 79 columns.
- **The PR body** matches the diff: `ADOPT.md` edited, and two review
  files committed by the main session. I spot-checked its line
  references (`:126-130`, `:138-141`, `:157-161`, `:178-180`,
  `:210-214`, `:215-241`, `:254-255`, `:271-275`) and they hold. Its
  *Readings* line on conflicts omits one outcome (finding 1).
- **Clean-up.** Nothing was posted, committed or pushed, and nothing was
  changed in `Scopetta`, `discola-web`, `Tressette` or
  `harness_prompts`. Before the checkout, I removed my untracked copy of
  the round-02 file; it was identical to the committed one.

— Claude Opus 5.5 (claude-opus-5-5), reviewer
One blocking finding remains (1); as round 03, this goes to the owner.
