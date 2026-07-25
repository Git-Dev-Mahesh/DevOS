// ==========================
//  PUBLIC PROJECTS PAGE — LIVE FIRESTORE DATA
// ==========================

import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

let allProjects = [];
let activeFilter = "All";
let searchTerm = "";

async function loadProjects(){

    const gridEl = document.getElementById("projGrid");
    if(!gridEl) return;

    gridEl.innerHTML = `<p style="color:var(--secondary)">Loading projects...</p>`;

    const snapshot = await getDocs(collection(db, "projects"));

    allProjects = snapshot.docs.map(d => d.data());

    renderSummary();
    renderGrid();

}

function renderSummary(){

    const el = document.getElementById("projSummaryCards");
    if(!el) return;

    const total = allProjects.length;
    const completed = allProjects.filter(p => p.status === "Completed").length;
    const totalSkills = new Set(allProjects.flatMap(p => p.skills || [])).size;
    const inProgress = allProjects.filter(p => p.status === "In Progress").length;

    el.innerHTML = `
        <div class="summary-mini-card">
            <i class="fa-solid fa-display"></i>
            <div><h3>${total}</h3><small>Total</small></div>
        </div>
        <div class="summary-mini-card">
            <i class="fa-solid fa-check"></i>
            <div><h3>${completed}</h3><small>Completed</small></div>
        </div>
        <div class="summary-mini-card">
            <i class="fa-solid fa-layer-group"></i>
            <div><h3>${totalSkills}</h3><small>Skills Used</small></div>
        </div>
        <div class="summary-mini-card">
            <i class="fa-solid fa-hourglass-half"></i>
            <div><h3>${inProgress}</h3><small>In Progress</small></div>
        </div>
    `;

}

function renderGrid(){

    const gridEl = document.getElementById("projGrid");

    let filtered = activeFilter === "All"
        ? allProjects
        : allProjects.filter(p => p.category === activeFilter);

    if(searchTerm){
        filtered = filtered.filter(p =>
            p.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    if(filtered.length === 0){
        gridEl.innerHTML = `<p style="color:var(--secondary)">No projects match this filter.</p>`;
        return;
    }

    gridEl.innerHTML = filtered.map(p => `
        <div class="proj-card">

            <div class="proj-card-header">
                <div>
                    <h4>${p.title}</h4>
                    <small>${p.type || ""}</small>
                </div>
                <span class="proj-status ${p.status === "Completed" ? "completed" : p.status === "In Progress" ? "in-progress" : "planned"}">
                    ${p.status || "Planned"}
                </span>
            </div>

            <p class="proj-desc">${p.description || ""}</p>

            <div class="proj-tags">
                ${(p.skills || []).slice(0, 4).map(s => `<span class="admin-tag">${s}</span>`).join("")}
            </div>

            <div class="proj-actions">
                ${p.demoUrl ? `<a href="${p.demoUrl}" target="_blank" class="action-btn demo"><i class="fa-solid fa-play"></i><span>Launch</span></a>` : ""}
                ${p.repo ? `<a href="https://github.com/Git-Dev-Mahesh/${p.repo}" target="_blank" class="action-btn code"><i class="fa-solid fa-code"></i><span>Source</span></a>` : ""}
            </div>

        </div>
    `).join("");

}

document.getElementById("projFilterTabs")?.addEventListener("click", (e) => {

    if(!e.target.classList.contains("proj-filter-tab")) return;

    document.querySelectorAll(".proj-filter-tab").forEach(t => t.classList.remove("active"));
    e.target.classList.add("active");

    activeFilter = e.target.dataset.filter;
    renderGrid();



});

document.getElementById("projSearch")?.addEventListener("input", (e) => {
    searchTerm = e.target.value;
    renderGrid();
});

loadProjects();

