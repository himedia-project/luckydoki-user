// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAnwwaeeiM_KFWRrOlI9MGTigCBx6Z7pW4",
  authDomain: "luckydoki-1ccea.firebaseapp.com",
  projectId: "luckydoki-1ccea",
  storageBucket: "luckydoki-1ccea.firebasestorage.app",
  messagingSenderId: "317154671908",
  appId: "1:317154671908:web:6e99a170d6d926a20847b1",
  measurementId: "G-6K2F9LGTLK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics and Messaging only in browser environment
let analytics = null;
let messaging = null;

if (typeof window !== "undefined") {
  analytics = getAnalytics(app);

  // Import and initialize messaging only in browser environment
  if ("serviceWorker" in navigator) {
    const { getMessaging } = require("firebase/messaging");
    messaging = getMessaging(app);
  }
}

export { messaging };
