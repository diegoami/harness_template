# The toy-r1 field test — iteration 0

**Status:** parked (2026-09-23). Iteration 0 completed; the four friction items
were folded into harness release 2 (tag `r2`). The run is not continued: the toy
is not a well-defined project, and the harness's next testbed is a real project
using the parametrizable scaffold (release 3).

**Question.** Does harness release 1 (`r1`) work end to end on a project that is
**not** a card game — the scaffold, the project slot, the roadmap and plan
templates, the two-stage process, the records, and the remote rules?

**Method.** The run is `toy-r1`, scaffolded from tag `r1`
(`C:\Users\diego\projects\toy-r1`, remote `diegoami/toy-r1`). Iteration 0 is the
scaffold (`harness_template/docs/04-toy-app.md`, build order). The data is what
the run itself produced: its design record, its implementation reviews, its PR
and its CI. Observed from the harness repo after the fact; no harness file was
touched during the run.

---

## What happened

| time (09-23) | step |
|---|---|
| 00:31 | scaffold `2dfdc07` — one commit, no remote |
| 00:41 | design proposal `a8723dc` |
| 00:43 | design review round 01: **BLOCK**, 3 blocking findings; answers `ef86f2f` |
| — | design **AGREE** on revision `ef86f2f` |
| 00:45 | implementation `e461a9f` |
| 00:48 | implementation review round 01: **BLOCK**, 1 finding; fix `7736e30` |
| 00:49 | implementation review round 02: **AGREE** on `7736e30` |
| 00:54 | owner decisions recorded (`d954ff0`): Node 24; the remote is created |
| 00:55 | design re-review: **AGREE** on `d954ff0` — the owner-decision edit is material |
| 00:59 | PR #2 merged `631e97f`; PR CI `test` green (12s run, 9s job) |

Issue #1 is the design record; PR #2 is the implementation; both records stay
canonical in the repository.

## What the process caught

1. **Design, finding 1** — the planned `PLAN.md` table did not carry the
   overlay's own required fields (request, done-when, out-of-scope, mode,
   design record) and did not record the iteration-0 non-roadmap exception.
2. **Design, finding 2** — a recommended local-gates fallback **weakened the
   done-when** ("CI green"); the reviewer required the criterion preserved or an
   explicit owner amendment, and the owner then created the remote.
3. **Design, finding 3** — the engine's **no-mutation contract** was missing
   from the proposal and from its test.
4. **Implementation, finding 1** — the project slot's product statement
   **omitted the agreed persistence decision** ("saved nowhere"), leaving the
   deferred save/restore request ambiguous.

None of the four is cosmetic: each changed what would have been built or how
completion is judged.

## What worked as designed

- **The done-when held.** A plausible soft substitution was blocked, and the
  missing remote became an explicit owner decision with a recommended default —
  which the owner took.
- **Materiality fired for real.** Recording the owner decisions edited the
  design record after its AGREE, and the run asked for a fresh verdict on the
  current revision without being told to.
- **Revisions make the sequence auditable.** The AGREE text for `ef86f2f` was
  committed together with the later implementation commit, so commit order
  alone would mislead — but every verdict names the revision it covers, and the
  order is reconstructable from the files alone.
- **Reproduce before you act.** The implementation review changed the engine's
  answer string and watched the test go red before restoring it, and ran the
  server plus a traversal URL.
- **The remote rules lit up unchanged**: design issue #1, PR #2, CI on both,
  files canonical.

## Friction, and what release 2 should fix

1. **The `PLAN.md` template's table contradicts the overlay's requirements.**
   The first session redesigned it, at the cost of a BLOCK round. Ship the full
   columns and the growth row in the template.
2. **Iteration 0's done-when depends on an owner action — creating the remote —
   that nothing surfaces up front.** Put it in the scaffold README's
   first-session list as an explicit owner action.
3. **Nobody closes the completion loop in the records.** The last design verdict
   says "the pull-request CI run has not been verified here"; the PR body and
   the merge carry it, but no record ticks the done-when and names the CI run.
   Add a short completion note — the done-when items and the CI link — and say
   who owns it.
4. **The design record's `Status:` field drifts** ("under review" after two
   AGREEs) because no rule owns it. Either the implementer updates it at each
   verdict, or the field goes.

## What it means

Release 1 survived a real, non-card project end to end **with no harness
edits**. Its core claims were exercised in the field: the design gate changed
the plan, the implementation gate caught an omission, the done-when was not
negotiated down, materiality triggered re-review, and the records reconstruct
the history. The four friction items are template and ownership fixes, not
process failures.

**Open:** nobody has played the page yet — the smoke was a served `public/` and
a 404 check, and the `main` CI run was queued. Iteration 1 gives the engine
something to play.

## Reproduce

```sh
git -C C:\Users\diego\projects\toy-r1 log --oneline --graph
# records: design/001-iteration-0-scaffold.md, reviews/001-*-impl-0N.md
gh pr view 2 --repo diegoami/toy-r1 --json title,state,mergedAt
gh run list --repo diegoami/toy-r1 --limit 5
```

**Review history.** The verdicts above are the data; this record reads them out
and does not re-review them.

## Parked

The run stopped here by the owner's decision, not by a failure: the toy was a
deliberately unspecified project, and the harness's remaining questions — which
process shape suits a real project — need a real project. `toy-r1` stays on
release 1; nothing is migrated. The repository is disposable.
