# Review — release 5 scope and claims, implementation round 02

**Revision reviewed:** `0650f74e844a674126d4e6e1e1691862cb354663`
(`0650f74`, branch `plan/r5-scope`). Three sources agree on this SHA: PR
#14's `headRefOid` (`gh pr view 14 --json headRefOid,files`),
`git ls-remote origin plan/r5-scope`, and `git rev-parse HEAD`. It is the
commit after `52f6c50`, which records round 01. The committed round-01 file
is the file as written; the working tree was clean.

**Files checked:** PR #14's file list: `BACKLOG.md` (+129 −1) and
`reviews/009-r5-scope-impl-01.md` (+193). It equals the local diff:
`git merge-base HEAD origin/main` = `d67c94b`, then
`git diff --name-only d67c94b..0650f74`. New since round 01: `52f6c50` (the
round-01 file) and `0650f74` (`BACKLOG.md`, +81 −54). Every hunk of `0650f74`
lies inside the new section (`BACKLOG.md:9-136`).

**Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`), continuing the round-01
session and re-reading the current revision (`PRINCIPLES.md`, Reviewer
sessions).

**Mode:** Claude. No design stage, no marker.

## Round-01 findings

- **1 (blocking), boundary and vacuous C1: fixed in part.** "Where r5 starts"
  (`BACKLOG.md:24-28`) defines r5 PRs. It correctly lists #9 and #11–#14 as
  the range's opening PRs: `git log --first-parent r4..origin/main` shows the
  merges of #9, #11, #12 and #13. C1 now requires exactly one equal comment
  per review file (`:64-67`). But C5's new proof is a tautology (finding 2
  below), and the equality proofs in C1 and C2 fail on a correct
  implementation (finding 1 below).
- **2 (blocking), coverage: fixed.** C4 names D3 and D4 (`:89`), and C11
  (`:127-135`) covers the fixed prompt, the re-review prompt on `BLOCK`,
  `--body-file`, verdict handling and the reviewer's family. The template's
  contents are still open (finding 4).
- **3 (blocking), D9 against D5: fixed.** `reviews/<tag>-milestone-NN.md`
  (`:53`) fits both schemes. It introduces a wording clash with D10
  (finding 5).
- **Non-blocking 4–10:**
  - fixed: C8 names a temporary directory (`:110-111`); C4's tag check can be
    run by anyone (`:90-92`); C6 quotes three passages (`:99-102`); D10 sets
    milestone rounds (`:54`); C2 says how to compare (`:74-75`); C3's proof
    covers all four rules (`:81-83`); C10 names the restatements inline
    (`:122-126`); D11 generalises the Notes decision (`:55`); D4 says
    "override" (`:48`); D2 covers a mixed range (`:46`); the "owner" column
    exists (`:43`);
  - C10's creation rule is fixed in wording but now contradicts C4 and C11
    (finding 3 below);
  - carried: see finding 7.

## Findings

1. **blocking — the equality proofs in C1 and C2 fail at the candidate on a
   correct implementation.** The milestone reviewer tests "at the candidate
   commit" (`BACKLOG.md:58`). C1 requires each review file to have "exactly
   one PR comment equal to it" (`:64-66`), and C2 requires every posted record
   to read back "equal to its file" (`:73-75`). But the completion note is
   appended to the last review file after the merge (`reviews/README.md:27-33`,
   D7 at `BACKLOG.md:51`), in a direct commit to `main`. This repository does
   exactly that: `d93c257`, `3b93b34` and `d67c94b` each add 17–20 lines to
   `005-…-impl-05.md`, `007-…-impl-06.md` and `008-…-impl-02.md`. At the
   candidate, every r5 PR's last review file therefore differs from its
   comment, so C1 and C2 read NOT MET, which blocks the tag. **Fix:** compare
   with the file as the PR's head (or merge commit) holds it, or with the file
   minus its `## Completion` section.

2. **blocking — C5's proof is true by definition, so "claims before the
   work" goes unchecked.** r5 PRs are defined as "those opened after the PR
   that lands this section has merged" (`BACKLOG.md:27-28`). C5's proof is
   that this PR "merged before the first r5 PR was opened" (`:97-98`), which
   holds for every possible history. What IC2's rule guards against, claims
   rewritten to describe what was built
   (`docs/sources/ic2-milestone-review.md:107-108`, `:115`), and the section's
   own promise that "a claim changes only here, visibly and with its reason"
   (`BACKLOG.md:15-16`) have no proof. **Fix:** prove it from history: every
   change to C1–C11 in `git log -p <landing merge>..<candidate> -- BACKLOG.md`
   carries its reason in the section, and none weakens a claim. Or: the
   claims are unchanged since the landing merge.

3. **blocking — C10's new rule forbids what C4 and C11 require of the
   milestone reviewer.** C10 rules that "a review never runs a path that
   creates something outside a temporary directory (no `--github`, no
   `gh … create`)" (`BACKLOG.md:119-121`). The milestone reviewer is required
   to post a verdict on the milestone issue and open one issue per reproduced
   finding (`:88`, and the handling in `:130-132`), which is
   `gh issue create` and a comment on GitHub. Landed as worded, the rule makes
   the milestone review break a harness rule, or leaves the reviewer unable to
   deliver it. **Fix:** scope the rule to running the code and tools under
   review. Exempt the reviewer's own verdict and finding issues, or name what
   is forbidden (repositories, pushes, merges, tags, posts made by the tool
   under test).

4. **non-blocking — C11 does not say what the template holds.** Round 01
   (finding 5) asked for per-claim verdicts to be checked in the prompt
   rather than in the reviewer's output. The answer was that C11 checks the
   template, but C11 (`BACKLOG.md:127-135`) only requires a fixed file that
   the implementer fills in. A one-line "review this" template passes. Name its
   parts: candidate SHA, previous tag and range; the promise; C1…Cn with their
   proofs; the "not in" list; the per-claim verdict table (MET, NOT MET,
   PARTLY MET, COULD NOT TEST); the limits (read-only, the creation rule);
   `--body-file`; and the signature. The IC2 brief
   (`docs/sources/ic2-milestone-review.md:80-104`) is the model. Also say where r5's filled
   prompt is kept, so that "differs … only in its filled placeholders"
   (`:133-134`) can be checked; the milestone issue is the natural place.

5. **non-blocking — D9 and D10 count verdicts differently.** D9's reason
   says "one number per verdict, even two in one round" (`BACKLOG.md:53`).
   D10 says "each verdict on the milestone issue is one round" (`:54`). Two
   verdicts in one round cannot both hold. Since a second reviewer is out of
   r5 (`:38`), drop "even two in one round" from D9, or have D10 count only
   the designated reviewer's verdicts.

6. **non-blocking — C1 and C3 still pass by absence.** An r5 change that
   lands without a PR (as completion notes already do, directly on `main`),
   or an r5 PR that adds no review file, satisfies "for every r5 PR, each
   review file it adds…" (`BACKLOG.md:64-66`) vacuously. Add to C1's proof:
   every commit in `<landing merge>..<candidate>` (`--first-parent`) is an r5
   PR's merge or a completion-note commit, and every r5 PR adds at least one
   review file whose final line states that no blocking finding remains.

7. **non-blocking — carried from round 01.**
   - The promise (`BACKLOG.md:20-22`) still says a release is tagged "only
     after" an independent check. D4 now gives the owner an override, so the
     promise needs "unless the owner overrides it".
   - C8's "carries the milestone rule (D5)" (`:112-113`) still does not
     require the run's copy to use the run's own tag scheme and no
     harness-only `rN` (the second half of round-01 finding 3).
   - C2 (`:69-70`) lists no milestone issue body, although the implementer
     posts one (C4), and the promise covers "every record the implementer
     posts" (`:19`).
   - How per-claim verdicts map to `AGREE`/`BLOCK` is still unstated: can
     `AGREE` stand with a COULD NOT TEST or a PARTLY MET?

8. **non-blocking — process notes.** The owner's answers go into the
   "owner" column in this PR (`BACKLOG.md:12-13`). That records owner
   decisions, a material edit (`PRINCIPLES.md:84-89`), so it takes another
   round. That round would be round 03, the one the Rounds rule sends to the
   owner if it does not end clean. Line 14 is 89 characters, a link line. The
   file has two older link lines over 80 (`:209`, `:219`), so this is
   optional.

## Verified

- Gate 0: head, remote ref and local HEAD agree. PR files equal the local
  diff, and the two paths are the ones expected.
- No change outside the section: every hunk of `c28ec6f..0650f74` falls in
  `BACKLOG.md:9-136`, and the rest of the file is unchanged.
- D2 matches the owner's settled rule: for a Claude-mode range, any model
  that is not Claude, DeepSeek included. Its only further exclusion is for a
  range with implementers from both modes, which that rule does not address.
- D4 no longer uses "waiver", so `PRINCIPLES.md:105-107` stays consistent.
- C4's commands are right: `git cat-file -t` gives `tag` for an annotated tag,
  and `git rev-parse r5^{commit}` peels it.
- C10's inline restatements match the Smaller item (`BACKLOG.md:273-277`),
  apart from "omits the bootstrap rule's trigger and its typo exception".
  That half is moot once the preamble stops listing the harness files.
- C6's three passages exist to be scoped: `CLAUDE.md` ("no AGREE/BLOCK
  marker"), `reviews/README.md:21-23`, `PRINCIPLES.md:94-99`.
- Every D row has a default, a reason and an empty owner column
  (`BACKLOG.md:45-55`). The table rows are the only new lines over 80
  characters besides line 14.

— Claude Opus 5.5 (claude-opus-5-5), reviewer
Three blocking findings remain (1: C1/C2 equality fails on the post-merge completion note; 2: C5's proof is a tautology; 3: C10's creation rule forbids the milestone reviewer's own verdict and finding issues).
