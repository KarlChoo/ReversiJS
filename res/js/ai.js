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

    await sleep(AI_THINK_TIME);
    //console.log(validMovesInfo);
    //console.log(validMovesInfo.validMoves.length,validMovesInfo.validMoves);

    //Get all moves
    let validMovesArr = [];
    for (let i = 0; i < validMovesInfo.validMoves.length; i++) {
        validMovesArr.push(validMovesInfo.validMoves[i].coords);
    }
    console.log(validMovesArr);
    //compare move values
    let moveValueArr = assignValue(validMovesArr);
    //console.log(moveValueArr);
    let cell = getMaxVal(moveValueArr).coords;
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

function assignValue(validMovesArr){
    let moveValueArr = [];
    for (let i = 0; i < validMovesArr.length; i++) {
        let coords = validMovesArr[i];
        let x = parseInt(coords.slice(-1));
        let y = coords.slice(0,1);
        let xIndex = X.indexOf(x);
        let yIndex = Y.indexOf(y);
        moveValueArr.push({coords: coords, value: CELL_WEIGHT[yIndex][xIndex]});
    }
    return moveValueArr;
}

function getMaxVal(moveValueArr){
    if(moveValueArr.length === 1) return moveValueArr[0]; //If only possible move, play that move

    let maxArr = [];
    let max = moveValueArr[0];
    for (let i = 1; i < moveValueArr.length; i++) {
        if(moveValueArr[i].value > max.value) max = moveValueArr[i];
    }

    for (let i = 0; i < moveValueArr.length; i++) {
        if(moveValueArr[i].value === max.value) maxArr.push(moveValueArr[i]);
    }

    if(maxArr.length === 1) return max;

    let randomIndex = Math.floor(Math.random() * maxArr.length);
    return maxArr[randomIndex];
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve,ms));
}
