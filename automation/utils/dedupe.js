import crypto from "crypto";

export function buildDedupeKey(job) {
    const raw = `${job.organization}|${job.title}|${job.lastDate}`;
    return crypto.createHash("md5").update(raw).digest("hex");
}

export async function isDuplicate(db, key) {
    const snap = await db
        .collection("pending_jobs")
        .where("dedupeKey", "==", key)
        .get();

    return !snap.empty;
}
