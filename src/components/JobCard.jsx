import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { saveJob } from "../services/jobService";
import { Link } from "react-router-dom";

export default function JobCard({ job }) {
    const { user } = useContext(AuthContext);

    const handleSave = async () => {
        if (!user) return alert("Login required");
        await saveJob(user.uid, job);
        alert("Job saved");
    };

    return (
        <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="font-semibold text-lg">{job.title}</h3>
            <p className="text-sm text-gray-600">{job.department}</p>
            <p className="text-sm">{job.location}</p>

            <div className="flex justify-between items-center mt-4">
                <Link to={`/jobs/${job.id}`} className="text-accent">
                    View Details →
                </Link>

                <button
                    onClick={handleSave}
                    className="text-sm bg-primary text-white px-3 py-1 rounded"
                >
                    Save
                </button>
            </div>
        </div>
    );
}
