# Review: claim C13 added to r6 (PR #34), round 03

- **Revision covered:** `a9325cd6c72ab5ee90cf660622dff832d0a17dbc`
  (branch `r6/add-c13`, base `main` at
  `f52bc9e4c8073716c04ac7ea551bf4ec67a57e08`).
- **Files reviewed:** `BACKLOG.md` (+148 −3),
  `docs/sources/hook-git-env-report.md` (+42, new),
  `docs/sources/ic2-worktrees.md` (+41, new),
  `reviews/028-add-c13-impl-01.md` (+202, new) and
  `reviews/028-add-c13-impl-02.md` (+223, new). The two review files are
  my own, and I judged them only as posted. I got the list from
  `gh pr view 34 --json files`, and from `git diff --stat f52bc9e..a9325cd`,
  which gives the same five files with the same counts. Since round 02,
  `a9325cd` changes `BACKLOG.md` only.
- **Target proof:** `git remote get-url origin` is
  `git@github.com:diegoami/harness_template.git`. I ran `git fetch origin`,
  then checked out the head, detached, in this reviewer's own worktree
  (`.claude/worktrees/agent-afb9012c07f4bda14`, relative to the
  repository). The PR head from
  `gh api repos/diegoami/harness_template/pulls/34` is `a9325cd6…`, open,
  with base `main` at `f52bc9e4…`. `git ls-remote origin
  refs/heads/r6/add-c13` gives `a9325cd6…`. `git merge-base HEAD
  origin/main` is `f52bc9e4…`, which is also `origin/main`. All four
  agree. The branch holds seven commits, the last two `55f4312` (round
  02) and `a9325cd`.
- **Read for context, not in the change:** `PRINCIPLES.md` (the ownership
  map, the target proof, *Milestones*, *Owner decisions*), `CLAUDE.md`,
  `ADOPT.md` (its file lists and its placeholder check),
  `reviews/milestone-prompt.md`, `presets/*.json`, and the PR body and its
  two comments.
- **Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`), the round-01 and
  round-02 reviewer, resumed. It has not seen the implementation.
- **Mode:** Claude Code, per-change review. There is no marker. This is
  round 03, under the ceiling (`PRINCIPLES.md`, *Rounds*).

## Round 02's findings

1. **Fixed.** `BACKLOG.md:195-203` names the variables exactly, calls the
   list "the variables that locate a repository or inject configuration",
   and lets `GIT_CONFIG_GLOBAL`, `GIT_CONFIG_SYSTEM` and
   `GIT_CONFIG_NOSYSTEM` through, with the reason. The tests set a fixed
   identity after clearing (`:203-209`), and the proof reads it.
2. **Fixed.** The `--github` test points `origin` at a local bare
   repository in the temporary directory and checks that the scaffold exits
   0 and that `main` landed there (`:250-257`). If the push kept a decoy
   `GIT_DIR`, it would push from the decoy, which has no `origin`. The
   scaffold would then fail, so the push is now tested too.
3. **Fixed.** Later reviews record their worktree "as a path relative to
   the repository … never one machine's absolute path" (`:257-261`).
4. **Fixed, by the owner's decision.** The prompt ships with every preset
   (`:234`). C9 is extended with a date (`:165-170`), and the ownership
   map gets a row. See finding 1 below for adoption.
5. **Fixed.** (c) is filled in by "the session that briefs the reviewer (in
   Claude mode, the main session)" (`:231-232`). In (d), the implementer
   reports its pushed head, and the main session names GitHub's head after
   checking it (`:235-241`).
6. **Fixed.** (a) covers a change without a pull request (`origin` and the
   branch) and a project without a remote (`:219-226`).

## Findings

1. **blocking — the prompt reaches new projects, but not adopted ones.**
   The third decision's reason is that "a reviewer that cannot find the
   commit it was given is a problem in the owner's projects, not only
   here, so projects need the prompt" (`BACKLOG.md:951-953`, and C9's
   extension at `:168-170`). The owner's existing projects get harness
   files by adoption, not by the scaffold. Examples are boar_life,
   pgn-postmortem and the others `BACKLOG.md` cites. C13 (c) and C9
   provide only for the scaffold: "It ships with every preset"
   (`:234`), "a generated run carries `reviews/review-prompt.md`"
   (`:167-168`). `ADOPT.md`, which r6 rebuilt, lists the files an adoption
   reads and writes:
   - `reviews/milestone-prompt.md` "always" (`ADOPT.md:65`, `:213-214`);
   - its placeholder check allows only the milestone prompt's `{{…}}`
     (`ADOPT.md:291-292`).

   Nothing in C13 changes those. Once implemented as claimed, an adopted
   project's `PRINCIPLES.md` would carry an ownership-map row, and its
   `CLAUDE.md` the (b) and (d) rules, for a prompt the project does not
   have. Or, if an adopter copies the prompt anyway, the step-7 placeholder
   check fails. So the claim can be MET at the candidate while the stated
   reason is not served where it was given. *Fix:* add to C13 (c) that
   `ADOPT.md` lists `reviews/review-prompt.md` among the files an adoption
   reads and always writes, and that its placeholder check allows the
   placeholders the prompt documents. Add that to the proof, as the text of
   `ADOPT.md` by `file:line`. The decision was asked about the scaffold
   ("to every new project"). If the owner meant new projects only, record
   that instead: adoption does not take the prompt in r6, listed under *Not
   in r6*, and C13 says how an adopted project's ownership-map row reads
   without it. Either way, this is the owner's to confirm. That fits a
   round 03 that goes to the owner.

2. **non-blocking — C9's exception should stay inside the prompt files.**
   C9's extension allows "the placeholders `reviews/review-prompt.md`
   documents" (`BACKLOG.md:166-167`), next to the milestone prompt's. The
   review prompt adds placeholders for the pull request, the head commit
   and the base. Read as allowed anywhere in a generated run, the exception
   would let an unfilled head or base placeholder in `CLAUDE.md` or
   `README.md` pass C9. r5 narrowed its own exception with the same care,
   to the placeholders the prompt documents (r5's C8, **Narrowed on
   2026-09-24**). Round 01 of PR #33 read C9 as scoped to the file ("0
   `{{…}}` outside `reviews/milestone-prompt.md`'s own"), and so did I.
   *Fix:* say "allowed as well, in that file only". The extension
   then adds a file and its own placeholders without widening what C9
   catches elsewhere.

3. **non-blocking — (d) has no case for a project without a remote.**
   (a) now covers "Without a remote" (`BACKLOG.md:224-226`). (d) names
   GitHub's head for a pull request, or "the branch's head on `origin`"
   (`:238-239`), and says nothing when there is no `origin`. *Fix:*
   "…, or without a remote the branch's local head, which the implementer
   reported". The four placeholders then always have a value.

## Verified

- **C9's extension** (`BACKLOG.md:165-170`) is visible, dated
  ("**Extended on 2026-09-26**"), attributed to the owner's decision with
  PR #34, reasoned, and in the same commit as the C13 change that needs
  it, as *Milestones* requires. C9's original text is unchanged. It is not
  a weakening to pass: it adds an obligation (a generated run carries the
  prompt) and one bounded exception, subject to finding 2. It follows the
  form of r5's C8 correction and C2's extensions.
- **The decisions match what was reported.**
  - The 2026-09-25 entry (`:917-929`) and the 2026-09-26 widening entry
    (`:931-944`) are unchanged since round 02.
  - The third entry (`:945-956`) quotes the question as reported, word for
    word. It gives the choice "Ship it, extend C9", the reason as shown to
    the owner, the alternative "harness-only", "The recommended default,
    taken", and the evidence, the merge of PR #34, which is pending (not a
    finding).
  - C13's "Added" paragraph notes the third decision (`:281-283`).
- **The implementer's wording choices:**
  - The pull-request placeholder "(or "none")" is fine: (a) says what to
    fetch then.
  - "The branch's head on `origin`" is fine where a remote exists
    (finding 3 covers the rest).
  - "The session that briefs the reviewer (in Claude mode, the main
    session)" is right, since the prompt now ships to OpenCode-mode
    projects too.
  - Quoting the question verbatim is better than a paraphrase.
  - Repeating the reason in C9's extension is what *Milestones* asks
    ("dated and with its reason"), as r5's C12 and its Notes entry both
    did.
- **Nothing else new** in `a9325cd` beyond the three findings: C1–C8 and
  C10–C12, D1–D11, *In r6* and *Not in r6* are unchanged, and the two
  sources are untouched since round 02.
- **Round 02's posting.** `reviews/028-add-c13-impl-02.md` at the head
  equals the file I wrote. The PR's second comment equals it, apart from
  the final newline that `--jq` adds. It was posted at 18:54:21Z, after
  `55f4312` (18:54:12Z) and before `a9325cd` (19:27:37Z).
- **Private detail.** No file in the change, commit message of `55f4312`
  or `a9325cd`, or the PR body names the private project or any of its
  file names, paths, commit ids or identity values. The only occurrence in
  `BACKLOG.md` is the pre-existing *Planning* candidate (now `:660`), out
  of scope.
- **The PR body** matches the diff: five files, 656 insertions and 3
  deletions, the seven commits, C13's parts and proof, C9's extension,
  the three Notes entries, and the answers to round 02 (each checked
  above). *Left out* names `ADOPT.md` nowhere, which is finding 1.
- **Wrapping.** No added line in `BACKLOG.md` or the sources exceeds 79
  columns.
- **Gates at `a9325cd`:** `node --test tools/*.test.mjs` gives 60 pass,
  0 fail; `node --check` passes on all four `tools/*.mjs`.
- **Clean-up.** Nothing was posted, committed or pushed. My untracked copy
  of round 02 was moved aside before the checkout, and it is identical to
  the committed file.

— Claude Opus 5.5 (claude-opus-5-5), reviewer
One blocking finding remains (1).
