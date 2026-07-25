// ==========================
//  PUBLIC CERTIFICATES PAGE — LIVE FIRESTORE DATA
// ==========================

import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const categoryIcons = {
    Cloud: '<i class="fa-solid fa-cloud"></i>',
    Development: '<i class="fa-solid fa-gear"></i>',
    Other: '<i class="fa-solid fa-star"></i>'
};

async function loadCertificates(){

    const gridEl = document.getElementById("certGrid");
    const summaryEl = document.getElementById("certSummaryCards");

    if(!gridEl || !summaryEl) return;

    gridEl.innerHTML = `<p style="color:var(--secondary)">Loading certificates...</p>`;

    const snapshot = await getDocs(collection(db, "certificates"));

    if(snapshot.empty){
        gridEl.innerHTML = `<p style="color:var(--secondary)">No certificates added yet.</p>`;
        summaryEl.innerHTML = "";
        return;
    }

    const certs = snapshot.docs.map(d => d.data());

    // Real counts per category
    const categories = ["Cloud", "Development", "Other"];
    const counts = {};
    categories.forEach(cat => {
        counts[cat] = certs.filter(c => c.category === cat).length;
    });

    summaryEl.innerHTML = `
        <div class="summary-mini-card">
            <i class="fa-solid fa-display"></i>
            <div><h3>${certs.length}</h3><small>Total Certificates</small></div>
        </div>
        ${categories.map(cat => `
            <div class="summary-mini-card">
                ${categoryIcons[cat]}
                <div><h3>${counts[cat]}</h3><small>${cat}</small></div>
            </div>
        `).join("")}
    `;

    gridEl.innerHTML = certs.map(cert => {

        const iconHTML = cert.imageUrl
            ? `<img src="${cert.imageUrl}" alt="${cert.title}" class="cert-logo-img" onerror="this.parentElement.innerHTML = '${(categoryIcons[cert.category] || categoryIcons.Other).replace(/'/g, "\\'")}'">`
            : (categoryIcons[cert.category] || categoryIcons.Other);

        return `
            <div class="cert-card">

                <div class="cert-card-top">
                    <div class="cert-icon">${iconHTML}</div>
                    ${cert.credentialUrl
                        ? `<a href="${cert.credentialUrl}" target="_blank" class="cert-link-icon"><i class="fa-solid fa-arrow-up-right-from-square"></i></a>`
                        : ""
                    }
                </div>

                <h4>${cert.title}</h4>
                <small>${cert.issuer}</small>

                <div class="cert-card-bottom">
                    <span class="cert-date">${cert.date || ""}</span>
                    ${cert.credentialUrl
                        ? `<a href="${cert.credentialUrl}" target="_blank" class="cert-view-btn">View Credential</a>`
                        : `<span class="cert-view-btn disabled">No Link</span>`
                    }
                </div>

            </div>
        `;

    }).join("");

}

loadCertificates();