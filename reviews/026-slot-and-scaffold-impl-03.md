# Review: the slot and the scaffold's roles and premise (PR #32), round 03

- **Revision covered:** `ba9e55b63fecfa7ed270e5dd70674b19e1c13627`
  (branch `r6/slot-and-scaffold`, base `main` at
  `b4ec2a93d40cbbb05510f2e650b584631b899a5a`).
- **Files reviewed:** the ten files in the change:
  - `AGENTS.md` (+9 −3), `BACKLOG.md` (+15 −0), `CLAUDE.md` (+19 −2);
  - `PRINCIPLES.md` (+2 −2), `README.md` (+11 −8), `ROADMAP.md` (+7 −4);
  - `reviews/026-slot-and-scaffold-impl-01.md` (+223 −0);
  - `reviews/026-slot-and-scaffold-impl-02.md` (+188 −0);
  - `tools/scaffold.mjs` (+215 −22), `tools/scaffold.test.mjs` (+277 −0).

  I got the list from `gh pr view 32 --json files`, and from
  `git diff --numstat b4ec2a9..ba9e55b`, which gives the same ten with the
  same counts. I re-read the whole change, with `git diff 1126fb6..ba9e55b`
  for what is new since round 02.
- **Target proof:** `git remote get-url origin` is
  `git@github.com:diegoami/harness_template.git`. The PR head from
  `gh api repos/diegoami/harness_template/pulls/32` is `ba9e55b6…`, open,
  with base `main` at `b4ec2a93…`. `git ls-remote origin
  refs/heads/r6/slot-and-scaffold` gives `ba9e55b6…`. The local checkout
  is detached at `ba9e55b6…`, and `git merge-base HEAD origin/main` is
  `b4ec2a93…`. All four agree. Since round 02 the branch has two new
  commits: `1126fb6`, which records round 02, and `ba9e55b`, which answers
  it. `tools/scaffold.mjs` is unchanged since `7f44f53`.
- **Round 02's record:**
  - `1126fb6` holds it, byte for byte the file I wrote.
  - The PR's second comment equals that file.
  - I removed my untracked copy of it before the checkout.
- **Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`), the same reviewer as
  rounds 01 and 02, resumed. It is a fresh-context subagent in its own
  worktree and has not seen the implementation.
- **Mode:** Claude Code, per-change review. There is no marker.

## Findings

1. **non-blocking. `AGENTS.md` still calls the table "the default
   assignment" in a project whose table the scaffold has filled.** This is
   the second bullet of round 02's finding 1.
   - `AGENTS.md:12` says "The table below is the harness's default
     assignment".
   - `AGENTS.md:28-29` says "the table above is the default assignment, and
     the slot holds the current one".
   - In a generated OpenCode run with non-default models, the table holds
     the project's models, not the default. The lines around it say
     plainly that the scaffold writes those models in, and that the slot
     governs. So no reader gets the wrong model. Only the noun is off.
   - **Fix, if wanted:** at `:28-29`, say "the table above is the
     harness's default, or in OpenCode mode a copy of the slot's". It
     need not hold the merge.

## Round 02's findings

1. **Fixed, apart from the wording in finding 1 above.**
   - `AGENTS.md:12-14` now says "in OpenCode mode, the scaffold writes the
     slot's models into it". That matches `tools/scaffold.mjs:708-710`.
   - `AGENTS.md:30-31` asks for the table to be updated only in OpenCode
     mode.
   - `README.md:49` says that the slot holds the current assignment.
   - **The unflagged edit at `README.md:12-16`** is right, and it is in
     scope. It said that OpenCode's implementer and reviewer are those in
     `AGENTS.md`'s table. Round 01's finding 1 moved that to the slot, so
     leaving the old line would have been one more of the descriptions
     that finding 1 names. It now says the slot names them and the table
     holds the default. No new claim.
2. **Fixed.** `CLAUDE.md:84-86` now reads "who, with its model id where one
   is chosen. In Claude mode the default is a model that is not Claude,
   which the owner picks at each milestone". That matches decision (c)
   (`BACKLOG.md:787-801`) and `tools/scaffold.mjs:40-42`. The PR body's
   *Left out* now says the same.
3. **Fixed.**
   - The test at `tools/scaffold.test.mjs:298` gives the reviewer
     "a | b" and asserts the escaped cell `a \| b`.
   - The test at `:318` asserts that a Claude-mode run's `AGENTS.md`
     equals `HEAD:AGENTS.md`. That is the ref the tests generate from.
   - Both of round 02's green breaks are red now (below).

## Verified

- **The target:** the proof above.
- **The gates:**
  - `node --check` passes on all four `tools/*.mjs`.
  - `node --test tools/*.test.mjs`: 60 tests, 60 pass, 0 fail.
- **Generated runs:** each used `--yes --ref ba9e55b… --dir <temp>`,
  never `--github`. The runs were:
  - `light`, `standard` and `auto`;
  - `standard` with `--implementer claude-code --premise testbed`;
  - `standard` with `--implementer opencode`;
  - `auto` with `--implementer opencode --design none`;
  - `light` with `--merge auto`;
  - `standard` with `--implementer opencode --implementer-model
    opencode/kimi-k3`, a reviewer holding a `|`, and `--premise testbed`.

  Every run exited 0. None leaves a `{{…}}` beyond the fifteen that
  `reviews/milestone-prompt.md` lists, and no relative Markdown link
  dangles. No slot line is over 79 columns, the gates table aside.
- **All twelve of my breaks at `ba9e55b` go red on their own test,** in a
  scratch clone:
  - the `--yes` default premise, the interactive default premise and the
    interactive default tool;
  - the role check, which turned the three role-refusal tests red;
  - the backtick refusal;
  - `assignAgents` not called;
  - the signature left unrewritten;
  - the `|` escaping removed (`:298`);
  - the wrap width set to 99;
  - the change reviewer's default no longer following the model;
  - the release reviewer's default set back to DeepSeek;
  - `assignAgents` run in Claude mode too (`:318`).
- **Nothing new is introduced.** The fix commit changes only `AGENTS.md`,
  `CLAUDE.md`, `README.md` and the test file. The two test changes are
  additive.
- **The roles' home, searched again:**
  - `AGENTS.md`, `CLAUDE.md`, `PRINCIPLES.md` and `README.md` agree.
  - Outside the change, `PLAN.md:38-39`'s reviewer column still reads
    "the assignment table". Those template rows are OpenCode rows. In an
    OpenCode project the scaffold makes that table a copy of the slot, so
    they still point to the right reviewer. That is not a defect, and
    `PLAN.md` is not in this change.
- **Line wrapping:** every added Markdown line is at most 79 columns,
  except the `README.md:49` table row, like the rows around it.
- **The PR body:**
  - It matches the diff. The references I checked are right:
    `AGENTS.md:11-14`, `:28-31`, `:50-51` and `:71`; `README.md:12-16` and
    `:49`; `CLAUDE.md:84-86`; the tests at `:298` and `:318`.
  - It has the four parts, and "Reviewed revision: pending".
  - Its *Check output* is at the head.
  - Two stale details, both cosmetic:
    - *Left out* still says "Round 01 was written by the reviewer and
      committed by the main session". Rounds 01 and 02 are both now.
    - The sentence that the roles' home "was searched for" names four
      files, and not `PLAN.md` (above).
- **The ceiling:** this is round 03, and it ends with no blocking finding,
  so it does not go to the owner under *Rounds*.
- **Clean-up:** the temporary directories and the scratch clone were
  deleted. Nothing was posted, committed or pushed.

— Claude Opus 5.5 (claude-opus-5-5), reviewer
No blocking finding remains.

## Completion

Landed by PR #32, merged on 2026-09-25 at 13:55 UTC as `6f8ee88` at the
owner's instruction ("merge #32"), after its last review comment and with
GitGuardian green. The note is non-material and transcribes the evidence
for the done-when items.

- C6: the one project slot, in `CLAUDE.md`, carries `premise:` and the
  three roles, and governs them (the ownership map; `AGENTS.md` defers to
  it). `ROADMAP.md`'s two testbed sentences hold only under
  `premise: testbed`, and its comparison-run line is unchanged. The
  `design:` line is OpenCode-only, and `CLAUDE.md` names shaping plus its
  review as Claude mode's planning gate. The never-echo item describes paths
  outside the repository relative to it (rounds 01–03, *Verified*).
- C7: the scaffold asks the roles and the premise as flags and
  interactively, takes the mode from the implementer's tool, asks `design`
  and writes its line only in OpenCode mode, writes the models into
  `AGENTS.md` in OpenCode mode, and lists `.claude/worktrees/` in a run's
  `.gitignore`. Each of these is pinned by a test that was shown failing
  first. The `merge: auto` wording names the main session in Claude mode
  (PR #31's *Left out*).
- The owner decisions of 2026-09-25 on this PR, recorded in `BACKLOG.md`'s
  *Notes*: Claude Code as the default tool, `product` as the default
  premise, and "a model that is not Claude" as the Claude-mode release
  reviewer. Their evidence is this merge.
- Gates at `ba9e55b`: `node --test tools/*.test.mjs`, 60 of 60 pass;
  `node --check` passes on every `tools/*.mjs`. Eight generated runs,
  without `--github`, exit 0 with no stray `{{…}}`, no dangling link, and
  no slot line over 79 columns.
- Three review rounds. Round 01 had one blocking finding (the roles in two
  homes), fixed in `b2ca6ed`. Rounds 02 and 03 ended clean. Round 02's
  cross-file contradictions were fixed in `ba9e55b`, and round 03's one
  wording finding was left, as the PR body says. `95991d5` only adds round
  03's record.

— Implementer (Claude Opus 5.5)
