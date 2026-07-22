// This part is 
// actually detect information from the visitor's browser.

const systemInfo = {

    cpu: navigator.hardwareConcurrency || "Unknown",

    memory: navigator.deviceMemory || "Unknown",

    language: navigator.language,

    platform: navigator.platform,

    userAgent: navigator.userAgent,

    screenWidth: screen.width,

    screenHeight: screen.height,

    colorDepth: screen.colorDepth,

    timezone:
        Intl.DateTimeFormat().resolvedOptions().timeZone

};