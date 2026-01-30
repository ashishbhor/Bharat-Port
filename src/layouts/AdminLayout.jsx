import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useEffect, useState } from "react";

export default function AdminLayout({ children }) {
    const { user } = useContext(AuthContext);
    const [allowed, setAllowed] = useState(null);

    useEffect(() => {
        const checkAdmin = async () => {
            if (!user) {
                setAllowed(false);
                return;
            }
            const snap = await getDoc(doc(db, "users", user.uid));
            setAllowed(snap.exists() && snap.data().role === "admin");
        };
        checkAdmin();
    }, [user]);

    if (allowed === null) return <p>Checking access...</p>;
    if (!allowed) return <Navigate to="/" />;

    return children;
}
