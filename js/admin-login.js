// ==========================
//  ADMIN LOGIN
// ==========================

import { auth } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");
const loginBtn = document.getElementById("loginBtn");

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    loginError.textContent = "";
    loginBtn.disabled = true;
    loginBtn.textContent = "Authenticating...";

    try{

        await signInWithEmailAndPassword(auth, email, password);

        window.location.href = "admin.html";

    }
    catch(error){

        loginError.textContent = "Access Denied — Invalid Credentials";
        loginBtn.disabled = false;
        loginBtn.textContent = "Authenticate";

    }

});