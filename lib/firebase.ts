import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import firebaseConfig from "../firebase-applet-config.json";

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Authentication and Provider
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Database
// Note: We need to specify the databaseId since it's not the default (it's in the config)
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export { app, auth, googleProvider, db };
