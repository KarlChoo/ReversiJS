const TURN_MESSAGE_DIV = document.querySelector("#turnMessage");
const SYSTEM_MESSAGE_DIV = document.querySelector("#systemStatus");


function displaySystemMessage(message,color="normal"){
    let classes = "alert ";
    if(color != "normal") classes += `alert-${color}`;
    else classes += `alert-primary`;

    SYSTEM_MESSAGE_DIV.className = classes;
    SYSTEM_MESSAGE_DIV.textContent = message;
}

function displayTurnMessage(message){
    TURN_MESSAGE_DIV.textContent = message;
}

function displayPlayerTurn(){
    let color;
    if (reversiGame.black_turn) color = PLAYERS[0];
    else color = PLAYERS[1];

    color = color.charAt(0).toUpperCase() + color.slice(1);

    displayTurnMessage(`${color}'s turn to move.`,"primary");
}
