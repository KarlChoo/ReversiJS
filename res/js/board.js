//GAME STATUS
const BOARD_SIZE = 560; //Width and height of board
const CELL_WIDTH = BOARD_SIZE/8; //Width of each cell
const CELL_HEIGHT = CELL_WIDTH; //Height of each cell
const COLUMNS = 8;
const Y = ["A","B","C","D","E","F","G","H"];
const X = [1,2,3,4,5,6,7,8];
const YCOORD_WIDTH = 20; //Width of Y coods
const YCOORD_RIGHT_MARGIN = 5; //Margin to the right of Y coords

//Generates the X coordinates
function genXCoords() {
    let table =  document.createElement("table");
    table.setAttribute("id","xcoord");
    table.style.width = `${BOARD_SIZE}px`;
    table.style.textAlign = "center";
    table.style.marginLeft = `${YCOORD_WIDTH + YCOORD_RIGHT_MARGIN}px`;
    let row = table.insertRow(i);
    for (var i = 0; i < COLUMNS; i++) {
         let cell = row.insertCell(i);
         cell.innerHTML = X[i];
         cell.style.width = `${CELL_WIDTH}px`;
    }
    document.querySelector("#xcoordtemplate").appendChild(table);
}

//Generates the Y coordinates
function genYCoords() {
  let table =  document.createElement("table");
  table.setAttribute("id","ycoord");
  table.style.height = `${BOARD_SIZE}px`;
  table.style.width = `${YCOORD_WIDTH}px`;
  table.style.marginRight = `${YCOORD_RIGHT_MARGIN}px`;
  table.style.verticalAlign = "center";
  for (let i = 0; i < COLUMNS; i++) {
      let row = table.insertRow(i);
      for (var j = 0; j < 1; j++) {
           let cell = row.insertCell(j);
           cell.style.height = `${CELL_HEIGHT}px`;
           cell.innerHTML = Y[i];
      }
  }
  document.querySelector("#container").appendChild(table);
}

//Generates the board
function generateBoard(){
    let div = document.createElement("div");
    div.setAttribute("id","board-container");
    div.style.width =  `${BOARD_SIZE}px`;
    div.style.height = `${BOARD_SIZE+2}px`;
    document.querySelector("#container").appendChild(div);

    //Table element
    let table =  document.createElement("table");
    table.setAttribute("id","board");
    table.style.width = table.style.height = `${BOARD_SIZE}px`;
    for (let i = 0; i < COLUMNS; i++) {
        let row = table.insertRow(i);
        for (var j = 0; j < COLUMNS; j++) {
             let cell = row.insertCell(j);
             cell.setAttribute("id",Y[i] + X[j]);
             cell.setAttribute('onclick', "playerMove(this);");
             cell.style.width = `${CELL_WIDTH}px`;
             cell.style.height = `${CELL_HEIGHT}px`;
        }
    }
    document.querySelector("#board-container").appendChild(table);
}

//Generate the menu
function generateMenu(){
    document.querySelector("#container").innerHTML +=
    `<div class="text-center card bg-dark text-light ml-3 pl-3 pr-3 pt-2 container-fluid" style="width:400px">
        <h3>Menu</h3>
        <div class="row">
            <div class="col-6"><button class="btn btn-success btn-block" type="button" id="startBtn">Start</button></div>
            <div class="col-6"><button class="btn btn-danger btn-block" type="button" id="resetBtn">Reset Game</button></div>
        </div>
        <p class="mt-3">Move Log</p>
        <select multiple class="form-control" id="gameLog">
        </select>

        <button class="btn btn-warning mt-3 mb-3" type="button" id="undoBtn">Undo</button>

        <h5>Black: <span id="blackScoreDisplay">0</span></h5>
        <h5>White: <span id="whiteScoreDisplay">0</span></h5>

        <div id="turnMessage" class="alert alert-primary" role="alert" style="bottom: 0px;">
            Welcome to Reversi!
        </div>
        <div id="systemStatus" class="alert alert-danger" role="alert" style="bottom: 0px;">
            Welcome to Reversi!
        </div>
    </div>`;
}

genXCoords();
genYCoords();
generateBoard();
generateMenu();
