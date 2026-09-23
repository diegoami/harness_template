# Review: the posting and pull-request rules (r5, C1 and C3), implementation round 01

**Revision reviewed:** `c98a797423352e5185ceda4b2de94949f068c87f`
(`c98a797`, branch `r5/posting-rules`). Three sources agree on this SHA:
PR #17's `headRefOid` (`gh pr view 17 --json headRefOid,files`),
`git ls-remote origin` for both `refs/heads/r5/posting-rules` and
`refs/pull/17/head`, and `git rev-parse HEAD`. The working tree was clean.

**Files checked:** PR #17's file list is `AGENTS.md` (+5, −4), `CLAUDE.md`
(+3, −2), `PRINCIPLES.md` (+21, −3), `design/README.md` (+2, −1) and
`reviews/README.md` (+2, −2). It equals the local diff:
`git merge-base HEAD origin/main` = `d001807` (still `main` on the remote
after `git fetch`), then `git diff --name-only d001807 HEAD`. One commit.

**Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`), a new session that has
not seen the implementation.

**Mode:** Claude. No design stage, no marker.

**Method:** read-only. I posted, created, edited and pushed nothing, and did
not run `tools/post-record.mjs`. The `gh` calls were `pr view` on #15, #16
and #17 and one read of PR #16's timeline
(`gh api repos/diegoami/harness_template/issues/16/timeline`). Line numbers
are at `c98a797`.

## Findings

1. **blocking — "equal to it" contradicts the completion note, and drops
   C1's "as the PR's head holds it".** `PRINCIPLES.md:149-150` requires "one
   comment per review file, equal to it". C1 (`BACKLOG.md:79-80`) asks for
   one comment "equal to the file **as the PR's head holds it**". The
   qualifier matters, because the Completion rule (`PRINCIPLES.md:119-121`,
   `reviews/README.md:27-31`) has the implementer append a `## Completion`
   section to the final review file after the merge. From then on, the
   file and its one comment differ, and "a record is posted when it is
   written" (`:144-145`) does not say whether the note is posted. This is
   already so in practice. At the PR heads, all five review files of #15
   and #16 are byte-equal to exactly one comment each. On `main`,
   `reviews/010-post-record-impl-03.md` and
   `reviews/011-backlog-field-report-impl-02.md` no longer equal their
   comments, because `4cd81a5` and `d001807` appended the notes. Under the
   rule as written, every Claude-mode change breaks the Posting rule by
   following the Completion rule. That is a contradiction inside the
   protocol, and `PRINCIPLES.md:25-26` says to fix it in the change that
   found it.
   *Fix:* "equal to the file as the pull request's head holds it", plus one
   clause for the note. The default that matches #15 and #16: the
   completion note, appended after the merge, is not posted.

2. **blocking — under `design: none`, the OpenCode posting clauses name a
   record that does not exist.** `PRINCIPLES.md:145-147`: "In OpenCode mode
   the design record opens as an issue before any implementation". The
   `design: none` bullet (`:132-134`) says that "every reference to a
   design record in this file resolves to the implementation review file".
   Applied to the posting clause, it reads "the implementation review file
   opens as an issue before any implementation", which cannot happen, and
   it conflicts with `:147-150`, which posts that file on the pull request.
   `AGENTS.md:77-78` goes further: "in this mode the pull request names the
   design record it implements", unconditionally. Yet `AGENTS.md:45-46`
   says a `design: none` project has no design stage. The `light` preset
   ships exactly this combination: `presets/light.json` has
   `"design": "none"` and ships `AGENTS.md`.
   `AGENTS.md:77-78` also restates `PRINCIPLES.md:155-156` ("names what it
   implements — the issue, the design record or the claim"), which the
   ownership map (`PRINCIPLES.md:5-6`, `:15`) reserves to `PRINCIPLES.md`.
   *Fix:* qualify `:145` ("In OpenCode mode, where the project has a design
   stage, …"), and cut `AGENTS.md:77-78` to the pointer. The protocol
   already lists the design record.

3. **non-blocking — the revision a pull request names has no answer after
   a later round or a waiver.** `PRINCIPLES.md:156-157` says the pull
   request names "once a round ends clean, the revision that round covered".
   Rounds can go on after a clean round (D6, `BACKLOG.md:61`; PR #9 did),
   so this should be the **last** clean round, updated when a later round
   runs. At the implementation stage, a third round that is not clean may
   be waived (`:96-99`, `:105-106`). No round then ends clean, and the rule
   leaves the pull request nothing to name. C3's proof
   (`BACKLOG.md:101-102`) still expects every r5 PR to name "the reviewed
   revision". *Suggest:* "the revision its last clean round covered, or the
   recorded waiver".

4. **non-blocking — the merge policy does not mention the new merge
   condition.** `PRINCIPLES.md:127-129` says that under `merge: auto` "a
   change merges when its review is clean … and every gate is green", which
   reads as sufficient. `:162-163` adds a third condition: the last review
   has been posted. The two do not contradict, since both are in the
   protocol. But the `auto` slot the scaffold writes lists only the first
   two (`tools/scaffold.mjs:194-198`), so an `auto` implementer who reads
   the slot can merge a clean, unposted round. *Suggest:* "clean and
   posted" in `:128`. The scaffold's slot text can wait for C8.

5. **non-blocking — the adapters now open a pull request unconditionally,
   while the protocol keeps a no-remote branch.** Before this change,
   `CLAUDE.md:11-13` and `AGENTS.md:37-38` said "open a pull request when a
   remote exists". They now drop the condition, while `PRINCIPLES.md:154`
   still says "Without a remote, the files stand alone". The scaffold's
   default is `--github none` (D8; `tools/scaffold.mjs:115`), and that
   default also turns CI off (`:407-417`). A default-scaffolded Claude-mode
   project therefore reads "opens a pull request" and has no remote. The
   fallback order (`PRINCIPLES.md:27-29`) makes the protocol govern, so
   this is not a contradiction. `AGENTS.md:76` does say "A remote is
   assumed", but `CLAUDE.md` does not. *Suggest:* the same four words, or
   "(*Posting* says what holds without one)", in `CLAUDE.md:11`.

6. **non-blocking — "what it implements" reads as a closed list.**
   `PRINCIPLES.md:155-156`: "the issue, the design record or the claim".
   A Claude-mode pull request for a backlog item, a request or a defect
   often has none of the three. PR #16 recorded a field report and
   implements no claim; its body names only C2, which it extends.
   *Suggest:* "for example", or add "the backlog item or request".

7. **non-blocking — a trivial change opened as a pull request fails C1's
   proof.** C1 asks that "every r5 PR adds at least one review file"
   (`BACKLOG.md:77-79`). `PRINCIPLES.md:49-51` says a trivial change "may"
   go straight to `main`, but the rules do not require it. A trivial change
   sent as a pull request would carry no review file. This is for the
   owner: either say that a trivial change is not opened as a pull request,
   or accept the gap.

8. **non-blocking — wrapping.** `AGENTS.md:37-38` leaves a short line in the
   middle of the paragraph ("request. The reviewer writes"). Rewrap it. No
   added line exceeds 80 columns.

## Verified

**C1, requirement by requirement** (`BACKLOG.md:71-81`):

| C1 requires | the text |
|---|---|
| "`PRINCIPLES.md` assumes a remote" | `PRINCIPLES.md:144` "A remote is assumed" |
| OpenCode: "the design record opens as an issue before implementation" | `:145-146` "the design record opens as an issue before any implementation" (see finding 2 for `design: none`) |
| "each verdict is posted as it is written" | `:146-147` "each verdict is posted on it as it is appended"; `:144-145` "posted when it is written, not after the fact" |
| both modes: "each implementation review is posted on the PR before the next round" | `:147-150` "committed to the pull request's branch, pushed, and posted on the pull request before the next commit, the next round and the merge" |
| proof: "exactly one PR comment equal to the file as the PR's head holds it" | `:150` "one comment per review file, equal to it". The qualifier is missing (finding 1) |
| proof: "dated before the next commit and before the merge" | `:149` "before the next commit … and the merge" |
| "with no remote, the files stand alone" | `:154` "Without a remote, the files stand alone" |

Nothing is weakened, and apart from finding 1 nothing is dropped. The text
adds the tool or `--body-file` requirement (`:150-154`), which is C2's and
fits it.

**C3, requirement by requirement** (`BACKLOG.md:96-103`):

| C3 requires | the text |
|---|---|
| "the PR names what it implements" | `PRINCIPLES.md:155-156` (finding 6) |
| "and the revision its clean review covers" | `:156-157` (finding 3) |
| "`Closes #N` stands on its own line" | `:159` "on a line of its own, outside any code span" |
| "and is checked with `closingIssuesReferences`" | `:160-161` `gh pr view <n> --json closingIssuesReferences` |
| "the body has four parts (what was built, the done-when ticked, the check output, what was left out)" | `:157-158`, all four, with the check output "verbatim" |
| "no merge while a review is running" | `:162-163`, in bold, glossed as "merges only after its last review is posted", which matches C3's proof "merged after its last review comment" |

**Ownership.** The map's protocol row (`PRINCIPLES.md:15`) now ends
"posting, pull requests". `reviews/README.md:24-26`,
`design/README.md:41-42` and `CLAUDE.md:11-13` point to *Posting* with at
most a clause of summary, in the house style of the existing
`AGENTS.md:40` ("The owner merges (`PRINCIPLES.md`), unless …").
`AGENTS.md:76` "A remote is assumed" is the same kind of summary. The one
real restatement is `AGENTS.md:77-78` (finding 2). `ROADMAP.md:77` already
pointed to "the posting rule … in `PRINCIPLES.md`" and needs nothing.

**Contradictions checked and not found:**
- **The round ceiling:** posting each file before the next round leaves
  rounds counted as before (`:94-99`, `reviews/README.md:3-5`).
- **The two modes:** the OpenCode-only clause is marked, and the rest says
  "In both modes". Claude mode needs no issue.
- **`scaffold.mjs`** ships `PRINCIPLES.md` without `tools/post-record.mjs`
  (every `presets/*.json` file list omits `tools/`). "where the project has
  it … otherwise with `gh … --body-file`" (`:150-152`) covers that project,
  and the no-remote clause covers the default `--github none`.
- **"Comment, not approval"** (`:140-143`, "or written to the file
  locally") agrees with the no-remote clause.
- **`ADOPT.md:81-82`** ("the design issue when a remote exists") and
  **`:92-93`** ("the commit message when there is no remote") are stale
  wording, not contradictions. The protocol keeps a no-remote branch
  (`:154`), and each sentence says what *Posting* says for its case.
  `ROADMAP.md:76` ("When GitHub exists") is the same. Leaving them for the
  r6 rebuild, as the PR's "Left out" says, is sound.

**Practice: PRs #15 and #16 against the rules as written**
(`gh pr view N --json body,comments,commits,mergedAt,closingIssuesReferences`):
- **Posting.** Every review file has exactly one comment that is
  byte-equal to it at the PR's head. #15: round 01 was posted 19:15:14Z
  (next commit 20:05:59Z), round 02 20:11:27Z (next commit 20:15:19Z) and
  round 03 20:19:26Z (merged 20:19:55Z). #16: round 01 was posted
  22:40:31Z (next commit 22:47:59Z) and round 02 22:59:45Z (merged
  23:17:23Z). #15 also carries a stray `README.md` comment and a note about
  it, which the rule does not forbid.
- **Pull requests.** Both bodies name the claim, give a "Reviewed revision"
  line (`2c505bf`, round 03; `062db44`, round 02) and have the four
  sections. Neither closes an issue, and `closingIssuesReferences` is `[]`
  for both. Both merged after their last review comment.
- **`main`.** `git log --first-parent 427749c..origin/main` lists only r5
  merges and completion-note commits.
- **The GitHub delay.** #16's round 02 was committed at 22:50:05Z. The PR
  was closed at 22:59:34Z and reopened at 22:59:36Z, and the round was
  posted at 22:59:45Z, 9m40s after the commit. No commit came in between,
  so "before the next commit" held. The rule orders the post against the
  next commit and the merge, not against the push, so a slow push only
  delays the post and the implementer waits. The tool's refusal to post a
  file the PR does not hold is what caught the lag. The rule is workable
  as written, and it needs no clause for the delay.
- Both PRs pass C1 and C3 as now written. Neither the completion-note gap
  (finding 1) nor the waiver gap (finding 3) came up, because the notes
  were not posted and no round was waived.

**Scope and form.** The diff touches only the five files, and every hunk
serves the aim. The new bullets use the protocol's bold-lead style. No
added line exceeds 80 columns (the longer lines in these files predate the
change). The diff has no CR bytes.

— Claude Opus 5.5 (claude-opus-5-5), reviewer
Two blocking findings remain (1 and 2).
