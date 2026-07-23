
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

    await bootStep("DevOS Boot Manager v1.0.0");
    
    await bootStep(
        `CPU Threads : ${systemInfo.cpu}`,
        "INFO"
    );

    if (systemInfo.memory !== "Unavailable") {

        await bootStep(
            `MEMORY CLASS : ${systemInfo.memory} GB`,
            "INFO"
        );

    } else {

        await bootStep(
            "MEMORY CLASS : Hardware API Not Supported",
            "WARN"
        );

    }

    const kernelVersion = "DevOS Kernel v1.0.0";

    await bootStep(kernelVersion, "INFO");

}

async function loadConfiguration(){

    await bootStep("Reading system configuration...");

    await bootStep(
        `Platform : ${systemInfo.platform}`,
        "INFO"
    );

    await bootStep(
        `Language : ${systemInfo.language}`,
        "INFO"
    );

    const configLoaded = true;

    if(!configLoaded){
        throw new Error("Configuration Failed");
    }

    await bootStep("Configuration Loaded","INFO");

}

async function loadTheme(){

    await bootStep("Loading UI Engine...");

    
    await bootStep(
        `Resolution : ${systemInfo.screenWidth} × ${systemInfo.screenHeight}`,
        "INFO"
    );

    document.body.classList.add("boot-loaded");

}

async function initializeSecurity(){

    await bootStep("Security...");
    
    await bootStep(
        `Timezone : ${systemInfo.timezone}`,
        "INFO"
    );

    const securityStatus = true;

    if(!securityStatus){
        throw new Error("Security Failed");
    }

    await bootStep("Security Online","INFO");
}

async function loadPortfolio(){

    bootHeader("PORTFOLIO");

    await bootStep("Loading Projects...");
    await bootStep("Loading Certificates...");
    await bootStep("Loading Skills...");
    await bootStep("Loading GitHub Cache...");

    const portfolioLoaded = true;

    if(!portfolioLoaded){
        throw new Error("Portfolio Missing");
    }

    await bootStep("Portfolio Database Ready","INFO");

}

async function initializeTerminal(){

    bootHeader("TERMINAL");

    await bootStep("Starting Command Engine...");
    await bootStep("Loading Terminal Commands...");
    await bootStep("Initializing History...");
    await bootStep("Preparing Shell...");

    const terminalReady = true;

    if(!terminalReady){
        throw new Error("Terminal Failed");
    }

    await bootStep("Terminal Ready","INFO");

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

    const percent = Math.round(

        (currentProgress / totalBootSteps) * 100

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
    totalBootSteps = 23;
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

}


startBootSequence();