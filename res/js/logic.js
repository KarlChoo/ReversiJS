const ALL_CELLS = document.querySelector(BOARD_DIV).querySelectorAll("td");


/*

HINT LOGIC

*/
function calculateValidMoves(){
    let validMovesArr = [];
    /*
    ALL_CELLS.forEach((cell, i) => {
        let coords = cell.id;
        let x = parseInt(coords.slice(-1));
        let y = coords.slice(0,1);
        let xIndex = X.indexOf(x);
        let yIndex = Y.indexOf(y);


    });
    */
}

function showPlacementHints(){
    console.log(ALL_CELLS);
}


let VALID_FLAG = false;
let CONVERTED_PIECES_COORDS = [];




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
        statusN = checkAdjacentNorth(xIndex,yIndex);
    yIndex <= 1 ? "" :  xIndex >= 6 ? "" :
        statusNE = checkAdjacentNorthEast(xIndex,yIndex);
    xIndex >= 6 ? "" :
        statusE = checkAdjacentEast(xIndex,yIndex);
    yIndex >= 6 ? "" : xIndex >= 6 ? "" :
        statusSE = checkAdjacentSouthEast(xIndex,yIndex);
    yIndex >= 6 ? "" :
        statusS = checkAdjacentSouth(xIndex,yIndex);
    xIndex <= 1 ? "" : yIndex >= 6 ? "" :
        statusSW = checkAdjacentSouthWest(xIndex,yIndex);
    xIndex <= 1 ? "" :
        statusW = checkAdjacentWest(xIndex,yIndex);
    xIndex <= 1 ? "" : yIndex <= 1 ? "" :
        statusNW = checkAdjacentNorthWest(xIndex,yIndex);



    return VALID_FLAG;
    //Return array containing true false and another array with the valid directions
}

function checkAdjacentNorth(xIndex,yIndex) {
    let cells = getDirectionCoordinates(xIndex,yIndex,0,-1);
    let adjacentCell = document.querySelector(`#${cells[0]}`);
    let adjacentPieceColor = checkPieceColor(adjacentCell);

    if (checkConvertPotential(adjacentPieceColor)) return;
    checkCovert(cells, adjacentPieceColor);
}

function checkAdjacentNorthEast(xIndex,yIndex) {
    let cells = getDirectionCoordinates(xIndex,yIndex,1,-1);
    let adjacentCell = document.querySelector(`#${cells[0]}`);
    let adjacentPieceColor = checkPieceColor(adjacentCell);

    if (checkConvertPotential(adjacentPieceColor)) return;
    checkCovert(cells, adjacentPieceColor);
}

function checkAdjacentEast(xIndex,yIndex) {
    let cells = getDirectionCoordinates(xIndex,yIndex,1,0);
    let adjacentCell = document.querySelector(`#${cells[0]}`);
    let adjacentPieceColor = checkPieceColor(adjacentCell);

    if (checkConvertPotential(adjacentPieceColor)) return;
    checkCovert(cells, adjacentPieceColor);
}

function checkAdjacentSouthEast(xIndex,yIndex){
    let cells = getDirectionCoordinates(xIndex,yIndex,1,1);
    let adjacentCell = document.querySelector(`#${cells[0]}`);
    let adjacentPieceColor = checkPieceColor(adjacentCell);

    if (checkConvertPotential(adjacentPieceColor)) return;
    checkCovert(cells, adjacentPieceColor);
}

function checkAdjacentSouth(xIndex,yIndex){
    let cells = getDirectionCoordinates(xIndex,yIndex,0,1);
    let adjacentCell = document.querySelector(`#${cells[0]}`);
    let adjacentPieceColor = checkPieceColor(adjacentCell);

    if (checkConvertPotential(adjacentPieceColor)) return;
    checkCovert(cells, adjacentPieceColor);
}

function checkAdjacentSouthWest(xIndex,yIndex) {
    let cells = getDirectionCoordinates(xIndex,yIndex,-1,1);
    let adjacentCell = document.querySelector(`#${cells[0]}`);
    let adjacentPieceColor = checkPieceColor(adjacentCell);

    if (checkConvertPotential(adjacentPieceColor)) return;
    checkCovert(cells, adjacentPieceColor);
}

function checkAdjacentWest(xIndex,yIndex) {
    let cells = getDirectionCoordinates(xIndex,yIndex,-1,0);
    let adjacentCell = document.querySelector(`#${cells[0]}`);
    let adjacentPieceColor = checkPieceColor(adjacentCell);

    if (checkConvertPotential(adjacentPieceColor)) return;
    checkCovert(cells, adjacentPieceColor);
}

function checkAdjacentNorthWest(xIndex,yIndex) {
    let cells = getDirectionCoordinates(xIndex,yIndex,-1,-1);
    let adjacentCell = document.querySelector(`#${cells[0]}`);
    let adjacentPieceColor = checkPieceColor(adjacentCell);

    if (checkConvertPotential(adjacentPieceColor)) return;
    checkCovert(cells, adjacentPieceColor);
}

function convertLines(){
    //loop throught valid directions
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

function checkCovert(cells,adjacentPieceColor) {
    for (let i = 1; i < cells.length; i++) {
        let cell = document.querySelector(`#${cells[i]}`)
        let pieceColor = checkPieceColor(cell);

        if (pieceColor === undefined) break;
        else if(pieceColor !== adjacentPieceColor){
            convertPieces(cells, i);
            VALID_FLAG = true;
            break;
        }
    }
}

function convertPieces(cells,lastIndex){
    for (let i = 0; i < lastIndex; i++) {
        let cell = document.querySelector(`#${cells[i]}`);
        let image = cell.querySelector("img");
        image.src = pieceSrc(reversiGame.black_turn);

        CONVERTED_PIECES_COORDS.push(cell.id);
    }
}
