window.onload = () => {
    window.scrollTo(0, 0);
};


// Clock and Date & Time

function updateClock(){
    const clockEl = document.querySelector(".hero-aside .info-card:nth-child(1) h3");
    const dateEl = document.querySelector(".hero-aside .info-card:nth-child(1) p");

    const now = new Date();

    const time = now.toLocaleTimeString("en-US", {
        hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true
    });

    const date = now.toLocaleDateString("en-US", {
        weekday: "long", day: "numeric", month: "long"
    });

    if(clockEl) clockEl.textContent = time;
    if(dateEl) dateEl.textContent = date;
}

setInterval(updateClock, 1000);
updateClock();

// ==========================
//  VISITOR COUNTER
// ==========================

function updateVisitorCount(){

    const visitorEl = document.querySelector(".hero-aside .info-card:nth-child(4) h3");

    if(!visitorEl){
        console.warn("Visitor count element not found");
        return;
    }

    let count = parseInt(localStorage.getItem("visitorCount")) || 0;

    if(!sessionStorage.getItem("countedThisSession")){
        count++;
        localStorage.setItem("visitorCount", count);
        sessionStorage.setItem("countedThisSession", "true");
    }

    visitorEl.textContent = count.toLocaleString();

}

updateVisitorCount();