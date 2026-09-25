> Guidance for Claude Code. OpenCode uses [`AGENTS.md`](AGENTS.md); the shared
> principles and the verdict protocol are in [`PRINCIPLES.md`](PRINCIPLES.md).
> **Read it before implementing.**

# The Claude Code mode

This file records the Claude-specific process and the project slot.

## The process

Claude mode is **orchestrated**: a main session, a forked implementer and a
fresh reviewer. A **forked subagent** is defined in `PRINCIPLES.md`
(*Sessions and handoff*); it is not a subagent type that copies the main
session's conversation, such as Claude Code's `fork`.

- The **main session** talks to the owner and asks the owner decisions. It
  holds only the subagents' reports. It commits each review file to the pull
  request's branch and posts it as `PRINCIPLES.md` says (*Posting*, *Pull
  requests*), which also covers a project with no remote yet. It asks the
  owner for the merge, or, where the slot records `merge: auto`, merges when
  the slot's conditions hold; and it writes the completion notes.
- Claude **implements** as a forked subagent in its own git worktree, on the
  owner's go. Its brief comes from what the repository records — the project
  slot, the request and its done-when — so a gap in the records surfaces as a
  question. It implements the change on a branch, opens a pull request, and
  stops and reports.
- A review's findings go back to **that same implementer, resumed**, which
  fixes them in the same change; a finding it disagrees with goes to the owner,
  not around the reviewer.
- The review is a **fresh-context session**: a separate, fresh forked
  subagent in its own worktree, which has not seen the implementation. It
  writes its review file and neither commits nor posts it. A re-review resumes
  the same reviewer. **The reviewer is the same model family by default; no
  cross-family reviewer is required.** The mechanism may instead be an
  **external process** from another family (for example `codex exec`, or
  `opencode run -m <provider>/<model>`); when it is, record the tool and the
  model id in the review.
- **Every forked brief, the implementer's and the reviewer's, begins with a
  repository identity check**: the remote's URL and the expected branch or
  commit. A worktree is made from the directory the fork starts in, so a fork
  from the wrong checkout lands in the wrong repository.
- **Without subagents**, one session is the fallback: the main session also
  implements, and starts the review itself, as a headless same-family session
  (for example `claude -p`) or by running the external process. The owner
  opens none. The review records the fallback.
- There is **no design stage**, and a change's review carries **no AGREE/BLOCK
  marker**. The review is recorded per [`reviews/README.md`](reviews/README.md).
- Claude mode's **planning gate** is the shaping of a request (`ROADMAP.md`,
  *The agent's job*) plus its fresh-context review, so a project does not
  take OpenCode's design stage to get one.
- **Milestones** follow `PRINCIPLES.md` (*Milestones*); their verdict is not a
  change's review and does carry the marker.
- **Fallback** for a failed or unavailable review: a new reviewer subagent, a
  headless session the main session starts, or the external process,
  recorded. The rules are in the protocol.
- The **owner may review** as an independent option, but an owner is not
  automatically a fresh context — and is not one if they directed or wrote the
  change.
- The **owner merges** (`PRINCIPLES.md`), unless the project slot records
  `merge: auto`. The owner may also ask for a review by OpenCode's process
  instead, when a cross-family check is wanted.

Materiality, fallback, waiver and the defect path are in `PRINCIPLES.md`; the
bootstrap applies as written there — one review, not two stages.

## Project slot

<!-- SLOT:BEGIN -->

<!-- The scaffold replaces everything between the markers. In the harness source
     repository this slot stays unfilled by design: the harness's own next items
     are in BACKLOG.md, and its history in design/ and reviews/. -->

- **product:** {{PROJECT}} — one paragraph: what it is and who it is for.
- **premise:** `product` or `testbed`. Under `product`, the project's content
  is the deliverable; under `testbed`, the project exists to exercise the
  process, and `ROADMAP.md`'s testbed sentences hold.
- **roles:** who implements, who reviews each change and who reviews
  releases, recorded before a mode is chosen. The mode is the implementer's
  tool's: Claude mode for Claude Code (this file), OpenCode mode for OpenCode
  (`AGENTS.md`).
  - **implementer:** the tool, Claude Code or OpenCode, and its model id.
  - **reviewer of each change:** who, with its model id.
  - **reviewer of releases:** who, with its model id where one is chosen. In
    Claude mode the default is a model that is not Claude, which the owner
    picks at each milestone (`PRINCIPLES.md`, *Milestones*).
- **paths to inspect:** the source roots and documents worth reading by default.
- **the canonical source:** the one place to read and edit; name any mirror,
  copy or generated artifact that must never be edited or cited.
- **paths to normally ignore:** each with its reason — generated by what, a copy
  of what, or merely large. Ignoring a path never means deleting or gitignoring
  it.
- **never read or echo:** secrets, signing material, one machine's paths. List
  them explicitly. A path outside the repository, such as a sibling clone or a
  download cache, is described relative to it, never absolutely.
- **merge:** owner
- **design:** OpenCode mode only: `required` or `none` (`AGENTS.md`, *The two
  stages*). A Claude-mode project's slot has no `design:` line.
- **milestones:** the release tag scheme (`vX.Y.Z` by default) and the one
  file that holds each release's claims (`PRINCIPLES.md`, *Milestones*).
- **the gates table:** one row per gate — the command, what it covers, when it
  runs, how many repeats, and the failure model that justifies the repeats.
- **conventions:** the player-facing language and the language of comments and
  commits; promises about build steps and dependencies; **decided, and not to be
  re-opened** (with the measured outcome, so a later session does not mistake it
  for a bug); where open work lives.

<!-- SLOT:END -->
