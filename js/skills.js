// ==========================
//  SKILLS DATA
// ==========================

const skillsData = [

    {
        id: "html",
        name: "HTML",
        category: "Frontend",
        icon: '<i class="fa-brands fa-html5" style="color:#E34F26"></i>',
        level: "Expert",
        rating: 5,
        projects: 12,
        years: "2+",
        description: "The standard markup language for building web pages.",
        related: ["CSS", "JavaScript"]
    },
    {
        id: "css",
        name: "CSS",
        category: "Frontend",
        icon: '<i class="fa-brands fa-css3-alt" style="color:#264DE4"></i>',
        level: "Expert",
        rating: 5,
        projects: 10,
        years: "2+",
        description: "Stylesheet language used for describing the presentation of web pages.",
        related: ["HTML", "Tailwind CSS"]
    },
    {
        id: "javascript",
        name: "JavaScript",
        category: "Frontend",
        icon: '<i class="fa-brands fa-js" style="color:#F7DF1E"></i>',
        level: "Advanced",
        rating: 4,
        projects: 14,
        years: "2+",
        description: "A programming language that powers interactivity on the web.",
        related: ["React", "TypeScript"]
    },
    {
        id: "react",
        name: "React",
        category: "Frontend",
        icon: '<i class="fa-brands fa-react" style="color:#61DAFB"></i>',
        level: "Advanced",
        rating: 4,
        projects: 8,
        years: "2+",
        description: "A JavaScript library for building user interfaces, maintained by Meta.",
        related: ["JavaScript", "TypeScript", "Redux", "Next.js"]
    },
    {
        id: "nodejs",
        name: "Node.js",
        category: "Backend",
        icon: '<i class="fa-brands fa-node" style="color:#3C873A"></i>',
        level: "Advanced",
        rating: 4,
        projects: 9,
        years: "2+",
        description: "A JavaScript runtime built on Chrome's V8 engine for server-side development.",
        related: ["Express.js", "MongoDB"]
    },
    {
        id: "mongodb",
        name: "MongoDB",
        category: "Database",
        icon: '<i class="fa-solid fa-leaf" style="color:#47A248"></i>',
        level: "Intermediate",
        rating: 3,
        projects: 5,
        years: "1+",
        description: "A NoSQL document database designed for scalability and flexibility.",
        related: ["Node.js", "Express.js"]
    }

    // Add more skills here — the UI will pick them up automatically

];

const categories = ["Frontend", "Backend", "Database", "Cloud & DevOps"];


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
                            ${s.icon} ${s.name}
                        </div>
                    `).join("")}
                </div>
            </div>
        `;

    }).join("");

    treeEl.querySelectorAll(".tree-item").forEach(item => {
        item.addEventListener("click", () => {
            showSkillDetail(item.dataset.skillId);
        });
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
            <div class="skill-icon">${s.icon}</div>
            <h5>${s.name}</h5>
            <div class="skill-level">${s.level}</div>
            <div class="skill-stars">${renderStars(s.rating)}</div>
            <div class="skill-projects-count">${s.projects} Projects</div>
        </div>
    `).join("");

    gridEl.querySelectorAll(".skill-card").forEach(card => {
        card.addEventListener("click", () => {
            showSkillDetail(card.dataset.skillId);
        });
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
        <div>${skill.icon} <h2 style="display:inline">${skill.name}</h2></div>
        <span class="detail-badge">${skill.level}</span>
    </div>

    <p class="detail-desc">${skill.description}</p>

    <div class="detail-label">EXPERIENCE LEVEL</div>
    <div class="skill-stars" style="margin-bottom:6px">${renderStars(skill.rating)}</div>
    <div class="detail-progress-bar">
        <div class="detail-progress-fill" style="width:${skill.rating * 20}%"></div>
    </div>

    <div class="detail-stat-grid">
        <div class="detail-stat-box"><small>Projects</small>${skill.projects}</div>
        <div class="detail-stat-box"><small>Years Experience</small>${skill.years}</div>
        <div class="detail-stat-box"><small>Last Used</small><span id="lastUsed-${skill.id}">Loading...</span></div>
    </div>

    <div class="detail-label">RELATED SKILLS</div>
    <div style="margin-bottom:20px">
        ${skill.related.map(r => `<span class="related-skill-tag">${r}</span>`).join("")}
    </div>

    <div class="detail-label">RECENT PROJECTS</div>
    <div id="recentProjectsList-${skill.id}">Loading...</div>

`;

loadLastUsed(skill);
loadRecentProjects(skill);

}


// ==========================
//  RENDER: TECH SUMMARY FOOTER
// ==========================

function renderTechSummary(){

    const el = document.getElementById("techSummaryGrid");
    if(!el) return;

    el.innerHTML = categories.map(cat => {

        const items = skillsData.filter(s => s.category === cat);
        if(items.length === 0) return "";

        const avg = Math.round(
            items.reduce((sum, s) => sum + s.rating, 0) / items.length * 20
        );

        return `
            <div class="tech-summary-item">
                <small>${cat}</small>
                <div class="detail-progress-bar">
                    <div class="detail-progress-fill" style="width:${avg}%"></div>
                </div>
            </div>
        `;

    }).join("");

}


// ==========================
//  UPDATE SUMMARY MINI CARDS
// ==========================

function updateSkillsSummaryCards(){

    document.getElementById("skillsTechCount").textContent = `${skillsData.length}+`;

    const totalProjects = skillsData.reduce((sum, s) => sum + s.projects, 0);
    document.getElementById("skillsProjectCount").textContent = `${totalProjects}+`;

}


// ==========================
//  SEARCH HANDLER
// ==========================

document.getElementById("skillSearch")?.addEventListener("input", (e) => {
    renderSkillsGrid(e.target.value);
});


// ==========================
//  INIT
// ==========================

function initSkillsPage(){
    renderSkillTree();
    renderSkillsGrid();
    renderTechSummary();
    updateSkillsSummaryCards();
}

initSkillsPage();

// ==========================
//  RECENT PROJECTS (real, scanned from Projects section)
// ==========================

function loadRecentProjects(skill){

    const container = document.getElementById(`recentProjectsList-${skill.id}`);
    if(!container) return;

    const tagClass = skill.name.toLowerCase().replace(".", "").replace(" ", "");

    const matchingCards = Array.from(document.querySelectorAll(".project-card"))
        .filter(card => card.querySelector(`.tag.${tagClass}`));

    if(matchingCards.length === 0){
        container.innerHTML = `<p style="color:var(--secondary);font-size:.85rem">No tagged projects found for ${skill.name} yet.</p>`;
        return;
    }

    container.innerHTML = matchingCards.map(card => {

        const title = card.querySelector("h3")?.textContent.trim() || "Untitled";
        const type = card.querySelector(".project-type")?.textContent.trim() || "";
        const statusEl = card.querySelector(".project-status");
        const status = statusEl ? statusEl.textContent.trim() : "In Progress";

        return `
            <div class="recent-project-item">
                <div>
                    <strong>${title}</strong>
                    <small>${type}</small>
                </div>
                <span class="recent-project-status">${status}</span>
            </div>
        `;

    }).join("");

}

// ==========================
//  LAST USED (real, via GitHub API)
// ==========================

const GITHUB_USERNAME = "Git-Dev-Mahesh";

const languageMap = {
    "html": "HTML",
    "css": "CSS",
    "javascript": "JavaScript",
    "react": "JavaScript",   // GitHub doesn't detect React as its own language
    "nodejs": "JavaScript",
    "mongodb": null          // GitHub can't detect a database as a "language"
};

async function loadLastUsed(skill){

    const el = document.getElementById(`lastUsed-${skill.id}`);
    if(!el) return;

    const githubLang = languageMap[skill.id];

    if(!githubLang){
        el.textContent = "N/A";
        return;
    }

    try{

        const reposRes = await fetch(
            `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`
        );

        if(!reposRes.ok) throw new Error("GitHub API error");

        const repos = await reposRes.json();

        const matchingRepo = repos.find(repo => repo.language === githubLang);

        if(!matchingRepo){
            el.textContent = "No data";
            return;
        }

        const daysAgo = Math.floor(
            (Date.now() - new Date(matchingRepo.pushed_at)) / (1000 * 60 * 60 * 24)
        );

        el.textContent = daysAgo === 0 ? "Today" : `${daysAgo} day${daysAgo === 1 ? "" : "s"} ago`;

    }
    catch(e){
        console.warn("GitHub fetch failed:", e);
        el.textContent = "Unavailable";
    }

}