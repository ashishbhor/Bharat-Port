import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { logoutUser } from "../services/authService";

export default function Navbar() {
    const { user } = useContext(AuthContext);

    return (
        <nav className="bg-primary text-white px-6 py-4 flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="text-xl font-bold">
                JobPortal
            </Link>

            {/* Links */}
            <div className="flex gap-4 items-center">
                <Link to="/jobs">Jobs</Link>

                {!user && (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}

                {user && (
                    <>
                        <Link to="/dashboard">Dashboard</Link>
                        <button
                            onClick={logoutUser}
                            className="bg-accent px-3 py-1 rounded"
                        >
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}
