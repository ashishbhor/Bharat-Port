import fetch from "node-fetch";
import * as cheerio from "cheerio";

export async function fetchUPSCNotices() {
    console.log("[UPSC] Fetching Recruitment Page...");

    const url = "https://upsc.gov.in/recruitment/recruitment-advertisements";

    const res = await fetch(url);
    const html = await res.text();

    const $ = cheerio.load(html);

    const notices = [];

    $("a").each((i, el) => {
        const href = $(el).attr("href");

        if (href && href.toLowerCase().includes(".pdf")) {

            const pdfUrl = href.startsWith("http")
                ? href
                : "https://upsc.gov.in" + href;

            notices.push({
                pdfUrl,
                source: "UPSC"
            });
        }
    });

    console.log("✅ UPSC PDFs Found:", notices.length);

    return notices;
}
