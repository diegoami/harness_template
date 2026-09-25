# Review: the slot and the scaffold's roles and premise (PR #32), round 01

- **Revision covered:** `ad1aba5b63cb1ad1e9d25bbcd3e66696e216fabd`
  (branch `r6/slot-and-scaffold`, base `main` at
  `b4ec2a93d40cbbb05510f2e650b584631b899a5a`).
- **Files reviewed:** `CLAUDE.md` (+18 −2), `README.md` (+5 −3),
  `ROADMAP.md` (+7 −4), `tools/scaffold.mjs` (+163 −22) and
  `tools/scaffold.test.mjs` (+164 −0), the five files in the change. I got
  the list from `gh pr view 32 --json files`, and from
  `git diff --numstat b4ec2a9..ad1aba5`, which gives the same five with the
  same counts.
- **Target proof:** `git remote get-url origin` is
  `git@github.com:diegoami/harness_template.git`. The PR head from
  `gh api repos/diegoami/harness_template/pulls/32` is `ad1aba5b…`, open,
  with base `main` at `b4ec2a93…`. `git ls-remote origin
  refs/heads/r6/slot-and-scaffold` gives `ad1aba5b…`. The local checkout
  is detached at `ad1aba5b…`, and `git merge-base HEAD origin/main` is
  `b4ec2a93…`. All four agree. The branch holds two commits, `1cd3bb0`
  and `ad1aba5`.
- **Read for context, not in the change:** `BACKLOG.md` (*Release 6: scope
  and claims*), `PRINCIPLES.md` in full, `AGENTS.md`, `PLAN.md` (*The
  owner's part*), `ADOPT.md` §3, `presets/*.json`, `reviews/README.md`,
  `docs/sources/boar-life-field-report.md` (items 1 and 5),
  `docs/sources/pgn-postmortem-field-report.md` (items 1 and 2), the PR
  body, and PR #31's *Left out* (`gh pr view 31 --json body`).
- **Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`), a fresh-context
  subagent in its own worktree that has not seen the implementation.
- **Mode:** Claude Code, per-change review. There is no marker.

## Findings

1. **blocking. The roles now have two homes, and a generated OpenCode
   project can contradict itself.**
   - C6 puts the three roles in the slot (`CLAUDE.md:78-85`), and the
     scaffold writes them there (`tools/scaffold.mjs:338-343`, from
     `:544-551`). `AGENTS.md:11-14` still holds its own assignment table,
     and `AGENTS.md:17` its signature, "Implementer (DeepSeek V4.1 Flash)".
     The scaffold copies `AGENTS.md` unchanged.
   - Reproduced at `ad1aba5`: `--yes --implementer opencode
     --implementer-model opencode/kimi-k3 --reviewer "Claude,
     claude-opus-5-5"`. The generated slot says "**implementer:** OpenCode,
     model `opencode/kimi-k3`" and "**reviewer of each change:** Claude,
     claude-opus-5-5". The same run's `AGENTS.md:13-14` says DeepSeek
     implements and GPT-5.6 Luna reviews. An OpenCode session reads its
     roles in `AGENTS.md` (*Roles and the assignment*); nothing tells it
     that the slot governs.
   - The ownership map is authoritative (`PRINCIPLES.md:18`, `:20`, `:27`).
     It gives "roles, assignment table" to `AGENTS.md`, and the slot's row
     names neither the premise nor the roles. A non-owning file "does not
     restate" an idea. `PRINCIPLES.md:27-29` also says a contradiction
     found between files "is recorded as a defect and fixed in the change
     that found it". This PR found it, in its *Left out*, and deferred it.
     So reading 9 does not hold.
   - **Fix:** give the roles one home, in this change.
     - Add the premise and the three roles to the slot's row of the map
       (`PRINCIPLES.md:20`).
     - Make `AGENTS.md`'s table defer to the slot: for example, the
       project's roles are the slot's; the table is the harness's default
       assignment and the invariant stays. Or have the scaffold rewrite
       the two rows and the signature in OpenCode mode.
     - Add a test: an OpenCode run with a non-default model has no
       `AGENTS.md` line that names another implementer.
     If the builder holds that this goes beyond C7, the owner decides
     which file governs. It does not wait for a later item.

2. **non-blocking. The `testbed` premise line is 104 columns wide.**
   `tools/scaffold.mjs:53-54` feeds `:337`. At `ad1aba5`, `--premise
   testbed` generates "- **premise:** testbed — the project exists to
   exercise the process; its content is not the deliverable." on one line.
   Commit `ad1aba5` wrapped the role lines but missed this one. The PR's
   runs all used `product`, so they did not show it. **Fix:** break the
   line after "process;" and indent the rest by two spaces. Add a width
   assertion over the generated slot, for both premises, to the test at
   `tools/scaffold.test.mjs:190`.

3. **non-blocking. The Claude-mode default reviewer of each change has no
   model id.** `tools/scaffold.mjs:38` gives "a fresh Claude Code subagent,
   same family". The slot asks for "who, with its model id"
   (`CLAUDE.md:83`), and the other three defaults carry one. **Fix:** derive
   the default from the implementer's model, for example "a fresh Claude
   Code subagent, `${model}`, same family", so that a changed
   `--implementer-model` carries over. Pin it in a test.

4. **non-blocking. Several new paths have no test. I broke each one in a
   scratch clone, and the suite stayed green.** Each break ran
   `node --test tools/scaffold.test.mjs` and passed 21 of 21:
   - the `--yes` default premise changed to `testbed` (`:525`);
   - the interactive default premise changed to `testbed` (`:524`);
   - the interactive default tool changed to `opencode` (`:529`);
   - the check that a role is one non-empty line removed (`:540-541`), so
     `--reviewer ""` would be written to the slot;
   - the backtick refusal for the model removed (`:545`).
   Readings 1 and 4 rest on these defaults and refusals, so they should be
   pinned. **Fix:** add tests in `tools/scaffold.test.mjs`:
   - a `--yes` run's slot says `**premise:** product`;
   - blank interactive answers give `product` and Claude Code;
   - `--reviewer ""` and ``--implementer-model 'a`b'`` are each refused,
     and the target is not written.
   Show each test red first.

5. **non-blocking. `README.md:69` says the scaffold asks the roles and the
   premise "first".** It asks the name, the directory, the ref, the preset
   and the description first (`tools/scaffold.mjs:496-517`). `--help` says
   it more precisely: "before the policy" (`tools/scaffold.mjs:215`).
   **Fix:** say "before the policy".

## The implementer's readings

1. **Claude Code with `claude-opus-5-5` and `product` as the defaults:**
   held, with no owner decision needed. C7 leaves the mode's derivation
   to the implementer, and no decision fixes the defaults. Claude Code is
   the owner's own practice (pgn-postmortem item 1, "You are claude, you
   are supposed to implement it"). A `testbed` default would recreate the
   mismatch that boar_life item 1 reports. Losing `design:` and
   `design/README.md` from `standard` and `auto` follows from D5, and
   `README.md:66-67`, `--help` and the PR body say so. The defaults are
   unpinned (finding 4).
2. **The default roles:** held. The release reviewers meet *Milestones*:
   DeepSeek is not Claude, and Claude implemented none of an OpenCode
   range, which DeepSeek implements and GPT-5.6 Luna reviews. Leaving the
   roles as free text is right, because `PRINCIPLES.md` owns the family
   rule and the slot points to it. The Claude-mode change reviewer lacks a
   model id (finding 3).
3. **Under `merge: auto`, the main session merges in Claude mode and the
   implementer in OpenCode mode:** held. It matches `CLAUDE.md:19-21`, and
   `AGENTS.md` names no one else. It closes PR #31's *Left out* item. The
   test at `tools/scaffold.test.mjs:308` pins both modes.
4. **`--design` with Claude Code is refused:** held. Refusing what it can
   detect is the scaffold's existing pattern. The refusal comes before any
   write: I moved the check after the writes, and the test at `:232` went
   red on its own assertion. It does break `--yes --design …` without
   `--implementer`, which worked before, and `--help` says so (`:218-219`).
   No owner decision is needed.
5. **The artistic license holds under either premise:** held. The
   boar_life owner decided "license kept" (item 1), and C6 makes only the
   two sentences conditional. `ROADMAP.md:57-60` and `:72-76` keep both
   sentences word for word. The comparison-run line (`:83-84`) is
   unchanged.
6. **A piped answer prints its question:** held. It matches what a TTY
   shows, and only on stdout. I removed the line, and three tests (`:216`,
   `:232`, `:264`) went red.
7. **The preset table in `README.md`:** held, and needed. Without it,
   `README.md` would contradict a default run.
8. **The field names `premise:` and `roles:` with sub-items:** held. C6
   names `premise:` literally and "the three roles" without naming a field.
9. **`AGENTS.md`'s table left out:** not held (finding 1).

## Verified

- **The target:** the proof above.
- **C6, clause by clause:**
  - The slot, one for both modes, carries `premise:` (`CLAUDE.md:75-77`)
    and the three roles (`:78-85`). `AGENTS.md:65` points to the slot.
  - The two testbed sentences say they hold only under `premise: testbed`
    (`ROADMAP.md:57-60`, `:72-76`). The comparison-run line is unchanged.
  - The `design:` line is marked OpenCode-only, and a Claude-mode slot has
    none (`CLAUDE.md:96-97`; generated, `tools/scaffold.mjs:329-335`).
  - The planning gate is shaping plus its fresh-context review
    (`CLAUDE.md:48-50`).
  - The never-echo item says a path outside the repository is described
    relative to it (`CLAUDE.md:92-94`; generated,
    `tools/scaffold.mjs:351-353`).
- **C7, clause by clause:**
  - The flags `--premise`, `--implementer`, `--implementer-model`,
    `--reviewer` and `--milestone-reviewer`, and the questions for them.
  - All of them are written into the slot.
  - The mode comes from the implementer's tool (`TOOLS`, `:29-50`).
  - `design` is asked, and its line written, only in OpenCode mode, and
    `design/README.md` is copied only then.
  - `.gitignore` lists `.claude/worktrees/` and is in the first commit.
  - Each has a test. The tests at `:190`, `:216`, `:232`, `:264` and
    `:283` pass.
- **Interactive and flag parity:** `design` is excluded from `askedFlags`
  unless `--implementer opencode` is given. When the tool is chosen
  interactively, the run is already interactive. When `--design` is
  given, the refusal applies both ways. The role checks run on flag and
  answer alike.
- **The gates:**
  - `node --check` passes on all four `tools/*.mjs`.
  - `node --test tools/*.test.mjs`: 51 tests, 51 pass, 0 fail.
- **Generated runs:** each used `--yes --ref ad1aba5… --dir <temp>`, never
  `--github`. The runs were `light`, `standard` and `auto`; `standard` with
  `--implementer claude-code --premise testbed`; `standard` with
  `--implementer opencode`; `auto` with `--implementer opencode --design
  none`; and `light` with `--merge auto`.
  - Every run exited 0.
  - No run leaves a `{{…}}` beyond the fifteen that
    `reviews/milestone-prompt.md` lists, and no relative Markdown link
    dangles.
  - Only the `testbed` run has a slot line over 79 columns (finding 2).
  - Claude-mode runs have no `design:` line and no `design/README.md`.
  - OpenCode runs have both when `required`, and the line alone when
    `none`.
  - Under `auto`, the slot and the generated README name the main session
    in Claude mode and the implementer in OpenCode mode.
- **My own breaks that went red,** in a scratch clone at `ad1aba5`:
  - the `--design` check moved after the writes (reading 4);
  - the piped echo removed (reading 6);
  - the premise asked after the policy, which turned `:216` and `:264`
    red, because the piped answers are read by position.
- **The implementer's fail-first evidence,** in the PR body, is credible.
- **Scope:** the change leaves `ADOPT.md`, the `--github` path,
  `verification/README.md`, the habits, `presets/*.json` and `BACKLOG.md`
  untouched. *Not in r6* is respected: the floor's path list, the
  comparison-run line, a handover file, and nothing from the bootstrap
  prompts. Under `auto`, an agent merges as *Merge policy* already allows.
  That is not "agents merging" by default.
- **Line wrapping:** every added Markdown line is at most 79 columns,
  except two preset-table rows in `README.md`. Earlier table rows were
  already longer than that. The `--help` lines over 79 columns were
  already there at `b4ec2a9`.
- **The PR body:**
  - It matches the diff, with the four parts and "Reviewed revision:
    pending".
  - One line reference is off by one: the help paragraph is
    `tools/scaffold.mjs:215-219`, not `:216-220`.
  - It lists `AGENTS.md`'s table under *Left out*, which finding 1
    disputes.
- **Clean-up:** the temporary directories and the scratch clone were
  deleted. Nothing was posted, committed or pushed.

— Claude Opus 5.5 (claude-opus-5-5), reviewer
One blocking finding remains (1).
