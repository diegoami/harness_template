# Adopting the harness into an existing project

Open a session **in the project** and paste:

> Adopt harness release `r5` into this project. The harness is the clone at
> `C:\Users\diego\projects\harness_template`. Fetch it, with
> `git -C C:\Users\diego\projects\harness_template fetch origin --tags`,
> then read `ADOPT.md` as `origin/main` holds it, with
> `git -C C:\Users\diego\projects\harness_template show origin/main:ADOPT.md`,
> and execute it as written.

If the session cannot run that, paste this file's content instead.

---

## What you are doing

You are adopting the harness — the process, not a framework — into an
existing project. The harness is the repository
`https://github.com/diegoami/harness_template`, cloned at
`C:\Users\diego\projects\harness_template`. Below, `<harness>` is that clone
and `<tag>` is the release you take: **`r5`**. You take the tag, and you
check what the harness's `main` holds beyond it. You write the harness files
**adapted to this project**, and you fill the project slot from what the
repository contains and from what the owner answers. **Read the harness
files and adapt them; do not invent rules and do not copy them blind.**

Four rules hold from the first step to the last:

- **You ask before you write.** Steps 1 to 4 write no file in this project.
  No file is written before step 5, and step 5 comes after the owner has
  answered step 4.
- **The harness files own the rules.** This file says only what adoption
  does, in order. Where it names a rule, the file it names is the rule.
- **Read the harness from git, never from its working tree.** Read each
  harness file at the tag or at `main`'s recorded commit, as the steps say,
  with `git -C <harness> show <revision>:<file>`. The clone's checked-out
  branch does not matter.
- **Where the repository does not say, ask.** Do not guess a command, a
  path, a language or a role.

## Who does which step

- **Claude mode**, in the orchestrated shape that the harness's `CLAUDE.md`
  describes (*The process*): the main session, the one the prompt was
  pasted into, does steps 1 to 5 and everything that faces the owner. The
  forked implementer's brief starts at step 6, after its identity check.
  It creates the branch in its own worktree, never in the owner's checkout.
  It does steps 6, 7 and 8.1, then stops and reports. The main session does
  the rest, as `CLAUDE.md` says.
- **OpenCode mode**: the session running `AGENTS.md` does every step.

## The steps

### 1. Read the harness at the tag

1. Fetch the harness, if the prompt has not, with
   `git -C <harness> fetch origin --tags`. It updates only the clone's
   remote refs, and writes nothing in this project. If the clone is
   missing, clone the URL above into a temporary directory outside this
   project, and use that.
2. Record the tag's commit: `git -C <harness> rev-parse <tag>^{commit}`.
3. Read these files **as the tag holds them**, with
   `git -C <harness> show <tag>:<file>`: `PRINCIPLES.md`, `CLAUDE.md`,
   `AGENTS.md`, `reviews/README.md`, `reviews/milestone-prompt.md`,
   `design/README.md`, `PLAN.md`, `ROADMAP.md` and
   `verification/README.md`. Read `PRINCIPLES.md` and `CLAUDE.md` in full.
   They own the rules; this file does not restate them.

### 2. List what the harness's `main` holds beyond the tag

1. Record `main`'s commit: `git -C <harness> rev-parse origin/main`.
2. List every change since the tag, new files included:
   `git -C <harness> diff --name-status <tag>..origin/main`.
3. Keep the harness's shipped files: the files of step 1, and every file
   that a `presets/*.json` lists as `origin/main` holds it
   (`git -C <harness> show origin/main:presets/<name>.json`). Below,
   `<files>` are those files. List the changes to them:

   ```sh
   git -C <harness> log --oneline --first-parent <tag>..origin/main -- <files>
   git -C <harness> diff --stat <tag>..origin/main -- <files>
   ```

4. Write the list for the owner: one line per pull request or commit that
   changes one of those files, saying what it changes for an adopter. Mark
   each item that adds something this file's steps rely on and the tag
   lacks, such as a slot field or the mode's shape. If the list is empty,
   say so; step 4 then has nothing to ask about it.

### 3. Reconnoitre this project, read-only

Write nothing and commit nothing. Run nothing that creates something outside
a temporary directory: no push, no issue, no comment, no publish, no deploy
(`PRINCIPLES.md`, *Creation paths*). Read a tool that publishes; do not run
it to learn what it does. Find:

1. **The product**, in one paragraph: what it is and who it is for.
2. **The premise it suggests**: is the content the deliverable (`product`),
   or does the project exist to exercise the process (`testbed`)?
3. **The tools in use**: which of Claude Code and OpenCode work here, and
   with which models. This is evidence for step 4, not the answer.
4. **The gates**: the real commands. Read `package.json` scripts, a
   `Makefile`, the CI workflows and the README: the unit command, the
   heavier check, lint, build, and which CI runs on every pull request. Do
   not run them yet; step 7 does.
5. **Paths to inspect**, and **the canonical source**: the one place to
   read and edit, with any mirror, copy or generated artifact that must
   never be edited or cited.
6. **Paths to normally ignore, each with its reason**: generated by what, a
   copy of what, or merely large. Open a file in an awkward directory
   individually rather than walking it. A path outside this repository is
   described relative to it, never absolutely (`CLAUDE.md`, the slot's
   never-echo item).
7. **Never read or echo**: secrets, signing material, one machine's paths —
   `.env*`, `*.jks`, `keystore.properties`, keys, credentials. List them by
   name; never open one to check it.
8. **Conventions**: the language of player-facing text, comments and
   commits; build-step and dependency promises; anything **decided and not
   to be reopened**, with its reason; where open work lives.
9. **Milestones**: the release tag scheme (the existing tags, or `vX.Y.Z`)
   and the one file that will hold each release's claims.
10. **The remote and the branch**: the remote's URL, the default branch,
    and any uncommitted change in the working tree. The adoption never
    commits a change it did not make.
11. **Collisions**: every file that step 6.1 names, chosen or not, that
    already exists here, and `.gitignore`, which step 6.5 appends to. Also
    any review process already in use, and any records already in
    `design/` or `reviews/`. For each file, note what it holds: process
    text, project knowledge, and any rule that conflicts with the harness.

### 4. Ask the owner, and wait

Put the questions below to the owner as owner decisions (`PRINCIPLES.md`,
*Owner decisions*): each with a recommended default and its reason,
grounded in what steps 2 and 3 found. **Write nothing before the answers.**

1. **First, the roles** (`CLAUDE.md`, the slot's roles), in a message of
   their own, since the mode and the other questions follow from them. If
   the prompt already carries the owner's answer (step 4.2), record it and
   do not ask again:
   - **the implementer**: the tool, Claude Code or OpenCode, and its model
     id. Default: the tool and the model running this session.
   - **the reviewer of each change**, with its model id. Default: with
     Claude Code, a fresh subagent of the implementer's model; with
     OpenCode, the reviewer in `AGENTS.md`'s assignment table.
   - **the reviewer of releases**, with its model id where one is chosen.
     Default: with Claude Code, a model that is not Claude, which the owner
     picks at each milestone; with OpenCode, a model of another family than
     the implementer's, such as Claude (`PRINCIPLES.md`, *Milestones*).

   Wait for the answer. **The mode follows the roles**: it is the
   implementer's tool's, Claude mode for Claude Code and OpenCode mode for
   OpenCode. Do not choose a mode for a feature it has. In Claude mode, the
   planning gate is shaping plus its review (`CLAUDE.md`, *The process*),
   not a design stage.
2. **If the implementer's tool is not the tool running this session,
   stop**, and write nothing. Tell the owner that adoption continues in
   that tool, and print the prompt to paste there: this file's paste
   prompt, followed by one line, "The owner has answered the roles:" and
   the three answers, with their model ids.
3. **Then the rest, in one message**, and wait for the answers:
   1. **The premise**: `product` or `testbed` (`CLAUDE.md`, the slot's
      premise). Default: `product`, unless step 3 found a testbed.
   2. **`merge:`**: `owner` or `auto` (`PRINCIPLES.md`, *Merge policy*).
      Default: `owner`. Under `auto`, also ask the merge conditions the
      slot will state.
   3. **`design:`**, only in OpenCode mode: `required` or `none`
      (`AGENTS.md`, *The two stages*). Default: `required`. In Claude mode,
      do not ask it; the slot has no `design:` line.
   4. **What is taken from the harness**: the tag alone, or also some of
      what `main` holds beyond it (step 2). Ask whether the project needs
      any of it now, item by item. Default: the tag alone, plus every item
      step 2 marked, since this file's steps rely on it; say so for each.
   5. **The optional files**: `PLAN.md` and `ROADMAP.md` (default: take
      them if the project slices work into iterations or grows by
      requests), and `verification/README.md` (default: take it).
   6. **Each collision**: how it is reconciled (step 6.2), with a default
      for each. Ask each conflict between a project rule and a harness
      rule as a decision of its own. Default: the harness rule.
   7. **The rest of the slot, as drafted from step 3**: the product
      paragraph, the paths, the never-echo list, the milestones line, the
      gates table and the conventions. Ask the owner to correct it, and ask
      whatever step 3 could not settle.
   8. **The first real change** after the adoption (step 9): a candidate
      that is non-trivial (`PRINCIPLES.md`, *What counts as non-trivial*),
      so that it takes the loop, such as the first open request, or a gate
      the project lacks. Default: the smallest non-trivial change that runs
      the gates.

If the owner rejects the adoption rather than answering, stop.

### 5. Open the change

The adoption is a non-trivial change (`PRINCIPLES.md`, *Bootstrap*). Its
branch is made from the default branch, for example `adopt-harness-<tag>`.

1. **Claude mode**: the main session forks the implementer. Its brief is
   the identity check, this file from step 6 on, the reconnaissance and the
   owner's answers. The implementer creates the branch in its own worktree.
2. **OpenCode mode**: create the branch. With `design: required`, write
   `design/001-adopt-harness.md` (`design/README.md`) with the file list,
   the filled slot, the owner's answers and every collision. Post it as
   `PRINCIPLES.md` says (*Posting*): with a remote, it opens as an issue.
   Take it to an explicit **AGREE** as `AGENTS.md` says. **Write no harness
   file before AGREE.** With `design: none`, go on to step 6.

### 6. Write the files

1. The files: `PRINCIPLES.md`, `CLAUDE.md`, `AGENTS.md`,
   `reviews/README.md` and `reviews/milestone-prompt.md` always;
   `design/README.md` only in OpenCode mode with `design: required`; and
   the optional files, `PLAN.md`, `ROADMAP.md` and
   `verification/README.md`, where the owner chose them.
2. Reconcile each collision of step 3 before writing over it, as the owner
   decided in step 4. For every kind, **nothing is lost**: the project's
   own knowledge moves into the slot, or stays in a file the harness does
   not own, and every move is noted for the pull request and the report.
   - **A file of step 6.1 that exists and is not the harness's**, such as
     a project's own `PRINCIPLES.md`, `AGENTS.md`, `CLAUDE.md` or
     `reviews/README.md`, is never overwritten unread. Sort what it says:
     - process text that the harness file covers is replaced by it;
     - project knowledge, such as paths, gates, conventions and decided
       items, goes into the slot, except a conservative floor's path
       list, which goes into the adopted `PRINCIPLES.md`'s floor;
     - a project rule that conflicts with a harness rule is settled by the
       owner's answer to step 4: the harness rule, or the project's rule
       kept in the slot's conventions;
     - a project rule the harness lacks goes into the slot's conventions;
     - anything that is not a rule, such as history or notes, moves to a
       file the harness does not own, named in the pull request.
   - **An existing `PLAN.md` or `ROADMAP.md`** with this project's own
     plans is not overwritten. Either keep the project's file and skip the
     harness one, or move the plan into the harness file's shape, and note
     what moved.
   - **An existing `.gitignore`** is appended to (step 6.5); none of its
     lines changes.
   - **Existing records in `design/` or `reviews/`** stay; new records
     take the next free number.
   - **An existing `README.md` at the root** is left as it is. The
     harness writes none.
3. Write each file from one revision, never a mix: the tag, with
   `git -C <harness> show <tag>:<file>`, or `main`'s recorded commit for an
   item the owner took in step 4. An item from `main` is taken with all of
   its changes, in every file it touches. Then each file is adapted like
   any harness file.
4. Fill the project slot in `CLAUDE.md`, between its markers, **from this
   repository**: the owner's answers to step 4, the reconnaissance of
   step 3 and what step 6.2 moved there. The roles, the premise and
   `merge:` are the owner's answers; `design:` is written only in OpenCode
   mode. In OpenCode mode, also write the slot's models into `AGENTS.md`'s
   assignment table and its implementer signature (`AGENTS.md`, *Roles and
   the assignment*).
5. Append `.claude/worktrees/` to `.gitignore`, or create it with that
   line, as the scaffold does: a forked subagent's worktree goes there.
6. Record the provenance: the harness's URL, the tag and its commit,
   `main`'s commit as step 2 read it, each item taken from `main`, and the
   date. It goes in `PLAN.md`'s *Fork provenance* table where the project
   takes the harness's `PLAN.md`, and otherwise in the slot's conventions.
7. Change nothing else. **The adoption PR changes no product code.** A gate
   the project lacks is a real change for step 9, not part of this one.

### 7. Check the adoption

1. Run every gate the slot names, on the adoption branch, and commit none
   of their output. A command that does not run as the gates table says is
   corrected in the table, and the owner is told.
2. A red gate does not merge (`PRINCIPLES.md`, *The six gates
   disciplines*). Run a gate that is red on the adoption branch on the
   default branch too, outside the owner's checkout:
   - **red there as well**: it goes to the owner as an owner decision
     before step 8. In Claude mode, the implementer stops there, before
     step 8.1, and reports; the main session asks the owner. Default: fix
     it first, in a change of its own, reviewed as the roles answered in
     step 4 say, and merge the adoption after it.
   - **red only on the adoption branch**: the adoption broke it. Fix it in
     the adoption PR.
3. Check that every relative link in the files written resolves, and that
   no `{{…}}` placeholder is left other than those
   `reviews/milestone-prompt.md` documents.

### 8. Take the adoption PR through the loop

1. Open the pull request as `PRINCIPLES.md` says (*Pull requests*). Its
   *what was built* lists the files, the filled slot, every collision and
   where its knowledge went, and each owner decision of step 4 with its
   default, its reason and the owner's answer. Its evidence is where
   *Owner decisions* says.
2. Have it reviewed as the mode requires: `CLAUDE.md` (*The process*) or
   `AGENTS.md` (*The two stages*). The review file is
   `reviews/001-adopt-harness-impl-01.md`, or the next free number where
   `reviews/` already holds records.
3. Post each record as `PRINCIPLES.md` says (*Posting*). Rounds are capped
   as *Rounds* says.
4. It merges as the slot's `merge:` says, with every gate green. The
   completion note follows the merge (`PRINCIPLES.md`, *Completion*).

### 9. Take the first real change through the loop

1. Wait for the owner's go on the change chosen in step 4. Do not start it
   while it is still being discussed.
2. Take it through the loop that the adopted slot now records: shaped as
   `ROADMAP.md` says where the project takes it, implemented on a branch,
   reviewed, posted and merged as the slot says, with its completion note.
   It is the first change under the harness, not part of the adoption PR.
3. A contradiction it finds in the adopted files is a defect
   (`PRINCIPLES.md`, *The ownership map*). Fix it in this change, say so in
   its pull request, and keep it for the report.

### 10. Report to the owner

End with a report to the owner, in the conversation. The repository's
records are the handover: write no handover file. The report says:

1. **what was built**: the adoption PR, its files and the filled slot, and
   what was taken from `main` beyond the tag;
2. **every collision**, and where its knowledge went;
3. **the real change**: its pull request, its review rounds and what they
   found;
4. **what was left undecided**: every question the owner did not settle,
   every red gate of step 7 and its outcome, and every defect of step 9.

## Done when

- The owner answered step 4 before any file was written, and the slot
  records the roles, the premise and `merge:`, and `design:` only in
  OpenCode mode.
- The provenance names the tag and its commit, `main`'s commit, and what
  was taken from `main`.
- Every chosen harness file exists, and the slot's product, paths,
  never-echo list, milestones and gates table are filled **from this
  repository**; the gates table names commands that run here.
- The adapters carry only their mode-specific text, and nothing contradicts
  `PRINCIPLES.md`.
- Every collision is reported, with where the displaced knowledge went.
- The adoption PR changed no product code, and it was reviewed, posted and
  merged as the slot says, with every gate green.
- The first real change after the adoption PR, a non-trivial one, was taken
  through the loop: reviewed, posted and merged as the slot says.
- The report of step 10 reached the owner.
