// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBNBs2gBDgpN9g96DnJQW_oWQOvy1oluII",
  authDomain: "parent-app-6cc1d.firebaseapp.com",
  projectId: "parent-app-6cc1d",
  storageBucket: "parent-app-6cc1d.appspot.com",
  messagingSenderId: "625787625836",
  appId: "1:625787625836:web:6ea86e744fe48bcc6e1349",
  measurementId: "G-VYBVPR3BC8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db }