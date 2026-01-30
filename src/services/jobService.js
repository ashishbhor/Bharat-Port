import { db } from "../firebase/firebaseConfig";
import {
    collection,
    getDocs,
    query,
    orderBy,
    doc,
    updateDoc,
    arrayUnion
} from "firebase/firestore";


export const getJobs = async () => {
    const q = query(
        collection(db, "jobs"),
        orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    }));
};

export const getJobById = async (id) => {
    const snapshot = await getDocs(collection(db, "jobs"));

    const jobs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    }));

    return jobs.find((job) => job.id === id);
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
