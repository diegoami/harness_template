# Review: the boar_life field report and the post-record test gaps (BACKLOG), implementation round 01

**Revision reviewed:** `0ece3388516a20f51b0200db486d236d887b253d`
(`0ece338`, branch `r5/backlog-field-report`). Three sources agree on this
SHA: PR #16's `headRefOid` (`gh pr view 16 --json headRefOid,files`),
`git ls-remote origin refs/heads/r5/backlog-field-report`, and
`git rev-parse HEAD`. The working tree was clean.

**Files checked:** PR #16's file list is `BACKLOG.md` (+43, −0) and
`docs/sources/boar-life-field-report.md` (+52, added). It equals the local
diff: `git merge-base HEAD origin/main` = `4cd81a5`, which is `main` on the
remote (`git ls-remote`), then `git diff --stat 4cd81a5 HEAD`: the same two
files, 95 insertions, no deletions. Two commits: `49bb3b3` and `0ece338`.

**Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`), a new session that has not
seen the implementation.

**Mode:** Claude. No design stage, no marker.

**Method:** read-only. I posted, created, edited and pushed nothing. The one
GitHub call beyond `gh pr view` was a GET of the rendered source file
(`gh api -H "Accept: application/vnd.github.html+json" repos/…/contents/docs/sources/boar-life-field-report.md?ref=0ece338…`).
I did not open the boar_life repository.

## Findings

1. **blocking. The two new smaller items silently enter r5's decided scope,
   and no claim covers them.** `BACKLOG.md:36-37` says "**In r5:** … the
   smaller items except scratch-repository deletion". The diff adds two
   bullets to that list (`BACKLOG.md:328-338`): the verification pattern
   (field report item 6) and the `post-record.mjs` test gaps. As written, both
   are now r5 work. But no claim C1–C11 covers them (C10 lists its smaller
   rules by name), and C5 requires a release's claims to be written when it is
   scoped. The PR body contradicts the file: "Left out: Fixing any of the
   recorded items: r6, or later r5 work where a claim covers it". No owner
   decision places either item. The aim says where they sit, not which
   release they belong to. So a milestone reviewer reading
   `BACKLOG.md:36-37` would find r5 work with no claim, and the scope status
   ("decided on 2026-09-23") no longer describes the file.
   *Fix:* ask the owner and record the answer. Either the two items are not
   in r5: mark them so in the bullets, or narrow line 36-37 to the smaller
   items decided on 2026-09-23. Or they are in r5: then a claim is added or
   extended, with its reason, as C5 requires.

2. **blocking. Item 2's second suggestion is lost, and the interim rule
   added to decision (b) contradicts `ADOPT.md`.** The report's item 2
   suggests "a point tag (r4.1) or having ADOPT.md name the exact commit to
   take" (`docs/sources/boar-life-field-report.md:28-29`). The owner decided
   against r4.1 (`BACKLOG.md:371-374`). Nothing records or decides the second
   suggestion. The decision's reason, "`r5` carries the fixes", also leaves
   the cause open. `ADOPT.md` on `main` names a release (`r4`, lines 5 and
   17) but takes "the files at the repository root", which are `main`. So at
   the `r5` tag it will name `r4` unless someone bumps it, and no claim
   covers that. Then `BACKLOG.md:374-376` adds a rule: "Until `r5`, an
   adopter takes `r4` plus `main`'s fixes and records both SHAs". It
   conflicts with `ADOPT.md:98-99`, which tells the adopter to record
   "adopted from harness `r4` (the commit at the tag)", one SHA. An adopter
   reads `ADOPT.md`, not the backlog Notes. `PRINCIPLES.md:25-26` has a
   contradiction between files fixed in the change that found it. The aim
   gives the owner's decision as "no r4.1", not this rule.
   *Fix:* make the sentence descriptive ("boar_life took `r4` plus `main`'s
   fixes and recorded both SHAs"). Record the other suggestion as an item,
   with the owner's routing: `ADOPT.md` names the exact commit, or its
   release name is bumped before a tag.

3. **non-blocking. Item 1 drops "the scaffold", and the reason for decision
   (a) inherits the gap.** The report suggests that "ADOPT.md §3 and the
   scaffold ask this as an owner decision" (source `:21-22`). The backlog has
   "Ask it at adoption as an owner decision" (`BACKLOG.md:199-200`).
   `ROADMAP.md`, `PRINCIPLES.md` and the `CLAUDE.md` slot are the templates a
   scaffolded run receives too (`BACKLOG.md:345-346`). So items 1, 3, 4 and 5
   are also scaffold problems, not only "adoption problems"
   (`BACKLOG.md:370-371`). The routing to r6 is the owner's decision and is
   not questioned. Restoring "and the scaffold" keeps r6 from fixing
   `ADOPT.md` alone.

4. **non-blocking. Small distortions in wording.**
   - "Four template problems every real product meets" (`BACKLOG.md:193`)
     overstates item 5. It arises only when the ignore list names something
     outside the repository.
   - The `ROADMAP.md` quotations are lower-cased: "the project exists…" and
     "the point is the process". `ROADMAP.md:55,68` capitalise them. Harmless,
     but they are quotation marks.
   - In the test gaps, "text after a closing fence" (`BACKLOG.md:336`) is not
     what round 03 found. Break Q3 is a closing fence *line* that carries an
     info string (`` ```text ``) and still closes
     (`reviews/010-post-record-impl-03.md:97-98`). As written, it reads as
     text on the lines after a fence. Suggested: "a closing fence that carries
     an info string".

5. **non-blocking, outside the aim. Round 03's process recommendation has
   no home.** `reviews/010-post-record-impl-03.md:106-113` recommends that
   C10's rule also cover the builder: no `--confirm` run against a real
   thread except for the real record. It calls this "the owner's decision for
   C10". Neither this diff nor any other file records it (grep over `*.md`).
   The aim asks only for the test gaps, so this is flagged, not required.

## Verified

- **The report's factual claims, against this repository:**
  - `git show r4:ADOPT.md` names `r3` (lines 5, 17 and 85, "adopted from
    harness `r3`"). Its §5 has only the design → AGREE flow, with no Claude
    mode steps. `r4` is an annotated tag on `39c29e3`.
  - `d67c94b` is on `main`, and its `ADOPT.md` names `r4` and has the Claude
    Code steps (lines 88-89). The fixes landed in `63f79e6`…`fdbaa5b`, both
    ancestors of `d67c94b`. `git diff d67c94b 4cd81a5` does not touch
    `ADOPT.md`, `ROADMAP.md`, `PRINCIPLES.md` or `CLAUDE.md`, so the passages
    below are what boar_life adopted.
  - `PRINCIPLES.md:43-44` lists `public/**`, `mobile/**`, `netlify.toml` and
    "the package manifests" in the conservative floor.
  - `ROADMAP.md:55` has "The project exists to exercise the process; its
    content is not the deliverable." `:68` has "The point is the process, not
    precision." `:78` has the bullet "**A comparison run copies a frozen
    subset**".
  - `CLAUDE.md:47` has "paths to normally ignore", and `:50` has "never read
    or echo: secrets, signing material, one machine's paths".
- **Faithfulness and placement.** Items 1, 3, 4 and 5 sit under Candidates
  → "From the first real adoption" (`BACKLOG.md:190-211`), next to the
  Adoption item and routed to r6. Item 6 and the round-03 gaps sit under
  Smaller items. The two decisions sit in Notes (`:368-376`). Item 2 is not
  an item; it is decision (b). Apart from findings 2-4, each entry keeps its
  source's substance: items 3, 4 and 5; item 6 (log, not exit code;
  `--check-only`); and the three round-03 gaps (the subdirectory path, Q1 /
  Q7, the symlink / junction). The "What worked well" paragraph is not
  recorded, which is reasonable for a backlog.
- **Owner-decision convention** (`PRINCIPLES.md:108-110`). Both decisions
  carry "the recommended default, taken", a reason, and the bold
  "**Owner decisions (2026-09-23)**" mark, as the earlier Notes entries do
  (`:347`, `:355`). Neither contradicts the milestone rule: decision (b)'s
  reason is "a tag is a milestone and waits for an independent review".
  Decision (a) keeps r5's claims and matches "Not in r5: rebuilding
  `ADOPT.md` … a candidate for r6" (`:40`). The r5-scope issue is finding 1.
- **C5.** The diff has 0 deleted lines. Its hunks are at old lines 187, 302
  and 331, so lines 9-157 (the scope, D1–D11 and C1–C11) are untouched. Added
  lines wrap at 80 columns. The one exception is the unbreakable link at
  `:192` (84 columns), the file's convention for links (see `:253`, `:263`).
- **The source file.**
  - UTF-8 with no BOM, LF endings, and a final newline. `§` and `—` are
    intact.
  - Its header follows the two existing sources: the provenance, "copied
    verbatim … and not edited", what in `BACKLOG.md` comes from it, and the
    "source, not a rule" disclaimer.
  - The disclaimer holds. The fence holds "Suggest:" proposals addressed to
    the harness's maintainers, not instructions to an agent working here.
  - "Verbatim" cannot be checked against the owner's original, which this
    session does not have.
  - On GitHub, the blob SHA at `0ece338` (`e01e1e7…`) equals the local one.
    The rendered page has the heading, the blockquote, the rule and one
    `<pre lang="text">`. That block's unescaped text equals the fence's
    content byte for byte (2364 characters), and nothing renders after it.
- **C1 / C3 for this r5 PR.** The body has the four parts. "Reviewed
  revision: pending" is to be filled once a round is clean.
  `closingIssuesReferences` is empty and the body closes nothing, which is
  consistent. It has no review file or comment yet. C1 needs this file
  committed on the PR and posted before the next commit.

— Claude Opus 5.5 (claude-opus-5-5), reviewer
Two blocking findings remain (1 and 2).
