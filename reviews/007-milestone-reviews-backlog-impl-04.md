# Review — milestone reviews queued in the backlog, implementation round 04

**Revision reviewed:** `13a15e6e5d7a2f12000450c158798cb9a22794bf` (`13a15e6`).
PR #12's `headRefOid` (`gh pr view 12`), `git ls-remote origin
refs/heads/backlog/milestone-reviews` and `git rev-parse backlog/milestone-reviews`
all return this SHA. Two earlier problems:
- A first request for this round named `13a15e6` before it was pushed, while
  PR #12's head was still `f0c2688`. That attempt stopped at Gate 0 and wrote
  no file.
- A later request gave the full SHA as `13a15e6a3d4c…`. No such object
  exists, and the coordinator corrected it. This review uses the value taken
  from the tools.

**Files checked:** PR #12's file list: `BACKLOG.md`,
`reviews/007-milestone-reviews-backlog-impl-01.md`, `-02.md`, `-03.md`,
`reviews/007-milestone-since-r4-01.md`. This equals
`git diff --name-only 365f0fe..13a15e6`, where `365f0fe` is
`git merge-base main 13a15e6`. New since round 03:
- `f0c2688` records round 03.
- `13a15e6` is the material edit. It touches only `BACKLOG.md`
  (`git diff --quiet f0c2688 13a15e6 -- reviews` holds).

**Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`). This re-review continues
the same reviewer session (`PRINCIPLES.md`, *Reviewer sessions*) and re-reads
the current revision.
**Mode:** Claude — no design stage, no marker.

**Round numbering.** Round 03 ended clean. This round reviews a material edit
the owner asked for after it. That is the undefined case recorded in
`BACKLOG.md:98-102` ("Rounds after a clean round"). As the coordinator asked,
it is numbered 04, following PR #9's precedent (`005-stale-text-impl-04.md`).
That is a numbering choice, not a ruling on whether the count restarts.

**Taken as given:** the owner's decision as relayed by the coordinator.
- A milestone is a release: an annotated tag on `main`, on the exact commit
  the release is built from.
- The independent review, by any model that is not Claude, comes before the
  tag, and the tag waits for it.
- On `BLOCK`, fixes land in ordinary PRs, the candidate moves, and a
  re-review follows under the round ceiling.
- On `AGREE`, the tag goes on exactly the reviewed commit.
- Per-change reviews and merge settings stay as each repository has them.

## Findings

1. **The proposed `CLAUDE.md` content brings an `AGREE`/`BLOCK` verdict and
   the round ceiling into Claude mode, but doesn't name the owned text it
   would have to amend** (non-blocking). `BACKLOG.md:55-67` says "To add to
   `CLAUDE.md`", then has the reviewer post "one verdict, `AGREE` or `BLOCK`",
   and `:68-70` puts the re-review "under the round ceiling". Adding that as
   written would conflict with four owned passages:
   - `CLAUDE.md:19`: "no AGREE/BLOCK marker".
   - `reviews/README.md:21-23`: in Claude mode, "replace the marker with one
     line stating whether any blocking finding remains". Yet `:73-74` copies
     the verdict into `reviews/`.
   - `PRINCIPLES.md:94-99`: rounds are counted "per stage: each appended
     design verdict, and each implementation review file". A milestone review
     is neither, so the ceiling has nothing to count yet.
   - The same bullet defines a clean round in Claude mode as "the statement
     that no blocking finding remains".

   The owner's own wording uses `AGREE`/`BLOCK`, so this is not an objection
   to the decision. The item should say the design also scopes `CLAUDE.md`'s
   "no marker" and `reviews/README.md`'s Claude-mode final line to per-change
   reviews, and defines how milestone rounds are counted. Otherwise "to add"
   hides an amendment. `007-milestone-since-r4-01.md` already ends in `AGREE`,
   so the question is live.

2. **The item doesn't separate the owner's decision from Claude's proposal**
   (non-blocking). `BACKLOG.md:48-56` marks the decision, and "To add to
   `CLAUDE.md`" reads as a proposal. But some bullets go beyond the decision
   as relayed:
   - one issue per finding;
   - `--body-file`;
   - "Claude gives a re-review prompt unasked";
   - "later work belongs to the next milestone";
   - above all, "The owner may tag without a review, and the issue records
     that" (`:72`).

   That last clause is an exception to "the tag waits for it", and so a form
   of waiver. `PRINCIPLES.md:105-107` allows a waiver only at the
   implementation stage. Say whether the owner decided the exception or it
   is proposed. If it is proposed, move it under "Open for the design" next
   to who creates the tag.

3. **The protocol-gaps heading still calls PR #11's review a milestone
   review** (non-blocking). `BACKLOG.md:82-84` reads "Protocol gaps found by
   the milestone reviews ([#10] and PR #11)", while `:79-80` now says the
   review on PR #11 "was not a milestone under this rule". Suggested wording:
   "found by the r4 milestone review (#10) and the review on PR #11".

4. **The naming item: one line over width, and one stale phrase**
   (non-blocking).
   - `BACKLOG.md:120` is 90 characters, introduced by `13a15e6`. The rest of
     the file wraps at 80, and the only other long lines, 18 and 133, predate
     this change.
   - `:120-121` still asks "whether a milestone copy and the change that
     records it share a number: `006` has one slug, `007` has two". Under
     the new rule, `007` is no longer a milestone copy. Say "a review copy".

## Checks requested

- **1. Gate 0:** see the header. The revision and file list equal PR #12's.
- **2. The decision is stated as relayed, and meets the convention.** Every
  element above is present:
  - release = annotated tag on `main`, on the exact build commit: `:48-50`;
  - `rN`, next `r5`: `:50-51`;
  - the review comes first and the tag waits: `:68`;
  - `BLOCK` → ordinary PRs, candidate moves, re-review under the ceiling:
    `:68-70`;
  - `AGREE` → tag on exactly the reviewed commit: `:70-71`;
  - per-change review and merge setting unchanged: `:58-59`;
  - "any model that is not Claude": `:63`.

  It meets `PRINCIPLES.md:108-110`:
  - the mark: "**Owner decision (2026-09-23)**";
  - the recommended default: "This was also Claude's recommendation", which
    is the Notes' "recommended default, taken" in other words;
  - the reason: "a tag is a fixed point, so the review covers exactly
    `<previous tag>..<candidate>`…".

  See findings 1–2 for what the proposal adds beyond the decision.
- **3. Contradictions:** finding 1 covers `CLAUDE.md`, `reviews/README.md`
  and the round ceiling. On comment, not approval, there is no conflict:
  the verdict is posted as a comment on the milestone issue, and nothing asks
  for an approval action.
- **4. Consistency across `BACKLOG.md`:**
  - The r4 records stay milestone records under the new rule:
    - `:78-79` has r4 "reviewed after the fact on #10";
    - `:151-154` has "The r4 milestone review (#10)";
    - `:148-150` lists the releases.
  - The 007 note (`:155-157`) says "the work since r4", not "milestone", so
    it is consistent.
  - "Rounds after a clean round" (`:98-102`) is unaffected and describes
    this round's own case.
  - "the two milestone reviews disagreed" (`:96`) means #10's two reviews of
    `r4`, which is consistent.
  - The only inconsistencies left are findings 3 and 4.
- **5. Tags.** `git cat-file -t` gives `tag` for `r1`, `r2`, `r3` and `r4`, so
  each is annotated. The commits they point to:

  | tag | commit |
  |---|---|
  | `r1` | `9f7b1a4` |
  | `r2` | `63cb9a9` |
  | `r3` | `af1a90f` |
  | `r4` | `39c29e3` |

  - `git branch -r --contains` lists `origin/main` for each.
  - Each commit is on `main`'s first-parent history
    (`git rev-list --first-parent origin/main`).
  - `git ls-remote --tags origin` shows the same tag objects and the same
    commits they point to, so the tags as pushed are annotated too.

## Verified

- `git diff f0c2688..13a15e6` changes only `BACKLOG.md`, in three places:
  - the milestone item, rewritten;
  - its "Open for the design" paragraph;
  - the naming item.

  The earlier credits to other projects are gone, as the coordinator said.
  No finding from rounds 01–03 is reopened by the rewrite. The attributions
  those rounds checked no longer appear.
- `git diff --check 365f0fe..13a15e6` is clean.
- **Not done:** no git or GitHub write of any kind. I read with `gh pr view`,
  `git ls-remote`, `git cat-file`, `git branch -r` and `git rev-list`.

— Claude Opus 5.5 (claude-opus-5-5), reviewer
No blocking finding remains.
