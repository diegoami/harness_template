> Guidance for Claude Code. OpenCode uses [`AGENTS.md`](AGENTS.md); the shared
> principles and the verdict protocol are in [`PRINCIPLES.md`](PRINCIPLES.md).
> **Read it before implementing.**

# The Claude Code mode

This file records the Claude-specific process and the project slot.

## The process

- Claude **implements** the change on a branch, and opens a pull request when a
  remote exists.
- The review is a **fresh-context session** — a new session that has not seen
  the implementation. **The reviewer is the same model family by default; no
  cross-family reviewer is required.** The mechanism may instead be an
  **external process** from another family (for example `codex exec`, or
  `opencode run -m <provider>/<model>`); when it is, record the tool and the
  model id in the review.
- There is **no design stage** and **no AGREE/BLOCK marker**. The review is
  recorded per [`reviews/README.md`](reviews/README.md).
- **Fallback:** a new session, or the external process, recorded. The rules are
  in the protocol.
- The builder fixes findings in the same change; a finding the builder disagrees
  with goes to the owner, not around the reviewer.
- The **owner may review** as an independent option, but an owner is not
  automatically a fresh context — and is not one if they directed or wrote the
  change.
- The **owner merges** — unless the project slot records `merge: auto`, in which
  case the implementer merges the pull request as soon as the review is clean
  and every gate is green (`gh pr merge <n> --squash --delete-branch`). The
  owner may also ask for a review by OpenCode's
  process instead, when a cross-family check is wanted.

Materiality, fallback, waiver and the defect path are in `PRINCIPLES.md`; the
bootstrap applies as written there — one review, not two stages.

## Project slot

<!-- The scaffold fills the product name; a project fills the rest in its first
     session. In the harness source repository this slot stays unfilled by
     design — the harness's own rules are README.md and docs/. -->

- **product:** {{PROJECT}} — one paragraph: what it is and who plays it.
- **paths to inspect:** the source and documents worth reading by default.
- **paths to normally ignore:** generated, vendored or binary paths; read the
  lockfile only when dependencies are the task.
- **never read or echo:** secrets, signing material, one machine's paths. List
  them explicitly.
- **the gates table:** one row per gate — the command, what it covers, when it
  runs, how many repeats, and the failure model that justifies the repeats.
- **conventions:** the player-facing language and the language of comments and
  commits; promises about build steps and dependencies; **decided, and not to be
  re-opened** (with the measured outcome, so a later session does not mistake it
  for a bug); where open work lives.
