import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC8OQ4mwjXInicak7hCBhO7J8-3zOTzNr8",
  authDomain: "ozelgunhatirlatmauygulamasi.firebaseapp.com",
  projectId: "ozelgunhatirlatmauygulamasi",
  storageBucket: "ozelgunhatirlatmauygulamasi.firebasestorage.app",
  messagingSenderId: "424554849856",
  appId: "1:424554849856:web:357905185ca514b9bf61a5"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
