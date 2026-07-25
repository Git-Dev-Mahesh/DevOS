// ==========================
//  PUBLIC BLOG — "FEATURED LOG"
// ==========================

import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

let posts = [];

async function loadPosts(){

    const heroEl = document.getElementById("blogHero");
    const gridEl = document.getElementById("blogGrid");

    if(!gridEl) return;

    gridEl.innerHTML = `<p style="color:var(--secondary)">Loading posts...</p>`;

    const snapshot = await getDocs(collection(db, "blog"));

    posts = snapshot.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    if(posts.length === 0){
        gridEl.innerHTML = `<p style="color:var(--secondary)">No posts published yet.</p>`;
        heroEl.innerHTML = "";
        renderActivityGraph();
        return;
    }

    renderActivityGraph();
    renderHero();
    renderGrid();

}

function formatDate(ts){
    if(!ts) return "";
    return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function renderActivityGraph(){

    const el = document.getElementById("blogActivityGraph");
    if(!el) return;

    const days = 84;   // 12 weeks
    const now = new Date();
    const postDates = posts.map(p => new Date(p.createdAt).toDateString());

    let html = "";

    for(let i = days - 1; i >= 0; i--){
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const active = postDates.includes(d.toDateString());
        html += `<span class="activity-dot ${active ? "active" : ""}" title="${d.toDateString()}"></span>`;
    }

    el.innerHTML = html;

}

function renderHero(){

    const heroEl = document.getElementById("blogHero");
    const featured = posts.find(p => p.featured) || posts[0];

    if(!featured){
        heroEl.innerHTML = "";
        return;
    }

    heroEl.innerHTML = `
        <div class="blog-hero-card" data-post-id="${featured.id}">
            ${featured.coverUrl ? `<div class="blog-hero-img" style="background-image:url('${featured.coverUrl}')"></div>` : ""}
            <div class="blog-hero-content">
                <span class="admin-tag">${featured.category || "General"}</span>${featured.linkedinUrl ? `<i class="fa-brands fa-linkedin" style="color:#0A66C2;margin-left:6px" title="Also on LinkedIn"></i>` : ""}
                <h2>${featured.title}</h2>
                <p>${featured.excerpt || ""}</p>
                <small>${formatDate(featured.createdAt)} · ${featured.readTime} min read</small>
            </div>
        </div>
    `;

    heroEl.querySelector(".blog-hero-card").addEventListener("click", () => openReader(featured.id));

}

function renderGrid(){

    const gridEl = document.getElementById("blogGrid");
    const featuredId = (posts.find(p => p.featured) || posts[0])?.id;

    const rest = posts.filter(p => p.id !== featuredId);

    if(rest.length === 0){
        gridEl.innerHTML = "";
        return;
    }

    gridEl.innerHTML = rest.map(p => `
        <div class="blog-card" data-post-id="${p.id}">
            <span class="admin-tag">${p.category || "General"}</span>${p.linkedinUrl ? `<i class="fa-brands fa-linkedin" style="color:#0A66C2;margin-left:6px" title="Also on LinkedIn"></i>` : ""}
            <h4>${p.title}</h4>
            <p>${p.excerpt || ""}</p>
            <small>${formatDate(p.createdAt)} · ${p.readTime} min read</small>
        </div>
    `).join("");

    gridEl.querySelectorAll(".blog-card").forEach(card => {
        card.addEventListener("click", () => openReader(card.dataset.postId));
    });

}

function openReader(postId){

    const post = posts.find(p => p.id === postId);
    if(!post) return;

    const overlay = document.getElementById("blogReaderOverlay");
    const content = document.getElementById("blogReaderContent");

    content.innerHTML = `
        <span class="admin-tag">${post.category || "General"}</span>
        <h1>${post.title}</h1>
        <small class="reader-byline">Published by Mahesh Milan · System Log · ${post.readTime} min read · ${formatDate(post.createdAt)}</small>

        <div class="reader-body">${marked.parse(post.content)}</div>

        ${post.linkedinUrl ? `
            <a href="${post.linkedinUrl}" target="_blank" class="linkedin-crosslink">
                <i class="fa-brands fa-linkedin"></i>
                Also posted on LinkedIn
                <i class="fa-solid fa-arrow-up-right-from-square" style="font-size:.75rem"></i>
            </a>
        ` : ""}
    `;

    overlay.hidden = false;
    document.body.style.overflow = "hidden";

}

document.getElementById("closeReaderBtn")?.addEventListener("click", () => {
    document.getElementById("blogReaderOverlay").hidden = true;
    document.body.style.overflow = "";
});

loadPosts();