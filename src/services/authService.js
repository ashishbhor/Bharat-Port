import { auth, db } from "../firebase/firebaseConfig";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

/* REGISTER */
export const registerUser = async (email, password) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);

    await setDoc(doc(db, "users", res.user.uid), {
        email,
        savedJobs: [],
        appliedJobs: []
    });

    return res;
};

/* LOGIN */
export const loginUser = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

/* LOGOUT */
export const logoutUser = () => {
    return signOut(auth);
};
