import { useEffect, useState } from "react";
import { getJobs } from "../services/jobService";
import JobCard from "../components/JobCard";

export default function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [search, setSearch] = useState("");
    const [location, setLocation] = useState("All");

    useEffect(() => {
        getJobs().then(setJobs);
    }, []);

    const filteredJobs = jobs.filter((job) => {
        const matchSearch =
            job.title.toLowerCase().includes(search.toLowerCase()) ||
            job.department.toLowerCase().includes(search.toLowerCase());

        const matchLocation =
            location === "All" || job.location === location;

        return matchSearch && matchLocation;
    });

    const locations = ["All", ...new Set(jobs.map((j) => j.location))];

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Government Jobs</h1>

            {/* SEARCH & FILTER */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search by title or department"
                    className="border p-2 rounded w-full"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    className="border p-2 rounded"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                >
                    {locations.map((loc) => (
                        <option key={loc}>{loc}</option>
                    ))}
                </select>
            </div>

            {/* JOB LIST */}
            {filteredJobs.length === 0 && (
                <p className="text-gray-500">No jobs found</p>
            )}

            <div className="grid md:grid-cols-3 gap-6">
                {filteredJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                ))}
            </div>
        </div>
    );
}
