#!/usr/bin/env node
// post-record.mjs — post a record to GitHub exactly as its file says.
//
//   node tools/post-record.mjs review reviews/010-x-impl-01.md --pr 15
//   node tools/post-record.mjs design design/010-x.md            # new issue + verdicts
//   node tools/post-record.mjs design design/010-x.md --issue 16 # verdicts not yet posted
//   node tools/post-record.mjs milestone r5-milestone.md
//   node tools/post-record.mjs reply reply.md --issue 10
//
// A dry run unless --confirm is given: it writes each body file, prints the
// `gh` command that would post it, and posts nothing. Every body goes through
// `gh … --body-file`, byte for byte as the source holds it, so no shell ever
// re-encodes it. With --confirm it posts a review only when the PR holds it
// (one of the PR's files, equal to it at the PR's head) and a design record
// only when it is committed and unmodified, then reads each body back from GitHub and fails if it differs from the file
// (line endings and trailing newlines aside). A body already on the thread is
// not posted again.

import { execFileSync } from "node:child_process";
import {
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Which options each kind takes; anything else is an error, not ignored.
const KINDS = {
  review: ["pr"],
  design: ["issue", "title"],
  milestone: ["title"],
  reply: ["pr", "issue"],
};
// A verdict follows a "---" line and a blank line, with LF or CRLF endings
// (a Windows checkout has CRLF), and starts "## Review — ".
const VERDICT_SEPARATOR = /(\r?\n---\r?\n\r?\n)(?=## Review — )/g;
const FENCE = /^ {0,3}(`{3,}|~{3,})/;

function usage() {
  return `post-record — post a record to GitHub exactly as its file says

  node tools/post-record.mjs review <file> --pr <n>
  node tools/post-record.mjs design <file> [--issue <n>] [--title <t>]
  node tools/post-record.mjs milestone <file> [--title <t>]
  node tools/post-record.mjs reply <file> (--issue <n> | --pr <n>)

  review     the file as one comment on a pull request
  design     a design record: without --issue, a new issue whose body is the
             record up to its first verdict ("---", a blank line, then
             "## Review — "), then one comment per verdict; with --issue,
             the verdicts that issue does not hold yet
  milestone  the file as a new issue
  reply      the file as one comment on an issue or pull request

  --confirm       post (without it: a dry run that posts nothing); a review
                  only if the PR holds it at its head, a design record only
                  if it is committed and unmodified
  --out <dir>     where the body files are written (default: a new temp dir)
  --title <t>     the issue title (default: the file's first "# " heading)
  -h, --help      this text`;
}

class UsageError extends Error {}

function parseArgs(argv) {
  const opts = { confirm: false, given: [] };
  const rest = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "-h" || a === "--help") opts.help = true;
    else if (a === "--confirm") opts.confirm = true;
    else if (["--pr", "--issue", "--out", "--title"].includes(a)) {
      if (i + 1 >= argv.length) throw new UsageError(`${a} needs a value`);
      opts[a.slice(2)] = argv[++i];
      opts.given.push(a.slice(2));
    } else if (a.startsWith("-")) throw new UsageError(`unknown option ${a}`);
    else rest.push(a);
  }
  [opts.kind, opts.file] = rest;
  if (rest.length > 2) throw new UsageError(`unexpected argument ${rest[2]}`);
  for (const n of ["pr", "issue"]) {
    if (opts[n] !== undefined && !/^[1-9][0-9]*$/.test(opts[n]))
      throw new UsageError(`--${n} must be a number, not ${opts[n]}`);
  }
  return opts;
}

// Read the source as bytes and refuse what would not survive the trip.
function readSource(file) {
  const bytes = readFileSync(file);
  if (bytes.length === 0) throw new UsageError(`${file} is empty`);
  if (bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf)
    throw new UsageError(`${file} starts with a byte-order mark; remove it`);
  let text;
  try {
    text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    throw new UsageError(`${file} is not valid UTF-8`);
  }
  return { bytes, text };
}

// Offsets inside fenced code blocks, which never hold a verdict or a title.
// As in CommonMark: a fence is 3+ backticks or tildes indented at most 3
// spaces, and only a fence of the same character, at least as long and with
// nothing after it, closes it. A span ends before its closing line's ending.
function inFence(text) {
  const spans = [];
  let open = null; // { at, char, len }
  let pos = 0;
  for (const raw of text.split("\n")) {
    const line = raw.replace(/\r$/, "");
    const m = FENCE.exec(line);
    if (m && open === null) open = { at: pos, char: m[1][0], len: m[1].length };
    else if (
      m &&
      m[1][0] === open.char &&
      m[1].length >= open.len &&
      line.slice(m[0].length).trim() === ""
    ) {
      spans.push([open.at, pos + line.length]);
      open = null;
    }
    pos += raw.length + 1;
  }
  if (open !== null) spans.push([open.at, text.length]);
  return (i) => spans.some(([a, b]) => i >= a && i < b);
}

// The issue body is the record up to its first verdict; each verdict is one
// comment. The separators are kept as found, so body + separators[i] +
// verdicts[i] ... rebuilds the record exactly.
export function splitDesign(text) {
  const fenced = inFence(text);
  const cuts = [...text.matchAll(VERDICT_SEPARATOR)].filter(
    (m) => !fenced(m.index),
  );
  const body = text.slice(0, cuts.length ? cuts[0].index : text.length);
  const separators = cuts.map((m) => m[1]);
  const verdicts = cuts.map((m, i) =>
    text.slice(
      m.index + m[1].length,
      i + 1 < cuts.length ? cuts[i + 1].index : text.length,
    ),
  );
  return { body, separators, verdicts };
}

function firstHeading(text, file) {
  const fenced = inFence(text);
  for (const m of text.matchAll(/^# (.+?)\s*$/gm)) {
    if (!fenced(m.index)) return m[1];
  }
  throw new UsageError(`${file} has no "# " heading; pass --title`);
}

// Two bodies are the same when only line endings and trailing newlines differ.
export function sameBody(a, b) {
  const norm = (s) => s.replace(/\r\n/g, "\n").replace(/\n+$/, "");
  return norm(a) === norm(b);
}

// Build the actions without touching GitHub.
export function plan(argv) {
  const opts = parseArgs(argv);
  if (opts.help) return { opts, actions: [] };
  if (!Object.hasOwn(KINDS, opts.kind))
    throw new UsageError(
      `the first argument must be one of ${Object.keys(KINDS).join(", ")}`,
    );
  for (const g of opts.given) {
    if (g !== "out" && !KINDS[opts.kind].includes(g))
      throw new UsageError(`${opts.kind} does not take --${g}`);
  }
  if (!opts.file) throw new UsageError("name the record file");
  const { bytes, text } = readSource(opts.file);
  const out = opts.out ?? mkdtempSync(path.join(tmpdir(), "post-record-"));
  mkdirSync(out, { recursive: true });
  const base = path.basename(opts.file, path.extname(opts.file));
  const bodyFile = (suffix, content) => {
    const f = path.join(out, `${base}${suffix}.body.md`);
    writeFileSync(f, content);
    return f;
  };
  const comment = (where, number, suffix, content, text) => ({
    kind: "comment",
    where,
    number,
    text,
    bodyFile: bodyFile(suffix, content),
    get gh() {
      return [where, "comment", String(this.number), "--body-file", this.bodyFile];
    },
  });
  const issue = (title, suffix, content, text) => {
    const f = bodyFile(suffix, content);
    return {
      kind: "issue",
      title,
      text,
      bodyFile: f,
      gh: ["issue", "create", "--title", title, "--body-file", f],
    };
  };

  const actions = [];
  if (opts.kind === "review") {
    if (!opts.pr) throw new UsageError("review needs --pr <n>");
    actions.push(comment("pr", opts.pr, "", bytes, text));
  } else if (opts.kind === "reply") {
    if (!!opts.pr === !!opts.issue)
      throw new UsageError("reply needs exactly one of --issue <n> or --pr <n>");
    const where = opts.pr ? "pr" : "issue";
    actions.push(comment(where, opts.pr ?? opts.issue, "", bytes, text));
  } else if (opts.kind === "milestone") {
    const title = opts.title ?? firstHeading(text, opts.file);
    actions.push(issue(title, "", bytes, text));
  } else {
    const parts = splitDesign(text);
    if (!opts.issue) {
      const title = opts.title ?? firstHeading(text, opts.file);
      actions.push(issue(title, "-issue", Buffer.from(parts.body, "utf8"), parts.body));
    }
    parts.verdicts.forEach((v, i) =>
      actions.push(
        comment(
          "issue",
          opts.issue ?? "{issue}",
          `-verdict-${i + 1}`,
          Buffer.from(v, "utf8"),
          v,
        ),
      ),
    );
  }
  return { opts, actions };
}

function defaultGh(args) {
  return execFileSync("gh", args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    maxBuffer: 16 * 1024 * 1024,
  });
}

// The file's physical path: git reports a checkout's real location, so a
// path through a directory link (a junction, a symlink, macOS's /var), an
// 8.3 short name or another letter case must be resolved before it is
// compared with what git says. A file that is itself a link keeps its own
// name; any other file's name is resolved too, for its letter case.
function physical(file) {
  const abs = path.resolve(file);
  const inDir = path.join(realpathSync.native(path.dirname(abs)), path.basename(abs));
  try {
    return lstatSync(inDir).isSymbolicLink() ? inDir : realpathSync.native(inDir);
  } catch {
    return inDir; // missing: the checks below refuse it
  }
}

// True when the file is tracked and matches HEAD, so the PR head holds it.
export function defaultCommitted(file) {
  try {
    const real = physical(file);
    const dir = path.dirname(real);
    execFileSync("git", ["-C", dir, "ls-files", "--error-unmatch", "--", real], {
      stdio: "ignore",
    });
    execFileSync("git", ["-C", dir, "diff", "--quiet", "HEAD", "--", real], {
      stdio: "ignore",
    });
    return true;
  } catch {
    return false;
  }
}

function defaultGit(dir, args) {
  return execFileSync("git", ["-C", dir, ...args], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    maxBuffer: 16 * 1024 * 1024,
  });
}

// The file's path inside the checkout, with forward slashes, as GitHub lists
// a pull request's files. `p` is node:path's platform flavour, for tests.
export function repoPath(top, file, p = path) {
  return p.relative(top, file).split(p.sep).join("/");
}

// A review is posted only when the PR holds it: the file is one of PR N's
// files and equals the file at the PR's head (line endings aside). This is
// what C1 compares, so a file the PR does not hold is never posted to it.
export function checkPrHolds({ gh, git, pr, file, text }) {
  const real = physical(file);
  const dir = path.dirname(real);
  const top = realpathSync.native(git(dir, ["rev-parse", "--show-toplevel"]).trim());
  const rel = repoPath(top, real);
  const info = JSON.parse(gh(["pr", "view", String(pr), "--json", "headRefOid,files"]));
  if (!info.files.some((f) => f.path === rel))
    throw new UsageError(`${rel} is not one of PR #${pr}'s files; post only what the PR holds`);
  let atHead;
  try {
    atHead = git(dir, ["show", `${info.headRefOid}:${rel}`]);
  } catch {
    throw new UsageError(
      `PR #${pr}'s head ${info.headRefOid} is not in this clone; git fetch, then retry`,
    );
  }
  if (!sameBody(atHead, text))
    throw new UsageError(
      `${rel} differs from PR #${pr}'s head ${info.headRefOid.slice(0, 7)}; push it first`,
    );
}

// Quote one argument for a POSIX shell, so a printed command pastes as it is.
export function shellQuote(a) {
  return /^[A-Za-z0-9_@%+=:,./-]+$/.test(a) ? a : `'${a.replace(/'/g, `'\\''`)}'`;
}

function show(args) {
  return "gh " + args.map(shellQuote).join(" ");
}

function existingBodies(gh, where, number) {
  const out = gh([where, "view", String(number), "--json", "comments"]);
  return JSON.parse(out).comments.map((c) => c.body);
}

// Post the plan (or, without --confirm, only print it).
export function run(
  argv,
  {
    gh = defaultGh,
    git = defaultGit,
    log = console.log,
    committed = defaultCommitted,
  } = {},
) {
  const { opts, actions } = plan(argv);
  if (opts.help) {
    log(usage());
    return;
  }
  if (!opts.confirm) {
    log("dry run — nothing is posted; add --confirm to post:");
    for (const a of actions) log("  " + show(a.gh));
    return;
  }
  if (opts.kind === "review")
    checkPrHolds({ gh, git, pr: opts.pr, file: opts.file, text: actions[0].text });
  if (opts.kind === "design" && !committed(opts.file))
    throw new UsageError(
      `${opts.file} is not committed as it is; commit it first, so what is posted is what the repository holds`,
    );
  let issueNumber;
  try {
    for (const a of actions) post(a);
  } catch (e) {
    // Once an issue exists, a plain rerun would create a second one.
    if (issueNumber !== undefined)
      e.message += `; issue #${issueNumber} exists, so rerun with --issue ${issueNumber} rather than creating another`;
    throw e;
  }

  function post(a) {
    if (a.kind === "issue") {
      const url = gh(a.gh).trim();
      const m = /\/issues\/([0-9]+)$/.exec(url);
      if (!m) throw new Error(`gh issue create printed no issue URL: ${url}`);
      issueNumber = m[1];
      const back = JSON.parse(gh(["issue", "view", issueNumber, "--json", "body"])).body;
      if (!sameBody(back, a.text))
        throw new Error(`issue #${issueNumber} body does not match ${a.bodyFile}`);
      log(`posted ${url}`);
      return;
    }
    const number = a.number === "{issue}" ? issueNumber : a.number;
    if (number === undefined) throw new Error("no issue to post the verdict on");
    a.number = number;
    if (existingBodies(gh, a.where, number).some((b) => sameBody(b, a.text))) {
      log(`already on ${a.where} #${number}: ${a.bodyFile}`);
      return;
    }
    const url = gh(a.gh).trim();
    const m = /\/(?:pull|issues)\/([0-9]+)#issuecomment-([0-9]+)$/.exec(url);
    if (!m || m[1] !== String(number))
      throw new Error(`gh ${a.where} comment printed no comment URL for #${number}: ${url}`);
    const back = JSON.parse(gh(["api", `repos/{owner}/{repo}/issues/comments/${m[2]}`])).body;
    if (!sameBody(back, a.text))
      throw new Error(`comment ${url} does not match ${a.bodyFile}`);
    log(`posted ${url}`);
  }
}

function isMain() {
  if (!process.argv[1]) return false;
  try {
    return (
      realpathSync.native(process.argv[1]) ===
      realpathSync.native(fileURLToPath(import.meta.url))
    );
  } catch {
    return false;
  }
}

if (isMain()) {
  try {
    run(process.argv.slice(2));
  } catch (e) {
    console.error(`post-record: ${e.message}`);
    if (e instanceof UsageError) console.error("run with --help for usage");
    process.exit(1);
  }
}
