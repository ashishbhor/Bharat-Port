/* eslint-env node */
import admin from "firebase-admin";

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
    const localKey = await import("../serviceAccountKey.json", {
        assert: { type: "json" }
    });
    serviceAccount = localKey.default;
}

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

export const db = admin.firestore();
