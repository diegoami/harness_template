# Review: the creation-path rule and the last small rules (r5, C10), implementation round 02

**Revision reviewed:** `dba82fd523ace0dc076ae07aae11e2c4c19af755`
(`dba82fd`, branch `r5/smaller-rules`). Three sources agree on this SHA: PR
#23's `headRefOid` (`gh pr view 23 --json headRefOid,files`),
`git ls-remote origin r5/smaller-rules`, and `git rev-parse HEAD`. The
working tree was clean apart from this file.

**Files checked:** PR #23's file list is `BACKLOG.md`, `PRINCIPLES.md`,
`README.md`, `ROADMAP.md` and `reviews/018-smaller-rules-impl-01.md`. It
equals the local diff: `git merge-base HEAD origin/main` = `5cfec3c`, then
`git diff --name-only 5cfec3c HEAD`. Two commits were added after round 01:
- `dc48ca8`, which adds only the round-01 file;
- `dba82fd`, the fixes, which I reviewed as `git diff dc48ca8 dba82fd`
  (`BACKLOG.md`, `PRINCIPLES.md`, `ROADMAP.md`), and within the full diff
  from the merge base.

The round-01 file is unchanged between the two commits, and it is
byte-identical to the file I wrote.

**Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`), the round-01 reviewer
continued, as *Reviewer sessions* allows. It has not seen the
implementation.

**Mode:** Claude. No design stage, no marker.

**Owner's decision taken as given (round 01):** a builder's scratch
repository is local only. It is a throwaway git repository in a temporary
directory, never one on GitHub.

**Method:** read-only in the repository and on GitHub. I ran no tool under
review. The only new file in the repository is this one. Nothing was posted,
committed or pushed.

**Posting of round 01:** PR #23 has one comment, created at
2026-09-24T11:57:32Z. That is after `dc48ca8` (11:57:20Z) and before
`dba82fd` (12:13:19Z). Its body equals `reviews/018-smaller-rules-impl-01.md`
as the head holds it, apart from line endings and the final newline.

## Round-01 findings, re-checked

1. **Blocking 1 (the self-contradiction): fixed.** `PRINCIPLES.md:168-169`
   now reads "a throwaway git repository in a temporary directory (never one
   on GitHub)". That is inside the first sentence's "outside a temporary
   directory" boundary (`:162-164`), so the two sentences agree. The new last
   sentence (`:171-172`) closes the gap for a path with neither a dry run nor
   a fake. C10's extension matches, cites the owner's round-01 decision, and
   keeps its date (`BACKLOG.md:174-180`). The Notes entry keeps its original
   wording and records the new decision with its default and reason
   (`BACKLOG.md:449-454`).
2. **"The real record": fixed.** The rule now says "the real thing: a
   record, or a project's own repository" (`PRINCIPLES.md:171`), and C10 says
   "the real thing" (`BACKLOG.md:178-179`).
3. **Flags in generated runs: fixed.** "for example the scaffold's
   `--github`" (`PRINCIPLES.md:165`) and "for example
   `post-record.mjs --confirm`" (`:170`) now read as examples in a run
   without `tools/`. The reviewer clause keeps C10's meaning: "(no
   `--github`, no creating command inside the code under review)"
   (`BACKLOG.md:166-168`) is the same set of paths.
4. **The exemption list: fixed.** It now reads "finding issues, comments on
   them, its verdict or stop notice" (`PRINCIPLES.md:166-167`). That covers
   every write the milestone prompt allows (`reviews/milestone-prompt.md:43-45`,
   `:106-108`).
5. **The Backlog's summary of the claim-change rule: fixed.**
   `BACKLOG.md:15-17` now says "visibly, dated and with its reason in the same
   commit" and points to `PRINCIPLES.md` (*Milestones*), matching
   `PRINCIPLES.md:212-215`.
6. **ROADMAP wrap: fixed.** `ROADMAP.md:18-19` is reflowed. All the changed
   lines are at most 78 characters.

## New findings

1. **non-blocking — the new smaller item overstates what builders cannot
   do.** `BACKLOG.md:363-365` says the scaffold's `--github` "has no dry run
   and no fake, so under the creation-path rule builders cannot test it",
   and names only a dry run as the remedy. The rule also allows fakes
   (`PRINCIPLES.md:168`), and a fake `gh` on `PATH` in
   `tools/scaffold.test.mjs` would do, as `post-record.mjs`'s tests already
   do. "Until it has one" (`PRINCIPLES.md:172`) is accurate. The item should
   say "a dry run, or a test with a fake `gh`".
2. **non-blocking — the scope change for the dry run has no stated reason.**
   `BACKLOG.md:36-38` and `:54` put the new item outside r5, citing only
   "(PR #23)". Earlier additions to "Not in r5" came with an owner decision
   and its reason in the Notes (`BACKLOG.md:427-443`, for example). No claim
   is narrowed here: the item is new, and C1–C11 never promised it. So this
   is not a C5 finding. Still, one clause of reason, such as "new work found
   after the claims were fixed, not needed by any claim", or the owner's mark
   if the owner decided it, would keep the plan's scope history as legible
   as its claim history.

## Verified

- **Gate 0.** The head is `dba82fd` on the PR, on the remote and locally. The
  file list equals the merge-base diff.
- **No new contradiction.** The builder sentence, the reviewer sentence, the
  exemption and the opening sentence of `PRINCIPLES.md:162-172` agree. The
  milestone prompt's LIMITS (`reviews/milestone-prompt.md:109-111`) are
  consistent with the reviewer clause. *Posting* (`PRINCIPLES.md:173-185`)
  is the "real thing" the builder sentence allows. C8's temporary-directory
  runs without `--github` stay allowed.
- **C5.** C10's extension was edited inside the same unmerged PR. It is still
  dated 2026-09-24 and still gives its reason, and it now also cites the
  round-01 decision. It narrows what a builder may do (local only), which
  makes it stricter, not weaker. C11's correction and C8's dated relabel
  are unchanged since round 01.
- **Scope.** The fix commit touches only the text the round-01 findings named,
  plus the recorded dry-run item. `README.md` is unchanged since round 01.

— Claude Opus 5.5 (claude-opus-5-5), reviewer
No blocking finding remains.

## Completion

Landed by PR #23, merged on 2026-09-24 (UTC) at the owner's instruction ("yes,
cover builders too; go ahead, merge when clean"), after its last review comment
and with GitGuardian green. The note is non-material and transcribes the
evidence for C10.

- `PRINCIPLES.md` carries *Creation paths*: a reviewer never runs the code under
  review on a creating path, its own output exempt; a builder tests creating
  paths only against fakes, a throwaway local repository (never one on GitHub, the
  owner's decision on round 01) or a dry run.
- `reviews/README.md` names milestone reviews (D9); the three restatements are
  gone.
- C10 extended, C11 corrected and C8's relabel dated, each with its reason (C5).
- Two review rounds; round 01's blocking finding decided by the owner and fixed;
  round 02 clean on `dba82fd`; `4b39d1d` only adds its record.

— Implementer (Claude Opus 5.5)
