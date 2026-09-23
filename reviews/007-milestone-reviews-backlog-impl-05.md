# Review — milestone reviews queued in the backlog, implementation round 05

**Revision reviewed:** `b114ce284604b9796d1f00b5a13533fac6e132fc` (`b114ce2`).
PR #12's `headRefOid` (`gh pr view 12`),
`git ls-remote origin refs/heads/backlog/milestone-reviews` and
`git rev-parse backlog/milestone-reviews` all return this SHA, which is also
the one in the request.
**Files checked:** PR #12's file list: `BACKLOG.md`,
`reviews/007-milestone-reviews-backlog-impl-01.md` … `-04.md`,
`reviews/007-milestone-since-r4-01.md`. This equals
`git diff --name-only 365f0fe..b114ce2`, where `365f0fe` is
`git merge-base main b114ce2`. New since round 04:
- `55e68bb` records round 04. The working tree was clean before this file was
  written, so the committed file is the one I wrote.
- `b114ce2` holds the fixes and touches only `BACKLOG.md`. The four earlier
  review files and the copied review are unchanged since `13a15e6`
  (`git diff --quiet`).

**Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`). This is a re-review that
continues the same reviewer session (`PRINCIPLES.md`, *Reviewer sessions*) and
re-reads the current revision.
**Mode:** Claude — no design stage, no marker.

**Round numbering.** Round 04 ended clean. This round reviews a material edit
made after it. That is again the undefined case in `BACKLOG.md:108-112`
("Rounds after a clean round"). As the coordinator asked, this round is
numbered 05, following PR #9's precedent (`005-stale-text-impl-05.md`). That
is a numbering choice, not a ruling on whether the count restarts.

## Round-04 findings

1. **The milestone verdict and the round ceiling against Claude mode**
   (non-blocking): **resolved.** `BACKLOG.md:82-85` leaves this open for the
   design. It says `CLAUDE.md` and `reviews/README.md` have no `AGREE`/`BLOCK`
   marker, and that the Rounds rule counts rounds per stage. The design is to
   "Scope those to per-change reviews, and say how milestone rounds are
   counted." Both statements are accurate (`CLAUDE.md:19`,
   `reviews/README.md:21-23`, `PRINCIPLES.md:94-99`). This also covers the
   Claude-mode meaning of "clean" in the Rounds and Merge-policy bullets.
2. **Decision and proposal were not separated** (non-blocking): **resolved,
   with a residue (new finding 1).** `BACKLOG.md:76-77` now separates them. The
   "owner may tag without a review" clause has left the bullets. It is an open
   question at `:80-81`, marked "the owner has not decided it here", so it no
   longer sits beside "the tag waits for the review" as if decided. The
   source it cites is new finding 2.
3. **Heading** (non-blocking): **resolved.** `BACKLOG.md:92-94` now reads "the
   r4 milestone review (#10) and the review on PR #11". This is consistent
   with `:89-90`.
4. **Naming item** (non-blocking): **resolved.** `BACKLOG.md:127-132` is
   rewrapped and says "a copied review". The only lines over 80 characters
   are 18 and 144, and both predate this change (144 was 133 in round 04).

## Findings

1. **The decision sentence records less than the decision as relayed**
   (non-blocking). `BACKLOG.md:76-77` says: "The decision is the definition and
   that the tag waits for the review; the bullets are the proposal built on
   it." The owner's decision, as the coordinator relayed it for round 04, also
   covered four other points:
   - on `BLOCK`, fixes land in ordinary PRs, the candidate moves, and a
     re-review follows under the round ceiling;
   - on `AGREE`, the tag goes on exactly the reviewed commit;
   - any model that is not Claude reviews;
   - per-change reviews and merge settings stay as they are.

   Those points now appear only as "proposal" in bullets `:58-72`. A later
   design session could treat them as open, and so reopen a decided point.
   Suggest: "The decision is the definition, that the tag waits for a review
   by a model that is not Claude, what `BLOCK` and `AGREE` do to the tag, and
   that per-change reviews and merge settings stay; the rest of the bullets
   are the proposal."

2. **"The youtube3 wording has this" cites a source I could not find**
   (non-blocking). `BACKLOG.md:80-81`. I searched three places, all read-only:
   - the local `C:\Users\diego\projects\youtube3` checkout (last commit
     2023-03-06);
   - `CLAUDE.md` on youtube3's `master` and on its only other branch,
     `f-2/login-fixes` (`gh api …/contents/CLAUDE.md`);
   - youtube3's issues.

   None has an owner-may-tag-without-a-review clause. The only copies I found
   are uncommitted working-tree edits in two other repositories:
   - `Scopetta/CLAUDE.md:99`: "The owner may tag without a review, and the
     milestone issue records that";
   - `discola-web/CLAUDE.md:55`, and its `review-handoff/SKILL.md:23`.

   The substance is correct, since the owner has not decided it here. Either
   point at a source a later reader can open, or drop the parenthetical.

## Verified

- **Gate 0**, as in the header.
- **Nothing else changed.** `git diff 55e68bb..b114ce2` has three hunks, all
  in `BACKLOG.md`:
  - the tag-without-review clause removed from the bullet, and the open
    questions turned into a list with the reconciliation item;
  - the heading;
  - the naming item's rewrap.

  The owner-decision mark, the reason, the recommended default, and the rest
  of round 04's checks 2, 4 and 5 still stand. Tags `r1`–`r4` are unchanged.
- `git diff --check 365f0fe..b114ce2` is clean.
- **Not done:** no git or GitHub write of any kind. The only reads outside
  this repository were `gh api` GET requests, `gh pr list`/`gh search` on
  youtube3, and file reads, `git log` and `git status` in the local projects.

— Claude Opus 5.5 (claude-opus-5-5), reviewer
No blocking finding remains.
