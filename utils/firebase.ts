// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDV0L3J1GIpQWJwwQaKMuXH0EFfdirDODI",
  authDomain: "icc-application-43d74.firebaseapp.com",
  projectId: "icc-application-43d74",
  storageBucket: "icc-application-43d74.firebasestorage.app",
  messagingSenderId: "1061934745237",
  appId: "1:1061934745237:web:4618d2e7f602d036cbfd9c",
  measurementId: "G-29DG61L68D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);