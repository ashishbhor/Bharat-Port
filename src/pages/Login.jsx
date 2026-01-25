import { useState } from "react";
import { loginUser } from "../services/authService";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        await loginUser(email, password);
    };

    return (
        <form onSubmit={handleLogin} className="max-w-sm mx-auto mt-20">
            <h2 className="text-2xl mb-4">Login</h2>

            <input
                className="border p-2 w-full mb-3"
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                className="border p-2 w-full mb-3"
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
            />

            <button className="bg-accent text-white px-4 py-2 w-full">
                Login
            </button>
        </form>
    );
}
