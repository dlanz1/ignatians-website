/**
 * Firebase configuration and initialization module.
 *
 * This module initializes the Firebase application instance and exports the
 * Firestore database, Authentication, and Google Auth Provider instances for use
 * throughout the application.
 *
 * @module firebase
 */

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Replace the following with your app's Firebase project configuration
// You can find this in the Firebase Console -> Project Settings -> General -> Your Apps
const firebaseConfig = {

    apiKey: "AIzaSyAoFEf94RI4cgAQwAUHGM8rjloLN7hdk8I",

    authDomain: "ignatians-service.firebaseapp.com",

    projectId: "ignatians-service",

    storageBucket: "ignatians-service.firebasestorage.app",

    messagingSenderId: "50575681556",

    appId: "1:50575681556:web:46d54642d8d4bb0fb31f01"

};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

/**
 * The initialized Cloud Firestore instance.
 * Used for database operations.
 * @type {import("firebase/firestore").Firestore}
 */
export const db = getFirestore(app);

/**
 * The initialized Firebase Authentication instance.
 * Used for user authentication.
 * @type {import("firebase/auth").Auth}
 */
export const auth = getAuth(app);

/**
 * The Google Auth Provider instance.
 * Used for Google Sign-In authentication flow.
 * @type {import("firebase/auth").GoogleAuthProvider}
 */
export const googleProvider = new GoogleAuthProvider();
