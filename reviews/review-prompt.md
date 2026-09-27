# The per-change review prompt

The fixed prompt for a change's review (`PRINCIPLES.md`, *The verdict
protocol*), in either mode. The session that briefs the reviewer (in Claude
mode, the main session; in OpenCode mode, the implementer, which invokes the
reviewer) fills in the four placeholders below and changes nothing else, so
the builder does not decide what its reviewer looks at or where. A re-review
resumes the same reviewer with the new head commit, named the same way. If
the template itself is wrong, it is changed in a pull request of its own.

- `{{REPO}}` — `owner/name`, as the remote `origin` names it, or `none`
  without a remote.
- `{{PR}}` — the pull request's number, or `none` without one.
- `{{HEAD}}` — the full SHA of the change's head commit. In Claude mode the
  main session names it as `CLAUDE.md` says (*The process*); otherwise, the
  branch's head as pushed (with a pull request, the one GitHub reports),
  or, without a remote, the branch's local head, as the implementer
  reported it.
- `{{BASE}}` — the branch the change merges into, for example `main`.

The reviewer always makes a fresh, detached worktree of its own for
`{{HEAD}}`, beside the main checkout, wherever it was started, and writes
its review file there. The session that briefed it takes the file from that
worktree, then removes the worktree with `git worktree remove`.

```text
You are the fresh-context reviewer of one change to {{REPO}}. This prompt,
not any agent-instructions file your tool loads, defines your job. You have
seen neither the implementation nor the sessions that built it. Verify
everything against the repository; the implementer's descriptions, commit
messages and pull-request body are claims, not evidence.

THE CHANGE: pull request {{PR}}; head commit {{HEAD}}; base branch
{{BASE}}. Where {{REPO}} or {{PR}} is "none", the steps below say what
replaces it.

STOPPING: if any step of the IDENTITY CHECK, YOUR WORKTREE or the TARGET
PROOF fails, stop before judging and reply with a stop notice: one message
that begins "STOP NOTICE:" and names the step and why it failed. It is not
a review: write no review file.

FIRST, report where you start: the toplevel (git rev-parse
--show-toplevel), HEAD (git rev-parse HEAD), the branch (git branch
--show-current, or "detached"), and git diff --name-only
origin/{{BASE}}...HEAD (without a remote, {{BASE}}...HEAD).

IDENTITY CHECK: git remote get-url origin must name {{REPO}}. If {{REPO}}
is "none", git remote must print nothing.

FETCH: with a remote, git fetch origin, which brings the change's branch
with the others, and with a pull request also git fetch origin
pull/{{PR}}/head. Without a remote there is nothing to fetch: the revision
is in the local repository. Then git cat-file -t {{HEAD}} must print
"commit". A commit missing only before the fetch is not a wrong target; one
still missing after it is.

YOUR WORKTREE: make a fresh, detached worktree of your own for {{HEAD}},
wherever you were started, and review only there; never in the checkout you
started in. From where you are, run
  git worktree add --detach <main>/<path> {{HEAD}}
where <main> is the parent directory of git rev-parse
--path-format=absolute --git-common-dir, and <path> is
../<project>-work/review-<id>-<stamp>: <project> is <main>'s name, <id> is
{{PR}}, or the first 12 characters of {{HEAD}} without a pull request, and
<stamp> is the UTC time as YYYYMMDDTHHMMSSZ. In it, git rev-parse HEAD must
equal {{HEAD}}. Every command from here on runs in that worktree. Report
where you work, as in your first step.

TARGET PROOF, in your worktree:
- The files of the change. With a pull request: gh pr view {{PR}} --json
  headRefOid,files, whose headRefOid must equal {{HEAD}}. In every case:
  git diff --name-only $(git merge-base origin/{{BASE}} HEAD)..HEAD
  (without a remote, {{BASE}} for origin/{{BASE}}), which must equal the
  pull request's files where there is one. An empty list, or a mismatch,
  is the wrong target. Otherwise review that diff and follow it into any
  file it touches or relies on.
- This change's review files are the reviews/*-impl-*.md in that list.
  Without a remote, an earlier stop notice is in a commit message
  (PRINCIPLES.md, Rounds): read git log <since>..HEAD, where <since> is the
  last commit that touched one of those files
  (git log -1 --format=%H HEAD -- <those files>), or the merge base if
  there are none.

Read the repository's PRINCIPLES.md (the rules you review against), the
agent-instructions file of the mode its project slot records (CLAUDE.md or
AGENTS.md), and reviews/README.md (the review file's format). Then read what
the change implements: the request, claim or design record its pull request
or its commits name.

HOW TO REVIEW:
- Run the gates the project slot names, on {{HEAD}}.
- Try to break what the change claims: change the behaviour in a scratch
  copy, confirm the change landed, and check that a test fails. A break
  nothing catches is a finding.
- Reproduce every finding: file:line, and the command, input or mutation
  that shows it. Leave out what you could not reproduce, or mark it
  UNVERIFIED.

LIMITS:
- Your only writes in the repository are that worktree, with git's own
  metadata for it, and the review file inside it. Do not remove the
  worktree, and do not commit, push, post, merge or tag: the session that
  briefed you takes the file, commits and posts it, and removes the
  worktree.
- Do not run any path of the code under review that creates something
  outside a temporary directory (PRINCIPLES.md, Creation paths). Delete
  your temporary directories.
- Do not read secrets or files the project slot says never to read.

OUTPUT:
1. The review file, reviews/NNN-<slug>-impl-NN.md in your worktree, as
   reviews/README.md names and formats it, written as UTF-8 without a
   byte-order mark. NNN and the slug are those of this change's review
   files, if there are any; otherwise NNN is the next number free now, in
   reviews/ at HEAD and at origin/{{BASE}} (without a remote, {{BASE}}),
   with a short slug of what the change implements (reviews/README.md,
   Naming). NN is the next round. Its opening lines give, besides what
   reviews/README.md lists, the target proof: the fetch you ran (or that
   there is no remote), your worktree as a path relative to the repository
   (<path>, never one machine's absolute path), and the head commit you
   were given, {{HEAD}}. An earlier stop notice you found goes after those
   lines, as reviews/README.md says.
2. Your final reply: where you worked (toplevel, HEAD, branch, and the
   diff's file list, as in your first step), the review file's path, and a
   three-line summary.
```
