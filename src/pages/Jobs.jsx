import { useEffect, useState } from "react";
import { getJobs } from "../services/jobService";
import JobCard from "../components/JobCard";

export default function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getJobs().then(data => {
            setJobs(data);
            setLoading(false);
        });
    }, []);

    if (loading) return <p>Loading jobs...</p>;

    return (
        <div className="grid md:grid-cols-3 gap-6 p-6">
            {jobs.map(job => (
                <JobCard key={job.id} job={job} />
            ))}
        </div>
    );
}
