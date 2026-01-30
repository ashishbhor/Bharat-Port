import { db } from "../firebase/firebaseConfig";
import {
    doc,
    getDoc,
    setDoc,
    deleteDoc,
    serverTimestamp
} from "firebase/firestore";

export const approvePendingJob = async (jobId) => {
    const ref = doc(db, "pending_jobs", jobId);
    const snap = await getDoc(ref);

    if (!snap.exists()) return;

    const job = snap.data();

    await setDoc(doc(db, "jobs", jobId), {
        title: job.title,
        department: job.department,
        location: job.location,
        notificationPdf: job.notificationPdf,
        applyLink: job.applyLink,
        lastDate: job.lastDate,
        createdAt: serverTimestamp()
    });

    await deleteDoc(ref);
};
