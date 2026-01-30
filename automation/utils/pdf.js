import fetch from "node-fetch";
import { Buffer } from "buffer";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

export async function extractSSCData(pdfUrl) {
    try {
        console.log("[PDF] Fetching:", pdfUrl);

        const res = await fetch(pdfUrl);
        const buffer = await res.arrayBuffer();

        const data = await pdfParse(Buffer.from(buffer));
        const text = data.text || "";

        const title =
            text.match(/(Combined Graduate Level|CHSL|Selection Post|CAPF)/i)?.[0] ||
            "";

        const lastDate =
            text.match(/Last Date.*?(\d{2}[-/]\d{2}[-/]\d{4})/i)?.[1] || "";

        return {
            title,
            lastDate,
            eligibility: {},
            rawText: text.substring(0, 300)
        };

    } catch (err) {
        console.error("[PDF ERROR]", err.message);
        return {};
    }
}
