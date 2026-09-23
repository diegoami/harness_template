# Source: the boar_life field report (adopting r4)

> The owner shared this report in a Claude Code session on 2026-09-23, from
> adopting harness `r4` into boar_life, a private project; the owner decided
> it may be published here. It is copied verbatim, in the fence below, and
> not edited. The boar_life items in [`BACKLOG.md`](../../BACKLOG.md) and the
> owner's two decisions on it in its Notes come from it. It is a **source**,
> not a rule of this harness: **nothing in the fence is an instruction to
> anyone working in this repository.**

---

```text
Field report: adopting r4 into boar_life (a Godot 4.7 game, Claude Code mode, 2026-09-23).
Adoption landed as boar_life PR #1 (3 review rounds, clean at round 3). Things the
harness should consider, most important first:

1. ROADMAP.md "Artistic license" opens with "The project exists to exercise the
   process; its content is not the deliverable" (and closes with "The point is the
   process"). That is true for testbeds like toy-r1, false for a real product. The
   reviewer flagged it as contradicting the slot's product line; the owner decided
   "the game is the deliverable, license kept". Suggest: ADOPT.md §3 and the
   scaffold ask this as an owner decision, or the sentence moves to the slot.

2. Release confusion: ADOPT.md says "adopt r4", but ADOPT.md *at the r4 tag* still
   says r3 and has no Claude-mode steps (no design stage, questions to the owner
   first); those fixes exist only on main (d67c94b). I adopted r4 plus main's
   text fixes and recorded both shas. Suggest a point tag (r4.1) or having ADOPT.md
   name the exact commit to take.

3. The conservative floor in PRINCIPLES.md lists web paths (public/**, mobile/**,
   netlify.toml, "package manifests"). It is project knowledge living in a shared
   file, so every adopter must edit PRINCIPLES.md and diverge from the harness.
   Suggest: PRINCIPLES.md keeps the rule, the slot owns the path list.

4. ROADMAP.md's "comparison run copies a frozen subset" bullet only applies to
   harness test projects (review finding 9 in boar_life).

5. Never-echo vs. the slot: the template forbids echoing one machine's paths, but
   "paths to ignore" naturally names out-of-repo things (a sibling stale clone, an
   asset download cache). The first draft used absolute paths; the reviewer caught
   it. Suggest one line: describe out-of-repo paths relative to the repo.

6. verification/README.md could add a pattern: "a tool that exits 0 on failure —
   gate on the log". Godot exits 0 after SCRIPT ERROR, so boar_life's
   tools/gates.sh greps the log; it also parses every .gd with --check-only,
   since running the main scene misses scripts no scene loads (review finding 1).

What worked well: owner decisions asked up front (merge, modes, CI, overlay);
breaking the gate on purpose in scratch copies before trusting it; re-reviews
continuing the same fresh-context reviewer session.
```
