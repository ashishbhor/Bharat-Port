import fetch from "node-fetch";
import pdfParsePkg from "pdf-parse";
import { Buffer } from "buffer";
import Tesseract from "tesseract.js";
import { fromBuffer } from "pdf2pic";

const pdfParse = pdfParsePkg.default || pdfParsePkg;

async function runOCR(pdfBuffer) {
    try {
        console.log("🧠 OCR Fallback Started");

        // Convert PDF → Image (Page 1 Only)
        const convert = fromBuffer(pdfBuffer, {
            density: 200,
            format: "png",
            width: 2000,
            height: 2000
        });

        const page = await convert(1);

        if (!page?.base64) {
            console.log("❌ PDF → Image conversion failed");
            return "";
        }

        const imageBuffer = Buffer.from(page.base64, "base64");

        const result = await Tesseract.recognize(
            imageBuffer,
            "eng",
            {
                logger: m => {
                    if (m.status === "recognizing text") {
                        console.log("OCR:", Math.round(m.progress * 100) + "%");
                    }
                }
            }
        );

        return result?.data?.text || "";

    } catch (err) {
        console.log("❌ OCR Failed:", err.message);
        return "";
    }
}

export async function extractSSCData(pdfUrl) {
    try {
        console.log("[PDF] Fetching:", pdfUrl);

        const res = await fetch(pdfUrl);
        const arrayBuffer = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        let text = "";

        try {
            const parsed = await pdfParse(buffer);
            text = parsed?.text || "";
        } catch (err) {
            console.log("⚠ pdf-parse failed → will try OCR");
        }

        if (!text || text.length < 50) {
            console.log("⚠ Low text detected → Running OCR");
            text = await runOCR(buffer);
        }

        if (!text) return {};

        const title =
            text.match(/(Combined Graduate Level|CHSL|Selection Post|CAPF|Recruitment|Vacancy|Assistant|Officer|Engineer)/i)?.[0]
            || text.substring(0, 120);

        const lastDate =
            text.match(/Last Date.*?(\d{2}[-/.]\d{2}[-/.]\d{4})/i)?.[1] ||
            text.match(/Closing Date.*?(\d{2}[-/.]\d{2}[-/.]\d{4})/i)?.[1] ||
            text.match(/Apply.*?(\d{2}[-/.]\d{2}[-/.]\d{4})/i)?.[1] ||
            "";

        const age =
            text.match(/Age Limit.*?\n/i)?.[0] ||
            text.match(/Age.*?\d{2}.*?\d{2}/i)?.[0] ||
            "";

        const education =
            text.match(/Educational Qualification.*?\n/i)?.[0] ||
            text.match(/Qualification.*?\n/i)?.[0] ||
            "";

        return {
            title,
            lastDate,
            eligibility: {
                age,
                education
            },
            rawText: text.substring(0, 2000)
        };

    } catch (err) {
        console.log("🔥 PDF TOTAL FAIL:", err.message);
        return {};
    }
}