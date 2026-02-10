import fetch from "node-fetch";
import { Buffer } from "buffer";
import Tesseract from "tesseract.js";
import { fromBuffer } from "pdf2pic";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");


async function runOCR(pdfBuffer) {
    try {
        console.log("🧠 OCR Fallback Started");

        const convert = fromBuffer(pdfBuffer, {
            density: 200,
            format: "png",
            width: 2000,
            height: 2000
        });

        const page = await convert(1);
        if (!page?.base64) return "";

        const imageBuffer = Buffer.from(page.base64, "base64");

        const result = await Tesseract.recognize(imageBuffer, "eng");
        return result?.data?.text || "";

    } catch (err) {
        console.log("❌ OCR Failed:", err.message);
        return "";
    }
}

export async function extractData(pdfUrl) {
    try {
        const res = await fetch(pdfUrl);
        const buffer = Buffer.from(await res.arrayBuffer());

        let text = "";

        try {
            const parsed = await pdfParse(buffer);
            text = parsed?.text || "";
        } catch {
            console.log("⚠ pdf-parse failed → OCR");
        }

        if (!text || text.length < 50) {
            text = await runOCR(buffer);
        }

        return text || "";
    } catch (err) {
        console.log("🔥 PDF TOTAL FAIL:", err.message);
        return "";
    }
}