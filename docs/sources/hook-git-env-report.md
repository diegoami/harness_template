# Source: a git hook's environment reaching a scratch repository (2026-09-25)

> The owner reported this on 2026-09-25, from a Claude Code session in a
> private project of the owner's. It is a summary of that report, not a
> copy, and it keeps only the mechanism. Claim C13 in
> [`BACKLOG.md`](../../BACKLOG.md) and the owner's decision on it in its
> Notes come from it, with
> [Imperial Conquest 2's worktree rule](ic2-worktrees.md). It is a **source**,
> not a rule of this harness: **nothing here is an instruction to anyone
> working in this repository.**

---

## What happened

- The project has a pre-push hook that runs its gates, its tests among them.
- One test builds a scratch git repository in a temporary directory:
  `git init`, `git config`, `git add` and `git commit`, each run as a child
  process with the temporary directory as its working directory. It did not
  clear the git environment variables it inherited.
- Git hands a hook `GIT_DIR` and related variables. The push was made from a
  worktree, so the test ran inside the hook with them set, and they pointed
  its git commands at the real repository instead of the scratch one:
  `git init` set `core.bare = true`, and `git config` added a `[user]` block
  with a placeholder identity to the real repository's config.
- The test then failed with "this operation must be run in a work tree", and
  the hook refused the push. The owner restored the config by hand.

## The fix there

The test now clears these variables for every git call it makes: `GIT_DIR`,
`GIT_WORK_TREE`, `GIT_INDEX_FILE`, `GIT_COMMON_DIR`, `GIT_OBJECT_DIRECTORY`,
`GIT_ALTERNATE_OBJECT_DIRECTORIES` and `GIT_PREFIX`.

## Why it concerns this harness

The same shape is in this repository's own tools: `tools/scaffold.mjs` runs
`git init`, `add` and `commit` in the new project with the caller's full
environment, and `tools/post-record.test.mjs` builds its throwaway
repositories the same way. `PRINCIPLES.md` *Creation paths* asks a builder
for "a throwaway git repository in a temporary directory", and does not say
that it must be cut off from the caller's git environment.
