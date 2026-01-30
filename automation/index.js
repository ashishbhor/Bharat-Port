import cron from "node-cron";
import { db } from "./firebase.js";
import { fetchSSCNotices } from "./sources/ssc.js";
import { extractSSCData } from "./utils/pdf.js";
import { buildDedupeKey, isDuplicate } from "./utils/dedupe.js";

async function runAutomation() {
    console.log("[AUTOMATION] SSC Automation started");

    const notices = await fetchSSCNotices();

    console.log("Filtered Notices:", notices.length);

    let saved = 0;

    for (const notice of notices) {

        const extracted = await extractSSCData(notice.pdfUrl);

        if (!extracted.title || !extracted.lastDate) continue;

        const job = {
            title: extracted.title,
            examName: extracted.title,
            organization: "SSC",
            notificationPdf: notice.pdfUrl,
            applyLink: "https://ssc.nic.in",
            announceDate: new Date().toISOString().slice(0, 10),
            lastDate: extracted.lastDate,
            eligibility: extracted.eligibility || {},
            status: "pending",
            needsReview: true,
            sourceUrl: "https://ssc.nic.in/Portal/Notices"
        };

        const key = buildDedupeKey(job);

        if (await isDuplicate(key)) continue;

        await db.collection("pending_jobs").add({
            ...job,
            dedupeKey: key,
            fetchedAt: new Date()
        });

        saved++;
        console.log("✅ Saved:", job.title);
    }

    console.log("🔥 Total Saved:", saved);
}

runAutomation();

// CRON (Daily Night)
cron.schedule("30 0 * * *", runAutomation);