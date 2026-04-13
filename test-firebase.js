import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCGcbEFN9e59AIfG7sSUfCj6lgWGm6CIFY",
  authDomain: "cxr-site-a5209.firebaseapp.com",
  projectId: "cxr-site-a5209",
  storageBucket: "cxr-site-a5209.firebasestorage.app",
  messagingSenderId: "1019258755807",
  appId: "1:1019258755807:web:3191d776ae15e33d92676a",
  measurementId: "G-7YQV7KZL9P"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testFirebase() {
  try {
    console.log("Testing read...");
    const snap = await getDocs(collection(db, "projects_showcase"));
    console.log("Read success. Found " + snap.docs.length + " docs.");
  } catch(e) {
    console.log("Read failed:");
    console.error(e);
  }

  try {
    console.log("Testing write...");
    const docRef = await addDoc(collection(db, "test_collection"), { test: 1 });
    console.log("Write success. ID:", docRef.id);
  } catch(e) {
    console.log("Write failed:");
    console.error(e);
  }
}
testFirebase().then(() => process.exit(0));
