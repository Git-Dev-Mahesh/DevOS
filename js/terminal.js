// GRAB INPUT ID 

const terminalInput = document.getElementById("terminalInput");

// GRAB OUTPUT ID

const terminalOutput = document.getElementById("terminal-output");

// FUNCTION OF EXECUTE COMMAND ENGINE RESULT

function executeCommand(){

    const command = terminalInput.value.trim().toLowerCase();

    if(command === ""){
        return;
    }

    commandHistory.push(command);
    historyIndex = commandHistory.length;

    printCommand(command);

    runCommand(command);

    terminalInput.value = "";

}

// HISTORY

let commandHistory = [];
let historyIndex = -1;

// WHEN ENTER BUTTON PRESS

terminalInput.addEventListener("keydown", handleKeyPress);

// FUNCITON FOR HISTORY AND ENTER BUTTON PRESS

function handleKeyPress(event){

    switch(event.key){

        case "Enter":

            executeCommand();
            break;

        case "ArrowUp":

            event.preventDefault();
            showPreviousCommand();
            break;

        case "ArrowDown":

            event.preventDefault();
            showNextCommand();
            break;

    }

}

// TYPED COMMAND FUNCTION

function printCommand(command){

    terminalOutput.innerHTML += `
        <p>
            <span class="prompt">
                devos@system:~$
            </span>
            ${command}
        </p>
    `;

}

// RUN COMMANDS FUNCTION

function runCommand(command){

    if(!commands[command]){

        terminalOutput.innerHTML += `
        
            <p class="terminal-error">
                Command not found: <strong>${command}</strong>
            </p>

            <p class="terminal-tip">
                Type <span class="terminal-command">help</span> to see available commands.
            </p>
            `;

        scrollTerminal();

        return;

    }

    const result = commands[command]();

    if(result === "__CLEAR__"){

        terminalOutput.innerHTML = "";

    }else{

        terminalOutput.innerHTML += `
            <pre>${result}</pre>
        `;

    }

    scrollTerminal();

}

// AUTO SCROLL FUNCTION 

function scrollTerminal(){

    terminalOutput.scrollTop = terminalOutput.scrollHeight;

}

// PREVIOUS COMMAND FUNCTION 

function showPreviousCommand() {

    if (commandHistory.length === 0) {
        return;
    }

    if (historyIndex > 0) {
        historyIndex--;
    }

    terminalInput.value = commandHistory[historyIndex];

}

// NEXT COMMAND FUNCTION

function showNextCommand() {

    if (commandHistory.length === 0) {
        return;
    }

    if (historyIndex < commandHistory.length - 1) {

        historyIndex++;
        terminalInput.value = commandHistory[historyIndex];

    } else {

        historyIndex = commandHistory.length;
        terminalInput.value = "";

    }

}

terminalInput.focus();