import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default function Dashboard() {
    const { user } = useContext(AuthContext);
    const [data, setData] = useState(null);

    useEffect(() => {
        const load = async () => {
            const ref = doc(db, "users", user.uid);
            const snap = await getDoc(ref);
            setData(snap.data());
        };
        load();
    }, [user]);

    if (!data) return <p>Loading...</p>;

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

            {/* STATS */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
                <Stat title="Saved Jobs" value={data.savedJobs.length} />
                <Stat title="Applied Jobs" value={data.appliedJobs.length} />
                <Stat title="Profile" value="Active" />
            </div>

            {/* SAVED JOBS */}
            <Section title="Saved Jobs" jobs={data.savedJobs} />

            {/* APPLIED JOBS */}
            <Section title="Applied Jobs" jobs={data.appliedJobs} />
        </div>
    );
}

function Stat({ title, value }) {
    return (
        <div className="bg-white shadow rounded-xl p-5">
            <p className="text-sm text-gray-500">{title}</p>
            <h2 className="text-2xl font-semibold">{value}</h2>
        </div>
    );
}

function Section({ title, jobs }) {
    return (
        <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">{title}</h2>
            {jobs.length === 0 && <p>No data available</p>}
            <div className="grid md:grid-cols-2 gap-4">
                {jobs.map((job, i) => (
                    <div key={i} className="border p-4 rounded-lg">
                        <p className="font-medium">{job.title}</p>
                        <p className="text-sm">{job.department}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
