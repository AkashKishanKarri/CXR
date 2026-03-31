// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCGcbEFN9e59AIfG7sSUfCj6lgWGm6CIFY",
  authDomain: "cxr-site-a5209.firebaseapp.com",
  projectId: "cxr-site-a5209",
  storageBucket: "cxr-site-a5209.firebasestorage.app",
  messagingSenderId: "1019258755807",
  appId: "1:1019258755807:web:3191d776ae15e33d92676a",
  measurementId: "G-7YQV7KZL9P"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);