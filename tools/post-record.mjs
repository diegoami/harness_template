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
// re-encodes it. With --confirm it posts a review or design record only when
// it is committed and unmodified (so the PR holds what is posted), then reads
// each body back from GitHub and fails if it differs from the file
// (line endings and trailing newlines aside). A body already on the thread is
// not posted again.

import { execFileSync } from "node:child_process";
import {
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
const FENCE = /^(```|~~~)/;

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
                  or design record is posted only committed and unmodified
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
function inFence(text) {
  const spans = [];
  let open = null;
  let pos = 0;
  for (const line of text.split("\n")) {
    if (FENCE.test(line)) {
      if (open === null) open = pos;
      else {
        spans.push([open, pos + line.length]);
        open = null;
      }
    }
    pos += line.length + 1;
  }
  if (open !== null) spans.push([open, text.length]);
  return (i) => spans.some(([a, b]) => i >= a && i <= b);
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

// True when the file is tracked and matches HEAD, so the PR head holds it.
export function defaultCommitted(file) {
  const dir = path.dirname(path.resolve(file));
  try {
    execFileSync("git", ["-C", dir, "ls-files", "--error-unmatch", "--", path.resolve(file)], {
      stdio: "ignore",
    });
    execFileSync("git", ["-C", dir, "diff", "--quiet", "HEAD", "--", path.resolve(file)], {
      stdio: "ignore",
    });
    return true;
  } catch {
    return false;
  }
}

// Quote for a POSIX shell, so the printed command can be pasted as it is.
function show(args) {
  const q = (a) =>
    /^[A-Za-z0-9_@%+=:,./\\-]+$/.test(a) ? a : `'${a.replace(/'/g, `'\\''`)}'`;
  return "gh " + args.map(q).join(" ");
}

function existingBodies(gh, where, number) {
  const out = gh([where, "view", String(number), "--json", "comments"]);
  return JSON.parse(out).comments.map((c) => c.body);
}

// Post the plan (or, without --confirm, only print it).
export function run(
  argv,
  { gh = defaultGh, log = console.log, committed = defaultCommitted } = {},
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
  if (["review", "design"].includes(opts.kind) && !committed(opts.file))
    throw new UsageError(
      `${opts.file} is not committed as it is; commit it first, so what is posted is what the PR holds`,
    );
  let issueNumber;
  for (const a of actions) {
    if (a.kind === "issue") {
      const url = gh(a.gh).trim();
      const m = /\/issues\/([0-9]+)$/.exec(url);
      if (!m) throw new Error(`gh issue create printed no issue URL: ${url}`);
      issueNumber = m[1];
      const back = JSON.parse(gh(["issue", "view", issueNumber, "--json", "body"])).body;
      if (!sameBody(back, a.text))
        throw new Error(
          `issue #${issueNumber} body does not match ${a.bodyFile}; the issue exists, so rerun with --issue ${issueNumber} rather than creating another`,
        );
      log(`posted ${url}`);
      continue;
    }
    const number = a.number === "{issue}" ? issueNumber : a.number;
    if (number === undefined) throw new Error("no issue to post the verdict on");
    a.number = number;
    if (existingBodies(gh, a.where, number).some((b) => sameBody(b, a.text))) {
      log(`already on ${a.where} #${number}: ${a.bodyFile}`);
      continue;
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
    return realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url));
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
