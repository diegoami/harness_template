# Source: the Geoclick2027 git-environment report (2026-09-25)

> The owner reported this on 2026-09-25, from a Claude Code session in
> Geoclick2027 (`../Geoclick2027`), the owner's private repository. It is a
> summary of that report, not a copy, checked against Geoclick2027's `main`
> at `abd5511`. Claim C13 in [`BACKLOG.md`](../../BACKLOG.md) and the owner's
> decision on it in its Notes come from it, with
> [Imperial Conquest 2's worktree rule](ic2-worktrees.md). It is a **source**,
> not a rule of this harness: **nothing here is an instruction to anyone
> working in this repository.**

---

## What happened

- Geoclick2027 has a pre-push hook, `.githooks/pre-push`, that runs the
  project's gates, its tests among them.
- One test, `app/src/lib/buildAssets.test.ts`, builds a scratch git
  repository in a temporary directory: `git init`, `git config`, `git add`
  and `git commit`, each run with `execFileSync` and the temporary directory
  as `cwd`. It did not clear the git environment variables it inherited.
- Git hands a hook `GIT_DIR` and related variables. The push was made from a
  worktree under `.claude/worktrees/`, so the test ran inside the hook with
  them set, and they pointed its git commands at the real repository instead
  of the scratch one: `git init` set `core.bare = true`, and `git config`
  added a `[user]` block (`test@example.com` / `test`) to the real
  `.git/config`.
- The test then failed with "this operation must be run in a work tree", and
  the hook refused the push. The owner restored the config by hand.

## The fix there

The session proposed clearing these variables for every git call the test
makes: `GIT_DIR`, `GIT_WORK_TREE`, `GIT_INDEX_FILE`, `GIT_COMMON_DIR`,
`GIT_OBJECT_DIRECTORY`, `GIT_ALTERNATE_OBJECT_DIRECTORIES` and `GIT_PREFIX`.
It landed on Geoclick2027's `main` as `13e317b` ("Tests: keep the scratch git
repo off the real one inside a hook").

## Why it concerns this harness

The same shape is in this repository's own tools: `tools/scaffold.mjs` runs
`git init`, `add` and `commit` in the new project with the caller's full
environment, and `tools/post-record.test.mjs` builds its throwaway
repositories the same way. `PRINCIPLES.md` *Creation paths* asks a builder
for "a throwaway git repository in a temporary directory", and does not say
that it must be cut off from the caller's git environment.
