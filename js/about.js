// ==========================
//  PUBLIC ABOUT — LIVE DATA
// ==========================

import { db } from "./firebase-config.js";
import { collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const GITHUB_USERNAME = "Git-Dev-Mahesh";

async function loadAboutProfile(){

    const snap = await getDoc(doc(db, "about", "profile"));
    if(!snap.exists()) return;

    const data = snap.data();

    const descEl = document.querySelector(".about-description");
    const locEl = document.querySelector(".about-info .info-item:nth-child(1) p");
    const expEl = document.querySelector(".about-info .info-item:nth-child(2) p");
    const emailEl = document.querySelector(".about-info .info-item:nth-child(3) p");
    const imgEl = document.querySelector(".profile-image");

    if(descEl) descEl.textContent = data.description || "";
    if(locEl) locEl.textContent = data.location || "";
    if(expEl) expEl.textContent = data.experience || "";
    if(emailEl) emailEl.textContent = data.email || "";
    if(imgEl && data.imageUrl) imgEl.src = data.imageUrl;

    updateAvailabilityUI(data.available !== false);

}

function updateAvailabilityUI(isAvailable){

    const statusCard = document.querySelectorAll(".hero-aside .info-card")[2];
    if(statusCard){
        const statusEl = statusCard.querySelector("h3");
        const subtextEl = statusCard.querySelector("p");

        if(statusEl){
            statusEl.textContent = isAvailable ? "Available" : "Busy";
            statusEl.classList.toggle("online", isAvailable);
        }
        if(subtextEl){
            subtextEl.textContent = isAvailable ? "For Opportunities" : "Not Available";
        }
    }

    const aboutAvailEl = document.querySelector(".about-info .info-item:nth-child(4) p");
    if(aboutAvailEl){
        aboutAvailEl.textContent = isAvailable ? "Open to work" : "Not available";
        aboutAvailEl.classList.toggle("online", isAvailable);
    }

}

async function loadAboutStats(){

    const [projectsSnap, certsSnap, skillsSnap] = await Promise.all([
        getDocs(collection(db, "projects")),
        getDocs(collection(db, "certificates")),
        getDocs(collection(db, "skills"))
    ]);

    const statBoxes = document.querySelectorAll(".about-stats .stat-box h3");

    if(statBoxes[0]) statBoxes[0].textContent = `${projectsSnap.size}+`;
    if(statBoxes[1]) statBoxes[1].textContent = certsSnap.size;
    if(statBoxes[2]) statBoxes[2].textContent = `${skillsSnap.size}+`;

}

async function loadGithubOverview(){

    const repoCountEl = document.querySelector(".github-grid div:nth-child(1) h2");
    const commitCountEl = document.querySelector(".github-grid div:nth-child(2) h2");
    const starCountEl = document.querySelector(".github-grid div:nth-child(3) h2");
    const footerLatestEl = document.querySelector(".github-footer span:nth-child(1)");
    const footerTimeEl = document.querySelector(".github-footer span:nth-child(2)");

    try{

        const userRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
        const userData = await userRes.json();

        const reposRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`);
        const repos = await reposRes.json();

        const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);

        if(repoCountEl) repoCountEl.textContent = userData.public_repos ?? "—";
        if(starCountEl) starCountEl.textContent = totalStars;
        if(commitCountEl) commitCountEl.textContent = repos.length;

        if(repos.length > 0){
            const latest = repos[0];
            const daysAgo = Math.floor((Date.now() - new Date(latest.pushed_at)) / (1000*60*60*24));

            if(footerLatestEl) footerLatestEl.textContent = `Latest Commit: ${latest.name}`;
            if(footerTimeEl) footerTimeEl.textContent = daysAgo === 0 ? "Today" : `${daysAgo} day${daysAgo === 1 ? "" : "s"} ago`;
        }

    }
    catch(e){
        console.warn("GitHub overview fetch failed:", e);
    }

}

loadAboutProfile();
loadAboutStats();
loadGithubOverview();