import { useState } from "react";
import { registerUser } from "../services/authService";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        await registerUser(email, password);
    };

    return (
        <form onSubmit={handleRegister} className="max-w-sm mx-auto mt-20">
            <h2 className="text-2xl mb-4">Register</h2>

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

            <button className="bg-primary text-white px-4 py-2 w-full">
                Register
            </button>
        </form>
    );
}
