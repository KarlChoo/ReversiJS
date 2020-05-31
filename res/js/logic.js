const ALL_CELLS = document.querySelector(BOARD_DIV).querySelectorAll("td");

/*

HINT LOGIC

*/
function calculateValidMoves(){
    let validMovesArr = [];
    let validFlag = true;

    //if(reversiGame.emptySpace < 56 && !reversiGame.black_turn) return {"validMoves": validMovesArr, "valid": validFlag};

    ALL_CELLS.forEach((cell) => {
        let coords = cell.id;
        let x = parseInt(coords.slice(-1));
        let y = coords.slice(0,1);
        let xIndex = X.indexOf(x);
        let yIndex = Y.indexOf(y);

        let validLines = [];

        //Return variables for each direction
        let statusN;
        let statusNE;
        let statusE;
        let statusSE;
        let statusS;
        let statusSW;
        let statusW;
        let statusNW;

        if(checkOccupied(cell)) return; //If occupied skip check

        //Skip direction check
        yIndex <= 1 ? statusN = false :
            statusN = checkNorth(xIndex,yIndex);
        yIndex <= 1 ? statusNE = false :  xIndex >= 6 ? statusNE = false :
            statusNE = checkNorthEast(xIndex,yIndex);
        xIndex >= 6 ? statusE = false :
            statusE = checkEast(xIndex,yIndex);
        yIndex >= 6 ? statusSE = false : xIndex >= 6 ? statusSE = false :
            statusSE = checkSouthEast(xIndex,yIndex);
        yIndex >= 6 ? statusS = false :
            statusS = checkSouth(xIndex,yIndex);
        xIndex <= 1 ? statusSW = false : yIndex >= 6 ? statusSW = false :
            statusSW = checkSouthWest(xIndex,yIndex);
        xIndex <= 1 ? statusW = false :
            statusW = checkWest(xIndex,yIndex);
        xIndex <= 1 ? statusNW = false : yIndex <= 1 ? statusNW = false :
            statusNW = checkNorthWest(xIndex,yIndex);




        if(!(statusN || statusNE || statusE || statusSE || statusS || statusSW || statusW || statusNW)) return; //Skip array push if not valid for all

        if(statusN) validLines.push(statusN);
        if(statusNE) validLines.push(statusNE);
        if(statusE) validLines.push(statusE);
        if(statusSE) validLines.push(statusSE);
        if(statusS) validLines.push(statusS);
        if(statusSW) validLines.push(statusSW);
        if(statusW) validLines.push(statusW);
        if(statusNW) validLines.push(statusNW);

        let coordsInfo = {"coords":coords,"validLines": validLines};
        validMovesArr.push(coordsInfo);
    });

    if(validMovesArr.length === 0) validFlag = false;

    return {"validMoves": validMovesArr, "valid": validFlag};
}

function showPlacementHints(){
    //console.log(validMovesInfo.validMoves);
    let validCells= validMovesInfo.validMoves;
    if(!validCells) return;
    validCells.forEach((moves) => {
        generateHint(moves.coords);
    });
}

function generateHint(cellid) {
    generatePiece(cellid,pieceSrc(reversiGame.black_turn));
    let cellImage = document.querySelector(`#${cellid} img`);
    cellImage.className = "hint";
}

function removePlacementHints(){
    let allCellsImage = document.querySelector(BOARD_DIV).querySelectorAll("img");
    allCellsImage.forEach((cellImage) => {
        if(cellImage.className === "hint")
            cellImage.remove();
    });
}




/*
function validMove(cell){
    let coords = cell.id;
    let x = parseInt(coords.slice(-1));
    let y = coords.slice(0,1);
    let xIndex = X.indexOf(x);
    let yIndex = Y.indexOf(y);

    let statusN;
    let statusNE;
    let statusE;
    let statusSE;
    let statusS;
    let statusSW;
    let statusW;
    let statusNW;


    yIndex <= 1 ? "" :
        statusN = checkNorth(xIndex,yIndex);
    yIndex <= 1 ? "" :  xIndex >= 6 ? "" :
        statusNE = checkNorthEast(xIndex,yIndex);
    xIndex >= 6 ? "" :
        statusE = checkEast(xIndex,yIndex);
    yIndex >= 6 ? "" : xIndex >= 6 ? "" :
        statusSE = checkSouthEast(xIndex,yIndex);
    yIndex >= 6 ? "" :
        statusS = checkSouth(xIndex,yIndex);
    xIndex <= 1 ? "" : yIndex >= 6 ? "" :
        statusSW = checkSouthWest(xIndex,yIndex);
    xIndex <= 1 ? "" :
        statusW = checkWest(xIndex,yIndex);
    xIndex <= 1 ? "" : yIndex <= 1 ? "" :
        statusNW = checkNorthWest(xIndex,yIndex);



    return VALID_FLAG;
    //Return array containing true false and another array with the valid directions
}
*/

function checkNorth(xIndex,yIndex) {
    let cells = getDirectionCoordinates(xIndex,yIndex,0,-1);
    let adjacentCell = document.querySelector(`#${cells[0]}`);
    let adjacentPieceColor = checkPieceColor(adjacentCell);

    if (checkConvertPotential(adjacentPieceColor)) return false;
    return getConvertingCells(cells, adjacentPieceColor);
}

function checkNorthEast(xIndex,yIndex) {
    let cells = getDirectionCoordinates(xIndex,yIndex,1,-1);
    let adjacentCell = document.querySelector(`#${cells[0]}`);
    let adjacentPieceColor = checkPieceColor(adjacentCell);

    if (checkConvertPotential(adjacentPieceColor)) return false;
    return getConvertingCells(cells, adjacentPieceColor);
}

function checkEast(xIndex,yIndex) {
    let cells = getDirectionCoordinates(xIndex,yIndex,1,0);
    let adjacentCell = document.querySelector(`#${cells[0]}`);
    let adjacentPieceColor = checkPieceColor(adjacentCell);

    if (checkConvertPotential(adjacentPieceColor)) return false;
    return getConvertingCells(cells, adjacentPieceColor);
}

function checkSouthEast(xIndex,yIndex){
    let cells = getDirectionCoordinates(xIndex,yIndex,1,1);
    let adjacentCell = document.querySelector(`#${cells[0]}`);
    let adjacentPieceColor = checkPieceColor(adjacentCell);

    if (checkConvertPotential(adjacentPieceColor)) return false;
    return getConvertingCells(cells, adjacentPieceColor);
}

function checkSouth(xIndex,yIndex){
    let cells = getDirectionCoordinates(xIndex,yIndex,0,1);
    let adjacentCell = document.querySelector(`#${cells[0]}`);
    let adjacentPieceColor = checkPieceColor(adjacentCell);

    if (checkConvertPotential(adjacentPieceColor)) return false;
    return getConvertingCells(cells, adjacentPieceColor);
}

function checkSouthWest(xIndex,yIndex) {
    let cells = getDirectionCoordinates(xIndex,yIndex,-1,1);
    let adjacentCell = document.querySelector(`#${cells[0]}`);
    let adjacentPieceColor = checkPieceColor(adjacentCell);

    if (checkConvertPotential(adjacentPieceColor)) return false;
    return getConvertingCells(cells, adjacentPieceColor);
}

function checkWest(xIndex,yIndex) {
    let cells = getDirectionCoordinates(xIndex,yIndex,-1,0);
    let adjacentCell = document.querySelector(`#${cells[0]}`);
    let adjacentPieceColor = checkPieceColor(adjacentCell);

    if (checkConvertPotential(adjacentPieceColor)) return false;
    return getConvertingCells(cells, adjacentPieceColor);
}

function checkNorthWest(xIndex,yIndex) {
    let cells = getDirectionCoordinates(xIndex,yIndex,-1,-1);
    let adjacentCell = document.querySelector(`#${cells[0]}`);
    let adjacentPieceColor = checkPieceColor(adjacentCell);

    if (checkConvertPotential(adjacentPieceColor)) return false;
    return getConvertingCells(cells, adjacentPieceColor);
}

function getDirectionCoordinates(xIndex,yIndex,xIncrement,yIncrement) {
    let coordArr = [];

    if(xIncrement === 0){
        while (yIndex >= 0 && yIndex < Y.length){
            yIndex += yIncrement;
            let coord = `${Y[yIndex]}${X[xIndex]}`
            coordArr.push(coord);
        }
    }else if (yIncrement === 0) {
        while (xIndex >= 0 && xIndex < X.length){
            xIndex += xIncrement;
            let coord = `${Y[yIndex]}${X[xIndex]}`
            coordArr.push(coord);
        }
    }else{
        while((yIndex >= 0 && yIndex < Y.length) && (xIndex >= 0 && xIndex < X.length)){
            xIndex += xIncrement;
            yIndex += yIncrement;
            let coord = `${Y[yIndex]}${X[xIndex]}`
            coordArr.push(coord);
        }
    }

    return coordArr;
}

//Checks whether cell is occupied
function checkOccupied(cell){
    if(cell.querySelector("img")) return true;
    else return false;
}

function checkPieceColor(cell){
    if(cell === null || !checkOccupied(cell)) return undefined;

    let piece = cell.querySelector("img");
    let pieceSrc = piece.src;

    if(pieceSrc.includes("black")) return "black";
    else if (pieceSrc.includes("white")) return "white";
}

//No convert potential if adjacent piece is empty or player's own color
function checkConvertPotential(adjacentPieceColor) {
    return adjacentPieceColor == undefined || reversiGame.black_turn && adjacentPieceColor === "black" || !reversiGame.black_turn && adjacentPieceColor === "white";
}

function getConvertingCells(cells,adjacentPieceColor) {
    for (let i = 1; i < cells.length; i++) {
        let cell = document.querySelector(`#${cells[i]}`)
        let pieceColor = checkPieceColor(cell);

        if (pieceColor === undefined) break;
        else if(pieceColor !== adjacentPieceColor){
            return cells.slice(0,i);
        }
    }
    return false;
}

//Fetch convertable lines, turns the array into a 1D array as well
function getConvertLines(coordinates){
    let validMovesArr;
    let validMovesSingleArr = [];
    for (let i = 0; i < validMovesInfo.validMoves.length; i++) {
        if(validMovesInfo.validMoves[i].coords === coordinates) validMovesArr = validMovesInfo.validMoves[i].validLines;
    }

    for (let i = 0; i < validMovesArr.length; i++) {
        let line = validMovesArr[i];
        for (let j = 0; j < line.length; j++) {
            let coords = line[j];
            validMovesSingleArr.push(coords);
        }
    }
    return validMovesSingleArr;
}

function convertLines(convLines){
    for (let i = 0; i < convLines.length; i++) {
        let cell = document.querySelector(`#${convLines[i]}`);
        let image = cell.querySelector("img");
        image.src = pieceSrc(reversiGame.black_turn);
    }
}

/*
function convertPieces(cells){
    for (let i = 0; i < cells.length; i++) {
        let cell = document.querySelector(`#${cells[i]}`);
        let image = cell.querySelector("img");
        image.src = pieceSrc(reversiGame.black_turn);

    }
}
*/

/*
if(cell.id === "F4"){
    console.log(statusN);
    console.log(statusNE);
    console.log(statusE);
    console.log(statusSE);
    console.log(statusS);
    console.log(statusSW);
    console.log(statusW);
    console.log(statusNW);
}
*/
