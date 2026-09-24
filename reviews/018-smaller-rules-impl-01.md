# Review: the creation-path rule and the last small rules (r5, C10), implementation round 01

**Revision reviewed:** `fecefac7beaf8534fc9a08619d2f224bf1c365c5`
(`fecefac`, branch `r5/smaller-rules`). Three sources agree on this SHA: PR
#23's `headRefOid` (`gh pr view 23 --json headRefOid,files`),
`git ls-remote origin r5/smaller-rules`, and `git rev-parse HEAD`. The
working tree was clean.

**Files checked:** PR #23's file list is `BACKLOG.md`, `PRINCIPLES.md`,
`README.md` and `ROADMAP.md`. It equals the local diff:
`git merge-base HEAD origin/main` = `5cfec3c`, then
`git diff --name-only 5cfec3c HEAD`. The change is one commit, `fecefac`.

**Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`), a new session that has
not seen the implementation.

**Mode:** Claude. No design stage, no marker.

**Owner's decision taken as given:** the creation-path rule covers builders
too. A builder tests a posting or creating path only against fakes, a scratch
repository or a dry run, and runs it for real only for the real record.

**Method:** read-only in the repository and on GitHub. I generated the three
presets from `fecefac` into the scratchpad, without `--github`, and deleted
them afterwards. I did not run `post-record.mjs` at all. The only new file in
the repository is this one. Nothing was posted, committed or pushed.

## Findings

1. **blocking — the rule's first sentence forbids what its builder sentence
   allows.** `PRINCIPLES.md:162-164` says: "Nobody exercises a path that
   creates something outside a temporary directory — a repository, an issue,
   a comment, a push — only to test it." `PRINCIPLES.md:167-168` then lets a
   builder test "against fakes, a scratch repository or a dry run".
   Elsewhere in this repository a scratch repository is a GitHub repository.
   `BACKLOG.md:358` says "Scratch-repository deletion needs the token's
   `delete_repo` scope", and `BACKLOG.md:35` and `:46` say the same. Read that
   way, the builder sentence allows creating a repository only to test in it,
   plus pushes, issues and comments there, which the first sentence forbids.
   Read the other way, as a local repository in a temporary directory, the
   builder sentence adds nothing, and a builder cannot tell which reading
   applies. This matters now: the scaffold's `--github` has no dry run
   (`tools/scaffold.mjs:11`; `--github` calls `gh repo create` directly), and
   `tools/scaffold.test.mjs:3` never uses it. So the only tests of that path
   the builder sentence allows are a fake `gh` or a scratch repository. C10's
   extension (`BACKLOG.md:172-176`) and the Notes (`BACKLOG.md:437-442`)
   repeat "a scratch repository" without saying where it lives. The first
   sentence was the implementer's framing, and the scratch repository was
   the owner's wording, so the text has to follow the owner's decision.
   *Smallest fix:* say where the scratch repository lives. If it is local, write "a
   scratch repository in a temporary directory". If it is remote, add a
   builder's scratch repository as an exception to the first sentence. The
   Backlog's use of the term suggests the owner meant a remote one. If
   that is not clear, ask the owner rather than choose.

2. **non-blocking — "the real record" does not fit `--github`.**
   `PRINCIPLES.md:168-169` says "runs it for real (`--confirm`, `--github`)
   only to post or create the real record". C10's extension uses the same
   words (`BACKLOG.md:175-176`), and the Notes say "for the real record"
   (`BACKLOG.md:439-440`). `--github` does not create a record. It creates the
   project's repository. A reader could conclude that `--github` may never be
   run for real. *Fix:* "the real record or repository", or "for real use".

3. **non-blocking — in a run, the rule names flags of tools the run does not
   have.** Runs generated from `fecefac` (`light`, `standard`, `auto`) have
   no `tools/` directory, but their `PRINCIPLES.md` (line 162 on) carries
   "(`--confirm`, `--github`)". *Posting* already handles this with "where
   the project has it" (`PRINCIPLES.md:179`). *Fix:* "(for the harness's own
   tools, `--confirm` or `--github`)", or leave the flags as examples.

4. **non-blocking — the exemption list is shorter than the reviewer's allowed
   writes.** `PRINCIPLES.md:165-166` exempts "its own finding issues and
   verdict". The milestone prompt also allows a stop notice and a comment on
   an existing issue for the same finding (`reviews/milestone-prompt.md:43-45`,
   `:106-108`). Neither of those runs code under review, and neither is done
   "only to test it", so the rule does not forbid them. But the list reads as
   if it names everything the reviewer may post. *Fix:* "its own posts (finding
   issues, comments, the verdict or a stop notice)".

5. **non-blocking — the Release 5 preamble summarises the claim-change rule
   and leaves words out** (task 4; this diff did not touch it).
   `BACKLOG.md:15-17` says "A claim changes only here, visibly and with its
   reason, and is never weakened to pass". The rule (`PRINCIPLES.md:212-215`)
   and the milestone prompt (`reviews/milestone-prompt.md:76-78`) also
   require "dated" and "in the same commit". The two texts do not
   contradict, and C5's proof (`BACKLOG.md:128-131`) points at the history, not
   at this sentence. Still, a strict milestone reviewer could quote the weaker
   wording. *Fix:* add "dated" and "in the same commit", or replace the
   sentence with a pointer to `PRINCIPLES.md` (*Milestones*).

6. **non-blocking — wrapping.** In `ROADMAP.md:17-19` the new text was not
   reflowed. Line 18 is "middle states. **Only the owner parks or" and line 19
   is "refuses**, …", about 40 characters each, against the file's roughly
   78-column wrap. The other three files wrap to their convention.

## Verified

**Gate 0.** The head is `fecefac` on the PR, on the remote and locally. The PR's
file list equals `git diff --name-only 5cfec3c HEAD`. `5cfec3c` is
`origin/main`'s tip.

**C10, requirement by requirement, as `BACKLOG.md:163-176` words it:**

| C10 requirement | where it is met |
|---|---|
| `PRINCIPLES.md` "rules that a review never runs the code or tools under review on a path that creates something outside a temporary directory (no `--github`, no creating command inside the code under review)" | `PRINCIPLES.md:164-166`, and the map row, `PRINCIPLES.md:15` ("creation paths") |
| "the reviewer's own verdict and finding issues are its output and are exempt" | `PRINCIPLES.md:165-166` |
| "`reviews/README.md` names milestone reviews (D9)" | `reviews/README.md:6-10` (landed earlier) |
| "`ROADMAP.md`'s `in design` status assuming a design stage" is gone | `ROADMAP.md:16-17`, conditional; `:25-26` and `:46-47` were already conditional |
| "`README.md` giving OpenCode 'the design agreed before code' unconditionally" is gone | `README.md:13-14`, "(unless the slot records `design: none`)" |
| "and saying the modes differ only in how the reviewer is obtained" is gone | `README.md:20-23` |
| "this file's preamble listing the harness files itself" is gone | `BACKLOG.md:3-5` points to the bootstrap and the non-trivial test. It also settles the trigger and typo-exception gap that `BACKLOG.md:362-363` records. |
| extension: "a builder tests a posting or creating path only against fakes, a scratch repository or a dry run, and runs it for real only to post or create the real record" | `PRINCIPLES.md:167-169`. It is present, but see findings 1 and 2. |

**The requested interactions:**
- *Posting* and `post-record.mjs --confirm`. The implementer's real posting
  (`PRINCIPLES.md:174-182`) is "the real record", which the builder sentence
  allows. The tool is a dry run without `--confirm` (`tools/post-record.mjs:10`,
  `:352-353`), which is one of the builder's allowed tests. Its tests use a
  fake `gh`. There is no conflict.
- *The milestone reviewer's own issues and verdict.* They are exempt
  (`PRINCIPLES.md:165-166`), and they match the prompt's LIMITS
  (`reviews/milestone-prompt.md:106-111`), which already forbade creating
  paths in the same words. For the other allowed posts, see finding 4.
- *The scaffold's `--github`.* The reviewer clause names it, and D8's
  default `none` stands (`tools/scaffold.mjs:166`). For the builder's side,
  see findings 1 and 2.
- *Reviewers running the scaffold into temporary directories* (C8,
  `BACKLOG.md:142-149`). The rule allows it, since it creates nothing outside
  a temporary directory. I did it: `light`, `standard` and `auto` from
  `fecefac` with `--yes`, exit 0, no remote. There was no `{{` outside
  `reviews/milestone-prompt.md`, and each run carries the new rule. The only
  stderr was `auto`'s expected "merge: auto without a remote" warning.
- *The implementer posting review files* is the real record. It is allowed and
  required.
- *The stated reason.* PR #15 has a README body posted at
  2026-09-23T19:18:07Z and an explanation at 20:05:53Z saying it "was posted
  in error". That confirms the reason given in `BACKLOG.md:176` and `:441-442`. The stray
  comment does not equal any `010-post-record-impl-NN.md`, so C1's "exactly
  one PR comment equal to the file" still holds for PR #15.

**The restatements.** All three are gone, as the table shows. The new README
sentence is accurate. OpenCode's per-change verdicts end with `AGREE`/`BLOCK`
(`AGENTS.md:36-39`, `reviews/README.md:21-26`). Claude mode's per-change
reviews carry no marker (`CLAUDE.md:20-21`, `reviews/README.md:26-29`).
Milestone verdicts carry it in both modes (`CLAUDE.md:22-23`,
`reviews/README.md:29-30`, `PRINCIPLES.md:199`, `:231`). So "a change's
verdict" is scoped correctly, and "share … the milestone review" is true.
"Differ … in the design stage" is loose for an OpenCode `design: none` run,
but `README.md:14` now makes that exception visible. The change restates
nothing new: the ownership map gains "creation paths", and the rule lives
only in `PRINCIPLES.md`.

**C5 on the three claim changes (all in `fecefac`, dated 2026-09-24, with
reasons):**
- *C10, extended* (`BACKLOG.md:172-176`). It is dated, gives the owner's
  decision and the PR #15 stray comment as the reason, and has a matching
  Notes entry (`:437-442`). It adds to the claim and weakens nothing.
- *C11, corrected* (`BACKLOG.md:189-194`). PR #21 (`55aa8c2`) introduced
  the post-tag copy. `git diff 42d8bca 55aa8c2 -- PRINCIPLES.md` adds
  "Every verdict's copy … lands after the tag", now `PRINCIPLES.md:255-258`,
  and the "When a verdict arrives" bullet (`:243-248`) no longer copies. So
  the claim's "copies the verdict into `reviews/`" at arrival had drifted
  from the rule since PR #21, and this correction aligns them. It is not a
  weakening. The copy is still required, only later, and C11's proof ("the
  text and the template file") does not depend on the copy existing at the
  candidate. The stated reason, that the range holds only pull requests
  (C1, `BACKLOG.md:29-32`), is coherent. C11 is now consistent with
  `PRINCIPLES.md:243-259`, with `reviews/README.md:6-10`, which gives no
  timing, and with C4 (`BACKLOG.md:120-122`). The candidate text at
  `BACKLOG.md:287-288` also says the verdict is copied "when a verdict
  arrives", but it is the historical proposal, not a claim or rule. One
  observation, with nothing to fix: PR #21 changed the rule without the
  claim, and the label "the claim was wrong" is defensible because the
  original timing conflicted with C1. The alternative reading is a claim
  that changed after its rule changed.
- *C8, relabel dated* (`BACKLOG.md:153-155`). PR #21 made the relabel
  (`git diff 42d8bca 55aa8c2 -- BACKLOG.md`: "are added" became "are an
  extension, not a correction") without a date. The new parenthetical dates
  it and names both PRs. The original text stays visible in history.

**Task 4, across Release 5.** I read C1–C11 against the rules at `fecefac`:
- C1 against `PRINCIPLES.md:170-182`;
- C2 against `tools/post-record.mjs:6-8` and `:48-58`, which cover review,
  design, milestone and reply;
- C3 against `PRINCIPLES.md:183-192`;
- C4 against `:203-242`;
- C5 against `:208-215` and `:243-248`;
- C6 against `CLAUDE.md:20-23`, `reviews/README.md:26-30` and
  `PRINCIPLES.md:107-110`;
- C7 against `PRINCIPLES.md:117-118`, `:143-154` and `:101-104`;
- C8 and C9 against the scaffold, via the runs above and the round-02 record;
- C10 above;
- C11 against `reviews/milestone-prompt.md` and `PRINCIPLES.md:234-259`.

Apart from findings 1 and 5, I found no wording drift that would make a strict
reviewer grade a claim PARTLY MET. Finding 1 is the one that could:
`PRINCIPLES.md` would be internally inconsistent on exactly C10's subject.
I also listed every commit that touched `BACKLOG.md` since the landing merge
`427749c` (`git log 427749c..fecefac -- BACKLOG.md`). In the ones that
touched claims (`e254e26`, `f28d05b`, `d7f633f`, `fecefac`), each change is
dated and carries its reason. The first-parent history since `427749c` is
r5 PR merges alternating with completion-note commits. `5cfec3c`, for
example, only appends `## Completion` to `reviews/017-scaffold-impl-02.md`.

**Scope and wrapping.** Every hunk serves C10, its extension, or the C8/C11
claim fixes. The README's added "and the milestone review" is part of
correcting the "differ only" sentence accurately. Changed lines wrap at 77-80
columns, except in `ROADMAP.md` (finding 6). The map row is a single table
line, as that table's convention requires.

— Claude Opus 5.5 (claude-opus-5-5), reviewer
One blocking finding remains (finding 1).
