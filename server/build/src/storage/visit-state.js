import { readFile, writeFile, rename, chmod, rm } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import { getDataDir } from "./file-store.js";
import { isBundledSampleDir } from "../sample-data.js";
/**
 * What Career Compass remembers between visits, so a return can open with what
 * changed.
 *
 * Week-one numbers said people try it once and don't come back: 1.66 uses per
 * active account. The digest already knows what needs the user, but only when
 * they ask for it, and someone back to tailor one résumé never asks. This file
 * is what lets any tool say "since you were last here: the Brightpath follow-up
 * came due" without the user having to know to ask.
 *
 * It lives beside the rest of the data, on the user's machine, owner-only like
 * every other file there. It holds when they were last here, which digest items
 * they had already been shown, and the last few companies they worked on. It is
 * never sent anywhere, and losing it costs one welcome-back note, nothing else:
 * every read and write here fails soft.
 */
export const VISITS_FILENAME = ".visits.json";
const MAX_RECENT = 8;
function visitsPath() {
    return join(getDataDir(), VISITS_FILENAME);
}
/** The bundled demo is read-only and nobody's; it has no visits to remember. */
function stateless() {
    return isBundledSampleDir(getDataDir());
}
export async function loadVisitState() {
    if (stateless())
        return { version: 1 };
    try {
        const raw = JSON.parse(await readFile(visitsPath(), "utf8"));
        if (!raw || typeof raw !== "object" || raw.version !== 1)
            return { version: 1 };
        return {
            version: 1,
            lastSeen: typeof raw.lastSeen === "string" ? raw.lastSeen : undefined,
            seenDigest: Array.isArray(raw.seenDigest) ? raw.seenDigest.filter((k) => typeof k === "string") : undefined,
            recent: Array.isArray(raw.recent)
                ? raw.recent.filter((r) => r && typeof r.company === "string" && typeof r.at === "string" && typeof r.tool === "string")
                : undefined,
        };
    }
    catch {
        return { version: 1 };
    }
}
export async function saveVisitState(state) {
    if (stateless())
        return;
    // No mkdir: a visit is not a reason to create the data folder. Until the user
    // saves something there is nothing to come back to, and the write just fails.
    const tmp = join(getDataDir(), `${VISITS_FILENAME}.${randomUUID().slice(0, 8)}.tmp`);
    try {
        const trimmed = { ...state, recent: (state.recent ?? []).slice(-MAX_RECENT) };
        await writeFile(tmp, JSON.stringify(trimmed, null, 2) + "\n", { mode: 0o600 });
        await rename(tmp, visitsPath());
        await chmod(visitsPath(), 0o600).catch(() => { });
    }
    catch {
        // A read-only or full disk costs the next welcome-back note, not this answer.
        await rm(tmp, { force: true }).catch(() => undefined);
    }
}
export function recordActivity(state, activity) {
    const company = activity.company.trim();
    if (!company)
        return state;
    const rest = (state.recent ?? []).filter((r) => r.company.toLowerCase() !== company.toLowerCase());
    return { ...state, recent: [...rest, { ...activity, company }].slice(-MAX_RECENT) };
}
//# sourceMappingURL=visit-state.js.map