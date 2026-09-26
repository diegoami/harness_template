# Review: claim C13 added to r6 (PR #34), round 04

- **Revision covered:** `75c974765c8fe181cc2d980314b5348caab0968f`
  (branch `r6/add-c13`, base `main` at
  `f52bc9e4c8073716c04ac7ea551bf4ec67a57e08`).
- **Files reviewed:** `BACKLOG.md` (+171 −3),
  `docs/sources/hook-git-env-report.md` (+42, new),
  `docs/sources/ic2-worktrees.md` (+41, new), and
  `reviews/028-add-c13-impl-01.md` (+202), `-02.md` (+223) and `-03.md`
  (+169), all new. The three review files are my own, and I judged them
  only as posted. I got the list from `gh pr view 34 --json files`, and
  from `git diff --stat f52bc9e..75c9747`, which gives the same six files
  with the same counts. Since round 03, `75c9747` changes `BACKLOG.md`
  only.
- **Target proof:** `git remote get-url origin` is
  `git@github.com:diegoami/harness_template.git`. I ran `git fetch origin`,
  then checked out the head, detached, in this reviewer's own worktree
  (`.claude/worktrees/agent-afb9012c07f4bda14`, relative to the
  repository). The PR head from
  `gh api repos/diegoami/harness_template/pulls/34` is `75c97476…`, open,
  with base `main` at `f52bc9e4…`. `git ls-remote origin
  refs/heads/r6/add-c13` gives `75c97476…`. `git merge-base HEAD
  origin/main` is `f52bc9e4…`, which is also `origin/main`. All four
  agree. The branch holds nine commits, the last two `3d3901c` (round 03)
  and `75c9747`.
- **Read for context, not in the change:** `PRINCIPLES.md` (*Rounds*,
  *Owner decisions*, *Milestones*), `ADOPT.md` (its file lists at `:65`
  and `:213-214`, and its placeholder check at `:291-292`), and the PR
  body and its three comments.
- **Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`), the reviewer of rounds
  01 to 03, resumed. It has not seen the implementation.
- **Mode:** Claude Code, per-change review. There is no marker. This is
  round 04. Round 03 did not end clean and went to the owner under the
  ceiling (`PRINCIPLES.md`, *Rounds*).

## Round 03's findings

1. **Fixed, by the owner's fourth decision.** C13 (c) says the prompt
   "reaches every project". It ships with every preset, and `ADOPT.md`
   lists it among the files an adoption reads and always writes, with its
   placeholder check allowing the prompt's placeholders "in that file only"
   (`BACKLOG.md:234-238`). The proof now cites that `ADOPT.md` text
   (`:248-251`). The "Added" paragraph (`:288-292`) and the third
   decision's entry (`:965-966`) point to the adoption decision.
2. **Fixed.** C9's extension allows the prompt's placeholders "in that
   file only" (`BACKLOG.md:166-168`).
3. **Fixed.** (d) now covers all three cases (`BACKLOG.md:238-245`). With
   a pull request, the main session names GitHub's head; without one, the
   branch's head on `origin`, checked against the implementer's report;
   without a remote, the branch's local head, which the implementer
   reported. The proof's review-file line follows it: "the fetch (or that
   there is no remote)" and "the head commit it was given, as (d) names
   it" (`:263-268`).

## Findings

None.

## Verified

- **The fourth decision is recorded as reported.** The Notes entry
  (`BACKLOG.md:967-979`):
  - says it was asked in conversation under the round ceiling, because
    round 03 did not end clean;
  - gives the question: "should adoption (`ADOPT.md`) also write
    `reviews/review-prompt.md`?" It is marked as paraphrased, and it is
    the reported question with one line of context;
  - gives the choice, "Yes, adoption too", and the reason as shown to the
    owner (the owner's existing projects, which adopt, are where the
    problem happens);
  - gives both alternatives, "new projects only" and "waive and merge
    now", "The recommended default, taken", and the evidence, the merge of
    PR #34. The evidence is pending, which is not a finding.

  Nothing is presented as the owner's beyond the four decisions as
  reported. The other three entries (`:926-938`, `:940-953`,
  `:954-966`) are unchanged since round 03, apart from the pointer added
  at `:965-966`.
- **The prompt's reach is consistent everywhere it is stated.**
  - C13 (c): presets and `ADOPT.md`, with the ownership-map row.
  - C13's proof: the `ADOPT.md` text, and a generated run of every
    preset.
  - C9's extension: generated runs, in that file only.
  - C13's "Added" paragraph: the third and fourth decisions.
  - The third and fourth Notes entries.
  - The PR body.

  *In r6* and *Not in r6* say nothing about the prompt, so nothing there
  contradicts it. Adopted projects now receive the file their
  `PRINCIPLES.md` ownership-map row and `CLAUDE.md` rules will name. The
  "in that file only" scoping is the same in C9 and in `ADOPT.md`'s check.
- **The implementer's wording choices.** Leaving C9's reason without
  adoption is right. C9 claims only what a generated run holds, and its
  reason explains that. Adoption's reason lives in C13 and in the fourth
  entry, where the claim about adoption is. The rest of the new wording in
  (c) and (d) is precise and testable by `file:line`.
- **Nothing else new.** `75c9747` touches only C9's extension, C13's (c),
  (d), proof and "Added" paragraph, and the Notes. C1–C8, C10–C12,
  D1–D11, *In r6*, *Not in r6* and both sources are unchanged since round
  03. A reflow nit, not a finding: `BACKLOG.md:255` ends short after "and
  a test runs".
- **Round 03's posting.** `reviews/028-add-c13-impl-03.md` at the head
  equals the file I wrote. The PR's third comment equals it, apart from
  the final newline that `--jq` adds. It was posted at 19:32:51Z, after
  `3d3901c` (19:32:42Z) and before `75c9747` (20:03:05Z).
- **Names.** No file in the change, commit message of `3d3901c` or
  `75c9747`, or the PR body names the private project or any of its file
  names, paths, commit ids or identity values. The only occurrence in
  `BACKLOG.md` is the pre-existing *Planning* candidate (now `:669`), out
  of scope. The other projects the added lines name are already named on
  `main` before this PR: Imperial Conquest 2 (and its sibling path
  `../imperial_conquest_2`), boar_life and pgn-postmortem.
- **The PR body** matches the diff: six files, 848 insertions and 3
  deletions, the nine commits, C13's parts and proof including the
  `ADOPT.md` text, C9's extension "in that file only", the four Notes
  entries, the answers to round 03 (each checked above), and *Left out*,
  which now names the `ADOPT.md` text as part of the next pull request.
- **Wrapping.** No added line in `BACKLOG.md` or the sources exceeds 79
  columns.
- **Gates at `75c9747`:** `node --test tools/*.test.mjs` gives 60 pass,
  0 fail; `node --check` passes on all four `tools/*.mjs`.
- **Clean-up.** Nothing was posted, committed or pushed. My untracked copy
  of round 03 was moved aside before the checkout, and it is identical to
  the committed file.

— Claude Opus 5.5 (claude-opus-5-5), reviewer
No blocking finding remains.
