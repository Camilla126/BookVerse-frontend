// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAkq-N21wb8jEUYqC0O1dZu_9F5vZOUFEQ",
  authDomain: "projeto-book-verse.firebaseapp.com",
  projectId: "projeto-book-verse",
  storageBucket: "projeto-book-verse.firebasestorage.app",
  messagingSenderId: "315096179561",
  appId: "1:315096179561:web:198dba398c12729fc293f8",
  measurementId: "G-Z6JGCP01FJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
