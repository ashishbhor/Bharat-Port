import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="text-center mt-24 px-4">
            <h1 className="text-4xl font-bold mb-4">
                Government Job Portal
            </h1>
            <p className="text-gray-600 mb-6">
                Find latest government job opportunities in one place
            </p>

            <Link
                to="/jobs"
                className="bg-accent text-white px-6 py-3 rounded"
            >
                Browse Jobs
            </Link>
        </div>
    );
}
