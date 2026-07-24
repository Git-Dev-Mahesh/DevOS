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


// ==========================
//  WEATHER
// ==========================

const WEATHER_API_KEY = "209eb0ce5c02ffb3b811ddfde045270a";
const WEATHER_CITY = "Colombo";

async function updateWeather(){

    const weatherCard = document.querySelectorAll(".hero-aside .info-card")[1];

    if(!weatherCard) return;

    const tempEl = weatherCard.querySelector("h3");
    const locationEl = weatherCard.querySelector("p");
    const iconEl = weatherCard.querySelector(".weather-icon");

    try{

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${WEATHER_CITY}&units=metric&appid=${WEATHER_API_KEY}`
        );

        const data = await response.json();

        if(data.cod !== 200){
            throw new Error("Weather API error");
        }

        const temp = Math.round(data.main.temp);
        const condition = data.weather[0].main;   // e.g. "Clouds", "Rain", "Clear"

        tempEl.textContent = `${temp}°C`;
        locationEl.textContent = `${data.name}, Sri Lanka`;

        iconEl.className = "fa-solid weather-icon " + getWeatherIcon(condition);

    }
    catch(e){
        console.warn("Weather fetch failed:", e);
        tempEl.textContent = "N/A";
    }

}

function getWeatherIcon(condition){

    const icons = {
        Clear: "fa-sun",
        Clouds: "fa-cloud",
        Rain: "fa-cloud-rain",
        Drizzle: "fa-cloud-rain",
        Thunderstorm: "fa-bolt",
        Snow: "fa-snowflake",
        Mist: "fa-smog",
        Fog: "fa-smog",
        Haze: "fa-smog"
    };

    return icons[condition] || "fa-cloud-sun";

}

updateWeather();

setInterval(updateWeather, 10 * 60 * 1000);   // refresh every 10 minutes

// ==========================
//  AVAILABILITY STATUS
// ==========================

const isAvailableForWork = true;   // 👈 change this by hand when your availability changes

function updateStatus(){

    const statusCard = document.querySelectorAll(".hero-aside .info-card")[2];

    if(!statusCard) return;

    const statusEl = statusCard.querySelector("h3");
    const subtextEl = statusCard.querySelector("p");

    if(isAvailableForWork){
        statusEl.textContent = "Available";
        statusEl.classList.add("online");
        subtextEl.textContent = "For Opportunities";
    }
    else{
        statusEl.textContent = "Busy";
        statusEl.classList.remove("online");
        subtextEl.textContent = "Not Available";
    }

}

updateStatus();
