// ======================================================
// HOME DASHBOARD WIDGETS
// ------------------------------------------------------
// Loads a small preview of Skills, Certificates and Blog
// from Firestore and displays them on the home dashboard.
//
// Purpose:
// • Keeps the dashboard synchronized with Firebase.
// • No hardcoded data.
// • Automatically updates when database content changes.
// ======================================================

import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


// ======================================================
// SKILLS WIDGET
// ------------------------------------------------------
// Fetches the skills collection from Firestore and shows
// only the first five skills as a dashboard preview.
// ======================================================

async function loadSkillsWidget(){

    // Dashboard container
    const el = document.getElementById("homeSkillsList");

    // Stop if the widget doesn't exist on this page
    if(!el) return;

    // Read every document from Firestore
    const snap = await getDocs(collection(db, "skills"));

    // Show friendly message if collection is empty
    if(snap.empty){
        el.innerHTML = `<p class="widget-empty">No skills added yet.</p>`;
        return;
    }

    // Convert Firestore documents into JavaScript objects
    // then keep only the first five.
    const skills = snap.docs
        .map(d => d.data())
        .slice(0, 5);

    // Build the widget using the retrieved data
    el.innerHTML = skills.map(s => `
        <div class="widget-row">
            <i class="${s.iconClass || 'fa-solid fa-code'}"></i>
            <span>${s.name}</span>
            <small>${s.level}</small>
        </div>
    `).join("");

}



// ======================================================
// CERTIFICATES WIDGET
// ------------------------------------------------------
// Retrieves certificates from Firestore and displays
// the newest three certificates on the dashboard.
// ======================================================

async function loadCertsWidget(){

    const el = document.getElementById("homeCertsList");

    if(!el) return;

    const snap = await getDocs(collection(db, "certificates"));

    if(snap.empty){
        el.innerHTML = `<p class="widget-empty">No certificates added yet.</p>`;
        return;
    }

    // Display only three certificates
    const certs = snap.docs
        .map(d => d.data())
        .slice(0, 3);

    el.innerHTML = certs.map(c => `
        <div class="widget-row">
            <i class="fa-solid fa-award"></i>
            <span>${c.title}</span>
            <small>${c.issuer}</small>
        </div>
    `).join("");

}



// ======================================================
// BLOG WIDGET
// ------------------------------------------------------
// Loads blog posts, sorts them by creation date,
// then displays only the latest three posts.
// ======================================================

async function loadBlogWidget(){

    const el = document.getElementById("homeBlogList");

    if(!el) return;

    const snap = await getDocs(collection(db, "blog"));

    if(snap.empty){
        el.innerHTML = `<p class="widget-empty">No posts published yet.</p>`;
        return;
    }

    // Convert documents to objects
    // Sort newest first
    // Keep latest three posts
    const posts = snap.docs
        .map(d => d.data())
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
        .slice(0, 3);

    el.innerHTML = posts.map(p => `
        <div class="widget-row">
            <i class="fa-solid fa-file-lines"></i>
            <span>${p.title}</span>
            <small>${p.readTime} min read</small>
        </div>
    `).join("");

}



// ======================================================
// INITIALIZE HOME WIDGETS
// ------------------------------------------------------
// Executes all widget loaders independently.
//
// Each function:
// • Connects to Firestore
// • Retrieves live data
// • Updates its own section
//
// Since they're independent, one widget failing
// doesn't stop the others from loading.
// ======================================================

loadSkillsWidget();
loadCertsWidget();
loadBlogWidget();