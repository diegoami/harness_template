# Review: the scaffold's `--test` guard and the rest of C8 (r5, C8, C9), implementation round 01

**Revision reviewed:** `2235ad34163ce3d544a83230b7b556f430bd127c`
(`2235ad3`, branch `r5/scaffold`). Three sources agree on this SHA: PR #22's
`headRefOid` (`gh pr view 22 --json headRefOid,files`),
`git ls-remote origin r5/scaffold`, and `git rev-parse HEAD`. The working
tree was clean.

**Files checked:** PR #22's file list is `CLAUDE.md`, `tools/scaffold.mjs`
and `tools/scaffold.test.mjs`. It equals the local diff:
`git merge-base HEAD origin/main` = `9eda6e9`, then
`git diff --name-only 9eda6e9 HEAD`. There are two commits: `71d6772` (the
tests, first) and `2235ad3` (the tool and `CLAUDE.md`).

**Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`), a fresh-context session
that has not seen the implementation.

**Mode:** Claude. No design stage, no marker.

**Method:** read-only in the repository and on GitHub. I generated runs into
the scratchpad and never passed `--github`. I broke the tool in place and
restored it with `git checkout -- <file>`, with `git status` clean after
each break. I ran the fail-before check in a `--shared` scratch clone. All
of these were deleted afterwards. The only new file in the repository is
this one. Nothing was posted, committed or pushed.

## Findings

1. **blocking — the PowerShell hint is wrong, and the guard never fires
   under Windows PowerShell 5.1.** `tools/scaffold.mjs:102-119` (the comment
   and the refusal) and `:149-150` (`--help`). I ran `node <argv-echo> --test
   …` under PowerShell 5.1.22000 to see what a native program receives:

   | typed in PowerShell 5.1 | what the program receives |
   |---|---|
   | `--test 'node --test "tools/**/*.test.mjs"'` | `node --test tools/**/*.test.mjs` |
   | ``--test "node --test `"tools/**/*.test.mjs`""`` | `node --test tools/**/*.test.mjs` |
   | `--% --test "node --test "tools/**/*.test.mjs""` (the hint, taken literally) | `node --test tools/**/*.test.mjs` |
   | `--test 'node --test "tools/**/*.test.mjs'` (the PR's own unbalanced example) | `node --test tools/**/*.test.mjs` |
   | `--test 'node "x'` | `node x` |
   | `--% --test "node --test \"tools/**/*.test.mjs\""` | `node --test "tools/**/*.test.mjs"` ✔ |
   | `--test 'node --test \"tools/**/*.test.mjs\"'` | `node --test "tools/**/*.test.mjs"` ✔ |

   Windows PowerShell 5.1 hands the program a command line on which the C
   runtime removes every unescaped double quote. So the value always arrives
   with an even count, zero, and the guard passes it. Even the unbalanced
   value from the PR's before/after demonstration is accepted silently when
   it is typed in PowerShell. I ran the stripped default through the tool,
   and it exits 0 and writes `` `node --test tools/**/*.test.mjs` `` into the
   gates table. On CI's bash, an unquoted `**` behaves like `*`. Three texts
   are therefore wrong:
   - the code comment ("PowerShell drops inner double quotes … so it refuses
     it instead"): the guard refuses nothing PowerShell 5.1 produces;
   - the hint: `--%` helps only when the inner quotes are written `\"`, and
     neither the refusal nor `--help` says so;
   - `--help`'s blanket "PowerShell removes inner double quotes": it holds
     for 5.1. PowerShell 7.3+ (`$PSNativeCommandArgumentPassing`) passes
     them intact, which I could not test because `pwsh` is not installed.

   The guard does work where an odd count really arrives: bash, a spawn
   without a shell, and interactive answers. C9's letter is therefore met,
   but the hint, which is the claim's substance, sends the owner's own shell
   to a form that reproduces the damage. **Fix:** give the working
   PowerShell form, `node tools/scaffold.mjs --% --test "node --test
   \"tools/**/*.test.mjs\""`, name the version it applies to, and correct
   the comment to say what the guard can and cannot catch. Consider printing
   the test command in the success summary (`:575-582`), so a stripped value
   is visible before the first commit.

2. **blocking — C8's "`vX.Y.Z` scheme … in its `reviews/README.md`" is not
   shown in a generated run, and the done-when leaves it out.** C8
   (`BACKLOG.md`) requires "its own `vX.Y.Z` scheme in the rule and in its
   `reviews/README.md` (D5, D9)". The rule is met: each generated
   `PRINCIPLES.md:196` reads "(`vX.Y.Z`, or the project's own scheme; …)".
   The generated `reviews/README.md` has only the generic
   `reviews/<tag>-milestone-NN.md` and no `vX.Y.Z`, in all three presets.
   The PR presents itself as finishing "C8's run contents", but its done-when
   paraphrases the item as just "with its own `vX.Y.Z` scheme", which drops
   "in the rule and in its `reviews/README.md`". The C8 test
   (`tools/scaffold.test.mjs:79-91`) checks only the slot line. A milestone
   reviewer who reads C8 literally will grade it PARTLY MET. **Fix, either
   way:**
   - make the run's `reviews/README.md` show the scheme, for example
     `reviews/<tag>-milestone-NN.md` (a run's tag is `vX.Y.Z`, the harness's
     `rN`), and assert it per preset;
   - or have the owner record in C8, dated, that D9's `<tag>` form is what
     "its `vX.Y.Z` scheme in its `reviews/README.md`" means.

   In both cases, the PR's done-when should quote C8 rather than narrow it.

3. **non-blocking — false refusals.** The lookbehind `(?<!\\)"`
   (`tools/scaffold.mjs:106`) is not a shell quote parser:
   - ``echo 'a"b'`` (valid in sh; the `"` is literal inside single quotes)
     is refused;
   - `node -e "a\\"` (valid in sh; `\\` is an escaped backslash, and the
     final `"` closes the string) is refused as unbalanced;
   - `node -e "a\"b"` is accepted, correctly.

   These are rare in a test command, and the refusal is safe, but the
   message tells the user that the shell changed a value that was correct.
   Either scan properly (single-quoted spans, backslash pairs) or soften the
   message to "may have changed".

4. **non-blocking — values the guard lets through that break the output.**
   Each of these exits 0:
   - `--test ""` and `--test "   "` write an empty code span into the gates
     table and, with `--ci yes`, an empty `run:`;
   - a backtick (``echo `date` ``) breaks the code span;
   - `npm test | tee log` splits the table row;
   - U+2028 passes `/[\r\n]/` and lands in the table.

   None of this is in C9's letter. Refusing empty values and escaping `|`
   and backticks in the table cell would be cheap.

5. **non-blocking — the tests do not prove everything their names claim.**
   I broke the tool and ran `node --test tools/scaffold.test.mjs` after each
   break.

   These breaks survived (exit 0, all green):
   - *"every preset names its milestones and plan in the slot"*: the plan
     file is never asserted. The light fallback forced to `` `PLAN.md` ``
     survived, and so did PLAN/ROADMAP precedence swapped;
   - the guard applied only to the flag (`if (args.test !== undefined)`),
     which leaves interactive answers unguarded: no test drives the
     interactive path;
   - "each reviewed before it is created" dropped from the slot line.

   These breaks turned red:
   - the guard moved after the writes (the three refusal tests);
   - "posted" dropped from the `auto` merge conditions;
   - the PowerShell hint dropped from the refusal;
   - "annotated" dropped from the light slot line.

   The PR's nine breaks are real as far as I can tell. **Add:**
   - per-preset plan-file assertions (light TBD, standard and auto
     `PLAN.md`, `--plan no --roadmap yes` gives `ROADMAP.md`);
   - one piped-stdin interactive test of the guard;
   - C8's own checks (no stray `{{…}}`, no dangling link), which today exist
     only as ad-hoc commands in the PR body and should be in the file the
     milestone reviewer re-runs.

6. **non-blocking — the `--ref HEAD` trap.** `tools/scaffold.test.mjs:22`
   runs the working-tree `scaffold.mjs` against the *committed* content. I
   made two uncommitted content breaks and both stayed green:
   - light's preset stops shipping `reviews/milestone-prompt.md`;
   - `CLAUDE.md` loses its slot markers.

   A builder who edits a shipped file or a preset and runs the tests before
   committing gets a false green, which is the silent kind that discipline 3
   warns about. The header says "from the committed HEAD" but not what that
   costs. **Handle it:** have the test fail fast, with "commit first", when
   `git status --porcelain -- presets CLAUDE.md AGENTS.md PRINCIPLES.md PLAN.md
   ROADMAP.md design reviews verification` is not empty, and say in the
   header that the tool comes from the working tree and the content from
   `HEAD`.

   Otherwise the tests are safe. They never pass `--github`, `--ci` defaults
   to no, there is no network, and nothing is read from stdin under `--yes`.
   Every temp directory is removed in `finally`, and I counted zero
   `scaffold-test-*` entries in `os.tmpdir()` after the runs.

7. **non-blocking — the plan-file choice depends on a file the run is told
   it may delete, and light's TBD is not in the first-session list.** For
   presets: light is TBD, standard and auto are `PLAN.md`. With `--plan no
   --roadmap yes` it is `ROADMAP.md`. `PRINCIPLES.md` only asks for "one file
   in the repository", so this ordering is defensible. There are two
   problems:
   - `PLAN.md` opens with "Delete this file if the project does not slice
     work into iterations", and the generated README's first-session step
     repeats that. Deleting it leaves the slot naming a missing file.
     Neither `PLAN.md` nor `ROADMAP.md` has a place for a promise, claims
     and a not-in-release list;
   - in light, the slot carries a second TBD ("TBD — name the one file …"),
     but the README's first session (`tools/scaffold.mjs:288-293`) lists
     only the product TBD.

   The TBD form contains no `{{`, so it passes C8's placeholder check
   (verified). **Suggest:** a README step whenever the plan is TBD, and a
   clause on the `PLAN.md` step: "if you delete it, move the release claims
   and update the slot".

8. **non-blocking — the slot line restates the rule, and not quite
   exactly.** `tools/scaffold.mjs:246-248`, "each reviewed before it is
   created", omits the owner's override on the record (D4, and
   `PRINCIPLES.md`, *The tag waits for the verdict*). The ownership map
   says a non-owning file links and does not restate. **Suggest:** "reviewed
   as `PRINCIPLES.md`, *Milestones*, says", or add the override.

9. **non-blocking — `ADOPT.md` does not know the new slot bullet.** The new
   template bullet (`CLAUDE.md:57-58`) fits the slot template's style and
   order. But `ADOPT.md`'s slot items (§3 *Policy*, and §6 *Done when*: "the
   slot's product, paths, never-echo list, `merge:`, `design:` and gates
   table are filled") do not include `milestones:`, so an adoption would
   leave it as template text. `ADOPT.md` is not in this PR, and its rebuild
   is r6. Record it there, or add the word in the r5 release-step change
   that already touches `ADOPT.md`.

10. **non-blocking — interactive refusal.** An interactive run with a bad
    value is refused only after every question has been answered, and the
    whole run exits instead of asking again. The hint's "answer the
    question interactively" also reads oddly when the user already did. A
    re-ask loop in interactive mode would be kinder.

**Out of scope, flagged (not introduced here):** `--plan no --roadmap yes`
generates a run whose `ROADMAP.md:5` links `PLAN.md`, which is not shipped.
That is one dangling link. The presets are unaffected, and so is C8.

## Verified

- **Gate 0:** the head `2235ad3` is identical across `gh`, `ls-remote` and
  `HEAD`. The file list equals the merge-base diff.
- **Gates at the head:** `node --check` passes on all four `tools/*.mjs`.
  `node --test tools/scaffold.test.mjs` gives 8/8 pass, and
  `node --test tools/post-record.test.mjs` gives 30/30 pass.
- **Fail before:** in a scratch clone at the head with `main`'s
  `scaffold.mjs` (from `9eda6e9`), the new tests give 6 fail and 2 pass. The
  two passing are the acceptance tests (a well-quoted value, an escaped
  quote), which correctly pass on a tool with no guard.
- **C8, each preset** generated with `--yes --ref 2235ad3… --preset <p>
  --name t` into the scratchpad, without `--github`:

  | preset | exit | stray `{{…}}` | dangling links | files |
  |---|---|---|---|---|
  | light | 0 | none | 0 | 7 |
  | standard | 0 | none | 0 | 10 |
  | auto | 0 | none | 0 | 10 |

  The stray check covers everything outside `reviews/milestone-prompt.md`;
  the links were checked with `check-links.mjs`, outside code fences. The
  prompt's placeholders are exactly the 15 it documents. Each run ships the
  milestone rule (`PRINCIPLES.md`, *Milestones*) and
  `reviews/milestone-prompt.md`. The slot's milestones line is present in
  every preset, and so is the `vX.Y.Z` in the rule. The `vX.Y.Z` in
  `reviews/README.md` is missing (finding 2). `auto`'s merge conditions and
  README both say "posted".
- **C9 through the real tool (spawn, no shell):**
  - refused, before anything is written, with the bash and PowerShell hint:
    an unbalanced `"`, `\n`, a lone `\r`, the piped-interactive answer
    `node --test "x`, and `--interactive --test 'a"b'`;
  - accepted: balanced single quotes, `\"`, trailing spaces and a tab;
  - findings 3 and 4 list the rest.
- **Regressions:**
  - every flag at once (`--tag`, `--description`, `--merge auto`,
    `--design none`, `--plan no`, `--roadmap yes`, `--test=` inline,
    `--ci yes`, `--owner`) exits 0, writes the workflow with the test
    command, and names `ROADMAP.md` as the plan;
  - the errors still work: `--ref` with `--tag`, an unknown flag, a bad
    choice, a non-empty target, and an unknown preset;
  - the default ref resolves to `r4`;
  - a piped interactive run with defaults exits 0 with the milestones line
    and the default gates row;
  - `--help` shows the quoting note.
- **Tool breaks:** each break was confirmed to have landed and was restored
  with `git checkout -- tools/scaffold.mjs` (or the content file), and
  `git status` was clean after each. The results are in findings 5 and 6.
- **A reviewer error, repaired:** one piped interactive run passed a POSIX
  path (`/c/Users/…`) on stdin. Git Bash does not convert stdin, so the
  scaffold resolved it to `C:\c\Users\…\rv17\i2` and wrote a run there,
  outside the temp directory. I confirmed that `C:\c` had been created
  seconds earlier by that run and held nothing else, and then deleted it.
  All later runs used scratch paths only.
- **Cleanup:** every scratch run, clone and probe script of mine is deleted.
  `os.tmpdir()` holds no `scaffold-test-*` entries, and the repository's
  `git status` shows only this file.

— Claude Opus 5.5 (claude-opus-5-5), reviewer
Two blocking findings remain (1 and 2).
