# Review: the milestone rule and its prompt (r5, C4, C5, C6, C11), implementation round 01

**Revision reviewed:** `dbfbfa0760d1dd760d12541037afd95ff48cc638`
(`dbfbfa0`, branch `r5/milestones`). Three sources agree on this SHA: PR
#19's `headRefOid` (`gh pr view 19 --json headRefOid,files`),
`git ls-remote origin refs/heads/r5/milestones`, and `git rev-parse HEAD`.
The working tree was clean.

**Files checked:** PR #19's file list is `AGENTS.md`, `BACKLOG.md`,
`CLAUDE.md`, `PRINCIPLES.md`, `reviews/README.md` and
`reviews/milestone-prompt.md`. It equals the local diff:
`git merge-base HEAD origin/main` = `6bb9505` (`origin/main`), then
`git diff --name-only 6bb9505 HEAD`. One commit, `dbfbfa0`.

**Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`), a fresh-context session
that has not seen the implementation.

**Mode:** Claude. No design stage, no marker.

**Method:** read-only in the repository and on GitHub. The only writes are
this file and a scaffolded run in my scratch directory (`--github none`, no
remote). Nothing was posted, committed or pushed.

## Findings

1. **blocking. The builder still decides what the reviewer checks, through
   `{{CLAIMS}}`, `{{PROMISE}}` and `{{NOT_IN_RELEASE}}`.**
   - The prompt says the implementer only fills placeholders "so the builder
     does not decide what its reviewer looks for"
     (`reviews/milestone-prompt.md:4-5`).
   - But the claims, the promise and the out-of-scope list are pasted in by
     the builder: "copied from the plan, as written before the work"
     (`:13-14`, used at `:43-49`).
   - The prompt never names the plan, and it never asks the reviewer to
     compare the pasted text with the plan at `{{CANDIDATE}}`. It also
     never asks the reviewer to check the plan's history for a weakened
     claim. So a dropped claim, a softened proof, or an item added to
     "NOT IN THIS RELEASE (absences here are not defects)" would go
     unnoticed.
   - The rule doesn't give the plan a home either: "the project's plan
     records its promise, numbered claims…" (`PRINCIPLES.md:188`). In a
     scaffolded run, `PLAN.md` is the optional iteration overlay, and the
     `light` preset has no `PLAN.md`. In this repository the plan is
     `BACKLOG.md`, which no rule names.
   - This fails C11's "complete and independent", and the rule's "claim …
     is never weakened to pass" (`PRINCIPLES.md:190-192`) has no check.
   - *Smallest fix:*
     - Add a `{{PLAN}}` placeholder: the plan's path at the candidate.
     - Tell the reviewer to confirm that the promise, the claims and the
       "not in this release" list equal `{{PLAN}}` at `{{CANDIDATE}}`, and
       to read `git log -p {{PREVIOUS_TAG}}..{{CANDIDATE}} -- {{PLAN}}` for
       claim changes without a visible reason.
     - In `PRINCIPLES.md`, say where the plan lives: the slot's "where open
       work lives".

2. **non-blocking. `{{KNOWN}}` and `{{EXCLUDED}}` can also steer the
   review.**
   - **`{{KNOWN}}`:** "do not re-report them, but say if one breaks a claim"
     (`milestone-prompt.md:54-56`). `AGREE` requires only that "no claim is
     NOT MET and no finding blocks" (`:94-95`, `PRINCIPLES.md:204-205`).
     A known issue is not a finding of this review. So a builder can file a
     blocking defect that breaks no claim, list it under `{{KNOWN}}`, and
     it never counts.
     - Also, the prompt doesn't have the reviewer check that each item
       exists: that the issue is open, or that the owner decision is in the
       plan.
     - A known issue that blocks is not sent to the "accepted gap" triage,
       so it never reaches the tag message (`PRINCIPLES.md:216-221`).
   - **`{{EXCLUDED}}`:** filled by the builder (`:19`, `:28-29`), so an
     incomplete list admits an excluded family. The reviewer could work the
     list out itself from the range: the `Co-Authored-By` trailers and the
     record signatures.
   - *Fix:*
     - The reviewer checks each `{{KNOWN}}` item exists. It grades in the
       verdict any item it judges blocking, and a known blocking item blocks
       unless triaged as an accepted gap.
     - The reviewer derives the implementing families from
       `git log {{PREVIOUS_TAG}}..{{CANDIDATE}}` as well as `{{EXCLUDED}}`,
       and stops on a match with either.
   - `{{GATES}}` is safe as written: it is labelled "claims; re-run what you
     can" (`:51-52`), and the gates table is reachable through the files
     `PRINCIPLES.md` names (`:58-59`).

3. **non-blocking. The target proof is weaker than Gate 0, and it assumes
   a clone.** `milestone-prompt.md:35-41` checks only that `rev-parse HEAD`
   equals `{{CANDIDATE}}`. It does not check:
   - that the candidate is on `main`
     (`git merge-base --is-ancestor {{CANDIDATE}} origin/main`). The rule
     requires it: "an annotated tag on `main`" (`PRINCIPLES.md:182`);
   - that `{{PREVIOUS_TAG}}` exists and is an ancestor of the candidate;
   - that an empty diff means stop. Gate 0 says "An empty diff … is the
     wrong tree" (`PRINCIPLES.md:84-85`).

   Also, `git fetch` presupposes a local clone. A cold reader needs "in a
   clone of `{{REPO}}`" first, and it needs to know that the
   `PRINCIPLES.md` it reads (`:58`) is the copy in the worktree at the
   candidate.

4. **non-blocking. The prompt asks for writes its own limits forbid, and
   two output details clash with `reviews/README.md`.**
   - LIMITS: "Your only writes are the finding issues and the one verdict
     comment" (`milestone-prompt.md:71-72`). But the prompt also asks for a
     stop notice on the issue (`:29`, `:35`), and for a comment on an
     existing issue instead of a duplicate (`:82-83`).
   - Nothing says whether a stop notice is a verdict. That matters, because
     "each verdict on its milestone issue is one round"
     (`PRINCIPLES.md:102`).
   - The signature template puts a parenthetical on the marker line
     (`:94-95`). A literal copy breaks "the marker line contains only
     `AGREE` or only `BLOCK`" (`reviews/README.md:24`).
   - "Where I reviewed" (`:85-86`) omits the mode. Yet the verdict is copied
     verbatim into `reviews/` (`PRINCIPLES.md:221-222`), where every
     verdict opens with "the mode" (`reviews/README.md:9-12`). Say the
     milestone format governs there, or add the field.

5. **non-blocking. Two rules speak differently about how the verdict is
   posted, and about which copy is canonical.**
   - `PRINCIPLES.md:223-224` sends "the verdict" through *Posting*, which
     says to use `tools/post-record.mjs` "where the project has it"
     (`:157-160`). The tool has a `reply` mode for issues.
   - The prompt, though, has the reviewer post with `gh … --body-file`
     (`milestone-prompt.md:96-98`), and it forbids running a "creating
     command inside the code under review" (`:73-75`).
   - Both are defensible; say which applies to the reviewer. "The file
     stays canonical" (`PRINCIPLES.md:150`, `reviews/README.md:31`) is also
     inverted for a milestone verdict: the comment is the original and the
     file a verbatim copy. Say which one governs.

6. **non-blocking. The rule gives no home for the tag's record, or for how
   the verdict copy lands.**
   - C4's proof ends "the completion note records both" (the tag object and
     its commit, `BACKLOG.md:111-113`). *Milestones* names no completion
     note and no place for it.
   - The verdict copy in `reviews/<tag>-milestone-NN.md`
     (`PRINCIPLES.md:221-222`) is a commit to `reviews/**`. That path is
     under the conservative floor (`PRINCIPLES.md:45-49`), so the copy is
     non-trivial. The rule doesn't say whether it takes a pull request and
     a per-change review, or counts as a non-material transcription like a
     completion note.
   - It will land after the candidate, so it belongs to the next milestone
     (`:212-213`). Say so, and place the tag note.

7. **non-blocking. A scaffolded run gets broken links now, and C8's
   placeholder check will clash with the prompt.**
   - **Reproduced:** `node tools/scaffold.mjs --yes --name mstest --preset
     standard --ref dbfbfa0… --github none` into scratch.
     - The run's `PRINCIPLES.md:17` and `:197`, and its
       `reviews/README.md:8`, link `reviews/milestone-prompt.md`, and the
       file is missing. `presets/*.json` list `PRINCIPLES.md` and
       `reviews/README.md`, but not the prompt, so `light` and `auto` are
       the same.
     - The run's rule also tells the implementer to hand over the prompt
       "filled in and otherwise unchanged", which it can't do. And "this
       harness uses `rN`" (`PRINCIPLES.md:184`) reads as the run's own
       scheme, against D5's `vX.Y.Z`.
   - **The deferral:** it is named only in the PR body's "Left out", not
     in `BACKLOG.md`.
     - At the candidate, C7's and C8's "no dangling relative link" proofs
       will catch the links, so this is not blocking now.
     - But C8 also requires that a run "leave no `{{…}}` placeholder"
       (`BACKLOG.md:135-137`). Shipping the template will trip that as
       worded: 13 placeholders by design, plus the literal `{{…}}` at
       `milestone-prompt.md:4`.
     - Record this now as a visible claim correction
       (`PRINCIPLES.md:190-192`), so that it is not found at the milestone
       as a claim weakened to pass.

8. **non-blocking. `CLAUDE.md` restates the milestone rule instead of
   pointing to it.**
   - `CLAUDE.md:22-24` restates who opens the issue, the reviewer's family,
     that the verdict ends `AGREE`/`BLOCK`, and that "the tag waits for
     it".
   - The ownership map gives milestones to `PRINCIPLES.md`
     (`PRINCIPLES.md:16`), and "a non-owning file links to an idea and does
     not restate it" (`:5-6`). `AGENTS.md:66` does this correctly, as a
     bare pointer.
   - C6 needs only the scoping at `CLAUDE.md:20-21`. The text agrees with
     the owner today, so this is a drift risk, not a contradiction.

9. **non-blocking, for the owner. `BACKLOG.md` makes a scope call outside
   this PR's aim, without an owner decision.**
   - The new item (`BACKLOG.md:356-362`) and the in-r5 line (`:36-39`)
     agree with each other. Both put PR #18's follow-ups out of r5.
   - Those follow-ups include a behaviour defect in r5's own tool (a
     checkout through a junction is refused) and test gaps of the same
     kind the owner put *into* r5 on 2026-09-24: "the gaps belong to r5's
     own tool" (`BACKLOG.md:399-403`).
   - No owner decision or reason is recorded for leaving them out, and the
     change is not part of C4/C5/C6/C11.
   - The items are also missing from the "Not in r5" list (`:45-50`). That
     list is what `{{NOT_IN_RELEASE}}` copies. The verification pattern is
     missing too, which predates this change.
   - Record the owner's decision with its reason, or move the backlog edit
     to its own change.
   - Claims C1–C11 are untouched: the diff's only `BACKLOG.md` hunks are at
     `:36-39` and `:351-362`.

## Verified

- **Gate 0:** the head, the file list and the merge base, as above.
- **C4**, against `PRINCIPLES.md`:
  - "an annotated tag on `main`, on the commit the release is built from":
    `:182-183`.
  - "proposed tag, candidate SHA, previous tag, PRs since, gate results":
    `:193-196`.
  - "one verdict on it, with one issue per reproduced finding": `:202-204`.
  - "who tags (D3)": "the implementer creates the tag on exactly the
    reviewed commit", `:210-211`.
  - "how the owner overrides (D4)": "Only the owner may tag without a
    review, as an override recorded on the milestone issue — never the
    implementer's call", `:213-215`. It avoids "waiver", as D4 requires.
- **C5**, against `PRINCIPLES.md`:
  - "numbered claims, each with its proof, written when a release is scoped,
    with a 'not in this release' list": `:187-190`.
  - "one verdict per claim (MET, NOT MET, PARTLY MET, COULD NOT TEST)":
    `:201-202`.
  - The `AGREE` mapping and the grading of PARTLY MET and COULD NOT TEST:
    `:204-206`, word for word.
  - "four-way triage": `:216-221`.
- **C6:**
  - `CLAUDE.md:20-21`: "a change's review carries **no AGREE/BLOCK
    marker**".
  - `reviews/README.md:25-28`: "a change's review replaces the marker …
    A milestone verdict ends with the marker in both modes".
  - `PRINCIPLES.md:101-103`: "each verdict on its milestone issue is one
    round, and a third that is not `AGREE` goes to the owner", which is D10
    exactly.
- **C11:**
  - A fixed file that the implementer only fills in:
    `milestone-prompt.md:3-5` and `PRINCIPLES.md:196-198`.
  - The target proof on the candidate: `:35-41`.
  - The range: `:39`, with `HEAD` pinned to `{{CANDIDATE}}` at `:37`.
  - The claims, and a verdict table of one row per claim: `:45-46`,
    `:87-89`.
  - "Not in this release": `:48-49`.
  - The limits: `:70-76`.
  - One issue per reproduced finding: `:79-83`.
  - The verdict comment: `:84-95`.
  - `--body-file`: `:96-99`.
  - A re-review prompt unasked: `PRINCIPLES.md:209`.
  - Every body posted through `--body-file`: `:223-224`.
  - Reproducing, replying per finding, and copying into `reviews/`:
    `:216-222`.
- **D2:** the rule is in `PRINCIPLES.md` and holds "the same in both
  modes" (`:178`). The reviewer is "of a family that implemented none of
  the range — in a Claude-mode range, any model that is not Claude"
  (`:199-200`).
  - `git log r4..HEAD` shows only `Claude Opus 5.5` co-author trailers, so
    DeepSeek qualifies for r5, as the owner settled.
- **D9:** `reviews/README.md:6-8`.
- **D3, D4, D10:** as above.
- **Placeholders:**
  - 13 are documented (`:10-19`), and each is used in the fence: `CANDIDATE`
    ×3, `ROUND` ×3, `ISSUE`, `REPO` and `TAG` ×2, the rest ×1.
  - No undocumented placeholder is used.
- **The re-review path:** `{{ROUND}}` and `{{PREVIOUS_VERDICT}}` plus
  `:32-33` make it workable. The old candidate can be found through the
  previous verdict's "Where I reviewed".
- **Consistency:**
  - D6 is deferred to C7. The milestone sentence says "a third", while D6
    will say "any round from the third", so align the two when C7 lands.
    Nothing conflicts today.
  - Nothing conflicts with the merge policy or `merge: auto` ("Each change
    keeps its own review and the project's merge setting", `:178-179`).
  - Nothing conflicts with `design: none`, which the rule never touches,
    or with "comment, not approval".
  - "Rules apply going forward" is respected, since r5's claims predate
    its r5 PRs (`BACKLOG.md:27-34`).
  - The six disciplines match `:62-68` of the prompt.
- **Checks:**
  - `node --check` passes on `tools/*.mjs`.
  - `node --test tools/post-record.test.mjs` gives 29 tests, 29 pass (no
    tool changed).
  - GitGuardian is green on PR #19.
- **Wrapping and encoding:**
  - The added prose wraps at 80 columns or fewer, measured in characters,
    except the ownership-map table rows, which are long by convention.
  - `milestone-prompt.md` is UTF-8 without a byte-order mark and has LF
    line endings.
  - No change outside the aim except finding 9.

— Claude Opus 5.5 (claude-opus-5-5), reviewer
One blocking finding remains (finding 1).
