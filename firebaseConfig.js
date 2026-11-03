// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBQkVkJY1jnXQeXrvzmXGA55cicQu8ulKc",
  authDomain: "bancodobrazil-a7374.firebaseapp.com",
  projectId: "bancodobrazil-a7374",
  storageBucket: "bancodobrazil-a7374.firebasestorage.app",
  messagingSenderId: "337965993109",
  appId: "1:337965993109:web:374c1d54ea97c132e71f9c",
  databaseURL:"https://bancodobrazil-a7374-default-rtdb.firebaseio.com/",
  measurementId: "G-4T30VM76MZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);