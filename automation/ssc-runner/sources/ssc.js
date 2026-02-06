import fetch from "node-fetch";
import * as cheerio from "cheerio";

const SSC_NOTICE_URL = "https://ssc.nic.in/Portal/Notices";

export async function fetchSSCNotices() {

    console.log("[SSC] Fetching Notice Page...");

    const res = await fetch(SSC_NOTICE_URL);
    const html = await res.text();

    const $ = cheerio.load(html);

    const notices = [];

    $("a").each((_, el) => {

        const href = $(el).attr("href");
        const text = $(el).text().toLowerCase();

        if (!href || !href.endsWith(".pdf")) return;

        const fullUrl = href.startsWith("http")
            ? href
            : "https://ssc.nic.in" + href;

        const recruitmentWords = [
            "recruitment",
            "vacancy",
            "apply",
            "examination",
            "selection post",
            "combined graduate",
            "chsl",
            "cgl",
            "capf"
        ];

        const rejectWords = [
            "result",
            "answer key",
            "corrigendum",
            "tender",
            "quotation",
            "schedule",
            "syllabus",
            "admit card"
        ];

        const isRecruitment =
            recruitmentWords.some(w => text.includes(w)) &&
            !rejectWords.some(w => text.includes(w));

        if (!isRecruitment) return;

        notices.push({
            pdfUrl: fullUrl,
            text
        });

    });

    console.log("✅ REAL Recruitment PDFs Found:", notices.length);

    return notices;
}
