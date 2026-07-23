// This part is 
// actually detect information from the visitor's browser hardware.


const systemInfo = {

    cpu: navigator.hardwareConcurrency ?? "Unknown",

    memory: navigator.deviceMemory ?? "Unavailable",

    platform: navigator.userAgentData?.platform
        ?? navigator.platform
        ?? "Unknown",

    language: navigator.language ?? "Unknown",

    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        ?? "Unknown",

    screenWidth: window.screen.width,

    screenHeight: window.screen.height
    

};

