# Review: the four protocol gaps and two milestone questions (r5, C7), implementation round 01

**Revision reviewed:** `f28d05b7ab985a9cb99bcc8aa6bc777903a66bc4`
(`f28d05b`, branch `r5/protocol-gaps`). Three sources agree on this SHA: PR
#21's `headRefOid` (`gh pr view 21 --json headRefOid,files`),
`git ls-remote origin refs/heads/r5/protocol-gaps`, and `git rev-parse HEAD`.
The working tree was clean.

**Files checked:** PR #21's file list is `AGENTS.md`, `BACKLOG.md`,
`PRINCIPLES.md`, `presets/auto.json`, `presets/light.json`,
`presets/standard.json` and `reviews/milestone-prompt.md`. It equals the
local diff: `git merge-base HEAD origin/main` = `42d8bca`, then
`git diff --name-only 42d8bca HEAD`. There is one commit, `f28d05b`.

**Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`), a fresh-context session
that has not seen the implementation.

**Mode:** Claude. No design stage, no marker.

**Method:** read-only in the repository and on GitHub. I generated each
preset from the head SHA into the scratchpad, without `--github`, and deleted
the runs afterwards. The only write in the repository is this file. Nothing
was posted, committed or pushed.

## C7, requirement by requirement

C7 (`BACKLOG.md:138-143`), with D6, D7 and D11 (`BACKLOG.md:66-71`):

- "`design: none` has one home for a bypass amendment and one for an
  OpenCode completion note (D7)". **Met.**
  - D7: "the bypass amendment goes in the project slot; the completion note
    in the last implementation review file".
  - The text: "the completion note goes in the last implementation review
    file (as in Claude mode); an owner amendment that would otherwise bypass
    a design stage goes in the project slot" (`PRINCIPLES.md:141-147`).
  - The Waiver bullet agrees: "(under `design: none`, in the project slot)"
    (`PRINCIPLES.md:115-116`). The two homes no longer disagree.
- "`PRINCIPLES.md` says a record is held to the rules in force when written
  (D11)". **Met.**
  - The text: "A record is held to the rules in force when it was written"
    (`PRINCIPLES.md:148-151`).
  - The ownership map names the idea (`PRINCIPLES.md:15`). The extra clause
    is discussed in finding 4.
- "the Rounds rule says how a round after a clean round counts (D6)".
  **Met.**
  - D6: "rounds count on through a stage, and any round from the third that
    does not end clean goes to the owner".
  - The text: "Rounds keep counting through a stage after a clean round …
    any round from the third on that does not end clean goes to the owner"
    (`PRINCIPLES.md:101-104`).
- "the `light` preset links no file it does not ship … a `light` run
  generated from the candidate has no dangling relative link". **Met.**
  - `AGENTS.md:31-33` names `design/README.md` in a code span now, not as a
    link.
  - `presets/light.json:8` ships the prompt.
  - Results below (*Verified*).

## The new rules

- **Rounds after a clean round.** This text conflicts with nothing.
  - It extends the ceiling ("It does not loop", `PRINCIPLES.md:101`) rather
    than resetting it.
  - It matches what the owner did on PR #14: a fourth round after a third
    that did not end clean (`BACKLOG.md:13-14`).
- **The stopped-review rule** (`PRINCIPLES.md:104-105`).
  - It agrees with *Fallback* ("no review and no approval",
    `:109-110`). For a wrong target, *Fallback*'s "retry" is the natural
    path.
  - It agrees with Gate 0's stop (`:84-85`), and with `reviews/README.md:12-13`
    ("a wrong target, not a finding").
  - It does not fit milestone rounds (D10) or the prompt's output. See
    finding 2.
- **"Rules apply going forward."** The correction clause matches both
  corrections, element by element. It goes beyond D11. See finding 4.
- **`design: none`.** I walked every design-record reference in
  `PRINCIPLES.md`. Each one resolves:
  - `:74-76` (records): the stage does not exist.
  - `:87-90` (materiality): the catch-all applies.
  - `:96-97` (design verdicts as rounds): no design stage.
  - `:115-116` (waiver): its own home.
  - `:123-127` (defect path): its own home.
  - `:128-129` (completion, "the change's record"): its own home.
  - `:160-163` (posting): conditional on a design stage.
  - `:172-173` (a PR names "a design record"): the catch-all applies.

  The catch-all reads oddly at `:173`: a PR would "name" an implementation
  review file as what it implements. This was the same under the old
  "every reference" wording, so it is not a finding.

## Findings

1. **blocking. The rule and the prompt now give different spans for the
   plan-history check.**
   - This change moves the prompt to
     `log -p {{CLAIMS_FIXED}}..HEAD -- {{PLAN}}`
     (`reviews/milestone-prompt.md:70-74`). It adds "The claims are fixed
     when the change that records them lands" (`PRINCIPLES.md:201-204`), and
     puts the fixing commit on the milestone issue (`:207-208`).
   - The reviewer bullet was not touched. It still says the reviewer checks
     "the plan's history since the previous tag for a claim weakened or
     changed without its reason" (`PRINCIPLES.md:215-217`). That is the
     exact span PR #19's round 02 finding 1 said would report the drafting
     of the claims as findings.
   - The prompt tells the reviewer to read `PRINCIPLES.md` as "the rules you
     review against" (`milestone-prompt.md:89-90`). A reviewer who follows
     the rule rather than the prompt gets round 02's false findings back.
   - `PRINCIPLES.md:27-28`: "A contradiction found between files is
     recorded as a defect and fixed in the change that found it". This
     change creates the contradiction.
   - *Fix:* reword `:216-217` as "the plan's history since the commit that
     fixed the claims".
2. **blocking. The prompt still makes a stopped review post a verdict with a
   marker, but the rule now says a stop is no review and not a round.**
   - The rule: "A review that stops before judging — a wrong target (above),
     or a reviewer who may not review — is no review (*Fallback*) and not a
     round" (`PRINCIPLES.md:104-105`). Directly after it: "each verdict on
     its milestone issue is one round" (`:106-107`).
   - The prompt covers both kinds of stop. A reviewer of an excluded family
     must "stop, and make your one verdict comment say so"
     (`milestone-prompt.md:40-41`), and so must a failed target proof
     (`:47-48`). The output is "Then, always, one verdict comment"
     (`:116`), whose last line is "AGREE if no claim is NOT MET and no
     finding blocks, otherwise BLOCK" (`:126-128`).
   - So a stop still posts what the prompt calls a verdict, on the
     milestone issue. `:106-107` counts that as a round, and `:104-105`
     says it is not one. Read literally, a stop with no claims judged and no
     findings satisfies "no claim is NOT MET and no finding blocks", so its
     last line would be `AGREE`. `reviews/README.md:27-28` requires the
     marker on every milestone verdict.
   - PR #19's round 02 finding 3 asked both halves: "say whether a stop ends
     `BLOCK` and counts as a round". This change answers only the second
     half, and only in `PRINCIPLES.md`.
   - The per-change side is also unsettled. Rounds are counted by files
     ("each implementation review file (`-NN`), is one round",
     `PRINCIPLES.md:96-97`; `NN` "increments per review round",
     `reviews/README.md:3-4`). The rule does not say whether a stopped
     review writes an `-NN` file.
   - *Fix:*
     - In the prompt, a stop posts a comment that says which check failed,
       carries the signature and no marker line, and is not a verdict.
     - In the Rounds rule, make clear that such a comment, or a stopped
       per-change review, takes no round number. Say whether a stopped
       per-change review writes a file.
3. **non-blocking. The verdict-copy rule leaves one path without a home, and
   the fix-PR path strains C1's per-PR proof.**
   The new rule: "A `BLOCK` verdict's copy lands with the first pull request
   that fixes one of its findings … the `AGREE` verdict's copy lands after
   the tag, with its completion note" (`PRINCIPLES.md:244-248`).
   - **BLOCK, then fix PRs:** `git log --first-parent` gains only a PR
     merge, so C1's first-parent proof (`BACKLOG.md:81-82`) holds.
   - **AGREE:** the copy lands after the candidate, outside
     `<landing merge>..<candidate>`, so C1 holds for r5.
   - **BLOCK with no fix PR:** every finding may be triaged "not a defect"
     or "accepted gap" (`PRINCIPLES.md:233-238`), or a stop may end
     `BLOCK` (finding 2). Then no pull request "fixes one of its findings",
     and the rule gives the copy no home.
     - *Fix:* "otherwise with the `AGREE` verdict's copy, after the tag".
       That keeps C1.
   - **The per-PR half of C1:** C1 requires that "every r5 PR adds at least
     one review file, and each has exactly one PR comment equal to the file"
     (`BACKLOG.md:83-86`). The fix PR would add `reviews/r5-milestone-NN.md`,
     but that file's comment is on the milestone issue, not the PR. Under
     the natural reading of "each", C1 would be PARTLY MET on r5's
     re-review.
     - *Fix:* say that the copy is not posted on the PR, and scope C1's
       "review file" visibly to implementation reviews.
   - **For r6:** the `AGREE` copy is a new file under `reviews/**`, committed
     straight to `main`. It is not a "completion-note commit that changes
     only a `## Completion` section" (`BACKLOG.md:32-34`), and it opens the
     next milestone's range. PR #19's reason ("transcribe records and change
     no rule") was removed, and "as a completion note does" replaces it.
     This matters only if r6 repeats C1. Note it for the r6 scope.
4. **non-blocking. "Rules apply going forward" adds a correction rule beyond
   D11, and states "not backfilled" without the exception this repository
   used.**
   - D11 generalizes the Notes decision (`BACKLOG.md:390-397`). That
     decision is the first two sentences of `PRINCIPLES.md:148-150`.
   - The clause "a record that is corrected after the fact says so, keeps
     its original text, and is signed by whoever corrects it" (`:150-151`)
     is new. It matches both precedents on all three points:
     - `design/001-harness-release-1.md:5-7` says "(corrected 2026-09-23)",
       keeps the line ("The line above is kept as written"), and is signed
       at `:373-374`;
     - `design/004-release-4.md:177-185` says "**Correction** … after
       landing", keeps the note ("kept as written"), and is signed.
   - It comes from the design/001 exception (`BACKLOG.md:398-407`), not
     from D11. And design/001's completion was a backfill of a later rule,
     which `:149-150` ("it is not backfilled") now forbids without
     exception.
   - *Fix:* either add "unless the owner decides otherwise, recorded", or
     record the clause as the owner's decision. The owner should decide
     which.
5. **non-blocking. C8's narrowing, read mechanically, fails at this head.**
   - C8 now says "the exception covers only the placeholders the prompt
     documents, so any other `{{…}}` in it … still fails"
     (`BACKLOG.md:155-158`).
   - The prompt's preamble contains the literal `` `{{…}}` ``
     (`reviews/milestone-prompt.md:4`, "fills in every `{{…}}`
     placeholder"). That string is not a documented placeholder, and every
     preset ships it.
   - A `grep -o '{{[^}]*}}'` over a generated run finds it: 1 hit per run,
     next to the 15 documented names.
   - *Fix:* reword `:4` (for example "every double-brace placeholder"), or
     scope the narrowing to placeholder names.
6. **non-blocking. Parts of PR #19's round 02 are neither answered nor
   listed as left out.**
   - PR #19's completion note says round 02's findings are "to settle
     before the r5 milestone" (`reviews/014-milestones-impl-02.md:220-221`).
   - This PR does not answer three of them, and its "Left out" does not
     name them:
     - finding 4's request that the junction test be shown red before the
       fix (discipline 3);
     - finding 4's point that the C2 extension lacks a recorded default and
       an owner-decision mark;
     - finding 5's point that C8's two additions are labelled "the claim
       was wrong" although they are extensions.
   - *Fix:* answer them, or name them in "Left out" with where they go.
7. **non-blocking, wrapping.**
   - Round 02's finding 6 is not fixed. "every claim a verdict —" is still
     a short line (`PRINCIPLES.md:218`). The PR body says "the merge-policy
     wrap is fixed", but that is a different bullet (`:136-140`).
   - This change adds two new short lines inside paragraphs:
     - "results on the candidate, and gives" (`PRINCIPLES.md:209`);
     - "project with a design stage has):" (`AGENTS.md:33`).

## Verified

- **Gate 0:** as above. The PR has one commit, and no comments yet.
- **Generated runs:** `node tools/scaffold.mjs --yes --ref f28d05b7… --preset
  <p> --name t --dir <scratch>`, with no `--github`.
  - `light` (7 `.md` files), `standard` and `auto` (10 each) exit 0.
  - Every run ships `reviews/milestone-prompt.md`.
  - `light` ships no `design/README.md`.
  - The runs were deleted afterwards.
- **Links:** I rewrote the link checker (`check-links2.mjs` in the
  scratchpad). It also handles reference definitions, `<…>` targets and
  fence kinds.
  - Results, counting relative links outside code fences: `light` 18
    checked, 0 dangling; `standard` 27, 0; `auto` 27, 0.
  - The check catches a break: `light` generated from the base `42d8bca`
    shows 3 dangling links (`AGENTS.md:32 → design/README.md`,
    `PRINCIPLES.md:199` and `reviews/README.md:8 → milestone-prompt.md`).
  - None of the changed files has a dangling link in the repository.
- **Placeholders:** 15 are documented (`milestone-prompt.md:10-24`), and
  each is used in the fence. `{{CLAIMS_FIXED}}` is documented at `:14-15`
  and used at `:70-71`.
  - The reviewer is told to verify it "from the plan's own history"
    (`:71-72`). A later commit would hide changes, and that check catches
    it. An earlier commit only widens the check. So the builder cannot
    steer the review this way.
  - Outside the prompt, no generated file has a `{{…}}` token.
- **`427749c`:** it is PR #14's merge (parents `d67c94b`, `cd6d3c2`).
  - `BACKLOG.md` has no "Release 5: scope and claims" and no claim at
    `d67c94b`, and has 11 claims at `c28ec6f`, the first commit of PR #14.
  - It is the first-parent merge on `main` that recorded the claims, so
    `{{CLAIMS_FIXED}}` = `427749c` is right for r5.
  - `427749c..f28d05b -- BACKLOG.md` holds `49bb3b3`, `0ece338`,
    `062db44`, `dbfbfa0`, `e254e26` and `f28d05b`.
- **"This harness":** gone from every shipped file (`PRINCIPLES.md`,
  `reviews/milestone-prompt.md`). It survives in no generated run.
- **C5 on the two claim changes:** in the full diff, `BACKLOG.md` changes
  only C2 (`:104-107`) and C8 (`:155-158`).
  - Both are bold, dated 2026-09-24 and name PR #21. Each carries its reason
    in the same commit: C2 says "meaning unchanged … the repository has no
    CI", and C8 names its effect on an unfilled `{{PROJECT}}`.
  - Neither weakens its claim.
    - C2 now names the real function, `checkPrHolds`
      (`tools/post-record.mjs:301`). The test is
      `tools/post-record.test.mjs:607-645`, with real `git` through a
      junction. There is no `.github/`, so the CI reading could never be
      met.
    - C8 narrows an exception, which strengthens the claim (finding 5
      aside).
  - C1, C3–C7, C9–C11, the promise, the decisions and the not-in-r5 list
    are untouched.
- **Checks:** `node --check` passes on all three `tools/*.mjs`, and
  `node --test tools/post-record.test.mjs` passes 30 of 30. No tool changed.
- **Ownership:** nothing is restated outside its owner.
  - The Waiver parenthetical and the `design: none` bullet share one owner,
    `PRINCIPLES.md`.
  - `AGENTS.md` only drops a link.
- **Scope:** every hunk is in the aim.
  - The merge-policy rewrap (`PRINCIPLES.md:136-140`) changes no words.
  - The presets change only their file lists.

— Claude Opus 5.5 (claude-opus-5-5), reviewer
Two blocking findings remain (1 and 2).
