// ==========================
//  PUBLIC ABOUT — LIVE DATA
// ==========================

import { db } from "./firebase-config.js";
import { collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const focusIcons = {
    "Full Stack Development": "fa-solid fa-layer-group",
    "Cloud Computing": "fa-solid fa-cloud",
    "System Design": "fa-solid fa-diagram-project",
    "AI & Machine Learning": "fa-solid fa-microchip"
};

async function loadAbout(){

    const snap = await getDoc(doc(db, "about", "profile"));
    if(!snap.exists()) return;

    const data = snap.data();

    document.getElementById("aboutNameDisplay").textContent = data.name || "";
    document.getElementById("aboutTitleDisplay").textContent = data.title || "";
    document.getElementById("aboutLocationDisplay").textContent = data.location || "";

    if(data.imageUrl){
        document.getElementById("aboutProfileImg").src = data.imageUrl;
    }

    const badge = document.getElementById("aboutAvailBadge");
    const isAvailable = data.available !== false;
    badge.textContent = isAvailable ? "Open to Work" : "Not Available";
    badge.classList.toggle("online", isAvailable);

    // Bio — split into paragraphs on blank lines
    const bioEl = document.getElementById("aboutBioText");
    const paragraphs = (data.description || "").split(/\n\s*\n/).filter(Boolean);
    bioEl.innerHTML = paragraphs.map(p => `<p>${p.trim()}</p>`).join("");

    // Tags
    document.getElementById("aboutTagsDisplay").innerHTML =
        (data.tags || []).map(t => `<span class="admin-tag">${t}</span>`).join("");

    // Contact list
    const contactEl = document.getElementById("aboutContactList");
    let contactHTML = "";
    if(data.email) contactHTML += `<div><i class="fa-solid fa-envelope"></i> ${data.email}</div>`;
    if(data.phone) contactHTML += `<div><i class="fa-solid fa-phone"></i> ${data.phone}</div>`;
    if(data.linkedinUrl) contactHTML += `<div><i class="fa-brands fa-linkedin"></i> <a href="${data.linkedinUrl}" target="_blank">${data.linkedinUrl.replace(/^https?:\/\//,"")}</a></div>`;
    contactEl.innerHTML = contactHTML;

    // Personal Info
    const infoEl = document.getElementById("aboutPersonalInfo");
    let infoHTML = "";
    if(data.birthday) infoHTML += `<div class="info-row"><i class="fa-regular fa-calendar"></i><span>Birthday</span><strong>${data.birthday}</strong></div>`;
    if(data.nationality) infoHTML += `<div class="info-row"><i class="fa-solid fa-flag"></i><span>Nationality</span><strong>${data.nationality}</strong></div>`;
    if(data.language) infoHTML += `<div class="info-row"><i class="fa-solid fa-language"></i><span>Language</span><strong>${data.language}</strong></div>`;
    infoHTML += `<div class="info-row"><i class="fa-solid fa-briefcase"></i><span>Freelance</span><strong>${isAvailable ? "Available" : "Not Available"}</strong></div>`;
    infoEl.innerHTML = infoHTML;

    // Sidebar social links — real data, no hardcoding
    const githubLink = document.getElementById("socialGithub");
    const linkedinLink = document.getElementById("socialLinkedin");
    const emailLink = document.getElementById("socialEmail");

    if(githubLink){
        githubLink.href = `https://github.com/Git-Dev-Mahesh`;
    }

    
    let linkedinUrl = data.linkedinUrl.trim();

    if (!linkedinUrl.startsWith("http://") && !linkedinUrl.startsWith("https://")) {
        linkedinUrl = "https://" + linkedinUrl;
    }

    linkedinLink.href = linkedinUrl;
    linkedinLink.target = "_blank";
    linkedinLink.rel = "noopener noreferrer";

    if (emailLink) {

    if (data.email) {

        emailLink.href =
            `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(data.email)}`;

        emailLink.target = "_blank";
        emailLink.rel = "noopener noreferrer";

    } else {

        emailLink.style.opacity = "0.4";
        emailLink.style.pointerEvents = "none";

    }

}

    // Resume button
    const resumeBtn = document.getElementById("aboutResumeBtn");
    if(data.resumeUrl){
        resumeBtn.href = data.resumeUrl;
    }
    else{
        resumeBtn.style.opacity = "0.5";
        resumeBtn.style.pointerEvents = "none";
        resumeBtn.textContent = "No resume uploaded yet";
    }

    // Focus areas
    document.getElementById("aboutFocusGrid").innerHTML = (data.focusAreas || []).map(f => `
        <div class="focus-item">
            <i class="${focusIcons[f] || "fa-solid fa-star"}"></i>
            <span>${f}</span>
        </div>
    `).join("");

    
    // Hero section's Download Resume button — same source as the About page
    const heroResumeBtn = document.getElementById("heroResumeBtn");
    if(heroResumeBtn){
        if(data.resumeUrl){
            heroResumeBtn.href = data.resumeUrl;
        }
        else{
            heroResumeBtn.style.opacity = "0.5";
            heroResumeBtn.style.pointerEvents = "none";
            heroResumeBtn.textContent = "No Resume Yet";
        }
    }

}

async function loadAboutStats(){

    const [projectsSnap, certsSnap] = await Promise.all([
        getDocs(collection(db, "projects")),
        getDocs(collection(db, "certificates"))
    ]);

    const aboutSnap = await getDoc(doc(db, "about", "profile"));
    const experience = aboutSnap.exists() ? (aboutSnap.data().experience || "—") : "—";

    document.getElementById("aboutStatsCards").innerHTML = `
        <div class="summary-mini-card">
            <i class="fa-solid fa-chart-line"></i>
            <div><h3>${experience}</h3><small>Years Experience</small></div>
        </div>
        <div class="summary-mini-card">
            <i class="fa-solid fa-check"></i>
            <div><h3>${projectsSnap.size}+</h3><small>Projects Completed</small></div>
        </div>
        <div class="summary-mini-card">
            <i class="fa-solid fa-certificate"></i>
            <div><h3>${certsSnap.size}</h3><small>Certificates</small></div>
        </div>
        <div class="summary-mini-card">
            <i class="fa-solid fa-mug-hot"></i>
            <div><h3>∞</h3><small>Cups of Coffee</small></div>
        </div>
    `;

}

loadAbout();
loadAboutStats();