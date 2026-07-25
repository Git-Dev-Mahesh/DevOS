// ==========================
//  ADMIN — ABOUT TAB
// ==========================

import { setDoc } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

async function renderAboutTab(){

    console.log("About tab clicked");

    tabContent.innerHTML = `<p style="color:var(--secondary)">Loading...</p>`;

    const snapshot = await getDocs(collection(db, "about"));
    const existing = snapshot.empty ? {} : snapshot.docs[0].data();

    tabContent.innerHTML = `

        <div class="admin-modal-box" style="width:600px;margin:0">

            <div class="input-group">
                <label>Description</label>
                <textarea id="aboutDesc" style="min-height:100px">${existing.description || ""}</textarea>
            </div>

            <div class="input-group">
                <label>Location</label>
                <input type="text" id="aboutLocation" value="${existing.location || ""}">
            </div>

            <div class="input-group">
                <label>Experience</label>
                <input type="text" id="aboutExperience" placeholder="e.g. 2+ Years" value="${existing.experience || ""}">
            </div>

            <div class="input-group">
                <label>Email</label>
                <input type="text" id="aboutEmail" value="${existing.email || ""}">
            </div>

            <div class="input-group">
                <label>Available for Work</label>
                <select id="aboutAvailable">
                    <option value="true" ${existing.available !== false ? "selected" : ""}>Yes — Available</option>
                    <option value="false" ${existing.available === false ? "selected" : ""}>No — Not Available</option>
                </select>
            </div>

            <div class="input-group">
                <label>Profile Image URL</label>
                <input type="text" id="aboutImage" value="${existing.imageUrl || ""}">
            </div>

            <button id="aboutSaveBtn" class="admin-add-btn" type="button" style="width:100%">Save About Info</button>
            <p id="aboutSaveStatus" style="color:var(--secondary);font-size:.8rem;margin-top:10px"></p>

        </div>

    `;

    document.getElementById("aboutSaveBtn").addEventListener("click", async () => {

    const data = {
        description: document.getElementById("aboutDesc").value.trim(),
        location: document.getElementById("aboutLocation").value.trim(),
        experience: document.getElementById("aboutExperience").value.trim(),
        email: document.getElementById("aboutEmail").value.trim(),
        imageUrl: document.getElementById("aboutImage").value.trim(),
        available: document.getElementById("aboutAvailable").value === "true"   // 👈 add this
    };

    await setDoc(doc(db, "about", "profile"), data);

    document.getElementById("aboutSaveStatus").textContent = "✔ Saved";

});

}

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

        else if(tab === "blog") renderBlogTab();
        
        else if(tab === "about") renderAboutTab();

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
                <label>Category</label>
                <select id="pCategory">
                    <option value="Web Apps" ${existing?.category === "Web Apps" ? "selected" : ""}>Web Apps</option>
                    <option value="Tools" ${existing?.category === "Tools" ? "selected" : ""}>Tools</option>
                    <option value="Mobile" ${existing?.category === "Mobile" ? "selected" : ""}>Mobile</option>
                </select>
            </div>

            <div class="input-group">
                <label>Status</label>
                <select id="pStatus">
                    <option value="Completed" ${existing?.status === "Completed" ? "selected" : ""}>Completed</option>
                    <option value="In Progress" ${existing?.status === "In Progress" ? "selected" : ""}>In Progress</option>
                    <option value="Planned" ${existing?.status === "Planned" ? "selected" : ""}>Planned</option>
                </select>
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
            category: document.getElementById("pCategory").value,
            status: document.getElementById("pStatus").value,
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

// ==========================
//  ADMIN — BLOG TAB
// ==========================

async function renderBlogTab(){

    tabContent.innerHTML = `
        <button class="admin-add-btn" id="openAddPostBtn">
            <i class="fa-solid fa-plus"></i> Add Post
        </button>
        <div id="postsList" class="admin-table"></div>
    `;

    document.getElementById("openAddPostBtn").addEventListener("click", () => openPostForm());

    await loadPostsList();

}

async function loadPostsList(){

    const listEl = document.getElementById("postsList");
    listEl.innerHTML = `<p style="color:var(--secondary)">Loading...</p>`;

    const snapshot = await getDocs(collection(db, "blog"));

    if(snapshot.empty){
        listEl.innerHTML = `<p style="color:var(--secondary)">No posts yet.</p>`;
        return;
    }

    listEl.innerHTML = "";

    // Sort newest first by timestamp
    const posts = snapshot.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    posts.forEach(post => {

        const row = document.createElement("div");
        row.className = "admin-row";

        row.innerHTML = `
            <div class="admin-row-info">
                <strong>${post.title}</strong>
                <small>${post.category || ""} • ${post.readTime || "?"} min read</small>
            </div>
            <div class="admin-row-actions">
                <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
                <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;

        row.querySelector(".edit-btn").addEventListener("click", () => openPostForm(post.id, post));
        row.querySelector(".delete-btn").addEventListener("click", () => deletePost(post.id));

        listEl.appendChild(row);

    });

}

async function deletePost(id){
    if(!confirm("Delete this post permanently?")) return;
    await deleteDoc(doc(db, "blog", id));
    await loadPostsList();
}

function estimateReadTime(markdown){
    const words = markdown.trim().split(/\s+/).length;
    return Math.max(1, Math.round(words / 200));   // ~200 wpm average reading speed
}

function openPostForm(id = null, existing = null){

    const isEdit = id !== null;

    const modal = document.createElement("div");
    modal.className = "admin-modal";

    modal.innerHTML = `
        <div class="admin-modal-box" style="width:640px">

            <h3>${isEdit ? "Edit Post" : "Add Post"}</h3>

            <div class="input-group">
                <label>Title</label>
                <input type="text" id="bTitle" value="${existing?.title || ""}">
            </div>

            <div class="input-group">
                <label>Category</label>
                <input type="text" id="bCategory" placeholder="e.g. Architecture, Debugging, Firebase" value="${existing?.category || ""}">
            </div>

            <div class="input-group">
                <label>Excerpt (short summary shown on the blog list)</label>
                <textarea id="bExcerpt" style="min-height:50px">${existing?.excerpt || ""}</textarea>
            </div>

            <div class="input-group">
                <label>Cover Image URL (optional)</label>
                <input type="text" id="bCover" value="${existing?.coverUrl || ""}">
            </div>

            <div class="input-group">
                <label>LinkedIn Post URL (optional)</label>
                <input type="text" id="bLinkedin" placeholder="Link to the related LinkedIn post" value="${existing?.linkedinUrl || ""}">
            </div>

            <div class="input-group">
                <label>Content (Markdown supported — ## headings, **bold**, \`code\`, \`\`\`code blocks\`\`\`)</label>
                <textarea id="bContent" style="min-height:220px;font-family:'JetBrains Mono',monospace">${existing?.content || ""}</textarea>
            </div>

            <div class="input-group">
                <label>Featured Post (shows large at the top)</label>
                <select id="bFeatured">
                    <option value="false" ${!existing?.featured ? "selected" : ""}>No</option>
                    <option value="true" ${existing?.featured ? "selected" : ""}>Yes</option>
                </select>
            </div>

            <div class="admin-modal-actions">
                <button id="bSaveBtn" type="button">${isEdit ? "Update" : "Publish"}</button>
                <button id="bCancelBtn" type="button">Cancel</button>
            </div>

        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById("bCancelBtn").addEventListener("click", () => modal.remove());

    document.getElementById("bSaveBtn").addEventListener("click", async () => {

        const content = document.getElementById("bContent").value.trim();

        const data = {
            title: document.getElementById("bTitle").value.trim(),
            category: document.getElementById("bCategory").value.trim(),
            excerpt: document.getElementById("bExcerpt").value.trim(),
            coverUrl: document.getElementById("bCover").value.trim(),
            linkedinUrl: document.getElementById("bLinkedin").value.trim(),   // 👈 new
            content: content,
            readTime: estimateReadTime(content),
            featured: document.getElementById("bFeatured").value === "true",
            createdAt: existing?.createdAt || Date.now()
        };

        if(!data.title || !content){
            alert("Title and content are required.");
            return;
        }

        if(isEdit){
            await updateDoc(doc(db, "blog", id), data);
        }
        else{
            await addDoc(collection(db, "blog"), data);
        }

        modal.remove();
        await loadPostsList();

    });

}