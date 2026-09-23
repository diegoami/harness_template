# Review — the owner's milestone source texts, implementation round 01

**Revision reviewed:** `87821369f0a25c8e6526612f3bb41f2c505828a6` (`8782136`).
Three sources agree on this SHA: PR #13's `headRefOid`
(`gh pr view 13 --json headRefOid,files`),
`git ls-remote origin refs/heads/docs/milestone-sources`, and the local
`git rev-parse HEAD` on `docs/milestone-sources`. It is also the SHA named in
the request.

**Files checked:** PR #13's file list:
- `BACKLOG.md`
- `docs/sources/ic2-milestone-review.md`
- `docs/sources/milestone-definition.md`

This equals `git diff --name-only 3b93b34..8782136`, where `3b93b34` is
`git merge-base main 8782136` (and `main` = `origin/main` = `3b93b34`). The
branch holds two commits, `fdbccfc` and `8782136`.

**Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`), a fresh-context session that
has not seen the implementation. **Mode:** Claude (no design stage, no marker).

## Findings

1. **The IC2 header's "not committed" claim is false** (blocking).
   `docs/sources/ic2-milestone-review.md:4-5` says: "On that date it was not
   committed in the `imperial_conquest_2` repository." The PR body repeats it,
   and adds that "no committed copy exists to compare against". Both are wrong.
   A near-identical text is committed in `imperial_conquest_2` and pushed:
   - branch `plan/milestone-review`, commit
     `5942e229400ba7de2d10a2ea130d2dd3c57b3bd5`, file `docs/milestone-review.md`,
     committed 2026-09-23 17:35 +0200;
   - `git ls-remote origin refs/heads/plan/milestone-review` returns that SHA;
   - IC2 PR #297, "Plan: a portable milestone-review process", is open from
     that branch;
   - the commit is not on IC2's `main` (`git merge-base --is-ancestor` fails).

   The commit predates this PR's `fdbccfc` (18:38 +0200) by an hour, so the
   claim was false when it was written. The miss is the same one round 06 made.
   A `git grep` or search of the working tree on `main` only does not look at
   other branches. `git grep -F "COULD NOT TEST" $(git for-each-ref
   --format='%(refname)')` finds it.

   The committed file matches the PR's body text word for word (word diff,
   ignoring whitespace and wrapping), apart from three things:
   - the committed file has an intro paragraph and a "What a milestone is made
     of" table that the shared text lacks;
   - `<what a user can do>` is written `*what a user can do*` there;
   - "(see step 6)" is written "(step 6)" there.

   The committed file wraps at 100 columns; this copy wraps at about 96.

   Fix: correct the header (and the PR body). Name the branch, commit and IC2
   PR as a committed near-copy that is not on `main`, and list the
   differences, or state that the shared text was a different draft. That
   also gives item 2 of the request its missing evidence. The body is
   consistent with a real document and not damaged.

2. **On GitHub, the rendered sources drop their angle-bracket placeholders**
   (blocking). The texts are plain text saved as `.md`. CommonMark reads
   `<previous tag>`, `<candidate SHA>` and `<what a user can do>` as raw HTML
   open tags (a tag name followed by attribute names), and GitHub strips them.
   I fetched the rendered HTML with a GET
   (`gh api -H "Accept: application/vnd.github.html"
   repos/diegoami/harness_template/contents/<path>?ref=8782136`), and it
   shows:
   - `milestone-definition.md:41` renders as "reviews git diff .., following
     it". The diff range, the heart of the process, is gone;
   - `milestone-definition.md:64` renders as "the diff to review becomes ..,";
   - `ic2-milestone-review.md:21` renders as "A named, bounded promise,
     "vX.Y.Z — ", recorded as a".

   The raw bytes are intact. But a reader who follows the new `BACKLOG.md`
   links on GitHub sees a damaged source, and nothing warns them. Fix without
   editing the text: put each body below the rule in a fenced block
   (```` ```text ````), which keeps it byte for byte. For the IC2 text,
   fencing or escaping the one `<…>` are both acceptable, provided the header
   says which was done. A fence also helps finding 3.

3. **An agent could still take the definition's imperatives as addressed to
   it** (non-blocking). The body of `milestone-definition.md:12` opens with
   "In this repository, "milestone" is being redefined by the owner". It ends
   with "WHAT TO DO NOW" (`:61-70`): show the owner edits, ask three questions,
   make the change on a branch. The header (`:7-8`) says "It is a
   **source**, not a rule of this harness: its instructions address the
   repository it is run in". That is mostly adequate, but "the repository it
   is run in" is ambiguous: an agent reading the file here is, literally,
   in this repository. Suggest wording that cannot be misread. For example:
   "Nothing below is an instruction to an agent working in this repository.
   This repository's rules are in `PRINCIPLES.md` and `CLAUDE.md`." The IC2
   header (`ic2-milestone-review.md:7-8`) has no such sentence. Its text is
   descriptive, but it includes a "Rules that make it work" section.
   "a source, not a rule of this harness" covers it, but adding the same
   sentence to both headers would be cheap.

4. **The backlog sentence now links the definition as the origin of bullets
   it does not contain** (non-blocking). `BACKLOG.md:78-81`: "The rest of the
   bullets, … is the proposal, taken from the definition the owner shared
   ([link])". Before this change the attribution could not be checked. The
   link now invites a check, and two parts do not come from the definition:
   - the UTF-8, no-BOM, `--body-file` rule (`BACKLOG.md:66-67`) is this
     repository's own lesson (`BACKLOG.md:17-19`);
   - the "when a verdict arrives" bullet (`BACKLOG.md:73-74`) is not in the
     definition.

   The owner decisions at `BACKLOG.md:76-78` also depart from the linked text.
   The definition gives feature PRs "no independent-review prompt"
   (`milestone-definition.md:24`), but the item keeps the per-change review.
   The definition asks for "a different model" (`:39`), but the item says
   "not Claude". The definition itself allows the first: "keep every rule
   that does not conflict" (`:15`). Recording both as owner decisions is
   legitimate, but a reader comparing the files sees a contradiction without
   the reason. Suggest "adapted from" instead of "taken from", or a clause
   noting that the owner's decisions depart from the source on these two
   points. This wording predates the PR, apart from the link, so it is
   non-blocking.

## Verified

- **Gate 0**, as in the header. The file list matches exactly.
- **`fdbccfc` → `8782136` is whitespace only.** `git diff fdbccfc 8782136`
  touches only `BACKLOG.md`, in the claims bullet. Collapsing all runs of
  spaces and newlines in both versions and diffing the resulting word streams
  gives no difference.
- **The `BACKLOG.md` edits are only the two link changes.** Against `main`,
  one hunk (`BACKLOG.md:77-94`):
  - "the process the owner pointed to" becomes "the definition the owner
    shared" plus a link;
  - "as the owner shared it" becomes a link, and the bullet is re-wrapped.

  Both relative paths resolve from the repository root, where `BACKLOG.md`
  lives. The headers' `../../BACKLOG.md` links resolve from `docs/sources/`.
- **No encoding damage.** Checked in Python:
  - neither file starts with a BOM, and both use LF only;
  - neither contains U+FFFD, `Ô`, `Ã` or `Â`, and no line has trailing
    whitespace.

  The only non-ASCII characters are in the IC2 text: U+2014 (em dash), U+2026
  (ellipsis, three times), U+2212 (minus) and U+2192 (arrow). Each is correct
  in context and matches the committed IC2 copy.
- **No truncation or broken structure.** Both texts end on a complete sentence
  with a final newline.
  - The definition's sections run in order: preamble, THE DEFINITION, HOW WORK
    FLOWS, HOW A MILESTONE HAPPENS (1–6), THE FIRST MILESTONE, WHAT TO DO NOW.
    WHAT TO DO NOW's three bullets match its "three things" and its default.
  - The IC2 text's steps 1–8 are all present. Step 6 has four triage routes,
    and the output format has items 1–4. It cross-references itself
    correctly: "see step 6" for triage, and the brief lists "the output
    format (below)".
- **The backlog agrees with the sources on the points named in the request:**
  - claims verdicts (MET / NOT MET / PARTLY MET / COULD NOT TEST, NOT MET
    blocks), from `ic2-milestone-review.md:60-61`;
  - "not in this milestone" list and claims before the work (`:48-49`,
    `:103`);
  - four-way triage, with "never quietly weakened", from `:62-67`. The item
    adapts "release notes" to "the tag message", which is a proposal;
  - "Not proposed here": the never-merged review PR, `review-base/` branches,
    GitHub milestones and a second reviewer, from `:22`, `:29-33` and
    `:40-44`;
  - "the owner may tag without a review" appears in
    `milestone-definition.md:53`. The backlog lists it as open, "the owner
    has not decided it here", which is honest: the item treats only THE
    DEFINITION as decided;
  - the round ceiling, from `milestone-definition.md:45-47`, is consistent
    with IC2's "two re-freezes" (`ic2-milestone-review.md:70`);
  - the tag-creator question and its default, from `milestone-definition.md:66-67`.
- **youtube3.** The local `C:\Users\diego\projects\youtube3` checkout (last
  commit 2023-03-06) has no milestone text on any ref. The header makes no
  claim about it being committed there, so this is noted, not a finding.
- **The `docs/` placement contradicts nothing.**
  - `CLAUDE.md:39-41`, as changed by PR #9, says the harness's next items are
    in `BACKLOG.md` and its history in `design/` and `reviews/`. It no longer
    says anything about `docs/`, so `docs/sources/` stales nothing.
  - `README.md:87` still accurately says "the analysis behind the rules is
    archived in `docs/archive/`".
  - The presets (`presets/*.json`) do not copy `docs/` into scaffolded runs,
    so the sources never reach a run.
  - `docs/sources/` has no index README (the archive has one). The backlog
    links are its only entry point, which is enough for two files.
- **Non-trivial?** Not under the floor. `docs/**` and `BACKLOG.md` are not in
  the floor's path list, and `BACKLOG.md:3-6` does not count itself or
  `docs/` among the harness files. Under the test (a)–(d), the change alters
  no behaviour, check, process a builder must follow, or user copy. The
  headers say explicitly that the texts are sources, not rules. The backlog
  edit only replaces attributions with links. Nothing is restated as a rule
  of this harness, and no owner row in `PRINCIPLES.md`'s map is touched. The
  review is therefore optional, not required, but the findings above still
  stand on accuracy.
- **Not modified.** Everything was read-only in `imperial_conquest_2` and
  `youtube3`. On GitHub I used only `gh pr view`, `gh pr checks` (GitGuardian:
  pass), `gh pr list` and GET content requests. One side effect, disclosed: a
  `git fetch -q origin` in this repository updated its remote-tracking refs
  (no working-tree or branch change). The only file written is this review.

— Claude Opus 5.5 (claude-opus-5-5), reviewer
Two blocking findings remain (1: the false "not committed" provenance claim; 2: placeholders lost when the sources render on GitHub).
