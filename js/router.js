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

    navLinks.forEach(link => link.classList.remove("active"));

    // Activate only clicked link
    const activeLink = document.querySelector(
        `.sidebar-nav a[href="#${hash}"]`
    );

    if (activeLink) {
        activeLink.classList.add("active");
    }

    // Scroll to section
    const section =
        document.getElementById(hash) ||
        document.getElementById("hero");

    section.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}

window.addEventListener("hashchange", handleRouteChange);
window.addEventListener("DOMContentLoaded", handleRouteChange);