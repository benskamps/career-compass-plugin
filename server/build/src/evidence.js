import { spawnSync } from "child_process";
import { existsSync } from "fs";
import { basename, resolve, posix } from "path";
/**
 * Run git with argv, never a shell.
 *
 * The path is user-supplied. Through a shell, a directory named
 * `foo; rm -rf ~` would be a command; through argv it is a directory name that
 * does not exist. Bounded output and a timeout so a pathological repository
 * cannot hang the server.
 */
export const realGit = (cwd, args) => {
    const r = spawnSync("git", args, {
        cwd,
        encoding: "utf-8",
        timeout: 20_000,
        maxBuffer: 32 * 1024 * 1024,
        windowsHide: true,
    });
    // A spawn failure ("git" not on PATH) is a different thing from git running
    // and saying no, and conflating them produces the worst kind of diagnostic:
    // a confident, specific, wrong one. Without this the tool told a user with no
    // git installed that their repository "is not a git repository", sending them
    // to look at the wrong thing entirely.
    const spawnFailed = !!r.error && r.error.code === "ENOENT";
    return { ok: r.status === 0 && !r.error, stdout: r.stdout ?? "", spawnFailed };
};
/** Hard cap on commits examined, so a monorepo cannot wedge a tool call. */
export const MAX_COMMITS = 5_000;
export class GitUnavailableError extends Error {
    constructor() {
        super("`git` is not available to this server process, so there is no history to read. " +
            "It runs wherever your MCP client launched it, which may not have your shell's PATH — " +
            "install git, or launch the client from a shell where `git --version` works.");
        this.name = "GitUnavailableError";
    }
}
export class NotARepoError extends Error {
    constructor(path) {
        super(`${path} is not a git repository (no commits found there). ` +
            `Point this at the root of a project you have committed to.`);
        this.name = "NotARepoError";
    }
}
function isoDaysAgo(days) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - days);
    return d.toISOString().slice(0, 10);
}
/** `ext` for a path, lowercased, or null for extensionless files. */
function extOf(file) {
    const name = posix.basename(file.replace(/\\/g, "/"));
    const i = name.lastIndexOf(".");
    return i > 0 ? name.slice(i + 1).toLowerCase() : null;
}
/** Top-level directory of a path, or "(root)". */
function topDir(file) {
    const parts = file.replace(/\\/g, "/").split("/");
    return parts.length > 1 ? parts[0] : "(root)";
}
/** Vendored, generated, and lockfile paths are noise, not evidence. */
function isNoise(file) {
    return /(^|\/)(node_modules|vendor|dist|build|\.next|target|__pycache__|\.venv)\//.test(file.replace(/\\/g, "/")) || /(^|\/)(package-lock\.json|yarn\.lock|pnpm-lock\.yaml|Cargo\.lock|poetry\.lock)$/.test(file.replace(/\\/g, "/"));
}
const TEST_RE = /(^|\/)(__tests__|tests?)\/|\.(test|spec)\.[a-z]+$/i;
/**
 * Read a repository and report what is measurably there.
 *
 * Pure apart from the injected `git`, so the tests drive it with fixtures rather
 * than needing a repository on disk with a known history.
 */
export function harvestEvidence(opts) {
    const git = opts.git ?? realGit;
    const path = resolve(opts.projectPath);
    const since = opts.since ?? isoDaysAgo(730);
    if (!existsSync(path))
        throw new NotARepoError(path);
    const probe = git(path, ["rev-parse", "--git-dir"]);
    if (probe.spawnFailed)
        throw new GitUnavailableError();
    if (!probe.ok)
        throw new NotARepoError(path);
    const branch = git(path, ["rev-parse", "--abbrev-ref", "HEAD"]).stdout.trim() || null;
    // Identity: the repo's own configured email unless told otherwise. Stated in
    // the report either way, because an attribution the user cannot see is an
    // attribution they cannot correct.
    let email = opts.authorEmail?.trim() || null;
    let source = email ? "supplied" : "unknown";
    if (!email) {
        const configured = git(path, ["config", "user.email"]).stdout.trim();
        if (configured) {
            email = configured;
            source = "repo config";
        }
    }
    const countCommits = (extra) => {
        const out = git(path, ["rev-list", "--count", "--no-merges", `--since=${since}`, ...extra, "HEAD"]);
        const n = Number.parseInt(out.stdout.trim(), 10);
        return Number.isFinite(n) ? n : 0;
    };
    const commitsTotal = countCommits([]);
    const commitsByYou = email ? countCommits([`--author=${email}`]) : 0;
    // Two plain git calls instead of one with exotic separators.
    //
    // The tempting version asks for a custom `--pretty=format` with \x01/\x02
    // record and field separators so one call yields both dates and filenames.
    // It also means hand-writing a parser for a format that has to survive every
    // filename a user can create. Two calls with no separators at all are cheaper
    // to read, impossible to mis-split, and each is a single cheap traversal.
    //
    // Merges are excluded from both: a merge commit touches every file in the
    // branch and would credit the user with authoring work they only integrated.
    const base = ["--no-merges", `--since=${since}`, `--max-count=${MAX_COMMITS}`];
    const mine = email ? [`--author=${email}`] : [];
    const dates = git(path, ["log", ...base, ...mine, "--date=short", "--pretty=format:%ad"])
        .stdout.split("\n")
        .map((d) => d.trim())
        .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d));
    const fileTouches = new Map();
    for (const line of git(path, ["log", ...base, ...mine, "--name-only", "--pretty=format:"])
        .stdout.split("\n")) {
        const file = line.trim();
        if (!file || isNoise(file))
            continue;
        fileTouches.set(file, (fileTouches.get(file) ?? 0) + 1);
    }
    const ordered = [...dates].sort();
    const months = new Set(ordered.map((d) => d.slice(0, 7)));
    const span = ordered.length > 0
        ? { first: ordered[0], last: ordered[ordered.length - 1], activeMonths: months.size }
        : null;
    const byExt = new Map();
    const byDir = new Map();
    let testFiles = 0;
    for (const file of fileTouches.keys()) {
        const ext = extOf(file);
        if (ext) {
            if (!byExt.has(ext))
                byExt.set(ext, new Set());
            byExt.get(ext).add(file);
        }
        const dir = topDir(file);
        if (!byDir.has(dir))
            byDir.set(dir, new Set());
        byDir.get(dir).add(file);
        if (TEST_RE.test(file))
            testFiles++;
    }
    const languages = [...byExt.entries()]
        .map(([ext, files]) => ({ ext, files: files.size }))
        .sort((a, b) => b.files - a.files || a.ext.localeCompare(b.ext))
        .slice(0, 8);
    const surfaces = [...byDir.entries()]
        .map(([dir, files]) => ({ dir, files: files.size }))
        .sort((a, b) => b.files - a.files || a.dir.localeCompare(b.dir))
        .slice(0, 8);
    const distinctFiles = fileTouches.size;
    // ── Measurements. Every one is a count, and every one names its method. ────
    const measurements = [];
    if (span) {
        measurements.push({
            claim: `Committed to ${basename(path)} across ${span.activeMonths} distinct month${span.activeMonths === 1 ? "" : "s"}, ${span.first} to ${span.last}.`,
            evidence: `git log --no-merges --author=<you> --since=${since}; counted distinct YYYY-MM values.`,
        });
    }
    if (distinctFiles > 0) {
        measurements.push({
            claim: `Touched ${distinctFiles} distinct file${distinctFiles === 1 ? "" : "s"} (excluding vendored, generated, and lockfiles).`,
            evidence: `--name-only across ${Math.min(commitsByYou, MAX_COMMITS)} of your commits; node_modules/vendor/dist/build/target and lockfiles filtered out.`,
        });
    }
    if (languages.length > 0) {
        const top = languages.slice(0, 3).map((l) => `.${l.ext} (${l.files})`).join(", ");
        measurements.push({
            claim: `Most-touched file types: ${top}.`,
            evidence: `Distinct files per extension among the files above. File COUNT, not lines — lines changed is dominated by reformatting and generated code.`,
        });
    }
    if (commitsTotal > 0 && commitsByYou > 0) {
        const share = Math.round((commitsByYou / commitsTotal) * 100);
        measurements.push({
            claim: `${commitsByYou} of ${commitsTotal} non-merge commits in this window are yours (${share}%).`,
            evidence: `git rev-list --count --no-merges, with and without --author. Share of commits, which is a measure of participation and NOT of contribution size.`,
        });
    }
    if (distinctFiles > 0) {
        const pct = Math.round((testFiles / distinctFiles) * 100);
        measurements.push({
            claim: `${testFiles} of those files (${pct}%) are test files.`,
            evidence: `Matched __tests__/ or tests/ directories, or a .test./.spec. filename. A ratio, not a quality judgement.`,
        });
    }
    // ── Questions. The things a commit log genuinely cannot answer. ────────────
    const questions = [];
    if (span) {
        questions.push(`What was the hardest problem you solved in ${basename(path)} between ${span.first} and ${span.last}? The log knows when you worked; only you know what was hard.`);
    }
    if (surfaces.length > 0) {
        questions.push(`You touched \`${surfaces[0].dir}/\` most (${surfaces[0].files} files). Were you the owner of that surface, or just its most frequent visitor?`);
    }
    questions.push("Did any of this ship to real users, and did anything measurable change when it did? That number is the résumé line; none of the above is.");
    // ── Notes. Limits stated where the user reads the numbers. ─────────────────
    const notes = [];
    if (!email) {
        notes.push("No author identity was resolved, so the per-author counts are zero and only repository totals are meaningful. Pass authorEmail to fix this.");
    }
    else {
        notes.push(`Attributed to <${email}> (${source}). Commits by any other identity are excluded.`);
    }
    if (commitsByYou >= MAX_COMMITS) {
        notes.push(`Truncated at ${MAX_COMMITS} commits; file-level figures cover only that slice.`);
    }
    notes.push("Nothing here is an achievement yet. These are counts, and counts are not impact — a large refactor and a large reformat look identical to git.");
    return {
        repo: basename(path),
        path,
        branch,
        identity: { email, source },
        window: {
            since,
            commitsByYou,
            commitsTotal,
            truncated: commitsByYou >= MAX_COMMITS,
        },
        span,
        languages,
        surfaces,
        measurements,
        questions,
        notes,
    };
}
//# sourceMappingURL=evidence.js.map