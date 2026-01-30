import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { approvePendingJob } from "../services/adminService";

export default function AdminPendingJobs() {
    const [jobs, setJobs] = useState([]);

    const loadJobs = async () => {
        const snap = await getDocs(collection(db, "pending_jobs"));
        setJobs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };

    useEffect(() => {
        loadJobs();
    }, []);

    const handleApprove = async (jobId) => {
        try {
            await approvePendingJob(jobId);
            alert("Job approved and published");
            loadJobs();
        } catch (err) {
            console.error("Approve failed:", err);
            alert("Approve failed. Check console.");
        }
    };


    const handleReject = async (jobId) => {
        await deleteDoc(doc(db, "pending_jobs", jobId));
        alert("Job rejected");
        loadJobs();
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Pending Jobs (Admin)</h1>

            {jobs.length === 0 && <p>No pending jobs</p>}

            {jobs.map(job => (
                <div
                    key={job.id}
                    className="border rounded-lg p-4 mb-4 shadow-sm"
                >
                    <h2 className="font-semibold text-lg">{job.title}</h2>
                    <p>{job.department}</p>
                    <p className="text-sm text-gray-500">{job.sourceName}</p>

                    <div className="flex gap-3 mt-4">
                        <button
                            onClick={() => handleApprove(job.id)}
                            className="bg-green-600 text-white px-4 py-1 rounded"
                        >
                            Approve
                        </button>

                        <button
                            onClick={() => handleReject(job.id)}
                            className="bg-red-600 text-white px-4 py-1 rounded"
                        >
                            Reject
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
