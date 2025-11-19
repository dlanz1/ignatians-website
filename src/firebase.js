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
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
