let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let originalGrid = [
    ["0", "0", "4", "0", "5", "0", "0", "0", "0"],
    ["9", "0", "0", "7", "3", "4", "6", "0", "0"],
    ["0", "0", "3", "0", "2", "1", "0", "4", "9"],
    ["0", "3", "5", "0", "9", "0", "4", "8", "0"],
    ["0", "9", "0", "0", "0", "0", "0", "3", "0"],
    ["0", "7", "6", "0", "1", "0", "9", "2", "0"],
    ["3", "1", "0", "9", "7", "0", "2", "0", "0"],
    ["0", "0", "9", "1", "8", "2", "0", "0", "3"],
    ["0", "0", "0", "0", "6", "0", "1", "0", "0"]
  ];
let grid = [
    ["0", "0", "4", "0", "5", "0", "0", "0", "0"],
    ["9", "0", "0", "7", "3", "4", "6", "0", "0"],
    ["0", "0", "3", "0", "2", "1", "0", "4", "9"],
    ["0", "3", "5", "0", "9", "0", "4", "8", "0"],
    ["0", "9", "0", "0", "0", "0", "0", "3", "0"],
    ["0", "7", "6", "0", "1", "0", "9", "2", "0"],
    ["3", "1", "0", "9", "7", "0", "2", "0", "0"],
    ["0", "0", "9", "1", "8", "2", "0", "0", "3"],
    ["0", "0", "0", "0", "6", "0", "1", "0", "0"]
  ];
let solutionGrid = [
    ["0", "0", "4", "0", "5", "0", "0", "0", "0"],
    ["9", "0", "0", "7", "3", "4", "6", "0", "0"],
    ["0", "0", "3", "0", "2", "1", "0", "4", "9"],
    ["0", "3", "5", "0", "9", "0", "4", "8", "0"],
    ["0", "9", "0", "0", "0", "0", "0", "3", "0"],
    ["0", "7", "6", "0", "1", "0", "9", "2", "0"],
    ["3", "1", "0", "9", "7", "0", "2", "0", "0"],
    ["0", "0", "9", "1", "8", "2", "0", "0", "3"],
    ["0", "0", "0", "0", "6", "0", "1", "0", "0"]
  ];
  
let gridSize;
let cellSize;
let xOffset;
let yOffset;
let canvasOffset;
let selectedCell = [-1, -1];

function Draw() {
    parent_bb = canvas.parentElement.getBoundingClientRect();
    window_bb = document.getElementsByTagName("body")[0].getBoundingClientRect();
    canvas.width = parent_bb.width;
    canvas.height = parent_bb.height;

    let min = Math.min(canvas.width, canvas.height);
    gridSize = min*0.8;
    cellSize = gridSize/9;
    xOffset = (canvas.width - gridSize)/2;
    yOffset = (canvas.height - gridSize)/2;
    canvasOffset = window_bb.width - canvas.width;

    ctx.fillStyle = "#271136";
    ctx.fillRect(xOffset, yOffset, gridSize, gridSize);
    if(!(selectedCell[0] == -1 && selectedCell[1] == -1)){
        ctx.fillStyle = "#8E58B1";
        console.log(selectedCell[0], selectedCell[1]);
        ctx.fillRect(
            xOffset + selectedCell[0]*cellSize,
            yOffset + selectedCell[1]*cellSize,
            cellSize,
            cellSize
        );
        console.log(xOffset + selectedCell[0]*cellSize,
            yOffset + selectedCell[1]*cellSize);
    }

    ctx.strokeStyle = "#57336E";

    ctx.lineWidth = 1;
    ctx.rect(xOffset, yOffset, gridSize, gridSize);
    ctx.stroke();
    for(let i = 0; i<9; i++) {
        ctx.beginPath();
        if(i%3 === 0 && i !== 0) {
            ctx.lineWidth = 4;
        }
        else {
            ctx.lineWidth = 1;
        }
        
        ctx.moveTo(xOffset+cellSize*i, yOffset);
        ctx.lineTo(xOffset+cellSize*i, yOffset+gridSize);
        ctx.moveTo(xOffset, yOffset+cellSize*i);
        ctx.lineTo(xOffset+gridSize, yOffset+cellSize*i);
        ctx.stroke();
    }

    let x, y, xCenter, yCenter, fontSize;
    fontSize = cellSize/2;
    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = "#B3B6C5";
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j] === "0") continue;
            xCenter = (cellSize - ctx.measureText(grid[i][j]).width)/2;
            yCenter = (7/8*cellSize - fontSize)/2 + fontSize;
            x = xOffset+xCenter+cellSize*j;
            y = yOffset+yCenter+cellSize*i;
            ctx.fillText(grid[i][j], x, y);
        }

    }
    
} 

canvas.addEventListener('click', (e) => {
    let x = e.clientX;
    let y = e.clientY;
    console.log(x, y);
    let xTotal = xOffset + canvasOffset/2 - 10;
    if (!(x > xTotal && x < (gridSize + xTotal))){
        return;
    }
    if(!(y > yOffset && y < (gridSize + yOffset))) {
        return;
    }
    let selectedCellX = Math.floor((x - xTotal)/cellSize);
    let selectedCellY = Math.floor((y - yOffset)/cellSize);
    selectedCell = [selectedCellX, selectedCellY];
    Draw();
});

Draw();
window.addEventListener("resize", Draw);

function isValid(number, row, col, board){
    for(let i = 0; i<grid.length; i++) {
        if(grid[row][i] === number || grid[i][col] === number) {
            return false;
        }
        //proverava 3x3 subgridove
        
        let startRow = Math.floor(row / 3) *3;
        let startCol = Math.floor(col / 3) *3;
        
        for(let i = startRow; i < startRow+3; i++) {
            for(let j = startCol; j < startCol+3; j++) {
                if(board[i][j] === number) {
                    return false;
                }
            }
        }
    }
    return true;
}

let possibleNumbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
var solve = function(grid) {
    let emptySpaces = [];
    
    for(let i = 0; i<grid.length; i++) {
        for(j = 0; j<board.length; j++) {
            if(grid[i][j] === "0") {
                emptySpaces.push({row: i, col: j});
            }
        }
    }

    function recurse(emptySpaceIndex) {
        if(emptySpaceIndex >= emptySpaces.length){
            return true;
        }

        const {row, col} = emptySpaces[emptySpaceIndex+1];

        for(let i = 0; i<possibleNumbers.length; i++) {
            let num = possibleNumbers[i];
            if(isValid(num,row,col,board)){
                board[row][col] = num;

                if(recurse(emptySpaceIndex+1)){
                    return true;
                }
                board[row][col] = "0";
            }
        }
        return false;
    }
    recurse(0);

    return grid;
}

//if(isValid() === true) {
  //  document.getElementById("solve-button").style.color = "#00ff00";}

function solve() {}
function hint() {}