// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBmYf4nRwbqjlhAfU5lhGTU3x14IPBQT8g",
    authDomain: "uramarket-41b9c.firebaseapp.com",
    projectId: "uramarket-41b9c",
    storageBucket: "uramarket-41b9c.firebasestorage.app",
    messagingSenderId: "1058007115193",
    appId: "1:1058007115193:web:7af20e3af2517a8536c268"
  };
// Инициализируем Firebase
const app = initializeApp(firebaseConfig);

// Экспортируем модули
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };