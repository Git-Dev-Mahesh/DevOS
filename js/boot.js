
//CREATE VARIABLES

const bootOutput = document.getElementById("bootOutput");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");


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

    await bootStep("Loading DevOS Kernel");
    
    await bootStep(
        `CPU Threads : ${systemInfo.cpu}`,
        "INFO"
    );

    await bootStep(
        `RAM : ${systemInfo.memory} GB`,
        "INFO"
    );

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
// (old sequence disapear and new sequence appear automatically)

function trimBootOutput(){
    while(bootOutput.children.length > MAX_DOM_LINES){
        bootOutput.removeChild(bootOutput.firstElementChild);
    }
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

async function bootStep(message, status = "...") {

    bootLog(message, status);

    await delay(400);

}

async function bootInfo(type, message){

    bootOutput.insertAdjacentHTML(
        "beforeend",
        `<div class="boot-step"><span class="boot-type">${type}</span>${message}</div>`
    );

    bootOutput.scrollTop = bootOutput.scrollHeight;
    trimBootOutput();
    await delay(350);

}

// ==========================
// BOOT MANAGER
// ==========================

// =============================
// START BOOT SEQUENCE
// =============================

async function startBootSequence(){

    bootOutput.innerHTML = "";

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

        updateProgress(
            Math.round(((i + 1) / bootSequence.length) * 100)
        );

    }

    bootComplete();

}

// ==========================
// BOOT COMPLETE
// ==========================
function bootComplete(){

    bootLog("System Ready", "SUCCESS");

}



startBootSequence();