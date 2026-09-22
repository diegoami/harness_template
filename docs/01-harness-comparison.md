# The four harnesses, compared

**Scope.** The four harnesses that have grown in `discola-web`, `Tressette`,
`Scopetta` and `balloons-JS`. This document is the evidence base for
standardization (release 1). Imperial Conquest 2's more complex model is
deliberately out of scope here and recorded separately in
[`02-ic2-complex-model.md`](02-ic2-complex-model.md).

**Method.** Every harness file was read in full: `AGENTS.md`, `CLAUDE.md`,
`PRINCIPLES.md`, the harness sections of `PLAN.md`, the `ui-check` skills, the
CI workflows, `package.json`, and the tools they gate. Line counts are from
2026-09-22. Claims cite paths; where a claim rests on one project's wording,
that project is named.

---

## 0. The four in one table

| | Discola-web | Tressette | Scopetta | balloons-JS |
|---|---|---|---|---|
| product | Briscola (1997 port) | Tressette | Scopa | balloon popper |
| role in the series | the origin | 2nd | 3rd | parallel, different shape |
| harness files | `AGENTS.md` (46), `CLAUDE.md` (143) | `AGENTS.md` (47), `CLAUDE.md` (20), `PLAN.md` §7 (2028 total) | `AGENTS.md` (198), `CLAUDE.md` (575), `PRINCIPLES.md` (141), `PLAN.md` (2004) | `AGENTS.md` (63), `CLAUDE.md` (178) |
| principles live in | `CLAUDE.md` | `PLAN.md` §7.7 | `PRINCIPLES.md` | `CLAUDE.md` |
| UI check | `check_ui.mjs` (492) | `check_ui.mjs` (1659) | `check_ui.mjs` (3616) | none (browser suite instead) |
| mutation harness | — | — | `break_ui.mjs` (1130) + `break.mjs` (487) | — |
| engine tests | `engine.test.mjs` (163) | `engine.test.mjs` (510), `opponent.test.mjs` (758) | `engine.test.mjs` (1054), `opponent.test.mjs` (652), `release.test.mjs` (173) | `scores.test.mjs` (265), `browser.test.mjs` (5389) |
| UI-check skill | yes (84) | yes (269) | yes (442) | no |
| CI | `ci.yml` + `opencode.yml` | `check.yml` | `check.yml` | none |
| `npm run check` | UI check | UI check | UI check | syntax + module wiring |
| `npm test` | unit tests | unit tests | unit tests | check + scores + browser |

The three card games share a lineage; balloons-JS shares the philosophy and the
two-file split, not the code.

---

## 1. Where each idea lives (ownership)

- **Discola** splits the material once: `AGENTS.md` says it holds the OpenCode
  review process, `CLAUDE.md` holds "the tool-agnostic principles, the
  verification gates and the project rules, with no reviewer-spawning
  mechanism" (`discola-web/AGENTS.md:40-44`). No ownership map, no rule for
  contradictions.
- **Tressette** keeps the thinnest harness files (47 + 20 lines). They are
  pointers: "This is the OpenCode harness… it does not restate them… read
  `PLAN.md` §7.7" (`Tressette/AGENTS.md:5-10`). The shared rules live inside
  the product's plan because the plan was written before the code, and the
  harness stabilized after it.
- **Scopetta** makes ownership explicit. `PRINCIPLES.md` carries an
  authoritative ownership table (principles / process / gates / project rules),
  and "a non-owning file **links** to an idea and does not restate it, so an
  idea lives in one place and cannot drift" (`Scopetta/PRINCIPLES.md:12-26`),
  with a fallback order for sentences that span two owners.
- **balloons-JS** keeps the same two-file split but uses `CLAUDE.md` as the
  repository encyclopedia: a one-source-of-truth table (`public/` vs the
  Android mirror vs generated icons), a never-read/never-echo list,
  big-file guidance, a commands table, and a "Decided, and not to be re-opened"
  section (`balloons-JS/CLAUDE.md:19-49,113-129`).

**Finding.** The drift between the three card games is not in what the rules
say — it is in *where the shared principles live*, and only Scopetta has a
mechanism (the ownership map) that prevents the next drift. A standard must
place the principles in one file and make every other file link to it.

## 2. Roles, models, invocation

All four name the same two roles and the same cross-family rule:

- Implementer: DeepSeek, `opencode/deepseek-v4.1-flash` (Discola/Tressette/
  Scopetta/balloons all name it; Discola and balloons mention the same
  signature convention in prose).
- Reviewer: Luna, `opencode/gpt-5.6-luna` at `#high`, "invoked as a subagent in
  a fresh context and given an explicit model id" (identical wording in all
  four; `Scopetta/AGENTS.md:20-33` adds the invariant: "the invariant is a
  different model family; the ids above are the current assignment").
- Claude Code's reviewer: a fresh-context Claude session, stated by Tressette
  (`CLAUDE.md:12-14`) and Scopetta (`CLAUDE.md:37-45`, including "an owner is
  **not automatically a fresh context** — and is not one if they directed or
  wrote the change"). Discola and balloons do not specify a Claude reviewer.

**Drift already visible.** `discola-web/.github/workflows/opencode.yml:33`
still pins `model: opencode/deepseek-v4-flash`, a version behind every harness
document. Scopetta's rule — "whoever changes an assignment updates the table in
the same change" — is the fix, and the reason the assignment table belongs in
one place.

## 3. Stage structure and unit of work

- **Discola / balloons-JS:** a change takes two stages, or none is defined.
  Design is written as a GitHub issue and reviewed to AGREE; implementation is
  a PR reviewed to AGREE; the owner merges. balloons adds the explicit
  bootstrap: a change to `AGENTS.md`/`CLAUDE.md` is itself opened as a PR and
  reviewed to AGREE (`balloons-JS/AGENTS.md:36-38`).
- **Tressette:** the unit is an **iteration**. "One iteration per session"
  (`PLAN.md §7.1`), each with a "Done when"; one PR per iteration with a
  four-part description; DESIGN issues are "an explicit exception to 'no issue
  per iteration'" (`PLAN.md:1735-1743`). It also fixes the build order and
  effort per iteration in a table (`§7.2`) and names the owner's part (`§7.6`:
  start iterations, answer defaults before iterations 4 and 5, play the game
  after 3 and 5).
- **Scopetta:** the unit is a **change**, and the defect path is explicit: a
  fix may skip the design stage only when it is limited to the recorded defect,
  changes no product behaviour beyond it, changes no check's design, and changes
  no process (`AGENTS.md:65-70`).

**Finding.** Iteration is a plan overlay, not part of the process core: it
suits a project whose whole shape is decided before coding (Tressette's plan
predates the engine). Scopetta's change unit is the portable one; the
iteration overlay is worth keeping as an optional section a plan-driven
project can adopt.

## 4. What needs review: the classification

- **Discola:** no trivial path documented. The process is stated for "a
  change", and the harness bootstrap applies.
- **Tressette:** the most explicit exclusion: "This applies to every OpenCode
  implementation, with no size floor" (`AGENTS.md:36`). Simple, and expensive
  on typos.
- **Scopetta:** the only operational test. A change is non-trivial if it can
  change (a) observable behaviour, (b) what a check measures, (c) the design or
  process a builder must follow — including the harness files and the design
  documents — or (d) player-facing copy. A conservative floor (`public/**`,
  `tools/**`, `.claude/**`, `.github/**`, `mobile/**`, `netlify.toml`,
  `package.json`, `package-lock.json`, the three harness files) is non-trivial
  whether or not the author believes the test is met, unless it is a pure typo
  or comment. A trivial change takes neither stage, may go straight to `main`,
  still runs the gates its diff can affect — and still gets the full CI on
  `main`, which the rule explicitly does not relax (`PRINCIPLES.md:28-66`).
- **balloons-JS:** no classification; bootstrap only.

**Finding.** Scopetta's classification is the one that can be applied without
a judgment call, and its conservative floor is what makes it auditable. The
counter-argument (Tressette) is that classification invites arguing about
classification; the counter-counter is the floor, which removes the argument
for the paths that matter.

## 5. Verdicts: where they live and what they say

- All four post the reviewer's verdict where the work is, signed, through the
  owner's single GitHub account — "the signature line is the only marker of
  authorship" (all four).
- Discola / Tressette / balloons: signature in prose (`— Luna (GPT-5.6,
  high)`).
- Scopetta fixes the exact convention and the mechanics: the final line is
  `— <display name> (<model id with variant>), reviewer`; the verdict is a
  **comment**, never `gh pr review --approve`, because "GitHub forbids
  approving your own pull request under one account"; the stage ends on an
  explicit `AGREE` or `BLOCK` marker in a comment
  (`Scopetta/AGENTS.md:35-50`).

**Finding.** The exact convention is free to adopt and removes ambiguity about
whether a comment is a verdict. A standard should carry it verbatim.

## 6. AGREE: materiality and re-review

Only Scopetta defines what an AGREE covers and what invalidates it
(`AGENTS.md:119-137`): the verdict covers the current revision; any change
after an AGREE invalidates it except commit messages, whitespace, and typos
that change no behaviour, assertion or process text; a material edit to the
issue body always re-opens review; comments that record a verdict, finding,
answer or owner decision are distinguished; an initial verdict comes from a new
reviewer session and a re-review after fixes may continue the same one, because
the separation the gate protects is from the implementer's context; a fallback
reviewer is the designated reviewer for its stage.

The other three say "iterate until AGREE" and leave the boundary to judgment.

**Finding.** This is the single most reusable piece of Scopetta's process:
without it, "AGREE" means whatever the last reader thought it meant.

## 7. Owner decisions

- Discola and balloons state the principle: "Keep reviewer requirements
  separate from **owner decisions**, and put owner decisions to the human with
  a recommended default."
- Tressette records the owner's part in the plan (§7.6).
- Scopetta operationalizes it: a decision that is the owner's — a name, an
  `appId`, a licence, a scope, a default — is recorded on the issue or PR with
  a recommended default and the reason, marked as an owner decision; the
  reviewer may require that it be decided and recorded but "may not reject it
  merely for differing from the reviewer's preference"; if the owner rejects
  the proposal, the issue is withdrawn or re-scoped, receives no AGREE, and is
  not merged around (`AGENTS.md:90-107`).

## 8. Failure handling: BLOCK, fallback, waiver, escalation

- **BLOCK:** identical in all four — not overridden by the implementer, goes to
  the owner, never merged around. Scopetta adds what a BLOCK may require:
  every required change must be necessary to the change as proposed; a separate
  concern is filed as its own issue and linked; if the required changes would
  turn the change into a different, larger one, the implementer may withdraw
  and re-scope with the owner, and any AGREE is invalidated
  (`AGENTS.md:72-80`).
- **Fallback and waiver:** only Scopetta. Failed, cancelled or unavailable
  review is no review and no AGREE; retry or select another reviewer from a
  different family, recorded on the issue or PR; a waiver is an
  implementation-review exception only, and bypassing the design stage is an
  explicit owner amendment, recorded (`AGENTS.md:109-117`).

## 9. Verification: commands, schedules, run counts

The commands converge; the schedules do not.

| | Discola | Tressette | Scopetta | balloons-JS |
|---|---|---|---|---|
| unit tests | `npm test` | `npm test` | `npm test` | `npm test` (check + scores + browser) |
| UI check | `npm run check` | `npm run check` | `npm run check` | `npm run check` is the syntax/wiring check |
| extra | `npm run verify` = check + test | — | `break_ui.mjs`, `break.mjs` when assertions change | `test:scores`, `test:browser`, `playtest` |
| repeat policy | full suite **3×** before pushing primary logic; read the pass COUNT | none stated | engine tests on every push; full UI check only when the **measured-input tree** changed, with the rebase exception (`AGENTS.md:139-176`) | **8×** for anything touching game logic; 1 pass + diff when no `public/`/`netlify/` file moved |
| cost driver | — | — | UI check ≈ 25 min, twelve passes (skill) | browser suite has timing in it; one flake in eight got through twice (`CLAUDE.md:170-174`) |

Scopetta's measured-input tree is the most precise scheduling rule: the
transitive runtime inputs of the UI check, the browser/playwright and workflow
configuration, measured at a push's tip, with "a rebase or a hand-resolved
conflict always re-runs the full UI check" as the one exception. Discola's 3×
and balloons' 8× are the same idea with numbers instead of a tree.

**Finding.** A standard cannot pick one count; it should standardize the
*shape* — (a) what always runs, (b) what runs when its inputs changed, (c) how
many repetitions, justified by the project's failure model (determinism for
engines, timing for browser suites, runtime cost for the UI check) — and require
each project to state its numbers in one gates table.

## 10. The mutation harness

Scopetta is the only one with a mechanized answer to "does this assertion
actually bite":

- `break.mjs` (engine, 487 lines) and `break_ui.mjs` (UI, 1130 lines) apply one
  deliberate defect at a time to a copy, point the check at it, and require
  **the assertion written for that defect** to go red; a break caught only by
  other assertions is a `MISMATCH` and red (`SKILL.md:51-70`).
- `EXPECT` entries name one assertion by a substring of its output line; a
  break whose defect needs two edits passes arrays for find/replace.
- `QUICK=1` trims the viewport grid and "is for proving an assertion bites,
  never for clearing one".
- Evidence: "iteration 4's mutation run caught 126 of 141, and every one of the
  fifteen it did not is the same family: an assertion that was never in a
  position to see its own subject" (`CLAUDE.md:256-259`), with the survivor
  shapes catalogued.
- Assertion removal and threshold retuning have rules: replacement catching the
  same defect, or a recorded reason plus a mutation run naming which remaining
  assertion covers it; a retune needs a second measurement and a re-run against
  the commit that introduced the bug it names (`AGENTS.md:178-191`).

Discola and Tressette have the *habit* ("writing the assertion against the
broken version first", `SKILL.md:81-84` in Discola) and the older-commit
technique (`git show <commit>:public/index.html > .old.html`, then point the
check at it). balloons has neither: its answer to "a passing test is not a
working feature" is to assert what a person would notice and then go play it,
with `playtest.mjs` measuring tuning rather than asserting
(`CLAUDE.md:164-174`).

**Finding.** The mutation harness is the strongest single invention in the
series and the one piece with no substitute: the habit catches the builder who
is looking, and the harness catches the assertion that cannot look. A standard
should require it wherever a UI check exists, with the older-commit technique as
the floor where it does not.

## 11. The UI check and its skill

- All three card games carry `tools/check_ui.mjs` and a `.claude/skills/ui-check/SKILL.md`.
  The skill is the *rationale and failure-reading* document; the tool is the
  mechanism. Discola's skill (84 lines) describes the check it forked; Tressette
  (269) and Scopetta (442) grow it as the defect table grows.
- Each skill carries the same core idea: a table of **assertion → the bug it was
  written for**, because "every threshold is calibrated against a defect that
  actually shipped"; and the same two warnings: "an assertion only sees the
  states the check renders", and "an assertion has to be in a position to see
  its own subject".
- The skills live under `.claude/skills/`, but they are plain markdown read by
  both tools: Claude Code auto-loads them, OpenCode reads them as docs per the
  read/ignore list. This is the existing cross-tool mechanism and the reason the
  template can keep one skill for both.
- balloons-JS has no equivalent; its `test/browser.test.mjs` (5389 lines) is the
  mechanism, with the knowledge living in `CLAUDE.md` and `docs/open-work.md`.

**Finding.** The skill's value is not the instructions — it is the defect
history. A standard should require the skill to be *born with the check* and to
keep the defect table; retrofitting it later loses the story.

## 12. CI

- **Discola:** `ci.yml` — `npm ci`, playwright-core install, `npm test`,
  `python3 tools/make_icons.py --check`, `npm run check`; plus `opencode.yml`,
  the comment-triggered `/oc` GitHub action with a pinned model.
- **Tressette / Scopetta:** two jobs — `engine` (`node --test
  "tools/**/*.test.mjs"`, no install) and `ui` (`npm ci`, `npx playwright-core
  install --with-deps chromium`, `npm run check`). Both filter `push` to `main`
  so a PR does not run the suite twice.
- **balloons-JS:** none. Its gates are local, and its suite is a heavy
  browser test with a fixed port.

**Finding.** The two-job split is the mature shape: the dependency-free engine
job is fast feedback on every commit; the UI job carries the install. A standard
should require CI, and keep the split.

## 13. Environment: read/ignore, secrets, output economy

All four carry the habit rules; they differ by repository shape:

- Discola/Tressette/Scopetta share the read/ignore list (inspect `public/*`,
  `tools/*`, root `*.md`, `.github/workflows/*`, `.claude/skills/*`; ignore
  `node_modules/`, `.git/`, art, `dist-release/`, binaries; never read
  `mobile/android/keystore.properties` or `*.jks`) and "Keep command output
  short" with PowerShell/bash equivalents, plus a three-bullet session handoff.
- balloons-JS has the one-source-of-truth table with the shadow copies
  explained (the Android mirror is written by Gradle; `rg` honors `.gitignore`,
  `grep -r`/`find` do not), a "Never read, never echo" secrets block, "Big
  files" guidance (grep the test name, do not read the 5,389-line suite), and a
  commands table with the ports each command binds.
- balloons also has "Decided, and not to be re-opened": the measured outcome of
  a tuning decision, so a later session does not mistake it for a bug.

**Finding.** These are project-shaped, not philosophy-shaped. A standard
should define the *categories* (what to inspect, what to ignore, what to never
echo, what is decided) and leave the paths and commands to the project — and
should carry balloons' "decided" section, which no other harness has.

## 14. Defects and follow-ups

- **Tressette:** defects found by playing are `defect` issues; each is closed
  by a PR that fixes the page **and adds the assertion that would have caught
  it**, written against the broken commit first (`PLAN.md:1739-1743`).
- **Scopetta:** the same, plus the assertion-removal and retune rules (§10
  above).
- **Discola / balloons:** flag out-of-scope defects rather than fixing them
  silently; balloons adds "if a fix turns out to be four errors where two were
  flagged, fix all four — half a correction is not what anyone wanted".
- **balloons** also records the *open* work in `docs/open-work.md`, including a
  flake seen once and never reproduced, "written down so that a second sighting
  is recognised as the second rather than the first".

## 15. Cross-project provenance

Tressette is the only one with an explicit record: §7.5 "What outlives a
session" keeps a fork table (what was forked, from which Discola commit, by
which iteration) and states "Discola is a moving reference, not a fixed one…
Anything forked from it is a snapshot with a date." Scopetta cites its
ancestors when explaining inherited defects, without a table.

**Finding.** A standard should carry the fork table: for a series of projects
built by forking, the provenance is the difference between "we know why this
looks like that" and archaeology.

## 16. Feature matrix

●  present and complete 　◐  partial or implicit 　—  absent

| | Discola | Tressette | Scopetta | balloons-JS |
|---|---|---|---|---|
| design stage before implementation (OpenCode) | ● | ● | ● | ● |
| implementation PR stage | ● | ● | ● | ● |
| bootstrap self-amendment | ● | ● | ● | ● |
| reviewer: different family, fresh context, explicit model | ● | ● | ● | ● |
| Claude Code reviewer: fresh-context Claude session | ◐ | ● | ● | ◐ |
| verdict signed on GitHub, with convention | ◐ | ◐ | ● | ◐ |
| AGREE materiality / re-review rules | — | — | ● | — |
| reviewer fallback / waiver | — | — | ● | — |
| BLOCK not overridden | ● | ● | ● | ● |
| owner-decision convention | ● | ◐ | ● | ● |
| trivial / non-trivial classification | — | — (explicit no floor) | ● | — |
| iteration as the unit of work (`PLAN.md §7`) | — | ● | — | — |
| verification gates table | ● | ● | ● | ● |
| repeat/run schedule stated | ● 3× | — | ● measured-input tree | ● 8× |
| UI check + skill with defect table | ● | ● | ● | — |
| mutation / break harness | — | — | ● | — |
| CI on every PR | ● | ● | ● | — |
| read/ignore list + output economy | ● | ● | ● | ◐ (different shape) |
| never-echo secrets list | ◐ | ◐ | ◐ | ● |
| session handoff shape | ● | ● | ● | ◐ |
| defect path (issue + assertion) | ◐ | ● | ● | ◐ |
| fork provenance table | — | ● | ◐ | — |
| "decided, not to be re-opened" | — | — | — | ● |

## 17. What each harness is best at

- **Discola** — the complete lifecycle at the smallest ceremony: two files, a
  verified build, release tooling, and the only GitHub-action integration
  (`/oc`). It is the ancestor every other habit cites, and its `CLAUDE.md`
  sentence "This file does not spawn a separate reviewer model" is still the
  cleanest statement of the split by tool.
- **Tressette** — the plan-shaped harness: iterations, a DoD per iteration, the
  model/effort table, the owner's part, and the fork provenance table. It is
  also the only prototype discipline in the series: `FORGETTING.md` is a
  complete experiment record (status, question, method, reproduce commands,
  results, recommendation, review history) for a branch that was deliberately
  never merged — the pattern every later "try an approach" experiment can reuse.
- **Scopetta** — the governance depth: ownership map, non-trivial test with a
  conservative floor, measured-input tree, AGREE materiality, fallback/waiver,
  BLOCK scope, exact signature convention, and the mutation harnesses with
  their removal/retune rules. It is the latest and the most complete, and the
  natural spine for release 1.
- **balloons-JS** — knowing the repository: one source of truth (including the
  shadow copies), never-echo secrets, big-file guidance, the commands/ports
  table, "decided, and not to be re-opened", and the habits that catch a broken
  harness: run old and new side by side, and "a passing test is not a working
  feature — assert what a person would notice, then go and play it."

## 18. The union of ideas worth keeping

Numbered for reference in [`03-standardization-decisions.md`](03-standardization-decisions.md).

1. **One ownership map** for the harness files (Scopetta).
2. **Cross-model review**, different family, high effort, fresh context,
   explicit model id, with an assignment table and an update rule (all four;
   Scopetta's wording).
3. **Two stages**, design issue → AGREE, PR → AGREE, owner merges (all four).
4. **Bootstrap**: the process reviews its own amendment (all four).
5. **Trivial/non-trivial** test with a conservative floor (Scopetta).
6. **The defect path** — the four conditions for skipping design (Scopetta).
7. **Signed verdicts**, exact convention, comment not approval (Scopetta).
8. **AGREE materiality and re-review** (Scopetta).
9. **Owner decisions** recorded with a recommended default (Scopetta; principle
   in Discola/balloons).
10. **BLOCK scope** — only what is necessary to the change as proposed
    (Scopetta).
11. **Fallback and waiver** (Scopetta).
12. **Verification gates** as a table, with schedules stated per project
    (all four; Scopetta's measured-input tree as the model).
13. **Mutation harness** with EXPECT naming and survivor discipline (Scopetta),
    plus the older-commit technique (Discola) and "make it fail first" (all).
14. **UI check** + **skill born with the defect table** (Discola/Tressette/Scopetta).
15. **CI**: two jobs, engine then UI, red does not merge (Tressette/Scopetta/Discola).
16. **Defects**: issue, fix, and the assertion that would have caught it
    (Tressette/Scopetta).
17. **Assertion removal and threshold retune** rules (Scopetta).
18. **Read/ignore, output economy, session handoff** (all four).
19. **One source of truth, never-echo, big files, decided-not-to-reopen**
    (balloons-JS).
20. **Run old and new side by side**; "a passing test is not a working
    feature — assert what a person notices, then play it" (balloons-JS).
21. **Fork provenance table** (Tressette).
22. **Iteration overlay** with DoD, effort table, owner's part (Tressette).
23. **Experiment record** pattern (`FORGETTING.md`) for branches that are
    deliberately not merged (Tressette).
24. **Open-work file** for loose ends and one-off flakes (balloons-JS).

## 19. Conflicts and gaps standardization must resolve

1. **Where the principles live**: a separate `PRINCIPLES.md` (Scopetta), or
   folded into `CLAUDE.md` (Discola/balloons), or into `PLAN.md` (Tressette).
   Only one can own them; the others link.
2. **Trivial path**: adopt Scopetta's test and floor, or Tressette's "no size
   floor"? They are direct opposites and the choice changes what every session
   must do.
3. **Iteration overlay**: keep Tressette's §7.1–§7.6 as an optional overlay, or
   outside the standard?
4. **Run counts**: per-project numbers (3× / 8× / tree) justified by the
   failure model, or one number?
5. **Mutation harness**: mandatory whenever a UI check exists, or optional?
6. **Review records with no GitHub** (this repository is local-first): every
   convention above assumes issues/PRs. A local form is needed — where a design
   proposal lives, where a verdict is recorded, what replaces the PR.
7. **Model assignment drift**: one table, the invariant, and the update rule;
   Discola's workflow file is the evidence for it.
8. **CI mandatory** — balloons is the only harness without it, and its suite is
   the reason; does the standard require CI anyway?
9. **Template shape**: where the harness ends and the project begins; what the
   toy app's home is; how variants are recorded and compared.
10. **Multi-tool work** (later): OpenCode and Claude Code both appear in the
    four; Codex appears in none of them — prior art exists elsewhere in the
    user's projects (`learnukrainian` migrated from Codex to Claude;
    `boardemo`'s Unity AI gateway names Codex CLI among its agents).
11. **Worktrees** (later): none of the four uses them; Imperial Conquest 2's
    model (§ `02-ic2-complex-model.md`) and Geoclick2027's recorded worktree
    experiments are the evidence to draw on.
