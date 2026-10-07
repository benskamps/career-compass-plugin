function str(v) {
    return typeof v === "string" ? v.trim() : "";
}
/** A human label that also serves as the identity of a list entry. */
export function entryLabel(section, e) {
    switch (section) {
        case "experience":
            return `${str(e.role)} at ${str(e.company)}`;
        case "education":
            return `${str(e.degree)}, ${str(e.institution)}`;
        case "narrative":
            return str(e.topic);
        case "stories":
            return str(e.title);
        case "testimonials":
            return `${str(e.source)}${str(e.relationship) ? ` (${str(e.relationship)})` : ""}`;
        default:
            return str(e.name) || JSON.stringify(e).slice(0, 60);
    }
}
function key(section, e) {
    return entryLabel(section, e).toLowerCase().replace(/\s+/g, " ");
}
function achievements(list) {
    return list.reduce((n, e) => n + (Array.isArray(e.achievements) ? e.achievements.length : 0), 0);
}
export function diffSection(section, current, next) {
    if (section === "profile")
        return null;
    const before = Array.isArray(current) ? current : [];
    const after = Array.isArray(next) ? next : [];
    const beforeKeys = new Set(before.map((e) => key(section, e)));
    const afterKeys = new Set(after.map((e) => key(section, e)));
    const diff = {
        before: before.length,
        after: after.length,
        added: after.filter((e) => !beforeKeys.has(key(section, e))).map((e) => entryLabel(section, e)),
        removed: before.filter((e) => !afterKeys.has(key(section, e))).map((e) => entryLabel(section, e)),
    };
    if (section === "experience") {
        diff.achievementsBefore = achievements(before);
        diff.achievementsAfter = achievements(after);
    }
    return diff;
}
/** True when the save would lose something already stored. */
export function losesData(d) {
    if (!d)
        return false;
    if (d.removed.length > 0 || d.after < d.before)
        return true;
    return (d.achievementsAfter ?? 0) < (d.achievementsBefore ?? 0);
}
function list(items, max = 5) {
    const shown = items.slice(0, max).join("; ");
    return items.length > max ? `${shown}; and ${items.length - max} more` : shown;
}
/** One-line receipt: "3 → 4 entries · added: … · removed: none". */
export function describeDiff(d) {
    const parts = [`${d.before} → ${d.after} ${d.after === 1 ? "entry" : "entries"}`];
    if (d.achievementsBefore !== undefined && d.achievementsAfter !== undefined && d.achievementsBefore !== d.achievementsAfter) {
        parts.push(`achievements ${d.achievementsBefore} → ${d.achievementsAfter}`);
    }
    parts.push(d.added.length ? `added: ${list(d.added)}` : "added: none");
    parts.push(d.removed.length ? `removed: ${list(d.removed)}` : "removed: none");
    return parts.join(" · ");
}
//# sourceMappingURL=section-diff.js.map