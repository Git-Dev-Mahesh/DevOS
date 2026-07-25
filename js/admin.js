// ==========================
//  ADMIN — PROJECTS TAB
// ==========================

import { db } from "./firebase-config.js";
import {
    collection, addDoc, getDocs, deleteDoc, doc, updateDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const tabContent = document.getElementById("adminTabContent");
const tabTitle = document.getElementById("adminTabTitle");

const GITHUB_USERNAME = "Git-Dev-Mahesh";


// ==========================
//  TAB SWITCHING
// ==========================

document.querySelectorAll(".admin-nav a").forEach(link => {

    link.addEventListener("click", (e) => {

        e.preventDefault();

        document.querySelectorAll(".admin-nav a").forEach(l => l.classList.remove("active"));
        link.classList.add("active");

        const tab = link.dataset.tab;
        tabTitle.textContent = link.textContent.trim();

        if(tab === "projects") renderProjectsTab();

        else if(tab === "skills") renderSkillsTab();

        else if(tab === "certificates") renderCertificatesTab();

        else{
            tabContent.innerHTML = `<p style="color:var(--secondary)">Coming next: ${tab}</p>`;
        }

    });

});


// ==========================
//  RENDER: PROJECTS TAB
// ==========================

async function renderProjectsTab(){

    tabContent.innerHTML = `

        <button class="admin-add-btn" id="openAddProjectBtn">
            <i class="fa-solid fa-plus"></i> Add Project
        </button>

        <div id="projectsList" class="admin-table"></div>

    `;

    document.getElementById("openAddProjectBtn").addEventListener("click", () => openProjectForm());

    await loadProjectsList();

}


// ==========================
//  LOAD PROJECTS FROM FIRESTORE
// ==========================

async function loadProjectsList(){

    const listEl = document.getElementById("projectsList");
    listEl.innerHTML = `<p style="color:var(--secondary)">Loading...</p>`;

    const snapshot = await getDocs(collection(db, "projects"));

    if(snapshot.empty){
        listEl.innerHTML = `<p style="color:var(--secondary)">No projects yet. Add your first one.</p>`;
        return;
    }

    listEl.innerHTML = "";

    snapshot.forEach(docSnap => {

        const project = docSnap.data();
        const id = docSnap.id;

        const row = document.createElement("div");
        row.className = "admin-row";

        row.innerHTML = `
            <div class="admin-row-info">
                <strong>${project.title}</strong>
                <small>${project.type || ""}</small>
                <div class="admin-row-tags">
                    ${(project.skills || []).map(s => `<span class="admin-tag">${s}</span>`).join("")}
                </div>
            </div>
            <div class="admin-row-actions">
                <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
                <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;

        row.querySelector(".edit-btn").addEventListener("click", () => openProjectForm(id, project));
        row.querySelector(".delete-btn").addEventListener("click", () => deleteProject(id));

        listEl.appendChild(row);

    });

}


// ==========================
//  DELETE PROJECT
// ==========================

async function deleteProject(id){

    if(!confirm("Delete this project permanently?")) return;

    await deleteDoc(doc(db, "projects", id));
    await loadProjectsList();

}


// ==========================
//  ADD / EDIT PROJECT FORM (modal)
// ==========================

function openProjectForm(id = null, existing = null){

    const isEdit = id !== null;

    const modal = document.createElement("div");
    modal.className = "admin-modal";

    modal.innerHTML = `
        <div class="admin-modal-box">

            <h3>${isEdit ? "Edit Project" : "Add Project"}</h3>

            <div class="input-group">
                <label>Project Title</label>
                <input type="text" id="pTitle" value="${existing?.title || ""}">
            </div>

            <div class="input-group">
                <label>Type (e.g. Tourism Platform)</label>
                <input type="text" id="pType" value="${existing?.type || ""}">
            </div>

            <div class="input-group">
                <label>Description</label>
                <textarea id="pDesc">${existing?.description || ""}</textarea>
            </div>

            <div class="input-group">
                <label>GitHub Repo Name (e.g. explore-sri-lanka)</label>
                <input type="text" id="pRepo" value="${existing?.repo || ""}">
                <small style="color:var(--secondary)">Used to auto-pull real skills/languages from GitHub</small>
            </div>

            <div class="input-group">
                <label>Live Demo URL</label>
                <input type="text" id="pDemo" value="${existing?.demoUrl || ""}">
            </div>

            <div id="pSyncStatus" style="color:var(--secondary);font-size:.8rem;margin-bottom:10px"></div>

            <div class="admin-modal-actions">
                <button id="pSyncBtn" type="button">Sync from GitHub</button>
                <button id="pSaveBtn" type="button">${isEdit ? "Update" : "Save"}</button>
                <button id="pCancelBtn" type="button">Cancel</button>
            </div>

        </div>
    `;

    document.body.appendChild(modal);

    let syncedSkills = existing?.skills || [];

    document.getElementById("pCancelBtn").addEventListener("click", () => modal.remove());

    document.getElementById("pSyncBtn").addEventListener("click", async () => {

        const repoName = document.getElementById("pRepo").value.trim();
        const statusEl = document.getElementById("pSyncStatus");

        if(!repoName){
            statusEl.textContent = "Enter a repo name first.";
            return;
        }

        statusEl.textContent = "Syncing with GitHub...";

        try{

            const res = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${repoName}`);
            if(!res.ok) throw new Error("Repo not found");

            const repoData = await res.json();

            const langRes = await fetch(repoData.languages_url);
            const langData = await langRes.json();

            syncedSkills = Object.keys(langData);

            statusEl.textContent = `✔ Synced: ${syncedSkills.join(", ")}`;

        }
        catch(e){
            statusEl.textContent = "Sync failed — check the repo name and that it's public.";
        }

    });

    document.getElementById("pSaveBtn").addEventListener("click", async () => {

        const data = {
            title: document.getElementById("pTitle").value.trim(),
            type: document.getElementById("pType").value.trim(),
            description: document.getElementById("pDesc").value.trim(),
            repo: document.getElementById("pRepo").value.trim(),
            demoUrl: document.getElementById("pDemo").value.trim(),
            skills: syncedSkills
        };

        if(!data.title){
            alert("Title is required.");
            return;
        }

        if(isEdit){
            await updateDoc(doc(db, "projects", id), data);
        }
        else{
            await addDoc(collection(db, "projects"), data);
        }

        modal.remove();
        await loadProjectsList();

    });

}


// ==========================
//  INIT — show Projects tab by default
// ==========================

renderProjectsTab();

// ==========================
//  ADMIN — SKILLS TAB
// ==========================

async function renderSkillsTab(){

    tabContent.innerHTML = `

        <button class="admin-add-btn" id="openAddSkillBtn">
            <i class="fa-solid fa-plus"></i> Add Skill
        </button>

        <div id="skillsList" class="admin-table"></div>

    `;

    document.getElementById("openAddSkillBtn").addEventListener("click", () => openSkillForm());

    await loadSkillsList();

}

async function loadSkillsList(){

    const listEl = document.getElementById("skillsList");
    listEl.innerHTML = `<p style="color:var(--secondary)">Loading...</p>`;

    const snapshot = await getDocs(collection(db, "skills"));

    if(snapshot.empty){
        listEl.innerHTML = `<p style="color:var(--secondary)">No skills yet. Add your first one.</p>`;
        return;
    }

    listEl.innerHTML = "";

    snapshot.forEach(docSnap => {

        const skill = docSnap.data();
        const id = docSnap.id;

        const row = document.createElement("div");
        row.className = "admin-row";

        row.innerHTML = `
            <div class="admin-row-info">
                <strong>${skill.name}</strong>
                <small>${skill.category} • ${skill.level}</small>
            </div>
            <div class="admin-row-actions">
                <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
                <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;

        row.querySelector(".edit-btn").addEventListener("click", () => openSkillForm(id, skill));
        row.querySelector(".delete-btn").addEventListener("click", () => deleteSkill(id));

        listEl.appendChild(row);

    });

}

async function deleteSkill(id){
    if(!confirm("Delete this skill permanently?")) return;
    await deleteDoc(doc(db, "skills", id));
    await loadSkillsList();
}

function openSkillForm(id = null, existing = null){

    const isEdit = id !== null;

    const modal = document.createElement("div");
    modal.className = "admin-modal";

    modal.innerHTML = `
        <div class="admin-modal-box">

            <h3>${isEdit ? "Edit Skill" : "Add Skill"}</h3>

            <div class="input-group">
                <label>Skill Name</label>
                <input type="text" id="sName" value="${existing?.name || ""}">
            </div>

            <div class="input-group">
                <label>Category</label>
                <select id="sCategory">
                    <option value="Frontend" ${existing?.category === "Frontend" ? "selected" : ""}>Frontend</option>
                    <option value="Backend" ${existing?.category === "Backend" ? "selected" : ""}>Backend</option>
                    <option value="Database" ${existing?.category === "Database" ? "selected" : ""}>Database</option>
                    <option value="Cloud & DevOps" ${existing?.category === "Cloud & DevOps" ? "selected" : ""}>Cloud & DevOps</option>
                </select>
            </div>

            <div class="input-group">
                <label>Level</label>
                <select id="sLevel">
                    <option value="Beginner" ${existing?.level === "Beginner" ? "selected" : ""}>Beginner</option>
                    <option value="Intermediate" ${existing?.level === "Intermediate" ? "selected" : ""}>Intermediate</option>
                    <option value="Advanced" ${existing?.level === "Advanced" ? "selected" : ""}>Advanced</option>
                    <option value="Expert" ${existing?.level === "Expert" ? "selected" : ""}>Expert</option>
                </select>
            </div>

            <div class="input-group">
                <label>Rating (1-5)</label>
                <input type="number" id="sRating" min="1" max="5" value="${existing?.rating || 3}">
            </div>

            <div class="input-group">
                <label>Description</label>
                <textarea id="sDesc">${existing?.description || ""}</textarea>
            </div>

            <div class="input-group">
                <label>Icon (Font Awesome class, e.g. fa-brands fa-html5)</label>
                <input type="text" id="sIcon" value="${existing?.iconClass || ""}">
            </div>

            <div class="input-group">
                <label>Related Skills (comma separated)</label>
                <input type="text" id="sRelated" value="${(existing?.related || []).join(", ")}">
            </div>

            <div class="admin-modal-actions">
                <button id="sSaveBtn" type="button">${isEdit ? "Update" : "Save"}</button>
                <button id="sCancelBtn" type="button">Cancel</button>
            </div>

        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById("sCancelBtn").addEventListener("click", () => modal.remove());

    document.getElementById("sSaveBtn").addEventListener("click", async () => {

        const data = {
            name: document.getElementById("sName").value.trim(),
            category: document.getElementById("sCategory").value,
            level: document.getElementById("sLevel").value,
            rating: parseInt(document.getElementById("sRating").value) || 3,
            description: document.getElementById("sDesc").value.trim(),
            iconClass: document.getElementById("sIcon").value.trim(),
            related: document.getElementById("sRelated").value
                .split(",").map(s => s.trim()).filter(Boolean)
        };

        if(!data.name){
            alert("Skill name is required.");
            return;
        }

        if(isEdit){
            await updateDoc(doc(db, "skills", id), data);
        }
        else{
            await addDoc(collection(db, "skills"), data);
        }

        modal.remove();
        await loadSkillsList();

    });

}

// ==========================
//  ADMIN — CERTIFICATES TAB
// ==========================

async function renderCertificatesTab(){

    tabContent.innerHTML = `
        <button class="admin-add-btn" id="openAddCertBtn">
            <i class="fa-solid fa-plus"></i> Add Certificate
        </button>
        <div id="certsList" class="admin-table"></div>
    `;

    document.getElementById("openAddCertBtn").addEventListener("click", () => openCertForm());

    await loadCertsList();

}

async function loadCertsList(){

    const listEl = document.getElementById("certsList");
    listEl.innerHTML = `<p style="color:var(--secondary)">Loading...</p>`;

    const snapshot = await getDocs(collection(db, "certificates"));

    if(snapshot.empty){
        listEl.innerHTML = `<p style="color:var(--secondary)">No certificates yet.</p>`;
        return;
    }

    listEl.innerHTML = "";

    snapshot.forEach(docSnap => {

        const cert = docSnap.data();
        const id = docSnap.id;

        const row = document.createElement("div");
        row.className = "admin-row";

        row.innerHTML = `
            <div class="admin-row-info">
                <strong>${cert.title}</strong>
                <small>${cert.issuer} • ${cert.category} • ${cert.date || ""}</small>
            </div>
            <div class="admin-row-actions">
                <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
                <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;

        row.querySelector(".edit-btn").addEventListener("click", () => openCertForm(id, cert));
        row.querySelector(".delete-btn").addEventListener("click", () => deleteCert(id));

        listEl.appendChild(row);

    });

}

async function deleteCert(id){
    if(!confirm("Delete this certificate permanently?")) return;
    await deleteDoc(doc(db, "certificates", id));
    await loadCertsList();
}

function openCertForm(id = null, existing = null){
    

    const isEdit = id !== null;

    const modal = document.createElement("div");
    modal.className = "admin-modal";

    modal.innerHTML = `
        <div class="admin-modal-box">

            <h3>${isEdit ? "Edit Certificate" : "Add Certificate"}</h3>

            <div class="input-group">
                <label>Certificate Title</label>
                <input type="text" id="cTitle" value="${existing?.title || ""}">
            </div>

            <div class="input-group">
                <label>Issuer (e.g. Microsoft, IBM, Google)</label>
                <input type="text" id="cIssuer" value="${existing?.issuer || ""}">
            </div>

            <div class="input-group">
                <label>Date Issued</label>
                <input type="text" id="cDate" placeholder="e.g. March 2026" value="${existing?.date || ""}">
            </div>

            <div class="input-group">
                <label>Credential URL (verification link)</label>
                <input type="text" id="cUrl" value="${existing?.credentialUrl || ""}">
            </div>

            <div class="input-group">
                <label>Badge Image URL</label>
                <input type="text" id="cImage" placeholder="Link to the certificate badge image" value="${existing?.imageUrl || ""}">
                <small style="color:var(--secondary)">
                    Right-click → save the badge from Credly/AWS/etc, upload it to your project's
                    images/certs/ folder, push to GitHub, then paste the raw GitHub URL here.
                    Or paste a direct Credly badge link if you have one.
                </small>
            </div>

            <div class="input-group">
                <label>Category</label>
                <select id="cCategory">
                    <option value="Cloud" ${existing?.category === "Cloud" ? "selected" : ""}>Cloud</option>
                    <option value="Development" ${existing?.category === "Development" ? "selected" : ""}>Development</option>
                    <option value="Other" ${existing?.category === "Other" ? "selected" : ""}>Other</option>
                </select>
            </div>

            <div class="admin-modal-actions">
                <button id="cSaveBtn" type="button">${isEdit ? "Update" : "Save"}</button>
                <button id="cCancelBtn" type="button">Cancel</button>
            </div>

        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById("cCancelBtn").addEventListener("click", () => modal.remove());

    document.getElementById("cSaveBtn").addEventListener("click", async () => {

        const data = {
            title: document.getElementById("cTitle").value.trim(),
            issuer: document.getElementById("cIssuer").value.trim(),
            category: document.getElementById("cCategory").value,
            date: document.getElementById("cDate").value.trim(),
            credentialUrl: document.getElementById("cUrl").value.trim(),
            imageUrl: document.getElementById("cImage").value.trim()
        };

        if(!data.title){
            alert("Title is required.");
            return;
        }

        if(isEdit){
            await updateDoc(doc(db, "certificates", id), data);
        }
        else{
            await addDoc(collection(db, "certificates"), data);
        }

        modal.remove();
        await loadCertsList();

    });

}