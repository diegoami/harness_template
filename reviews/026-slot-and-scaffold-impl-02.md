# Review: the slot and the scaffold's roles and premise (PR #32), round 02

- **Revision covered:** `7f44f53a108a17729ae58921da460f23baffd2a4`
  (branch `r6/slot-and-scaffold`, base `main` at
  `b4ec2a93d40cbbb05510f2e650b584631b899a5a`).
- **Files reviewed:** the nine files in the change:
  - `AGENTS.md` (+6 −2), `BACKLOG.md` (+15 −0), `CLAUDE.md` (+18 −2);
  - `PRINCIPLES.md` (+2 −2), `README.md` (+5 −3), `ROADMAP.md` (+7 −4);
  - `reviews/026-slot-and-scaffold-impl-01.md` (+223 −0);
  - `tools/scaffold.mjs` (+215 −22), `tools/scaffold.test.mjs` (+265 −0).

  I got the list from `gh pr view 32 --json files`, and from
  `git diff --numstat b4ec2a9..7f44f53`, which gives the same nine with the
  same counts. I re-read the whole change, with `git diff ad1aba5..7f44f53`
  for what is new since round 01.
- **Target proof:** `git remote get-url origin` is
  `git@github.com:diegoami/harness_template.git`. The PR head from
  `gh api repos/diegoami/harness_template/pulls/32` is `7f44f53a…`, open,
  with base `main` at `b4ec2a93…`. `git ls-remote origin
  refs/heads/r6/slot-and-scaffold` gives `7f44f53a…`. The local checkout
  is detached at `7f44f53a…`, and `git merge-base HEAD origin/main` is
  `b4ec2a93…`. All four agree. Since round 01 the branch has four new
  commits: `c065727`, `b2ca6ed`, `0a7097b` and `7f44f53`.
- **Round 01's record:**
  - `c065727` holds it, byte for byte the file I wrote.
  - The PR's only comment equals that file.
  - I removed my untracked copy of it before the checkout.
- **Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`), the same reviewer as
  round 01, resumed. It is a fresh-context subagent in its own worktree
  and has not seen the implementation.
- **Mode:** Claude Code, per-change review. There is no marker.

## Findings

1. **non-blocking. `AGENTS.md` now describes its table in three ways, and
   one of them is false in a Claude-mode run.**
   - `AGENTS.md:11-13` says "the scaffold writes the slot's models into
     it". The scaffold does that only in OpenCode mode
     (`tools/scaffold.mjs:708-710`). A generated Claude-mode run still has
     DeepSeek and GPT-5.6 Luna in the table, while its slot names Claude
     Code and `claude-opus-5-5`. The PR's *Left out* says this is so, but
     the file's own sentence does not.
   - Once the scaffold has written the project's models, "the harness's
     default assignment" no longer describes the table.
   - `AGENTS.md:27-28` still calls it "the current assignment, not the
     rule".
   - `README.md:48` still calls `AGENTS.md` the home of "the current
     implementer/reviewer assignment".
   - The slot governs, so no run is ambiguous. The words just disagree
     with each other.
   - **Fix:** say "in OpenCode mode, the scaffold writes…" at `:12-13`.
     Make `:27` and `README.md:48` say that the slot holds a project's
     assignment and the table mirrors it in OpenCode mode.

2. **non-blocking. The slot template still asks for a model id that
   decision (c) leaves out.**
   - `CLAUDE.md:84-85` says "**reviewer of releases:** who, with its model
     id".
   - The Claude-mode default that the owner chose names no model: "a model
     that is not Claude, for example Codex or DeepSeek; the owner picks one
     at each milestone" (`tools/scaffold.mjs:40-42`). So a default
     generated slot does not follow its own template.
   - The PR body's *Left out* repeats "who, with its model id" for both
     reviewers.
   - **Fix:** add to the template line "or how the owner picks one at each
     milestone", and change the *Left out* sentence to match.

3. **non-blocking. Two new behaviours are still unpinned.** I broke each
   one in a scratch clone at `7f44f53`, and the suite stayed green, 29 of
   29:
   - The escaping of `|` in the reviewer cell
     (`tools/scaffold.mjs:414`, `text.replaceAll("|", "\\|")`) was removed.
     A reviewer with a `|` would then break the generated table.
   - `assignAgents` was run in Claude mode too
     (`tools/scaffold.mjs:708`, `tool === "opencode"` made `true`). A
     Claude-mode run's `AGENTS.md` would then change, and no test says it
     must not, or that it must.
   - **Fix:** in the test at `tools/scaffold.test.mjs:298`, give
     `--reviewer` a `|` and assert the escaped cell. Add an assertion that
     a Claude-mode run's `AGENTS.md` equals the ref's, or whatever
     finding 1's wording settles.

## Round 01's findings

1. **Fixed.** The roles have one home, the slot:
   - The ownership map gives the slot "premise, the roles (who implements,
     who reviews each change, who reviews releases)" (`PRINCIPLES.md:20`).
     It gives `AGENTS.md` "the roles' duties, the default assignment
     table" (`:18`).
   - `AGENTS.md:11-13` says the slot governs.
   - In OpenCode mode, `assignAgents` (`tools/scaffold.mjs:413-427`)
     rewrites the two table rows and the implementer signature. It
     replaces with a function, so a `$` in a model id is not expanded. It
     is called before anything is written, and refuses a ref whose
     `AGENTS.md` lacks a row.
   - Reproduced with `--implementer-model opencode/kimi-k3 --reviewer
     "Claude, \`claude-opus-5-5\`, a | b"`: the generated `AGENTS.md` names
     only those models, with the `|` escaped, and the slot agrees.
   - It also works with `--ref r3`, `r4` and `r5` in OpenCode mode.
   - The wording left over is finding 1 above.
2. **Fixed.** `wrapItem` (`tools/scaffold.mjs:300-315`) wraps the premise
   and the three role items. The `testbed` line is now two lines. The test
   at `tools/scaffold.test.mjs:223` covers both premises and both tools.
3. **Fixed.** The Claude-mode change reviewer defaults to "a fresh
   subagent, `<the implementer's model>`" (`tools/scaffold.mjs:38`), and
   `--implementer-model claude-other-9` carries over (test `:241`).
4. **Fixed.** Each of my five round-01 breaks now goes red on its own
   test (`:241`, `:268`, `:280-296`).
5. **Fixed.** `README.md:69` says "before the policy".

## The owner's decisions (`BACKLOG.md:787-801`)

- **The form fits *Owner decisions*.** Each of (a), (b) and (c) has a
  reason and the alternative that was offered, and "Each is the recommended
  default, taken". The record names its evidence: "the owner's merge of PR
  #32". That is the evidence *Owner decisions* names for a decision a pull
  request records, where the owner merges.
- The entry follows the form of the *Notes* entries before it, for
  example the PR #27 entry at `:775-786`.
- I cannot check that the reasons are word for word what the owner was
  shown. Their evidence is the merge, so until the merge they are pending,
  not a finding.
- **The code matches:**
  - (a) is the Claude Code default (`tools/scaffold.mjs:571-575`), pinned
    at `:241` and `:268`;
  - (b) is the `product` default (`:566-570`), pinned at the same two
    tests;
  - (c) is the exact wording at `:40-42`, pinned at `:241`.
- Neither decision reopens C7's clause that the mode's derivation is the
  implementer's reading. (a) sets only the default tool.
- (c) agrees with *Milestones*, which accepts any model that is not
  Claude for a Claude-mode range.
- In OpenCode mode, the default reviewer of releases is Claude. The PR
  body labels that as the implementer's reading, and it meets
  *Milestones*.

## Verified

- **The target:** the proof above.
- **The gates:**
  - `node --check` passes on all four `tools/*.mjs`.
  - `node --test tools/*.test.mjs`: 59 tests, 59 pass, 0 fail.
- **Generated runs:** each used `--yes --ref 7f44f53… --dir <temp>`,
  never `--github`. The runs were:
  - `light`, `standard` and `auto`;
  - `standard` with `--implementer claude-code --premise testbed`;
  - `standard` with `--implementer opencode`;
  - `auto` with `--implementer opencode --design none`;
  - `light` with `--merge auto`;
  - the non-default OpenCode run above.

  Every run exited 0. None leaves a `{{…}}` beyond the fifteen that
  `reviews/milestone-prompt.md` lists, and no relative Markdown link
  dangles. No slot line is over 79 columns, the gates table aside.
- **My breaks at `7f44f53`, each red on its own test:**
  - the `--yes` default premise, the interactive default premise and the
    interactive default tool changed;
  - the role check removed, which turned the three role-refusal tests
    red;
  - the backtick refusal removed;
  - `assignAgents` not called;
  - the signature left unrewritten;
  - the wrap width set to 99;
  - the change reviewer's default no longer following the model;
  - the release reviewer's default set back to DeepSeek.

  The two breaks that stayed green are finding 3.
- **The fixes introduce nothing else I could find:**
  - `wrapItem` keeps an over-long word whole.
  - `role` still rejects an empty, blank or multi-line value.
  - The refusal paths all run before `mkdirSync`.
- **Scope:** `ADOPT.md`, the `--github` path, `verification/README.md`,
  the habits and the claims in `BACKLOG.md` are untouched. `BACKLOG.md`
  gains only the *Notes* entry. *Not in r6* is respected.
- **Line wrapping:** every added Markdown line is at most 79 columns,
  except table rows in `PRINCIPLES.md` and `README.md`, as before.
- **The PR body:**
  - It matches the diff. The line references I checked are right:
    `AGENTS.md:11-13`, `:27-28` and `:69`; `tools/scaffold.mjs:38`,
    `:300-315`, `:413-427` and `:708-710`; `BACKLOG.md:787-801`.
  - It has the four parts, and "Reviewed revision: pending".
  - One line in *Check output* is over 79 columns (the one ending "is
    shown as"). The fix is cosmetic.
- **Clean-up:** the temporary directories and the scratch clone were
  deleted. Nothing was posted, committed or pushed.

— Claude Opus 5.5 (claude-opus-5-5), reviewer
No blocking finding remains.
