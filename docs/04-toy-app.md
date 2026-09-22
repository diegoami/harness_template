# The toy application — a design sketch

**Status: proposal.** The toy is the substrate for the standard
([`03-standardization-decisions.md`](03-standardization-decisions.md) D-8), for
the experiments (E1–E6) and for the harness competition
([`05-harness-competition.md`](05-harness-competition.md)). It exists to answer
one question before release 1 is frozen: *does the standard generalize beyond a
card table?*

The toy's tests, UI check and mutation harness are its **own project
verification** — one worked example of the optional patterns in
[`01-harness-comparison.md`](01-harness-comparison.md) §9, not part of the
harness itself. The toy is not versioned as harness release 1 either; its
milestones are **iterations** (below), and it exists to be built, measured and
broken on purpose.

---

## Why a text adventure, and why this one

The four source harnesses all grew on the same product shape: a static page,
one HTML file, a deterministic game engine beside it, a CSS geometry budget,
and a Playwright check that renders states at many viewports. A text adventure
keeps the parts the harness needs — an engine with rules, a page with states, a
score, a win and a lose — and removes the parts that are card-specific
(overlapping hands, sprite decks, the size budget). If the standard's UI-check
section only makes sense with cards on a table, this will show it.

The engine also adds one test shape the card games do not have: a **world
graph**. Every exit must resolve, every item must be reachable, and the win must
be playable end to end — properties, not fixtures.

## The game

**The Crypt.** A five-room adventure, in the Zork lineage, engine-first.

```
Gatehouse → Courtyard → Great Hall → Kitchen
                │            │
                └──→ Cellar (dark) → Vault (locked)
```

- **The lamp** (Great Hall, on the mantel): `light` / `extinguish`. Fuel burns
  one unit per turn while lit; a warning at four; running out in the dark is
  fatal.
- **The dark**: entering the Cellar with no lit lamp prints the warning; the
  next dark turn is the grue. This is the lose state, reachable on purpose.
- **The key** (Cellar, only findable with light): unlocks the Vault door.
- **The chalice** (Vault): taking it is the win — 100 points, plus a score
  event for reaching the Cellar and one for unlocking the Vault, so the score
  line has something to show and the tests have numbers to assert.

Nothing is random. The game is deterministic by construction — there is no
seeded RNG, and the golden transcript is exact. (Deliberate: it tests whether
the standard's determinism language over-fits the card games' "arrives as an
injected `rng`".)

## The engine

`public/engine.js`, a classic script, no DOM, no timers, no `Math.random` —
Node runs it unchanged, which is what makes the tests and the golden transcript
possible.

- `newGame()` → a plain state object: room, lamp (location, lit, fuel),
  inventory, flags (`vaultUnlocked`), score, move count, `over` (`null`,
  `'won'`, `'grue'`).
- `parse(input)` → `{ verb, noun }`, with synonyms (`take/get/grab`,
  `go/north/n`, `look/l`, `inventory/i`, `unlock/open`) and case and
  punctuation tolerated.
- `turn(state, input)` → `{ state, text }`, no mutation: the text is the lines
  the page prints, the state is the new one. All rules, including the grue and
  the win, live here.
- World data as tables (`ROOMS`, `ITEMS`, `EXITS`), because the graph tests
  read them.

## The tests

`tools/engine.test.mjs`, `node --test`, deterministic:

1. **World integrity** — every exit resolves to a room; every room is reachable
   from the start; no item is stranded.
2. **Parser** — synonyms, directions, case, punctuation, empty input, unknown
   verb.
3. **Movement, items, inventory** — including "can't take scenery".
4. **The lamp** — light/extinguish; fuel burns only while lit; the warning; the
   dark.
5. **The grue** — entering dark without light warns; the next dark turn kills.
6. **The vault** — closed, locked, key, unlocked, chalice.
7. **The walkthrough** — a scripted optimal session reaches the win in a fixed
   number of turns with the expected score.
8. **The golden transcript** — a scripted session's exact text, re-recordable
   with `node tools/session.mjs --golden > tools/golden.json` (same pattern as
   the card games' `selfplay.mjs`, honest name).

## The page

`public/index.html` + `public/style.css`: a terminal on a sheet.

- a transcript log that scrolls (the newest line stays visible);
- an input line, always in the viewport;
- a compact button row for directions and the common verbs, every target ≥32px
  (the input is not a phone keyboard's friend);
- a status bar: room, moves, score.

**States the UI check renders:** boot/help; mid-game with history;
inventory shown; dark room; the grue (death); victory; and a long transcript
that must scroll rather than clip.

**Viewports:** 320×568 up to 1920×1080, both orientations.

**Assertions, seeded from the card games' list:** exactly one screen; no
sideways scroll; text floors; nothing clipped that should scroll; the input
line above the fold after fifty turns; tap targets; no console errors; no
network; the log is at the bottom after a turn (autoscroll measured, not
assumed); the death and victory panels are modal and their action is focused.

**`tools/break_ui.mjs`:** one deliberate defect per assertion — two screens
visible, shrunk text, a clipped log, an input below the fold, autoscroll
removed, a 20px button, a panel that lets the page show through — each with its
`EXPECT` entry naming the assertion it must trip.

## Growing the toy — the seed backlog

The toy is not "finished" at iteration 4: it grows through feature requests in
its own `ROADMAP.md` ([`07-feature-requests.md`](07-feature-requests.md)), one
request per iteration, in the owner's order. Seed requests, to be shaped one at
a time:

| id | request |
|---|---|
| F-1 | three more rooms past the vault, with a loop back to the courtyard |
| F-2 | a fuller parser: adjectives, "put X in Y", pronouns, "again" |
| F-3 | a riddle gate: three riddles on the vault door, a wrong answer costs a turn |
| F-4 | more items, and a combination puzzle (rope, bucket, well) |
| F-5 | an NPC that trades — a ghost in the cellar |
| F-6 | a danger you can fight or flee (a rat; a lamp that can be exhausted) |
| F-7 | save and restore (localStorage; a `restore` verb) |
| F-8 | a map command, and gentle hints after N turns without progress |
| F-9 | multiple endings: the chalice, the hoard, or out with nothing |
| F-10 | a compact log of firsts (rooms first seen, riddles answered) |

Each landed request is one iteration, one session and one review. The subset
frozen for a comparison run becomes the competition's task list.

## What the toy deliberately does not have

A card table, a fan, a geometry budget, sprite sheets, a seeded shuffle, a
result panel with counting rows. If the standard needs any of those to make
sense, the standard is too product-shaped and release 1 must say which parts are
the harness and which are the card game.

## Build order (once the standard is decided)

Every iteration runs in a run repo scaffolded from harness release 1
([`06-testing-the-harness.md`](06-testing-the-harness.md)), never in this
repository.

| iteration | scope | done when |
|---|---|---|
| 0 | scaffold: harness files + empty app + CI | CI green on an app that prints "not implemented" |
| 1 | engine + tests | the walkthrough wins, the grue kills, the graph tests pass |
| 2 | the page and its states | every state renderable by hand |
| 3 | the UI check | every state measured, the assertions list populated |
| 4 | the break harness, polish, docs | every assertion has a break that trips it |
