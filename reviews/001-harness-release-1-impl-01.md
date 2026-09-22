# Review — harness release 1, implementation round 01

**Revision reviewed:** 2857b50
**Reviewer:** GPT-5.6 Luna (opencode/gpt-5.6-luna#high), OpenCode mode

### Findings

1. **Record-format ownership is duplicated outside `reviews/README.md` and `PRINCIPLES.md`** — blocking. The ownership map assigns the verdict-record format and exact signature convention to `reviews/README.md` (`PRINCIPLES.md:22`, `PRINCIPLES.md:113-114`), but the exact signature line is repeated in `AGENTS.md:18-22`; the marker rule is also repeated in `design/README.md:8-13`, while its canonical wording is `reviews/README.md:11-20`. Materiality is likewise restated outside its owner: `design/README.md:14-16` and `reviews/README.md:24-27` prescribe re-review behavior that belongs to `PRINCIPLES.md:73-81`. These non-owning files should link to the owners rather than restate the rules; otherwise the release does not satisfy its authoritative ownership discipline.

### Verified

- `PRINCIPLES.md` contains the required ownership map, four non-trivial conditions, conservative floor including `.claude/**`, `mobile/**`, and `netlify.toml`, pure-typo guard, six disciplines, and the shared protocol including materiality, sessions, fallback, waiver, owner decisions, defect path, bootstrap, and comment-not-approval (`PRINCIPLES.md:8-114`).
- `AGENTS.md` has the current implementer/reviewer assignment, different-family invariant and update rule, fresh explicit-model subagent review, both stages, BLOCK scope, bootstrap, remote pointers, and owner merge (`AGENTS.md:9-77`). `CLAUDE.md` has the fresh same-family default, no design stage or AGREE/BLOCK marker, external-process option, owner-review caveat, owner merge, and exactly one `{{PROJECT}}` token outside comments (`CLAUDE.md:9-52`).
- `PLAN.md`, `ROADMAP.md`, `design/README.md`, `reviews/README.md`, and `verification/README.md` contain the planned overlay, request/artistic-license rules, record structure, nine optional patterns, and links to shared owners. The union map assigns the experiment-record pattern to the lab (`PRINCIPLES.md:19-23`; `design/001-harness-release-1.md:128`), and no union item from `docs/01-harness-comparison.md:303-332` is unassigned.
- The scaffold manifest has exactly eight run files (`scaffold.manifest.json:3-12`). I ran `node tools/scaffold.mjs --ref 2857b50 --name sample-project --dir <temp>` in the Windows workspace: it created those eight files plus `README.md`, replaced `{{PROJECT}}` (zero remaining occurrences), listed the first-session steps, initialized a repository with exactly one commit, and produced subject `Scaffold from harness 2857b50`. The generated repository had no remote; the implementation uses local `git show`/filesystem operations and does not invoke network or GitHub APIs (`tools/scaffold.mjs:7-9`, `tools/scaffold.mjs:60-95`, `tools/scaffold.mjs:123-143`).
- I ran the non-empty-target and unknown-ref cases separately; both exited 1, and the unknown-ref case created no target. The temporary directories were cleaned up afterward. The Windows execution used Node's path APIs and direct argument arrays, and completed successfully.

### Not verified

- The normal `--tag r1` spelling was not run because `r1` is not yet tagged at revision `2857b50`; the supported `--ref 2857b50` path was run instead.
- The stale design-record metadata still says `awaiting re-review` at `design/001-harness-release-1.md:3` despite the appended AGREE at line 446; this is non-blocking for the implementation gate but should be corrected before tagging.

— GPT-5.6 Luna (opencode/gpt-5.6-luna#high), reviewer
BLOCK
