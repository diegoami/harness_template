# Review — stale text (posting record, adoption prompt), implementation round 05

**Revision reviewed:** `25ab21bc7e9bc9babf61f2f2c8a8a1692f5f6e97` (`25ab21b`,
branch `fix/stale-text`; `git rev-parse fix/stale-text` returns the same sha).
**Files checked:** `ADOPT.md`, `BACKLOG.md`, `CLAUDE.md`, `README.md`,
`ROADMAP.md`, `design/004-release-4.md`, `reviews/005-stale-text-impl-01.md`
… `-04.md` — obtained locally: `git merge-base main 25ab21b` = `39c29e3`, then
`git diff --name-only 39c29e3..25ab21b`. New since round 04: `e6fbb45` (round
04 recorded, identical to the file as written) and `25ab21b` (`CLAUDE.md`,
`README.md`, `ROADMAP.md`). The list equals the expected list; no pull request
exists for this branch.
**Reviewer:** Claude Opus 5.5 (`claude-opus-5-5`); a re-review continuing the
same reviewer session (`PRINCIPLES.md`, *Reviewer sessions*), re-reading the
current revision.
**Mode:** Claude — no design stage, no marker. Round 04 ended clean; this round
reviews a material edit made after it.

**Input.** Findings 3, 5 and 6 of the r4 milestone review on issue #10
(`gh issue view 10 --comments`), by DeepSeek V4.1 Flash — r4's own implementer —
so they were weighed as input, not as a verdict.

## The three milestone findings

- **#10 finding 3 (`ROADMAP.md`)** — **resolved.** "The shaping *is* the
  design stage — in OpenCode mode it becomes the design record, in Claude mode
  the brief" is gone; `ROADMAP.md:42-45` now says the shaping is recorded as the
  block, and "Where the project has a design stage ([`AGENTS.md`](AGENTS.md)),
  the block is where its design record starts." `ROADMAP.md:22-25` qualifies
  the design stage with "where the project has one". No "brief", no restated
  mode process; the pointer goes to the owner (`PRINCIPLES.md:16`). Consistent
  with `AGENTS.md:43-46`, `CLAUDE.md:19` and `PLAN.md:22`.
- **#10 finding 5 (`README.md`)** — **resolved.** The DeepSeek/Luna names are
  gone from `README.md:3-4`, `:12` and `:44`, which now point at `AGENTS.md`'s
  assignment table; `README.md:16-18` reads "no cross-family reviewer required
  (the options are in `CLAUDE.md`)", matching `CLAUDE.md:14-18`; the `auto` row
  (`README.md:63`) points at `PRINCIPLES.md` instead of restating the policy.
  No contradiction with `AGENTS.md`, `CLAUDE.md` or `PRINCIPLES.md:127-131`.
- **#10 finding 6 (`CLAUDE.md` slot comment)** — **resolved.**
  `CLAUDE.md:39-41` no longer names `docs/` (which holds only `docs/archive/`);
  it points at `BACKLOG.md`, `design/` and `reviews/`, all of which exist. The
  comment sits between the slot markers, so the scaffold replaces it and no run
  ships it (confirmed below).

## Findings

1. **`ROADMAP.md` keeps a status that assumes a design stage** —
   non-blocking. `ROADMAP.md:15`: "`requested` → `accepted` → `in design` →
   `in review` → `landed`". The edit made the design stage conditional at
   `:23` and `:44`, but the status still names it, and `ROADMAP.md` ships to
   both adapters in `standard` and `auto`. A Claude-mode run, which has no
   design stage (`CLAUDE.md:19`), has no meaning for `in design`. Same kind as
   #10 finding 3; "`shaped`" or "`in design` (or shaping, without a design
   stage)" would close it.

2. **`README.md` still describes the modes a little too flatly** —
   non-blocking. `README.md:13-14` gives OpenCode "the design agreed before
   code" unconditionally, while `README.md:61` (the `light` preset) and
   `AGENTS.md:45-46` have OpenCode runs with no design stage; and
   `README.md:20-21` says the modes "differ in how the reviewer is obtained",
   although lines 14 and 17 show they also differ in the design stage and the
   marker. Descriptive text, not a contradiction of an owned rule; "the design
   agreed before code where the slot requires it" and "differ in the design
   stage and how the reviewer is obtained" would align it.

3. **`BACKLOG.md`'s preamble still lists the harness files** — non-blocking.
   #10 finding 4 (not in the three folded in) is mostly answered by this
   change's `63f79e6`: `BACKLOG.md:3-7` now defers to the bootstrap in
   `PRINCIPLES.md`. Its second half still stands: the preamble enumerates the
   harness files, which `PRINCIPLES.md:137-139` does not, so the lists can
   drift, and it omits the bootstrap's trigger ("changes what a builder must do
   or how the process works") and the typo exception. Pointing without the list
   ("A harness-file or tool change takes the review the bootstrap in
   `PRINCIPLES.md` requires") would remove the drift.

## Verified

- **Gate 0** as above; working tree clean before this file was written;
  `git diff --check 25ab21b~1 25ab21b` clean. `25ab21b` changes only the three
  files it names.
- **Ownership** (`PRINCIPLES.md:8-23`): none of the three edits restates an
  owned idea; each replaces a restatement with a pointer (`AGENTS.md` for the
  assignment and the design stage, `CLAUDE.md` for Claude's reviewer options,
  `PRINCIPLES.md` for the merge policy).
- **The shipped `ROADMAP.md`.** Read `tools/scaffold.mjs` first: it reads the
  harness with `git show`, writes only to `--dir`, runs `git init`/`commit`
  there, and touches the network only with `--github` (default `none`). Ran
  `node tools/scaffold.mjs --yes --ref fix/stale-text --preset standard
  --name t --dir <scratchpad>/scaf-std` (no `--github`): exit 0, "8 files from
  fix/stale-text (25ab21bc7e9b), preset standard, merge owner, design required,
  ci no", no remote, one local commit. The shipped `ROADMAP.md`, `AGENTS.md`,
  `PLAN.md` and `PRINCIPLES.md` are byte-identical to `25ab21b`; the
  `ROADMAP.md` links (`PLAN.md`, `AGENTS.md`) resolve inside the run; it reads
  coherently for both modes apart from finding 1. The generated slot has no
  harness-only comment. `auto` ships the same `ROADMAP.md`
  (`presets/auto.json`). The temp directory was deleted; `git status` and
  `git worktree list` in the harness repository show nothing new.
- **Stale text of the same kind in the three files:** findings 1 and 2. Also
  checked, not stale: `README.md:32` "context-budget field" (the name design
  004 gives the canonical-source change), `ROADMAP.md:80` (records refer to the
  request id), the `CLAUDE.md` process section.
- #10 findings 1 and 2 (the `design: none` homes and the `light` preset's
  design link) are rule and preset changes, not stale text, and stay outside
  this change.
- No GitHub or git write in the harness repository.

— Claude Opus 5.5 (claude-opus-5-5), reviewer
No blocking finding remains.

## Completion

Landed by PR #9, merged at `ae9fa24` on 2026-09-23 by the owner's instruction.
The note is non-material and transcribes the evidence that closed the change.

- Five review rounds (`-01` to `-05`). Round 01 had three blocking findings,
  all fixed; rounds 02–05 ended with no blocking finding. The final round
  covers `25ab21b`, and `ded9e0e` only adds its record.
- Every factual claim about the GitHub records was checked against
  `gh issue view` / `gh pr view` output by the implementer and by the
  reviewer.
- The re-posted bodies of issues #5–#8 equal their design records at
  `d69c538`, `b06e6f3`, `8c770ea` and `a3ae6c8`. PR #4 still closes #5.
- `node --check tools/scaffold.mjs` passes, and a `standard` run generated
  with `--ref fix/stale-text` ships `ROADMAP.md` as committed. The temp
  directories were removed.
- PR checks green (GitGuardian); the repository has no CI workflow of its own.

— Implementer (Claude Opus 5.5)
