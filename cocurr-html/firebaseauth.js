import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBFD3eK8SmP4z_eXAoiPzNN0gRnhxyum-U",
  authDomain: "cocurr-sofeng.firebaseapp.com",
  projectId: "cocurr-sofeng",
  storageBucket: "cocurr-sofeng.firebasestorage.app",
  messagingSenderId: "387943862464",
  appId: "1:387943862464:web:d6f4f44572d6f571fadd25"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 🔥 Make sign-up function available to index.html
export function firebaseSignUp(email, password) {
  createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCred) => {
      const uid = userCred.user.uid;

      // Create user profile in Firestore
      await setDoc(doc(db, "users", uid), {
        email: email,
        createdAt: new Date()
      });

      window.location.href = "../cocurr-homepage/homepage.html";
    })
    .catch(error => {
      alert(error.message);
    });
}

// 🔥 Make login function available
export function firebaseLogin(email, password) {
  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      window.location.href = "../cocurr-homepage/homepage.html";
    })
    .catch(error => {
      alert(error.message);
    });
}