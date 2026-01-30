import fetch from "node-fetch";
import * as cheerio from "cheerio";

const SSC_NOTICE_URL = "https://ssc.nic.in/Portal/Notices";

const ALLOW_KEYWORDS = [
    "notice",
    "recruitment",
    "exam",
    "cgl",
    "chsl",
    "selection",
    "capf",
    "mts",
    "je",
    "steno"
];

const BLOCK_KEYWORDS = [
    "resolution",
    "calendar",
    "telephone",
    "charter",
    "evaluation",
    "sample",
    "question",
    "answer",
    "syllabus",
    "tender",
    "office",
    "committee"
];

function isRecruitmentPdf(url) {
    const lower = url.toLowerCase();

    const allow = ALLOW_KEYWORDS.some(k => lower.includes(k));
    const block = BLOCK_KEYWORDS.some(k => lower.includes(k));

    return allow && !block;
}

export async function fetchSSCNotices() {
    console.log("[SSC] Fetching Notice Page...");

    const res = await fetch(SSC_NOTICE_URL);
    const html = await res.text();

    const $ = cheerio.load(html);

    const pdfLinks = [];

    $("a").each((_, el) => {
        const href = $(el).attr("href");

        if (!href) return;
        if (!href.toLowerCase().endsWith(".pdf")) return;

        const fullUrl = href.startsWith("http")
            ? href
            : `https://ssc.nic.in${href}`;

        if (isRecruitmentPdf(fullUrl)) {
            pdfLinks.push(fullUrl);
        }
    });

    console.log("✅ Recruitment PDFs Found:", pdfLinks.length);

    return pdfLinks.map(link => ({
        pdfUrl: link
    }));
}
