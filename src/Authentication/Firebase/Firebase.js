// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBs-_jX2HmpEnCukoD1rrMz_DHzyi2DF5E",
  authDomain: "food-ordering-system-e1acb.firebaseapp.com",
  projectId: "food-ordering-system-e1acb",
  storageBucket: "food-ordering-system-e1acb.firebasestorage.app",
  messagingSenderId: "216106815041",
  appId: "1:216106815041:web:526adaadefed0535bc00c0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);