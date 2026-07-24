// ==========================
//  VIEW ROUTER
// ==========================

const views = document.querySelectorAll(".view");
const navLinks = document.querySelectorAll(".sidebar-nav a[data-route]");

function showView(routeName){

    views.forEach(view => {
        view.classList.toggle("active", view.dataset.view === routeName);
    });

    navLinks.forEach(link => {
        link.classList.toggle("active", link.dataset.route === routeName);
    });

    window.scrollTo(0, 0);

}

function handleRouteChange(){

    const hash = window.location.hash.replace("#", "") || "home";

    const routeMap = {
        home: "hero",
        about: "hero",
        projects: "hero",
        skills: "skills",
        certificates: "certificates",
        timeline: "timeline",
        blog: "blog",
        lab: "lab",
        contact: "hero"
    };

    const targetView = routeMap[hash] || "hero";

    showView(targetView);

    if(hash === "about" || hash === "projects" || hash === "contact"){
        setTimeout(() => {
            document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
        }, 50);
    }

}

window.addEventListener("hashchange", handleRouteChange);
window.addEventListener("DOMContentLoaded", handleRouteChange);