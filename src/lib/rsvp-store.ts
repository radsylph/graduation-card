export interface RsvpRecord {
    name: string;
    email: string;
    attending: boolean;
    submittedAt: string;
}

const KEY_PREFIX = "judith:rsvp:";

function storageKey(eventSlug: string): string {
    return `${KEY_PREFIX}${eventSlug}`;
}

/**
 * Persists the guest's RSVP for an event in localStorage, scoped to the
 * current device/browser. Failures (private mode, quota) are swallowed so the
 * RSVP flow still works without persistence.
 */
export function saveRsvp(eventSlug: string, record: RsvpRecord): void {
    try {
        localStorage.setItem(storageKey(eventSlug), JSON.stringify(record));
    } catch {
        // Storage unavailable; the submission itself was already recorded
        // server-side, so there's nothing actionable here.
    }
}

/**
 * Returns the stored RSVP record for an event, or null when absent or invalid.
 */
export function getRsvp(eventSlug: string): RsvpRecord | null {
    try {
        const raw = localStorage.getItem(storageKey(eventSlug));
        if (!raw) return null;

        const parsed: unknown = JSON.parse(raw);
        if (!isRsvpRecord(parsed)) return null;

        return {
            name: parsed.name,
            email: parsed.email,
            attending: parsed.attending,
            submittedAt: parsed.submittedAt,
        };
    } catch {
        return null;
    }
}

/** Removes the stored RSVP record for an event (e.g. "change my answer"). */
export function clearRsvp(eventSlug: string): void {
    try {
        localStorage.removeItem(storageKey(eventSlug));
    } catch {
        // Nothing to do if storage is unavailable.
    }
}

function isRsvpRecord(value: unknown): value is RsvpRecord {
    if (typeof value !== "object" || value === null) return false;
    const record = value as Record<string, unknown>;
    return (
        typeof record.name === "string" &&
        typeof record.email === "string" &&
        typeof record.attending === "boolean" &&
        typeof record.submittedAt === "string"
    );
}
