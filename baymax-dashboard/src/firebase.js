// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Import getAuth for authentication
import { getAnalytics } from "firebase/analytics"; // Optional: For analytics
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA39j21TTHgJrDCGo5V42x6Xr_U-IJnr-M",
    authDomain: "baymax-d74b8.firebaseapp.com",
    projectId: "baymax-d74b8",
    storageBucket: "baymax-d74b8.firebasestorage.app",
    messagingSenderId: "658717424752",
    appId: "1:658717424752:web:d2f7fb1b740d462880c8b5",
    measurementId: "G-V6JDN926GF"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Analytics
const auth = getAuth(app); // Initialize Firebase Authentication
const analytics = getAnalytics(app); // Optional: Initialize Analytics

// Export the auth object and Firebase app
export { auth };
export default app;

export const db = getFirestore(app); // Firestore database
export const storage = getStorage(app); // Firebase Storage
