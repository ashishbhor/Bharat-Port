import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDLS9o45cRuwMu3q5MRSK0D7kI0Q4vxGxc",
    authDomain: "bharat-port.firebaseapp.com",
    projectId: "bharat-port",
    storageBucket: "bharat-port.firebasestorage.app",
    messagingSenderId: "182346529671",
    appId: "1:182346529671:web:1f7bdbe416b7daa863b122"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
