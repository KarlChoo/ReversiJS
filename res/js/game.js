let GOD_MODE = false;
//PIECE SRC
const BLACK_PIECE_SRC = "res/images/blackpiece.png";
const WHTIE_PIECE_SRC = "res/images/whitepiece.png";

const BOARD_DIV = "#board"
const STARTING_PIECES = ["D4","E4","E5","D5"]; //Coordinates for starting piece
const PLAYERS = ["black","white"];
const GAMELOG_ID = "#gameLog";


//GAME_INFO
let reversiGame = {
    "boardDiv" : "#board",
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
    if(reversiGame.hasEnded) {
        displaySystemMessage("Game has ended! Please reset the game","danger");
        return;
    }

    //Check if game already started
    if(!reversiGame.isOngoing) {
        displaySystemMessage("Game has not started! Click on the start button first","danger");
        return;
    }

    //showPlacementHints();

    if(checkOccupied(cell)) return; //Check if cell has piece already
    if(!validMove(cell)) return ; //Check if move is valid for , converts pieces if valid

    //if(!GOD_MODE) VALID_FLAG = false; //Reset Valid Value

    let boardCoordinates = cell.id; //get the id of cell clicked
    let pieceImg = pieceSrc(reversiGame.black_turn); //return img source
    generatePiece(boardCoordinates,pieceImg); //generate piece image
    //convertLines();


    logMove(boardCoordinates,reversiGame.black_turn,CONVERTED_PIECES_COORDS); //logs the players move
    updateScore(CONVERTED_PIECES_COORDS.length); //update player's score
    updateScoreboard(); //update score display

    CONVERTED_PIECES_COORDS = [] //remove last moves converted piece coords

    reversiGame.black_turn = !reversiGame.black_turn; //switch players turn
    displayPlayerTurn();
    reversiGame.emptySpace--; //reduce empty space count

    //set game to not isOngoing when no more empty space
    if(reversiGame.emptySpace === 0) {
        reversiGame.isOngoing = false;
        reversiGame.hasEnded = true;
        determineWinner();
    }
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

    let allCells = document.querySelector(reversiGame.boardDiv).querySelectorAll("img");
    allCells.forEach((cells) => {
        cells.remove();
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
    if(!reversiGame.isOngoing) return; //Check if game is going on
    if(reversiGame.moveLog.length == 0) return; //Check if there is a previous move
    let lastMove = reversiGame.moveLog.pop(); //Return the last move made

    document.querySelector(`#${lastMove.coordinates}`).innerHTML = ""; //Remove piece from the cell from last move
    reversiGame.black_turn = !reversiGame.black_turn; //Change players turn
    displayPlayerTurn();

    let movesArr = document.querySelector(GAMELOG_ID).querySelectorAll("option");
    document.querySelector(GAMELOG_ID).removeChild(movesArr[movesArr.length-1]);
    document.querySelector(GAMELOG_ID).selectedIndex = document.querySelector(GAMELOG_ID).length - 1;

    undoPieces(lastMove.convertedPieces);
    reversiGame.emptySpace++;
}

function undoPieces(convertedPieces){
    for (let i = 0; i < convertedPieces.length; i++) {
        let cell = document.querySelector(`#${convertedPieces[i]}`);
        let image = cell.querySelector("img");
        image.src = pieceSrc(!reversiGame.black_turn);
    }
    updateScore(-convertedPieces.length,"undo")
    updateScoreboard();
}

function getAllCells() {
    return document.querySelector(BOARD_DIV).querySelectorAll("img");
}

function updateScore(score, mode="move") {
    if(reversiGame.black_turn){
        reversiGame.blackCount += score + 1;
        reversiGame.whiteCount -= score;
        if(mode === "undo") reversiGame.blackCount -= 2;
    }else{
        reversiGame.whiteCount += score + 1;
        reversiGame.blackCount -= score;
        if(mode === "undo") reversiGame.whiteCount -= 2;
    }
}


function updateScoreboard() {
    document.querySelector("#blackScoreDisplay").textContent = reversiGame.blackCount;
    document.querySelector("#whiteScoreDisplay").textContent = reversiGame.whiteCount;
}

//Determine winner of the game
function determineWinner() {
    if(reversiGame.blackCount === reversiGame.whiteCount) displayTurnMessage("Draw game");

    if(reversiGame.blackCount > reversiGame.whiteCount) displayTurnMessage("Black is the winner!");
    else displayTurnMessage("White is the winner!");
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
