import { useParams } from "react-router-dom";
import { getJobById } from "../services/jobService";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { applyJob } from "../services/jobService";

export default function JobDetails() {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [job, setJob] = useState(null);

    useEffect(() => {
        setJob(getJobById(id));
    }, [id]);

    const handleApply = async () => {
        if (!user) return alert("Login required");
        await applyJob(user.uid, job);
        alert("Application recorded");
        // later: window.open(job.applyLink)
    };

    if (!job) return <p>Loading...</p>;

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-bold">{job.title}</h1>
            <p className="text-gray-600">{job.department}</p>

            <p className="mt-4">{job.description}</p>

            <button
                onClick={handleApply}
                className="mt-6 bg-accent text-white px-6 py-2 rounded"
            >
                Apply Now
            </button>
        </div>
    );
}
