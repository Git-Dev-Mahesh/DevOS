// This part is 
// actually detect information from the visitor's browser hardware.

function detectBrowser(){

    const ua = navigator.userAgent;

    if(ua.includes("Edg/")) return "Edge";
    if(ua.includes("Chrome/") && !ua.includes("Edg/")) return "Chrome";
    if(ua.includes("Firefox/")) return "Firefox";
    if(ua.includes("Safari/") && !ua.includes("Chrome/")) return "Safari";
    if(ua.includes("OPR/") || ua.includes("Opera")) return "Opera";

    return "Unknown";

}

const systemInfo = {

    browser: detectBrowser(),

    cpu: navigator.hardwareConcurrency ?? "Unknown",

    memory: navigator.deviceMemory ?? "Unavailable",

    platform: navigator.userAgentData?.platform
        ?? navigator.platform
        ?? "Unknown",

    language: navigator.language ?? "Unknown",

    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        ?? "Unknown",

    screenWidth: window.screen.width,

    screenHeight: window.screen.height,

    online: navigator.onLine

};

