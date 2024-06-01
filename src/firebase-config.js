// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBrR4pYyacUs4fuWW1gYbqGSFgfqskrQA8",
  authDomain: "iot-bici-7ffef.firebaseapp.com",
  projectId: "iot-bici-7ffef",
  storageBucket: "iot-bici-7ffef.appspot.com",
  messagingSenderId: "629122767691",
  appId: "1:629122767691:web:98c005072169b9f5a6a6ce"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);

// Conectar al emulador de funciones si estás desarrollando localmente
// connectFunctionsEmulator(functions, "localhost", 5001);

export { auth, db, functions };