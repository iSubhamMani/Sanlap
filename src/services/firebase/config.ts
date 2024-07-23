// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: "echo-854aa.firebaseapp.com",
  projectId: "echo-854aa",
  storageBucket: "echo-854aa.appspot.com",
  messagingSenderId: "29681270677",
  appId: "1:29681270677:web:a9cb747f8f8645a47c409c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { auth, app };
