const AI_THINK_TIME = 1500;

const CELL_WEIGHT = [
  [8, 5, 5, 5, 5, 5, 5, 8],
  [5, 0, 1, 1, 1, 1, 0, 5],
  [5, 1, 2, 2, 2, 2, 1, 5],
  [5, 1, 2, 2, 2, 2, 1, 5],
  [5, 1, 2, 2, 2, 2, 1, 5],
  [5, 1, 2, 2, 2, 2, 1, 5],
  [5, 0, 1, 1, 1, 1, 0, 5],
  [8, 5, 5, 5, 5, 5, 5, 8],
];

async function moveAI(){

    //await sleep(1500);
    console.log(validMovesInfo);

    //Get all moves
    let validMovesArr = [];
    for (let i = 0; i < validMovesInfo.validMoves.length; i++) {
        validMovesArr.push(validMovesInfo.validMoves[i].coords);
    }

    console.log(validMovesArr);
    //compare move values
    let cell = getMaxVal(validMovesArr)

    //pick cell

    //let boardCoordinates = cell.id; //get the id of cell clicked
    let pieceImg = pieceSrc(reversiGame.black_turn); //return img source
    generatePiece(cell,pieceImg); //generate piece image
    let convLines = getConvertLines(cell);
    convertLines(convLines);


    logMove(cell,reversiGame.black_turn,convLines); //logs the players move
    updateScore(convLines.length); //update player's score
    updateScoreboard(); //update score display

    reversiGame.black_turn = !reversiGame.black_turn; //switch players turn
    displayPlayerTurn();
    reversiGame.emptySpace--; //reduce empty space count

    if(reversiGame.emptySpace === 0) {
        reversiGame.isOngoing = false;
        determineWinner();
        return;
    }

    validMovesInfo = calculateValidMoves();

    if(SHOW_HINT) showPlacementHints();
}

function getMaxVal(validMovesArr){
    if(validMovesArr.length === 1) return validMovesArr[0]; //If only possible move, play that move

    let maxArr = [];
    let max = validMovesArr[0];
    for (let i = 1; i < validMovesArr.length; i++) {
        if(validMovesArr[i] > max) max = validMovesArr[i];
    }

    for (let i = 0; i < validMovesArr.length; i++) {
        if(validMovesArr[0] === max) maxArr.push(validMovesArr[0]);
    }


}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve,ms));
}
