// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC1zhIHzZoTHx7XBfaYnSYya_TgrJR-eNU",
  authDomain: "fitness-tracker-9c801.firebaseapp.com",
  projectId: "fitness-tracker-9c801",
  storageBucket: "fitness-tracker-9c801.firebasestorage.app",
  messagingSenderId: "890869868034",
  appId: "1:890869868034:web:034347f9849af262ea691b",
  measurementId: "G-TYDL5MRFRL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
