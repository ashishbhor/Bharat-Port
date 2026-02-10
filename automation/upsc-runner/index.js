import cron from "node-cron";
import { db } from "./firebase.js";

import { fetchUPSCNotices } from "./sources/upsc.js";
import { extractData } from "./utils/pdf.js";



import { buildDedupeKey, isDuplicate } from "./utils/dedupe.js";
import { isRealUPSCRecruitment } from "./utils/upscFilter.js";

const CUTOFF_DATE = new Date("2026-01-01");

function isAfterCutoff(dateStr) {
    if (!dateStr) return false;
    return new Date(dateStr) >= CUTOFF_DATE;
}

async function runAutomation() {
    console.log("\n🚀 [UPSC] Automation Started\n");

    const notices = await fetchUPSCNotices();
    console.log("📄 UPSC PDFs Found:", notices.length);

    let saved = 0;
    let skipped = 0;

    for (const notice of notices) {
        try {
            console.log("\n📥 Processing:", notice.pdfUrl);

            const extracted = await extractData(notice.pdfUrl);

            if (!extracted.title) {
                skipped++;
                continue;
            }

            // UPSC recruitment filter
            if (!isRealUPSCRecruitment(extracted)) {
                skipped++;
                continue;
            }

            // Date safety (future-only)
            if (!isAfterCutoff(new Date().toISOString())) {
                skipped++;
                continue;
            }

            const job = {
                title: extracted.title,
                examName: extracted.title,
                organization: "UPSC",

                notificationPdf: notice.pdfUrl,
                applyLink: "https://upsc.gov.in",

                announceDate: new Date().toISOString().slice(0, 10),
                lastDate: extracted.lastDate,

                eligibility: extracted.eligibility || {},

                status: "pending",
                needsReview: true,
                sourceUrl: notice.pdfUrl
            };

            const key = buildDedupeKey(job);

            if (await isDuplicate(key)) {
                skipped++;
                continue;
            }

            await db.collection("pending_jobs").add({
                ...job,
                dedupeKey: key,
                fetchedAt: new Date()
            });

            saved++;
            console.log("💾 Saved:", job.title);

        } catch (err) {
            console.log("🔥 Failed:", notice.pdfUrl);
            skipped++;
        }
    }

    console.log("\n====================");
    console.log("✅ UPSC Saved:", saved);
    console.log("⏭ Skipped:", skipped);
    console.log("====================\n");
}

// Run once (Render / manual)
runAutomation();