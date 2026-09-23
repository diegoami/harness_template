# Review — release 5 scope and claims, implementation round 04

**Revision reviewed:** `b0f4775494f97079ea03af2331f633c742e058f7`
(`b0f4775`, branch `plan/r5-scope`). Three sources agree on this SHA: PR
#14's `headRefOid` (`gh pr view 14 --json headRefOid,files`),
`git ls-remote origin plan/r5-scope`, and `git rev-parse HEAD`. It is the
commit after `0ea2faf`, which records round 03. The working tree was clean.

**Files checked:** PR #14's file list: `BACKLOG.md` (+150 −1) and
`reviews/009-r5-scope-impl-01.md` … `-03.md` (+193, +164, +124). It equals
the local diff: `git merge-base HEAD origin/main` = `d67c94b`, then
`git diff --name-only d67c94b..b0f4775`. New since round 03: `0ea2faf` (the
round-03 file) and `b0f4775` (`BACKLOG.md`, +31 −25). Every hunk of
`b0f4775` lies inside the section.

**Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`), continuing the session of
rounds 01–03 and re-reading the current revision.

**Mode:** Claude. No design stage, no marker. This is round 04. It runs on
the owner's decision after round 03 did not end clean, as the Status line
records (`BACKLOG.md:13-14`). That decision is one of the owner's options
under the Rounds rule ("record a decision", `PRINCIPLES.md:97-99`).

## Round-03 findings

- **1 (blocking), the owner column did not render: fixed.** Every decision
  row now has five cells under the five-column header (`BACKLOG.md:51-61`,
  counted per row). The GitHub-rendered file at `b0f4775`, fetched by a
  read-only `gh api repos/diegoami/harness_template/contents/BACKLOG.md?ref=b0f4775…`
  with `Accept: application/vnd.github.html`, has one `<th>owner</th>` and
  eleven `<td>accepted</td>` cells. The D11 row renders as
  `D11 | "rules apply going forward" … | yes, stated in PRINCIPLES.md |
  this repository's decision in Notes, made general | accepted`.
- **2 (blocking), C5's verdict gap: fixed.** "`AGREE` only when no claim is
  NOT MET and no finding blocks, and a PARTLY MET or COULD NOT TEST is a
  finding the reviewer grades as blocking or not" (`BACKLOG.md:106-108`).
  Every combination now has exactly one verdict, and it matches the source
  (`docs/sources/ic2-milestone-review.md:64-65`).
- **3 (non-blocking), the owner's acceptance: noted.** The acceptance of
  D1–D11 (`BACKLOG.md:11-12`, the owner column) and the decision to run this
  round (`:13-14`) are recorded on the coordinator's report of what the owner
  said in session; the repository cannot show it. The coordinator states that
  the owner will confirm it by merging this PR, or with a line on the PR.
  Until then it is recorded, not verified.
- **4 (non-blocking), trivial commits: fixed.** "Where r5 starts"
  (`BACKLOG.md:31-34`) and C1's proof (`:71-73`) admit a trivial change "as
  `PRINCIPLES.md` defines it". That can be checked: the conservative floor
  (`PRINCIPLES.md:41-47`) makes any harness-file or `tools/**` diff
  non-trivial unless it is a pure typo.
- **5 (non-blocking), weakening and triage: fixed.** C5's proof requires the
  reason "written here in the same commit" and exempts a visible "the claim
  was wrong" correction (`BACKLOG.md:109-111`). This matches the Status
  paragraph (`:18-19`) and C5's own four-way triage.
- **6 (non-blocking), the template's parts: fixed.** C11 adds the "not in
  this release" list and the reviewer's limits (`BACKLOG.md:148`).
- **7 (non-blocking), cosmetic: fixed in part.** Line 14 is split. No line
  outside the table exceeds 80 characters. The ragged wraps remain (finding 1
  below).

## Findings

1. **non-blocking — ragged wraps from the edits.** `BACKLOG.md:73` ("least
   one review"), `:108` ("or not; and four-way triage. *Proof:* the") and
   `:150` end short and do not reflow into the next line. The same holds for
   `BACKLOG.md:80` and `:128`, carried from round 03. The rendered page is
   unaffected; reflow when next touching the section.

No new issue found. The two fixes and the Status split change no other
claim, decision or rule.

## Verified

- Gate 0: head, remote ref and local HEAD agree. PR files equal the local
  diff, and the four paths are the ones expected.
- No change outside the section: every hunk of `0ea2faf..b0f4775` falls in
  `BACKLOG.md:9-160`, and the rest of the file matches the earlier rounds.
- The D1–D11 defaults and reasons are unchanged since round 03. Only the
  cell separator changed, so the values accepted are the defaults reviewed in
  rounds 01–03, and D2 still matches the owner's settled rule.
- The round-02 fixes still stand: C1 and C2 compare against the PR head's
  file; C10's creation rule exempts the reviewer's verdict and finding
  issues; C5's proof is the section's history.

— Claude Opus 5.5 (claude-opus-5-5), reviewer
No blocking finding remains.

## Completion

Landed by PR #14, merged at `427749c` on 2026-09-23 (18:41 UTC) on the owner's
explicit instruction ("merge #14"), which confirms the owner's acceptance of
D1–D11. The note is non-material and transcribes the evidence.

- **The landing merge for r5 is `427749c`.** C1, C3 and C5 measure from it: the
  r5 PRs are those opened after 18:41 UTC on 2026-09-23.
- Four review rounds. Rounds 01–03 each had blocking findings; round 03 reached
  the ceiling and went to the owner, who decided to fix the findings and run a
  fourth. Round 04 ended with no blocking finding on `b0f4775`, and `cd6d3c2` only
  adds its record.
- The rendered owner column shows "accepted" for all eleven decisions (checked by
  the reviewer against GitHub's HTML).

— Implementer (Claude Opus 5.5)
