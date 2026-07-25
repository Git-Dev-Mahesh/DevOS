// ==========================
//  SKILLS PAGE — LIVE FIRESTORE DATA
// ==========================

import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

let skillsData = [];
let projectsData = [];

const categories = ["Frontend", "Backend", "Database", "Cloud & DevOps"];


// ==========================
//  LOAD DATA FROM FIRESTORE
// ==========================

async function loadSkillsAndProjects(){

    const skillsSnap = await getDocs(collection(db, "skills"));
    const projectsSnap = await getDocs(collection(db, "projects"));

    skillsData = skillsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    projectsData = projectsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    // Real project count per skill — matched by name against each project's synced GitHub skills
    skillsData.forEach(skill => {
        skill.matchedProjects = projectsData.filter(p =>
            (p.skills || []).some(s => s.toLowerCase() === skill.name.toLowerCase())
        );
        skill.projectCount = skill.matchedProjects.length;
    });

}


// ==========================
//  RENDER: SKILL EXPLORER TREE
// ==========================

function renderSkillTree(){

    const treeEl = document.getElementById("skillTree");
    if(!treeEl) return;

    treeEl.innerHTML = categories.map(cat => {

        const items = skillsData.filter(s => s.category === cat);
        if(items.length === 0) return "";

        return `
            <div class="tree-category">
                <div class="tree-category-header" data-category="${cat}">
                    <i class="fa-solid fa-folder folder-icon"></i>
                    ${cat}
                    <span class="count">${items.length}</span>
                </div>
                <div class="tree-items">
                    ${items.map(s => `
                        <div class="tree-item" data-skill-id="${s.id}">
                            <i class="${s.iconClass}"></i> ${s.name}
                        </div>
                    `).join("")}
                </div>
            </div>
        `;

    }).join("");

    treeEl.querySelectorAll(".tree-item").forEach(item => {
        item.addEventListener("click", () => showSkillDetail(item.dataset.skillId));
    });

}


// ==========================
//  RENDER: SKILLS GRID
// ==========================

function renderSkillsGrid(filter = ""){

    const gridEl = document.getElementById("skillsGrid");
    if(!gridEl) return;

    const filtered = skillsData.filter(s =>
        s.name.toLowerCase().includes(filter.toLowerCase())
    );

    gridEl.innerHTML = filtered.map(s => `
        <div class="skill-card" data-skill-id="${s.id}">
            <div class="skill-icon"><i class="${s.iconClass}"></i></div>
            <h5>${s.name}</h5>
            <div class="skill-level">${s.level}</div>
            <div class="skill-stars">${renderStars(s.rating)}</div>
            <div class="skill-projects-count">${s.projectCount} Project${s.projectCount === 1 ? "" : "s"}</div>
        </div>
    `).join("");

    gridEl.querySelectorAll(".skill-card").forEach(card => {
        card.addEventListener("click", () => showSkillDetail(card.dataset.skillId));
    });

}

function renderStars(rating){
    let stars = "";
    for(let i = 1; i <= 5; i++){
        stars += `<i class="fa-solid fa-star ${i <= rating ? "filled" : ""}"></i>`;
    }
    return stars;
}


// ==========================
//  RENDER: DETAIL PANEL
// ==========================

function showSkillDetail(skillId){

    const skill = skillsData.find(s => s.id === skillId);
    const detailEl = document.getElementById("skillDetail");

    if(!skill || !detailEl) return;

    document.querySelectorAll(".skill-card").forEach(c =>
        c.classList.toggle("selected", c.dataset.skillId === skillId)
    );
    document.querySelectorAll(".tree-item").forEach(t =>
        t.classList.toggle("active", t.dataset.skillId === skillId)
    );

    detailEl.innerHTML = `

        <div class="detail-header">
            <div><i class="${skill.iconClass}"></i> <h2 style="display:inline">${skill.name}</h2></div>
            <span class="detail-badge">${skill.level}</span>
        </div>

        <p class="detail-desc">${skill.description || ""}</p>

        <div class="detail-label">EXPERIENCE LEVEL</div>
        <div class="skill-stars" style="margin-bottom:6px">${renderStars(skill.rating)}</div>
        <div class="detail-progress-bar">
            <div class="detail-progress-fill" style="width:${skill.rating * 20}%"></div>
        </div>

        <div class="detail-stat-grid">
            <div class="detail-stat-box"><small>Projects</small>${skill.projectCount}</div>
            <div class="detail-stat-box"><small>Last Used</small><span id="lastUsed-${skill.id}">Loading...</span></div>
        </div>

        <div class="detail-label">RELATED SKILLS</div>
        <div style="margin-bottom:20px">
            ${(skill.related || []).map(r => `<span class="related-skill-tag">${r}</span>`).join("")}
        </div>

        <div class="detail-label">PROJECTS USING THIS SKILL</div>
        <div>
            ${skill.matchedProjects.length === 0
                ? `<p style="color:var(--secondary);font-size:.85rem">No linked projects yet.</p>`
                : skill.matchedProjects.map(p => `
                    <div class="recent-project-item">
                        <div><strong>${p.title}</strong><small>${p.type || ""}</small></div>
                    </div>
                `).join("")
            }
        </div>

    `;

    loadLastUsed(skill);

}


// ==========================
//  LAST USED (real, via GitHub API)
// ==========================

const GITHUB_USERNAME = "Git-Dev-Mahesh";

async function loadLastUsed(skill){

    const el = document.getElementById(`lastUsed-${skill.id}`);
    if(!el) return;

    try{

        const reposRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`);
        if(!reposRes.ok) throw new Error("GitHub API error");

        const repos = await reposRes.json();

        // Check any repo whose linked project references this skill
        const relevantRepoNames = skill.matchedProjects.map(p => p.repo).filter(Boolean);
        const matchingRepo = repos.find(r => relevantRepoNames.includes(r.name));

        if(!matchingRepo){
            el.textContent = "No data";
            return;
        }

        const daysAgo = Math.floor((Date.now() - new Date(matchingRepo.pushed_at)) / (1000 * 60 * 60 * 24));
        el.textContent = daysAgo === 0 ? "Today" : `${daysAgo} day${daysAgo === 1 ? "" : "s"} ago`;

    }
    catch(e){
        el.textContent = "Unavailable";
    }

}


// ==========================
//  TECH SUMMARY FOOTER
// ==========================

function renderTechSummary(){

    const el = document.getElementById("techSummaryGrid");
    if(!el) return;

    el.innerHTML = categories.map(cat => {

        const items = skillsData.filter(s => s.category === cat);
        if(items.length === 0) return "";

        const avg = Math.round(items.reduce((sum, s) => sum + s.rating, 0) / items.length * 20);

        return `
            <div class="tech-summary-item">
                <small>${cat} — ${avg}%</small>
                <div class="detail-progress-bar">
                    <div class="detail-progress-fill" style="width:${avg}%"></div>
                </div>
            </div>
        `;

    }).join("");

}


// ==========================
//  SUMMARY MINI CARDS
// ==========================

async function updateSkillsSummaryCards(){

    document.getElementById("skillsTechCount").textContent = `${skillsData.length}+`;

    const totalProjects = projectsData.length;
    document.getElementById("skillsProjectCount").textContent = `${totalProjects}+`;

    const certsSnap = await getDocs(collection(db, "certificates"));
    document.querySelector(".skills-summary-cards .summary-mini-card:nth-child(3) h3").textContent = certsSnap.size;

}


// ==========================
//  SEARCH
// ==========================

document.getElementById("skillSearch")?.addEventListener("input", (e) => {
    renderSkillsGrid(e.target.value);
});


// ==========================
//  INIT
// ==========================

async function initSkillsPage(){

    document.getElementById("skillsGrid").innerHTML = `<p style="color:var(--secondary)">Loading skills...</p>`;

    await loadSkillsAndProjects();

    renderSkillTree();
    renderSkillsGrid();
    renderTechSummary();
    
    await updateSkillsSummaryCards();

}

initSkillsPage();

