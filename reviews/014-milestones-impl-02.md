# Review: the milestone rule and its prompt (r5, C4, C5, C6, C11), implementation round 02

**Revision reviewed:** `e254e264b3c4a377a58ab384ac49f3f615c6e6e5`
(`e254e26`, branch `r5/milestones`). Three sources agree on this SHA: PR
#19's `headRefOid` (`gh pr view 19 --json headRefOid,files`),
`git ls-remote origin refs/heads/r5/milestones`, and `git rev-parse HEAD`.
The working tree was clean.

**Files checked:** PR #19's file list is `AGENTS.md`, `BACKLOG.md`,
`CLAUDE.md`, `PRINCIPLES.md`, `reviews/014-milestones-impl-01.md`,
`reviews/README.md` and `reviews/milestone-prompt.md`. It equals the local
diff: `git merge-base HEAD origin/main` = `6bb9505`, then
`git diff --name-only 6bb9505 HEAD`. There are three commits:
- `dbfbfa0`, which round 01 reviewed;
- `8dbfb50`, which adds only the round-01 file;
- `e254e26`, the fixes, which I reviewed as `git diff 8dbfb50 e254e26`,
  and within the full diff from the merge base.

**Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`), a fresh-context session
that has not seen the implementation (the round-01 reviewer, continued, as
*Reviewer sessions* allows).

**Mode:** Claude. No design stage, no marker.

**Method:** read-only in the repository and on GitHub. The only write is
this file. Nothing was posted, committed or pushed.

## Round 01, re-checked

1. **Fixed** (it was blocking).
   - `{{PLAN}}` is documented (`milestone-prompt.md:13-17`) and used in THE
     PLAN block (`:67-72`). The reviewer compares the pasted text with the
     plan at the candidate, and reads the plan's `log -p`. A mismatch or a
     weakened claim is a finding.
   - The rule names the plan's home: "one file in the repository, which the
     milestone issue names (this harness: `BACKLOG.md`)"
     (`PRINCIPLES.md:190-191`).
   - The milestone issue lists the plan file (`:196`), and the reviewer
     bullet carries the check (`:203-206`).
2. **Fixed.**
   - `{{KNOWN}}` "excuses nothing" (`milestone-prompt.md:80-84`): a known
     item that breaks a claim or blocks the release counts against `AGREE`,
     and the reviewer grades it.
   - `{{EXCLUDED}}` is checked against the authors and the
     `Co-Authored-By` trailers (`:36-40`).
3. **Fixed.** The target proof now covers the missing steps
   (`milestone-prompt.md:46-60`):
   - a clone if needed, and `fetch --tags`;
   - `merge-base --is-ancestor` against `origin/main`;
   - `cat-file -t` on the previous tag must print `tag`;
   - an empty list means stop.

   `r1`–`r4` are all annotated (`git cat-file -t` prints `tag`), and `r4`
   is an ancestor of `origin/main`, so r5's review passes these steps.
4. **Fixed, with one question left** (new finding 3).
   - A stop now goes in the one verdict comment (`:39-40`, `:46-47`).
   - The limits allow a comment on an existing issue (`:99-100`).
   - The marker is described in words (`:122-125`, preamble `:25-27`).
   - The header names the mode, "milestone review" (`:114-116`).
5. **Fixed.** "The record" (`PRINCIPLES.md:227-236`) settles two things:
   - the reviewer posts with `gh … --body-file`;
   - the comment is the record until it is copied into `reviews/`, and the
     file is canonical from then on.
6. **Fixed, with a consequence** (new finding 2). The tag's checks go in a
   `## Completion` section on the last verdict's copy (`PRINCIPLES.md:230-233`),
   which places C4's "the completion note records both".
7. **Recorded.** C8 now requires shipping the prompt and excepts the
   prompt's placeholders (`BACKLOG.md:141-152`). Its C5 status is judged
   below.
8. **Fixed.** `CLAUDE.md:22-23` is a pointer now. It also states that the
   verdict carries the marker, which C6 needs.
9. **Taken as the owner's decision.** The three places agree:
   - the in-r5 line (`BACKLOG.md:36-39`: "other than the linked-checkout
     defect");
   - the "Not in r5" list (`:51-54`, which also gains the verification
     pattern);
   - the follow-ups item (`:368-375`).

   The earlier posting checks out:
   - the round-01 comment on PR #19 (2026-09-24T07:09:18Z) equals
     `reviews/014-milestones-impl-01.md`, apart from line endings and the
     trailing newline;
   - it came after `8dbfb50` (09:09:07+02:00) and before `e254e26`
     (10:00:08+02:00).

## C5 on the two claim changes

- **C2, "Extended again on 2026-09-24"** (`BACKLOG.md:100-104`).
  - It is visible (bold and dated), its reason is in the same commit
    `e254e26` ("a defect in r5's own tool and blocks posting where the temp
    directory is a link"), and it names a proof.
  - It adds a requirement, so it is **not a weakening**. It meets C5,
    subject to finding 4.
- **C8, "Corrected on 2026-09-24", as "the claim was wrong"**
  (`BACKLOG.md:141-152`).
  - It is visible, dated, reasoned and in the same commit.
  - The exception is forced: C11 and the rule require a fixed template with
    placeholders, and D5 gives scaffolded runs milestone reviews. So "no
    `{{…}}`" as first written could not be met together with those. That
    is the case "the claim was wrong" is for.
  - The claim also gains two requirements: shipping the prompt, and the
    `auto` line naming posted reviews.
  - Net, it is **not a weakening**. It meets C5, subject to finding 5.

## Findings

1. **non-blocking. The plan-history check starts at the previous tag, not
   at the point the claims were fixed.**
   - The prompt has the reviewer read
     `log -p {{PREVIOUS_TAG}}..HEAD -- {{PLAN}}`, and says "every change to a
     claim must be visible, dated and carry its reason"
     (`milestone-prompt.md:69-71`). The rule uses the same span: "the plan's
     history since the previous tag" (`PRINCIPLES.md:204-206`).
   - For r5, `r4..candidate` includes PR #12's and PR #14's drafting of the
     claims across their review rounds. Those were scoping, before the work
     started (`PRINCIPLES.md:187-188`), and they are not dated per change. A
     reviewer following the prompt literally would report them as findings.
   - C5's own proof starts at `<landing merge>` (`BACKLOG.md:128`), which
     is a narrower span.
   - *Fix:* check changes after the claims were recorded. The milestone
     issue or a placeholder should name that commit (for r5, `427749c`).
2. **non-blocking. A verdict copy committed "as a completion note is" falls
   outside C1's categories.**
   - "The copy and its completion note … are committed as a completion note
     is" (`PRINCIPLES.md:233-235`).
   - C1's proof accepts only these first-parent commits on `main`: "r5 PR
     merges, completion-note commits and trivial changes" (`BACKLOG.md:81-82`).
     Elsewhere a completion-note commit is one "that changes only a
     `## Completion` section" (`:32-33`).
   - A verdict copy adds a whole file under `reviews/**`, so the
     conservative floor makes it non-trivial.
   - On a `BLOCK`, the round-01 copy would land on `main` before the moved
     candidate. It would then sit inside `<landing merge>..<candidate>`,
     and C1 would be NOT MET on r5's own re-review.
   - *Fix:* say when the copies land (for example, all of them after the
     tag), or correct C1 visibly to admit verdict-copy commits.
3. **non-blocking. A stopped review's marker and round are not settled.**
   - A reviewer of an excluded family, or a failed target proof, "stop[s],
     and make[s] your one verdict comment say so"
     (`milestone-prompt.md:39-40`, `:46-47`).
   - The output still asks for a last line of `AGREE` or `BLOCK` (`:122-125`),
     and "each verdict on its milestone issue is one round"
     (`PRINCIPLES.md:101-103`).
   - Fallback treats a failed review as "no review and no approval"
     (`PRINCIPLES.md:104-105`). So say whether a stop ends `BLOCK` and
     counts as a round, or is no review. As written, a family mismatch can
     use up one of the three rounds.
4. **non-blocking. C2's new proof names a check that does not exist.**
   - The proof reads "a test … through a directory junction or symlink
     passes the PR check" (`BACKLOG.md:103-104`).
   - This repository has no CI workflow: there is no `.github/` directory,
     and the only check on PR #19 is GitGuardian.
   - *Fix:* name the command (`node --test tools/post-record.test.mjs`),
     and require that the test is red before the fix (discipline 3).
   - The owner's decision is recorded only inline, "by the owner's decision
     (PR #19)". It lacks the recommended default and the owner-decision mark
     that *Owner decisions* asks for (`PRINCIPLES.md:112-113`). The PR #16
     precedent recorded its decision in the Notes (`BACKLOG.md:405-416`).
5. **non-blocking. C8's correction is broader than it needs to be, and
   mislabels its additions.**
   - The exception covers the whole file ("outside
     `reviews/milestone-prompt.md`", `BACKLOG.md:144`). So an unfilled
     placeholder the scaffold is meant to substitute, such as `{{PROJECT}}`,
     would pass there unnoticed.
   - "Other than the prompt's documented placeholders" keeps the check's
     purpose.
   - The two additions (shipping the prompt, and the `auto` line suggested
     in PR #17's round 02) are an extension, not a correction. They sit
     under the "the claim was wrong" label (`:149-152`); label them as what
     they are.
   - A generated run will also inherit "this harness: `BACKLOG.md`"
     (`PRINCIPLES.md:191`, `milestone-prompt.md:13-14`). C8 covers the tag
     scheme but not this line.
6. **non-blocking, wrapping.** The rewrap leaves a short line in the
   reviewer bullet: "every claim a verdict —" (`PRINCIPLES.md:206`). Every
   other added line is 79 characters or fewer.

## Verified

- **Gate 0:** as above. `8dbfb50` touches only the round-01 file.
- **Placeholders:** 14 are documented (`milestone-prompt.md:10-23`), and all
  14 are used in the fence. `{{PLAN}}` is used at `:67` and `:69`.
- **The fence:** it no longer carries a copyable marker line.
- **Encoding:** the prompt is UTF-8, with no byte-order mark and no
  carriage returns.
- **C4, C5, C6, C11:** the round-01 mappings still hold at `e254e26`.
  - The line numbers in `PRINCIPLES.md` shifted: the reviewer bullet is
    `:201-212`, the tag `:213-221`, triage `:222-227`, and the record
    `:228-236`.
  - C6's passages are `CLAUDE.md:20-23`, `reviews/README.md:25-28` and
    `PRINCIPLES.md:101-103`.
  - C11's `--body-file` requirements are at `milestone-prompt.md:126-129`
    and `PRINCIPLES.md:228-236`.
- **The claim changes:** in the full diff, `BACKLOG.md` changes only C2 and
  C8. Both are judged above. C1, C3–C7 and C9–C11 are untouched.
- **Checks:** `node --check` passes on `tools/*.mjs`, and
  `node --test tools/post-record.test.mjs` gives 29 of 29. No tool changed.
- **Scope:** nothing changed outside the aim and the round-01 answers.

— Claude Opus 5.5 (claude-opus-5-5), reviewer
No blocking finding remains.
