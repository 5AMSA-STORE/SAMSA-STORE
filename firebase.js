import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAhbrM3HgoXD-EdSnKY7IADcsj5UQi2an4",
  authDomain: "amsa-store.firebaseapp.com",
  projectId: "amsa-store",
  storageBucket: "amsa-store.firebasestorage.app",
  messagingSenderId: "840571898050",
  appId: "1:840571898050:web:d69d49f43383dd4408935b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };