// ==========================
//  ADMIN AUTH GUARD
//  Runs on every admin page load
// ==========================

import { auth } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

const adminApp = document.getElementById("adminApp");
const adminLoading = document.getElementById("adminLoading");
const adminUserEmail = document.getElementById("adminUserEmail");
const logoutBtn = document.getElementById("logoutBtn");

onAuthStateChanged(auth, (user) => {

    if(user){

        adminLoading.hidden = true;
        adminApp.hidden = false;
        adminUserEmail.textContent = user.email;

    }
    else{

        window.location.href = "admin-login.html";

    }

});

logoutBtn?.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "admin-login.html";
});