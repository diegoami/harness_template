# Review: the `ADOPT.md` rebuild (PR #33), round 02

- **Revision covered:** `2c904d782a84aa04a8a4a5e63a88bb5807034bea`
  (branch `r6/adopt-rebuild`, base `main` at
  `1829302cddac5e5ad102ff5458dd5c74310ff150`).
- **Files reviewed:** `ADOPT.md` (+301 −105 from the base) and
  `reviews/027-adopt-rebuild-impl-01.md` (+271 −0), the two files in the
  change. I got the list from `gh pr view 33 --json files`, and from
  `git diff --stat 1829302..2c904d7`, which gives the same two with the
  same counts. The round-01 file at `2c904d7` is byte-identical to the
  one I wrote. The fix commit, `670297d..2c904d7`, changes `ADOPT.md`
  only (+110 −72).
- **Target proof:** `git remote get-url origin` is
  `git@github.com:diegoami/harness_template.git`. The PR head from
  `gh api repos/diegoami/harness_template/pulls/33` is `2c904d78…`, open,
  with base `main` at `1829302c…`. `git ls-remote origin
  refs/heads/r6/adopt-rebuild` gives `2c904d78…`. The local checkout is
  detached at `2c904d78…`; `git merge-base HEAD origin/main` is
  `1829302c…`, which is also `origin/main`. All four agree. The branch
  holds three commits, `4d7c477`, `670297d` and `2c904d7`. The PR has one
  comment, the round-01 review.
- **Read for context, not in the change:** the same files as round 01,
  re-read where the fix touches them: `PRINCIPLES.md` (*The six gates
  disciplines*, *Sessions and handoff*), `CLAUDE.md` (*The process*),
  `presets/*.json` at `origin/main`, and the current PR body.
- **Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`), the round-01
  reviewer, resumed. It has not seen the implementation.
- **Mode:** Claude Code, per-change review. There is no marker.

## Findings

1. **blocking — an existing `PRINCIPLES.md` is not a collision.**
   `ADOPT.md:125-127` lists the collisions, and `ADOPT.md:220-228`
   reconciles them. Neither names `PRINCIPLES.md`,
   `verification/README.md`, `reviews/README.md` or
   `design/README.md`. Yet step 6 writes every one of them
   (`ADOPT.md:202-210`). The walk found a real case. `Scopetta` has its
   own 150-line `PRINCIPLES.md`, with its own non-trivial floor, *Read
   this much* and *Sessions and handoff*. Followed as written, step 6.1
   overwrites it from the tag. No step notes it as a collision, and no
   step puts it in the report. That breaks the text's own "nothing is
   lost" (`ADOPT.md:220`), and C5's "every collision". Round 01 missed
   it: `Tressette`, the round-01 walk, has no `PRINCIPLES.md`. *Fix:* in
   step 3.11, a collision is "any file or directory step 6 would write
   that already exists, and any review process already in use". In step
   6.6, add a bullet: an existing `PRINCIPLES.md` (or another harness
   file) has its project knowledge moved into the slot, its process text
   is replaced by the harness file, and every move is noted.

2. **non-blocking — in Claude mode, step 7.2 does not say that the
   implementer stops.** `ADOPT.md:241-246` sends a gate that is red on
   both branches to the owner "before step 8". The implementer does
   steps 7 and 8.1 (`ADOPT.md:48`). That the main session raises the
   decision follows only from "everything that faces the owner"
   (`ADOPT.md:45`). Step 7.2 does not say that the implementer stops
   before 8.1. Also, "reviewed like any change" (`ADOPT.md:245-246`)
   comes before the harness is adopted, and does not say under which
   process. *Fix:* add to 7.2: "In Claude mode, the implementer stops
   there and reports; the main session asks the owner." Say that the
   fix-first change is reviewed by the roles already answered in step 4.

3. **non-blocking — the prompt's fetch has no `-C`.** `ADOPT.md:6`
   says "Run `git fetch origin --tags` there". The session runs in the
   project, so a literal run fetches the project's `origin`. The harness
   clone's `origin/main` then stays stale, and line 8 reads a stale
   `ADOPT.md`. Line 8 already uses `-C`. *Fix:*
   `git -C C:\Users\diego\projects\harness_template fetch origin --tags`.

4. **non-blocking — the stop at step 4.2 loses the roles answer.**
   `ADOPT.md:152-154` sends the owner to paste "the same prompt" into the
   other tool. That session starts again at step 1 and asks the roles
   again. The first answer lives only in a conversation it cannot see
   (*Durable facts belong in the repository*). *Fix:* the stop gives the
   owner the prompt plus the roles as answered, so the new session asks
   them only to confirm.

5. **non-blocking — a count in the PR body.** The dry walk says the
   unfiltered diff shows "11 added review files". `git diff
   --name-status r5..origin/main` shows 12 added files, all under
   `reviews/`: 11 implementation reviews and
   `reviews/r5-milestone-01.md`. The conclusion is not affected, since
   none is a shipped file. It concerns `ADOPT.md:72-77`, the step the
   walk ran. *Fix:* "12 added review files".

## Verified

- **Round 01's findings are fixed:**
  1. A red gate. `ADOPT.md:241-248` cites discipline 2. It runs a red
     gate on the default branch too, sends one red on both branches to
     the owner with a fix-first default, and fixes one red only here in
     the adoption PR. Step 8.4 and the done-when require every gate
     green (`:266`, `:307-308`). Fixed; finding 2 is a clarification.
  2. The division of work. *Who does which step* (`:41-50`) and step 5
     (`:187-192`) say it: the main session does steps 1–5 and everything
     that faces the owner. The implementer's brief starts at step 6,
     after the identity check. It creates the branch in its own
     worktree, does 6, 7 and 8.1, and stops. Fixed.
  3. Mode-dependent questions. The roles are asked alone, and the
     session waits (`:135-151`). A tool mismatch stops the session
     before any write (`:152-154`). `design:` is asked afterwards, only
     in OpenCode mode (`:161-163`). Fixed.
  4. New files on `main`. The unfiltered `--name-status` (`:72-73`)
     sees them, and the shipped-file filter (`:74-82`) keeps them.
     Fixed.
  5. The default for what is taken. Step 2 marks what this file relies
     on (`:85-87`), and the default takes it (`:166-167`). In the walk,
     PRs #31 and #32 are marked. Fixed.
  6. Which `ADOPT.md` is read. The prompt reads `origin/main:ADOPT.md`
     (`:5-9`), and the rule at `:34-37` covers every harness file.
     Fixed; finding 3 is a gap in the prompt's first command.
  7. "Taken whole". Each file comes from one revision, the item comes
     complete, and then the file is adapted (`:202-206`). Fixed.
  8. The `.gitignore` line. It goes in every mode, as the scaffold does
     (`:218-219`). Fixed.
  9. A trivial first change. The candidate is non-trivial (`:177-181`),
     and so is the done-when (`:309-310`). Fixed.
  10. Posting. The design record is posted per *Posting* (`:195-196`).
      Fixed.
  11. The PR body. It now has *Readings that change what an adopter may
      do*, with the three readings and their reasons. Fixed.
- **C3, C4 and C5,** re-checked literally at `2c904d7`, still hold:
  - C3: the steps are numbered. The roles, then the premise, `merge:`
    and `design:` in OpenCode mode only, are asked as owner decisions
    with defaults (`:131-176`). They come before step 5, the first that
    writes, and are recorded in the slot (`:211-214`). The mode follows
    the roles (`:147-149`).
  - C4: the tag is named (`:5`, `:21`) and its commit recorded (`:61`).
    `main` is listed beyond the tag (`:69-88`), the owner is asked
    (`:164-167`), and the provenance is recorded (`:229-232`).
  - C5: the done-when has the non-trivial first change through the loop
    (`:309-310`). No product code is changed (`:233`, `:307`). The report
    has its four parts (`:286-292`).
- **Nothing contradicts *Not in r6*, and the new text restates nothing.**
  *Who does which step* points to `CLAUDE.md` for the shape and adds
  only the step split. Step 7.2 points to discipline 2 rather than
  stating an exception. Nothing else new was introduced, apart from
  findings 1–4, and finding 1 is old text that round 01 missed.
- **The four readings.** All four are accepted, and none needs an owner
  decision:
  - **`origin/main`, not local `main`.** After the fetch, it is the
    remote's state whatever the clone has checked out, which is what C4
    asks.
  - **"Shipped files" means the tag's files plus what a preset lists on
    `origin/main`.** The presets are the harness's own list of what a
    project receives, and the scaffold copies from them. A new file that
    no preset lists is not shipped.
  - **The default-branch run happens outside the owner's checkout.** In
    Claude mode, the implementer's own worktree can check out the
    default branch detached. This keeps the owner's uncommitted changes
    untouched.
  - **The main session raises step 7.2's owner decision.** This follows
    from `:44-45`. Finding 2 asks for it to be said at step 7.2.
- **Step 2 at `2c904d7`, reproduced:**
  - `r5^{commit}` is `f22685d8…`, and `origin/main` is `1829302c…`.
  - `--name-status r5..origin/main` gives 9 `M`: 7 Markdown files, and
    `tools/scaffold.mjs` and `tools/scaffold.test.mjs`.
  - It also gives 12 `A`, all under `reviews/`.
  - The shipped files among them are `AGENTS.md`, `CLAUDE.md`, `PLAN.md`,
    `PRINCIPLES.md` and `ROADMAP.md`. They come from the tag's list, and
    from `presets/{light,standard,auto}.json` at `origin/main`.
  - The first-parent log over them gives PRs #32 and #31.
- **The dry walk,** read-only, against `Scopetta`. It is a different
  project from round 01's `Tressette`. Nothing there was changed, and no
  secret-looking file was opened.
  - **Step 3.**
    - The origin is `diegoami/Scopetta`, the default branch `main`
      (`origin/HEAD`), and the tree is clean.
    - The checkout is on a feature branch, `start-download-link`. Step 5
      branches from the default branch, so that is handled.
    - The newest tag is `v1.0.1`.
    - The gates are `npm test`, `npm run check` and
      `.github/workflows/check.yml`.
    - The never-echo names come from `.gitignore`
      (`mobile/android/keystore.properties`, `*.jks`, `*.keystore`), none
      of them opened.
    - `.claude/` exists, holding `skills/`.
    - The collisions: `AGENTS.md` (221 lines), `CLAUDE.md` (657), a
      2026-line project `PLAN.md`, `.gitignore`, and `PRINCIPLES.md`
      (150), which the text misses (finding 1).
  - **Step 4.** The roles can be asked first. Scopetta's own
    `AGENTS.md` and `CLAUDE.md` are the evidence. The rest can then be
    asked.
  - **Steps 5 to 7.** In Claude mode, the branch is made in the
    implementer's worktree from `main`, and the owner's feature-branch
    checkout is untouched. Step 6.5 appends to Scopetta's `.gitignore`.
    Step 7.2's default-branch run fits in that worktree.
  - No step writes before step 4 is answered.
- **Gates at `2c904d7`:**
  - `node --test tools/*.test.mjs` gives 60 pass, 0 fail.
  - `node --check` passes on all four `tools/*.mjs`.
  - `light`, `standard` and `auto` were each generated with
    `--ref 2c904d782a84aa04a8a4a5e63a88bb5807034bea` into a scratch
    directory, without `--github`. Each exits 0.
  - A walk of each run (8, 10 and 10 files) found 0 `{{…}}` outside
    `reviews/milestone-prompt.md`'s own, and 0 dangling relative links.
  - The temporary directories were deleted.
- **Wrapping.** No line of `ADOPT.md` exceeds 79 columns.
- **The PR body** matches the diff: `ADOPT.md` edited, and the round-01
  file committed by the main session. I spot-checked its line
  references (`:29-31`, `:92-95`, `:133`, `:152-154`, `:155`, `:241-248`,
  `:266`, `:307-310`) and they hold. The one wrong count is finding 5.
- **Clean-up.** Nothing was posted, committed or pushed, and nothing was
  changed in `Scopetta`, `Tressette` or `harness_prompts`. Before the
  checkout, I removed my untracked copy of the round-01 file; it was
  identical to the committed one.

— Claude Opus 5.5 (claude-opus-5-5), reviewer
One blocking finding remains (1).
