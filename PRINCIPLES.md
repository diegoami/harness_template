# Principles

> Shared by both working modes. OpenCode reads this through
> [`AGENTS.md`](AGENTS.md), Claude Code through [`CLAUDE.md`](CLAUDE.md). The
> ownership map below is authoritative: a non-owning file links to an idea and
> does not restate it.

## The ownership map

| idea | owner |
|---|---|
| the principles and habits on this page | `PRINCIPLES.md` |
| the non-trivial test, the conservative floor, the pure-typo exception | `PRINCIPLES.md` |
| the six gates disciplines | `PRINCIPLES.md` |
| the verdict protocol: revision scope and target proof, rounds, materiality, reviewer sessions, fallback, waiver, owner decisions, defect path, completion note, merge policy, `design: none` scoping, rules going forward, bootstrap, comment-not-approval, posting, pull requests | `PRINCIPLES.md` |
| milestones: the definition, claims before work, the milestone issue, the reviewer and its verdict, the tag, triage | `PRINCIPLES.md` |
| the milestone review prompt | `reviews/milestone-prompt.md` |
| the OpenCode process: roles, assignment table, reviewer acquisition, the two stages, BLOCK scope, withdraw/re-scope | `AGENTS.md` |
| the Claude Code process: fresh-context review, same-family default, no design stage, the external-process option | `CLAUDE.md` |
| the project rules: product, paths, never-echo, the gates table, conventions, one source of truth, decided-not-to-reopen, open work | `CLAUDE.md`, the project slot |
| the iteration overlay and the fork-provenance table | `PLAN.md` |
| feature requests and artistic license | `ROADMAP.md` |
| the design-record format | `design/README.md` |
| the verdict-record format and the signature convention | `reviews/README.md` |
| the optional verification patterns | `verification/README.md` |

**The table is authoritative.** A contradiction found between files is recorded
as a defect and fixed in the change that found it. If the table does not settle
a sentence that spans two owners, the fallback order is: this file for
principles and the protocol, `AGENTS.md` for the OpenCode process, `CLAUDE.md`
for project rules.

## What counts as non-trivial

A change is **non-trivial** if it can change:

- **(a)** the observable behaviour of the product or of any tool;
- **(b)** what any check measures or asserts;
- **(c)** the design or process a builder must follow — including the harness
  files, the design records, and any document that states design;
- **(d)** user-facing copy.

Anything that meets none of (a)–(d) is **trivial**. As a **conservative floor** —
the checklist a builder uses instead of tracing imports — a diff touching
`public/**`, `tools/**`, `design/**`, `reviews/**`, `.claude/**`, `.github/**`,
`mobile/**`, `netlify.toml`, the harness files or the package manifests is
non-trivial whether or not the author believes the test is met, **unless it is a
pure typo or comment that changes no behaviour, no assertion and no process
text**.

A trivial change takes neither stage: no design record, no review, no verdict.
It may go straight to the main branch, still runs the gates its diff can affect,
and does not relax CI.

## The six gates disciplines

1. **Declare the gates in one table**: the commands, what each covers, when it
   runs, how many repeats, and the failure model that justifies the repeats.
2. **A red gate does not merge.**
3. **A new assertion is made to fail before it is made to pass**, and a claim
   that *nothing* caught it is re-taken before it is believed: show that the
   break landed, that the command ran, and that it ran on the revision under
   review. A false red announces itself; a false green is silent.
4. **Reproduce before you act** — a reviewer's finding and your own claim alike.
5. **Assert what a person would notice** — pixels, contrast, timing — then play
   it.
6. **Say what a passing check would have caught** had the code been wrong.

## The verdict protocol

**Shared across both modes.**

- Records are files. An **implementation review** is
  `reviews/NNN-<slug>-impl-NN.md`, naming the revision it covers. A **design
  record** (`design/NNN-<slug>.md`) exists only in OpenCode mode, which has a
  design stage; Claude mode has none, so it has no design records.
- A verdict or review covers **the named revision**, and the reviewer shows the
  target before judging: the revision, and the files of the change — the pull
  request's head and file list where a pull request exists, otherwise the diff
  from the change's base (`git merge-base main <revision>`, then
  `git diff --name-only <merge-base>..<revision>`). **The revision the reviewer
  holds must equal the named target, and its file list must equal the change's
  file list**; every finding names a file in that list. An empty diff or a
  mismatched revision is the wrong tree, so the review stops and says so rather
  than reviewing what it can see.
- **Materiality.** Non-material edits: commit messages, whitespace, and typos
  that change no behaviour, no assertion and no process text. A material edit to
  a design record, or a comment that changes the proposal or records an owner
  decision the reviewer required, triggers re-review; a comment that merely
  answers within the proposal does not. A verdict that refers to an obsolete
  revision is re-reviewed against the current one.
- **Reviewer sessions.** A stage's initial verdict comes from a new reviewer
  session; a re-review after fixes may continue that session, because the
  separation the gate protects is from the implementer's context, and the
  reviewer re-reads the current revision.
- **Rounds.** Rounds are counted per stage: each appended design verdict, and
  each implementation review file (`-NN`), is one round. Rounds 1 and 2 may
  rework; a third round that does not end clean — `AGREE` in OpenCode mode, the
  statement that no blocking finding remains in Claude mode — stops and goes to
  the owner, who decides: re-scope, record a decision, or, at the implementation
  stage only, waive. It does not loop. Rounds keep counting through a stage
  after a clean round: a change extended after one is reviewed in the next
  round, and any round from the third on that does not end clean goes to the
  owner. A review that stops before judging — a wrong target (above), or a
  reviewer who may not review — is no review (*Fallback*) and not a round. A
  milestone's rounds are counted per milestone instead: each verdict on its
  milestone issue is one round, and a third that is not `AGREE` goes to the
  owner (*Milestones*).
- **Fallback.** A failed, cancelled or unavailable review is no review and no
  approval. Retry, or select another reviewer; record its model id and who
  selected it; the fallback becomes the designated reviewer for its stage. Each
  mode states where its fallback reviewer may come from (`AGENTS.md`,
  `CLAUDE.md`).
- **Waiver.** An implementation-stage exception only, recorded, and never called
  AGREE. Bypassing the design stage is an owner amendment, recorded in the
  design record (under `design: none`, in the project slot).
- **Owner decisions.** Recorded with a recommended default, the reason, and an
  owner-decision mark. The reviewer may require that a decision be made and
  recorded; it may not reject it merely for differing from its own preference.
  If the owner rejects the proposal rather than deciding a value, the change is
  withdrawn or re-scoped, recorded; it receives no approval and is not merged
  around.
- **Defect path.** A defect found after a change landed is recorded and fixed by
  a change that lands the assertion that would have caught it. In OpenCode mode
  the fix takes the design stage unless all four hold: limited to the recorded
  defect; no behaviour beyond it; no change to what a check measures; no process
  change. Claude mode has no design stage; the fix is reviewed like any change.
- **Completion.** When a change lands, the implementer appends a short
  **completion note** to the change's record: each done-when item and the
  evidence that closed it — the CI run, the gate output. The note is
  **non-material**: it may only transcribe the already-agreed done-when items
  and their outcome. Changing a done-when, an assertion, an owner decision or
  any process rule is material and takes the review its mode requires; a note
  that does any of that is not a completion note. The latest verdict still
  governs.
- **Merge policy.** The owner merges, unless the project slot records
  `merge: auto`; then a change merges when its review is clean — `AGREE` in
  OpenCode mode, no blocking finding in Claude mode — its reviews are posted
  (*Posting*), and every gate is green. A project that takes `auto` states its
  merge conditions in its slot, and the pull request records the merge.
- **`design: none`.** Where a project's slot records `design: none`, the
  design stage does not exist in either mode, and each thing this file puts
  in a design record has one home: the completion note goes in the last
  implementation review file (as in Claude mode); an owner amendment that
  would otherwise bypass a design stage goes in the project slot; the defect
  path is the implementation review; and any other reference to a design
  record resolves to the implementation review file.
- **Rules apply going forward.** A record is held to the rules in force when
  it was written. A later rule is not applied to it, and it is not
  backfilled; a record that is corrected after the fact says so, keeps its
  original text, and is signed by whoever corrects it.
- **Bootstrap.** A change to a harness file that changes what a builder must do
  or how the process works takes the review its mode requires — both stages in
  OpenCode, the review in Claude; a pure typo takes neither.
- **Comment, not approval.** The verdict is posted as a comment (or written to
  the file locally); it is never an approval action. Under the single GitHub
  account an approval is impossible, and the signature is the only marker of
  authorship.
- **Posting.** A remote is assumed, and a record is posted when it is
  written, not after the fact; the file stays canonical. Where the project
  has a design stage (OpenCode mode, `design: required`), the design record
  opens as an issue before any implementation, and each verdict is posted on
  it as it is appended. In both modes each implementation review file is
  committed to the pull request's branch, pushed, and posted on the pull
  request before the next commit, the next round and the merge — one comment
  per review file, equal to the file as the pull request's head holds it.
  The completion note, appended after the merge, is not posted. Post with
  `tools/post-record.mjs` where the project has it (it refuses a review the
  pull request does not hold, and reads every body back); otherwise with
  `gh … --body-file` from a UTF-8 file without a byte-order mark, never from
  text a shell has passed on. Without a remote, the files stand alone.
- **Pull requests.** A pull request names what it implements (an issue, a
  design record, a claim, a request) and the revision its last clean round
  covered, or, when the owner waives the review, the waiver. Its body has
  four parts: what was built; the done-when, ticked; the check output,
  verbatim; and what was left out. A trivial change needs no pull request.
  An issue a pull request completes is closed by `Closes #N` on a line of its
  own, outside any code span, and the pull request is checked to list it
  (`gh pr view <n> --json closingIssuesReferences`); a reference that only
  links says so. **No merge while a review is running**: a pull request
  merges only after its last review is posted.

The **record format** — naming, the exact signature line, the marker rules — is
owned by [`reviews/README.md`](reviews/README.md).

## Milestones

The same in both modes. Each change keeps its own review and the project's
merge setting; a milestone adds one independent review of everything since
the last one.

- **A milestone is a release**: an annotated tag on `main`, on the exact
  commit the release is built from (`vX.Y.Z`, or the project's own scheme;
  the harness repository itself uses `rN`). It is not a pull request, a
  proposal, a count of pull requests or a process change. The owner calls
  one, or the implementer proposes one when a release is due.
- **Claims come before the work.** When a release is scoped, before its work
  starts, the project's plan records its promise, numbered claims (C1…Cn),
  each naming the check that proves it, and a "not in this release" list.
  The plan is one file in the repository, which the milestone issue names
  (in the harness repository itself, `BACKLOG.md`). The claims are fixed
  when the change that records them lands; from then on a claim changes only
  there, visibly, dated and with its reason in the same commit; it is never
  weakened to pass, and a claim found wrong is corrected there as such.
- **The milestone issue.** When the release's work has landed, the
  implementer opens an issue holding the proposed tag, the candidate commit
  on `main` (its full SHA), the previous tag, the plan file and the commit
  that fixed the claims, the pull requests merged since, and the gate
  results on the candidate, and gives
  the owner the milestone review prompt
  ([`reviews/milestone-prompt.md`](reviews/milestone-prompt.md)), filled in
  and otherwise unchanged, to run in a fresh session.
- **The reviewer** is of a family that implemented none of the range — in a
  Claude-mode range, any model that is not Claude — and reviews
  `git diff <previous tag>..<candidate>`. It checks the claims it was given
  against the plan at the candidate, and the plan's history since the
  previous tag for a claim weakened or changed without its reason. It gives
  every claim a verdict —
  MET, NOT MET, PARTLY MET or COULD NOT TEST, each with its evidence — opens
  one issue per reproduced finding, and posts one verdict comment on the
  milestone issue, ending `AGREE` or `BLOCK`. `AGREE` only when no claim is
  NOT MET and no finding blocks; a PARTLY MET or COULD NOT TEST is a finding
  the reviewer grades as blocking or not.
- **The tag waits for the verdict.** On `BLOCK` the findings are fixed in
  ordinary pull requests, the candidate moves to the new `main` commit, and
  the implementer gives a re-review prompt unasked. A milestone's rounds are
  counted per milestone (*Rounds*). On `AGREE` the implementer creates the
  tag on exactly the reviewed commit, its message naming the milestone
  issue, the reviewer and its model id, and any accepted gap; work merged
  after the candidate belongs to the next milestone. Only the owner may tag
  without a review, as an override recorded on the milestone issue — never
  the implementer's call.
- **When a verdict arrives**, the implementer reproduces each finding,
  replies on the milestone issue per finding, and sends each one exactly one
  way: a **defect**, fixed in a pull request (this milestone's if it
  blocks); **the claim was wrong**, corrected in the plan as above; an
  **accepted gap**, recorded in the tag message with its issue; or **not a
  defect**, with the reason.
- **The record.** The reviewer posts its verdict with `gh … --body-file`, and
  the comment is the record until the implementer copies it verbatim into
  `reviews/` (`reviews/README.md`); from then on the file is canonical. After
  tagging, the implementer appends a `## Completion` section to the last
  verdict's copy, showing that the tag is annotated (`git cat-file -t`) and
  that `git rev-parse <tag>^{commit}` equals the SHA the `AGREE` names. A
  `BLOCK` verdict's copy lands with the first pull request that fixes one of
  its findings, so the range under review holds only pull requests; the
  `AGREE` verdict's copy lands after the tag, with its completion note, as a
  completion note does. The implementer posts the milestone issue and its
  replies as *Posting* says.

## The habits

- **Reproduce before you act.** Run the command, break the code, watch the
  check go red on the assertion written for it. An unreproduced finding is a
  hypothesis; an unreproduced claim is a remembered number.
- **Say what a passing check would have caught** had the code been wrong. Never
  let implementer and reviewer share a blind spot.
- **A threshold from one measurement is a coin toss.** Hold it against a second
  range, a spread of real environments, a second browser, and say where it came
  from.
- **Flag out-of-scope defects rather than fixing them silently**; if a fix turns
  out bigger than flagged, fix it fully.
- **Show diffs, not whole files.** Search first, read the range you need, edit
  with focused replacements, and do not re-echo a file you just edited.
- **Read this much, and no more.** The paths to inspect and to ignore are the
  project's (see the project slot in `CLAUDE.md`); ignoring a path never means
  deleting or gitignoring it.
- **Keep command output short.** Prefer the project's own commands, cap their
  output, and scope file searches to source directories.
- **Run old and new side by side.** A broken harness shows up as both columns
  agreeing when they should differ.
- **A passing test is not a working feature.** Assert what a person would
  notice, then go and play it.
- **Durable facts belong in the repository** — this file, the project rules,
  the design and review records, the pull-request body — not in a conversation.
- **Sessions and handoff.** Start a fresh session after a completed logical unit
  or when a thread has grown long. Carry forward a short handoff: **Completed**
  (what is now true, and what was verified); **Files / decisions** (the paths
  touched and the decisions made, with reasons); **Next** (the next task, or
  "nothing open").
