let GOD_MODE = false;
let SHOW_HINT = true;
let VS_AI = false;
//PIECE SRC
const BLACK_PIECE_SRC = "res/images/blackpiece.png";
const WHTIE_PIECE_SRC = "res/images/whitepiece.png";

const BOARD_DIV = "#board"
const STARTING_PIECES = ["E4","D4","D5","E5"]; //Coordinates for starting piece
//const STARTING_PIECES = ["D4","E4","E5","D5"]
const PLAYERS = ["black","white"];
const GAMELOG_ID = "#gameLog";

let validMovesInfo = [];

//GAME_INFO
let reversiGame = {
    "isOngoing" : false,
    "hasEnded" : false,
    "black_turn" : true,
    "blackCount" : 2,
    "whiteCount" : 2,
    "emptySpace" : 60,
    "moveLog" : []
}

//Event Listerner
document.querySelector("#startBtn").addEventListener("click",startGame);
document.querySelector("#resetBtn").addEventListener("click",resetGame);
document.querySelector("#undoBtn").addEventListener("click",undoMove);
document.querySelector("#hintCheckbox").addEventListener("click",toggleHint);



//Starts the game
function startGame(){
    if(reversiGame.hasEnded){
        displaySystemMessage("Game has already ended! Please reset the game","danger");
        return;
    }

    if(reversiGame.isOngoing) {
        displaySystemMessage("Game has already started!","danger");
        return;
    }
    reversiGame.isOngoing = true;
    initalizeBoard(reversiGame.black_turn);
    displayPlayerTurn();
    updateScoreboard();
    validMovesInfo = calculateValidMoves();
    if(SHOW_HINT) showPlacementHints();
}

//Initialize the starting pieces
function initalizeBoard(player_turn){
    STARTING_PIECES.forEach((coords) =>{
        let pieceImg = pieceSrc(player_turn)
        generatePiece(coords,pieceImg);
        player_turn = !player_turn;
    });
}

//function when player makes a move
function playerMove(cell) {
    if(VS_AI && !reversiGame.black_turn){
        displaySystemMessage("It is not your turn","danger");
        return;
    }

    if(reversiGame.hasEnded) {
        displaySystemMessage("Game has ended! Please reset the game","danger");
        return;
    }

    //Check if game already started
    if(!reversiGame.isOngoing) {
        displaySystemMessage("Game has not started! Click on the start button first","danger");
        return;
    }

    if(!checkValid(cell)) return ; //Check if move is valid for , converts pieces if valid

    //if(!GOD_MODE) VALID_FLAG = false; //Reset Valid Value

    removePlacementHints(); //remove all hints
    let boardCoordinates = cell.id; //get the id of cell clicked
    let pieceImg = pieceSrc(reversiGame.black_turn); //return img source
    generatePiece(boardCoordinates,pieceImg); //generate piece image
    let convLines = getConvertLines(boardCoordinates);
    convertLines(convLines);


    logMove(boardCoordinates,reversiGame.black_turn,convLines); //logs the players move
    updateScore(convLines.length); //update player's score
    updateScoreboard(); //update score display

    //console.log(reversiGame.moveLog);

    reversiGame.black_turn = !reversiGame.black_turn; //switch players turn
    displayPlayerTurn();
    reversiGame.emptySpace--; //reduce empty space count



    //set game to not isOngoing when no more empty space
    if(reversiGame.emptySpace === 0) {
        reversiGame.isOngoing = false;
        determineWinner();
        return;
    }

    validMovesInfo = calculateValidMoves(); //calculate valid moves
    //console.log(validMovesInfo);
    if(SHOW_HINT && !VS_AI) showPlacementHints(); //Display hints for the user

    if(validMovesInfo.validMoves.length === 0 && reversiGame.isOngoing){
        let color;
        if (reversiGame.black_turn) color = PLAYERS[0];
        else color = PLAYERS[1];

        color = color.charAt(0).toUpperCase() + color.slice(1);

        reversiGame.black_turn = !reversiGame.black_turn;
        let oppositeValidMoves = calculateValidMoves();

        if(oppositeValidMoves.validMoves.length > 0){
            displaySystemMessage(`${color} has no possible moves! Passing turn to opposite color.`,"warning");
            displayPlayerTurn();
            validMovesInfo = calculateValidMoves();
            if(SHOW_HINT) showPlacementHints();
        }else{
            displaySystemMessage(`Both players have no possible moves! Game has ended.`,"warning");
            determineWinner();
            return;
        }
    }

    //if(VS_AI) moveAI(); //AI moves
}

function checkValid(cell) {
    for (let i = 0; i < validMovesInfo.validMoves.length; i++) {
        if(validMovesInfo.validMoves[i].coords === cell.id) return true;
    }
    return false;
}

//Returns image source
function pieceSrc(black_turn) {
    if(black_turn) return BLACK_PIECE_SRC;
    else return WHTIE_PIECE_SRC;
}

//Generates the piece image
function generatePiece(boardCoordinates,pieceImg){
    let piece = document.createElement("img");
    piece.src = pieceImg;
    piece.width = CELL_WIDTH - 5;
    piece.height = CELL_HEIGHT - 5;
    document.querySelector(`#${boardCoordinates}`).appendChild(piece);
}

//Logs the move made
function logMove(boardCoordinates,player,coordArr) {
    let move = {
        "coordinates" : boardCoordinates,
        "blackMove" : player,
        "convertedPieces" : coordArr
    };

    reversiGame.moveLog.push(move);

    let color = player? "Black" : "White";
    let log = document.createElement("option");
    let text = document.createTextNode(`${boardCoordinates} - ${color}`);
    log.appendChild(text);
    document.querySelector(GAMELOG_ID).appendChild(log);

    let movesArr = document.querySelector(GAMELOG_ID).querySelectorAll("option");
    if(movesArr.length == 1) movesArr[movesArr.length-1].selected = true; //Selects the first option
    document.querySelector(GAMELOG_ID).selectedIndex = document.querySelector(GAMELOG_ID).length - 1;
}

//Resets game and start over
function resetGame() {
    if(!reversiGame.hasEnded && !reversiGame.isOngoing){
        displaySystemMessage("Can't Reset. Game has not started!","danger");
        return;
    }
    if(reversiGame.emptySpace == 60){
        displaySystemMessage("Game has already reset!","warning");
        return;
    }

    let allCellsImage = document.querySelector(BOARD_DIV).querySelectorAll("img");
    allCellsImage.forEach((cellImage) => {
        cellImage.remove();
    });

    let allMoves = document.querySelector(GAMELOG_ID).querySelectorAll("option");
    allMoves.forEach((moves) =>{
        moves.remove();
    });

    resetGameState();
    startGame();
    displaySystemMessage("Welcome to Reversi!","danger");

}

function resetGameState() {
    reversiGame.isOngoing = false;
    reversiGame.hasEnded = false;
    reversiGame.black_turn = true;
    reversiGame.blackCount = 2;
    reversiGame.whiteCount = 2;
    reversiGame.emptySpace = 60;
    reversiGame.moveLog = [];
}

//Undo a move made
function undoMove() {
    if(reversiGame.hasEnded) return;
    if(!reversiGame.isOngoing) return; //Check if game is going on
    if(reversiGame.moveLog.length == 0) return; //Check if there is a previous move
    let lastMove = reversiGame.moveLog.pop(); //Return the last move made

    document.querySelector(`#${lastMove.coordinates}`).innerHTML = ""; //Remove piece from the cell from last move
    reversiGame.black_turn = !reversiGame.black_turn; //Change players turn
    displayPlayerTurn();

    let movesArr = document.querySelector(GAMELOG_ID).querySelectorAll("option");
    document.querySelector(GAMELOG_ID).removeChild(movesArr[movesArr.length-1]);
    document.querySelector(GAMELOG_ID).selectedIndex = document.querySelector(GAMELOG_ID).length - 1;

    undoPieces(lastMove);
    reversiGame.emptySpace++;

    removePlacementHints();
    validMovesInfo = calculateValidMoves(); //calculate valid moves
    showPlacementHints(); //Display hints for the user
}

function undoPieces(lastMove){
    for (let i = 0; i < lastMove.convertedPieces.length; i++) {
        let cell = document.querySelector(`#${lastMove.convertedPieces[i]}`);
        let image = cell.querySelector("img");
        image.src = pieceSrc(!lastMove.blackMove);
    }
    undoScore(lastMove);
    updateScoreboard();
}

function getAllCells() {
    return document.querySelector(BOARD_DIV).querySelectorAll("img");
}

function undoScore(lastMove) {
    let score = lastMove.convertedPieces.length;
    if(lastMove.blackMove){
        reversiGame.blackCount = reversiGame.blackCount - score - 1;
        reversiGame.whiteCount += score;
    }else{
        reversiGame.whiteCount = reversiGame.whiteCount - score - 1;
        reversiGame.blackCount += score;
    }
}

function updateScore(score) {
    if(reversiGame.black_turn){
        reversiGame.blackCount += score + 1;
        reversiGame.whiteCount -= score;
        //if(mode === "undo") reversiGame.blackCount -= 2;
    }else{
        reversiGame.whiteCount += score + 1;
        reversiGame.blackCount -= score;
        //if(mode === "undo") reversiGame.whiteCount -= 2;
    }
}


function updateScoreboard() {
    document.querySelector("#blackScoreDisplay").textContent = reversiGame.blackCount;
    document.querySelector("#whiteScoreDisplay").textContent = reversiGame.whiteCount;
}

//Determine winner of the game
function determineWinner() {
    reversiGame.hasEnded = true;

    if(reversiGame.blackCount === reversiGame.whiteCount) displayTurnMessage("Draw game");

    if(reversiGame.blackCount > reversiGame.whiteCount) displayTurnMessage("Black is the winner!");
    else displayTurnMessage("White is the winner!");
}

function toggleHint(){
    if(SHOW_HINT){
        SHOW_HINT = false;
        removePlacementHints();
    }else{
        SHOW_HINT = true;
        showPlacementHints();
    }
}

function godMode(){
    if(!GOD_MODE) {
        //VALID_FLAG = true;
        GOD_MODE = true;
    }else{
        //VALID_FLAG = false;
        GOD_MODE = false;
    }
}
