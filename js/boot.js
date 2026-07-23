
//CREATE VARIABLES

const bootOutput = document.getElementById("bootOutput");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

// Create progress variables
let currentProgress = 0;
let totalBootSteps = 0;

// TIMER
let bootStartTime = 0;

// Save the Session
const bootSession = generateSessionID();


// GIVING CONNECTION FOR BOOT SEQUENCE FUNCTION

const bootSequence = [

    {
        message: "Initializing DevOS Kernel...",
        task: initializeKernel
    },

    {
        message: "Loading Configuration...",
        task: loadConfiguration
    },

    {
        message: "Loading Theme Engine...",
        task: loadTheme
    },

    {
        message: "Initializing Security Module...",
        task: initializeSecurity
    },

    {
        message: "Loading Portfolio Database...",
        task: loadPortfolio
    },

    {
        message: "Initializing Developer Terminal...",
        task: initializeTerminal
    }

];

//FUNCTION OF BOOT SEQUENCE 

async function initializeKernel(){

    bootHeader("HARDWARE SCAN");

    await bootStep(
        formatLine("Browser", systemInfo.browser),
        "INFO"
    );

    await bootStep(
        formatLine("Platform", systemInfo.platform),
        "INFO"
    );

    await bootStep(
        formatLine("Language", systemInfo.language),
        "INFO"
    );

    await bootStep(
        formatLine("Resolution", `${systemInfo.screenWidth} x ${systemInfo.screenHeight}`),
        "INFO"
    );

    await bootStep(
        formatLine("Timezone", systemInfo.timezone),
        "INFO"
    );

    await bootStep(
        formatLine("CPU Threads", systemInfo.cpu),
        "INFO"
    );

    await bootStep(
        formatLine(
            "RAM",
            systemInfo.memory !== "Unavailable" ? `${systemInfo.memory} GB` : "Unavailable"
        ),
        "INFO"
    );

    await bootStep(
        formatLine("Network", systemInfo.online ? "ONLINE" : "OFFLINE"),
        systemInfo.online ? "OK" : "WARN"
    );

    const kernelVersion = "DevOS Kernel v1.0.0";
    await bootStep(kernelVersion, "INFO");

}

async function loadConfiguration(){

    await bootStep("Reading system configuration...");

    const configLoaded = true;

    if(!configLoaded){
        throw new Error("Configuration Failed");
    }

    await bootStep("Configuration Loaded","INFO");

}

async function loadTheme(){

    await bootStep("Loading UI Engine...");
    await bootStep("Applying color scheme...", "INFO");

    document.body.classList.add("boot-loaded");

}

async function initializeSecurity(){

    bootHeader("SECURITY MODULE");

    const cookiesOK = checkCookies();
    await bootStep(
        formatLine("Checking Cookies", cookiesOK ? "" : "BLOCKED"),
        cookiesOK ? "OK" : "WARN"
    );

    const localOK = checkLocalStorage();
    await bootStep(
        formatLine("Checking Local Storage", localOK ? "" : "BLOCKED"),
        localOK ? "OK" : "WARN"
    );

    const sessionOK = checkSessionStorage();
    await bootStep(
        formatLine("Checking Session Storage", sessionOK ? "" : "BLOCKED"),
        sessionOK ? "OK" : "WARN"
    );

    const httpsOK = checkHTTPS();
    await bootStep(
        formatLine("Checking HTTPS", httpsOK ? "" : "INSECURE"),
        httpsOK ? "OK" : "WARN"
    );

    await bootStep(
        formatLine("Checking JavaScript" , ""),
        "OK"
    );

    const devMode = checkDevMode();
    await bootStep(
        formatLine("Checking Developer Mode", devMode ? "DETECTED" : "SAFE"),
        devMode ? "WARN" : "OK"
    );

    const securityStatus = cookiesOK && localOK && sessionOK;

    if(!securityStatus){
        throw new Error("Security Module Failed — Storage Blocked");
    }

    await bootStep("Security Online", "OK");

}

async function loadPortfolio(){

    bootHeader("PORTFOLIO DATABASE");

    const projectCount = await getProjectCountFromPortfolio();

    await bootStep(
        formatLine("Projects Loaded", projectCount),
        projectCount > 0 ? "OK" : "WARN"
    );

    await bootStep(
        formatLine("Certificates", "Module Not Built"),
        "WARN"
    );

    await bootStep(
        formatLine("Skills", "Module Not Built"),
        "WARN"
    );

    await bootStep(
        formatLine("Blog Articles", "Module Not Built"),
        "WARN"
    );

    const portfolioLoaded = projectCount > 0;

    if(!portfolioLoaded){
        throw new Error("Portfolio Database Empty");
    }

    await bootStep("Portfolio Database Ready", "OK");

}

async function initializeTerminal(){

    bootHeader("TERMINAL");

    await bootStep("Starting Command Engine...");
    await bootStep("Initializing History...");

    const terminalReady = true;

    if(!terminalReady){
        throw new Error("Terminal Failed");
    }

    await bootStep("Terminal Ready", "INFO");

}

async function getProjectCountFromPortfolio(){

    try{
        const response = await fetch("index.html");
        const html = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        return doc.querySelectorAll(".project-card").length;
    }
    catch(e){
        return 0;
    }

}
const MAX_DOM_LINES = 15;   
// num of sequence line can be display 
// ( old sequence disapear and new sequence appear automatically )

function trimBootOutput(){
    while(bootOutput.children.length > MAX_DOM_LINES){
        bootOutput.removeChild(bootOutput.firstElementChild);
    }
}

// Current Time

function getBootTime(){

    return new Date().toLocaleTimeString();

}

// ==========================
//  SECURITY CHECKS
// ==========================

function checkCookies(){
    try{
        return navigator.cookieEnabled;
    }
    catch(e){
        return false;
    }
}

function checkLocalStorage(){
    try{
        const testKey = "__devos_test__";
        localStorage.setItem(testKey, "1");
        localStorage.removeItem(testKey);
        return true;
    }
    catch(e){
        return false;
    }
}

function checkSessionStorage(){
    try{
        const testKey = "__devos_test__";
        sessionStorage.setItem(testKey, "1");
        sessionStorage.removeItem(testKey);
        return true;
    }
    catch(e){
        return false;
    }
}

function checkHTTPS(){
    return location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1";
}

function checkDevMode(){
    // Heuristic: large gap between outer and inner window size often means devtools is docked open
    const threshold = 160;
    const widthDiff = window.outerWidth - window.innerWidth;
    const heightDiff = window.outerHeight - window.innerHeight;

    return (widthDiff > threshold || heightDiff > threshold);
}

// ==========================
//  FORMAT A HARDWARE/REPORT LINE
// ==========================

function formatLine(label, value, width = 22){

    const dots = ".".repeat(Math.max(width - label.length, 3));

    return `${label}${dots}${value}`;

}

// CREATE A LOGGER

function bootLog(message, status = ""){

    let statusHTML = "";

    if(status !== ""){
        const color =
             status === "OK" ? "ok" :
            status === "FAILED" ? "failed" : "success";

        statusHTML = `<span class="${color}">[ ${status} ]</span>`;
    }

    bootOutput.insertAdjacentHTML(
        "beforeend",
        `<div class="boot-line">${message}${statusHTML}</div>`
    );

    bootOutput.scrollTop = bootOutput.scrollHeight;   //  changed from 
    trimBootOutput()

}

// ==========================
//  MODULE HEADER
// ==========================
function bootHeader(title){

    bootOutput.insertAdjacentHTML(
        "beforeend",
        `
        <div class="boot-header">
            ========= ${title} =========
        </div>
        `
    );

    bootOutput.scrollTop = bootOutput.scrollHeight;
    trimBootOutput();
}

//PROGRESS FUNCTION

function updateProgress(percent) {

    progressFill.style.width = percent + "%";

    progressText.textContent = percent + "%";

}

//DELAY FUNCTION

function delay(ms){

    return new Promise(resolve => {

        setTimeout(resolve, ms);

    });

}

async function bootStep(message, status = "..."){

    bootLog(message, status);

    currentProgress++;

    const percent = Math.min(
        Math.round((currentProgress / totalBootSteps) * 100),
        100
    );

    updateProgress(percent);

    await delay(100);

}

// ==========================
// CREATE A SESSION ID
// ==========================

function generateSessionID(){

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    let id = "DEV-";

    for(let i = 0; i < 4; i++){

        id += chars[Math.floor(Math.random() * chars.length)];

    }

    id += "-";

    for(let i = 0; i < 4; i++){

        id += chars[Math.floor(Math.random() * chars.length)];

    }

    return id;

}

// ==========================
// BOOT BANNER
// ==========================

function bootBanner(){

    bootOutput.insertAdjacentHTML(

        "beforeend",

        `
        <div class="boot-banner">

            ========================================<br>

            &nbsp;&nbsp;DevOS Boot Manager v1.0.0<br>

            ========================================<br>

            Boot Mode&nbsp;&nbsp;&nbsp;: Visitor<br>

            Boot Type&nbsp;&nbsp;&nbsp;: Cold Boot<br>

            Session ID&nbsp;&nbsp;: ${bootSession}<br>

            Boot Time&nbsp;&nbsp;&nbsp;: ${getBootTime()}<br>

            ========================================

        </div>
        `

    );

}

// ==========================
// BOOT MANAGER
// ==========================

// =============================
// START BOOT SEQUENCE
// =============================

async function startBootSequence(){
    
    currentProgress = 0;
    totalBootSteps = 28;
    updateProgress(0);

    bootOutput.innerHTML = "";

    bootBanner();

    await delay(300);

    // Reset Progress
    

    // TIMER
    bootStartTime = performance.now();

    for(let i = 0; i < bootSequence.length; i++){

        const module = bootSequence[i];

        try{

            await module.task();

            bootLog(module.message,"OK");

        }
        catch(error){

            bootLog(module.message,"FAILED");

            bootLog("BOOT ABORTED","FAILED");

            return;

        }

    }

    bootComplete();

}

// ==========================
// BOOT COMPLETE
// ==========================

function bootComplete(){

    const bootEndTime = performance.now();

    const duration =
        ((bootEndTime - bootStartTime) / 1000).toFixed(2);

    bootLog("System Ready", "SUCCESS");

    bootLog(
        `Boot Time : ${duration} seconds`,
        "INFO"
    );

    // Auto-continue into the terminal
    setTimeout(() => {

        bootLog("Launching Developer Terminal...", "SUCCESS");

        setTimeout(() => {
            window.location.href = "index.html";
        }, 900);   // small pause so the message is actually readable before navigating

    }, 1000);   // pause after "System Ready" before showing the next line

}


startBootSequence();