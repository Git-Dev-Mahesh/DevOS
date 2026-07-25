// ==========================
//  FIREBASE INIT
// ==========================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDadtmKdpNlcqKuHAgulc6zr6dKz1rcopI",
  authDomain: "devos-portfolio-v1.firebaseapp.com",
  projectId: "devos-portfolio-v1",
  storageBucket: "devos-portfolio-v1.firebasestorage.app",
  messagingSenderId: "328323171176",
  appId: "1:328323171176:web:f008048111d5f9e28e8cdd"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);