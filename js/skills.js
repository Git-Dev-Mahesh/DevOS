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
        confidence: "High",
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
        confidence: "High",
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
        confidence: "High",
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
        confidence: "High",
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
        confidence: "High",
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
        confidence: "Medium",
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
            <div class="detail-stat-box"><small>Confidence</small>${skill.confidence}</div>
        </div>

        <div class="detail-label">RELATED SKILLS</div>
        <div>
            ${skill.related.map(r => `<span class="related-skill-tag">${r}</span>`).join("")}
        </div>

    `;

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