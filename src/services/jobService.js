import { fakeJobs } from "../utils/fakeJobs";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export const getJobs = async () => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(fakeJobs), 500);
    });
};

export const getJobById = async (id) => {
    return fakeJobs.find(job => job.id === id);
};

export const saveJob = async (userId, job) => {
    const ref = doc(db, "users", userId);
    await updateDoc(ref, {
        savedJobs: arrayUnion(job)
    });
};

export const applyJob = async (userId, job) => {
    const ref = doc(db, "users", userId);
    await updateDoc(ref, {
        appliedJobs: arrayUnion({
            ...job,
            appliedAt: new Date()
        })
    });
};
