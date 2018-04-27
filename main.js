(function() {
const cells = []

function lose() {
    for(let r = 0; r < cells.length; r++) {
        for(let c = 0; c < cells[0].length; c++) {
            cells[r][c].element.removeEventListener("click", cells[r][c].onClickFunction);
            if(!cells[r][c].mine) {
                cells[r][c].element.classList.add("openCell");
            } else {
                cells[r][c].element.classList.add("openMine");
                cells[r][c].element.innerHTML = "X"
            }
            
        }
    } 

    for(let r = 0; r < cells.length; r++) {
        for(let c = 0; c < cells[0].length; c++) {
            cells[r][c].element.removeEventListener("click", cells[r][c].onClickFunction)
        }
    }

}

const getCellString = (cell) => {
    return cell.row.toString() + "," + cell.col.toString()
}

function openCell(row, col) {
    checkedCells = {
        [row.toString() + "," + col.toString()]: true
    }
    cellStack = [cells[row][col]]
    while(cellStack.length) {
        const cell = cellStack.pop()
        cell.element.classList.add("openCell");
        const numBorderingMines = getNumberOfBorderingMines(cell.row, cell.col)
        
        if(numBorderingMines === 0) {
            for(neighbor of getNeighbors(cell.row, cell.col)) {
                if(!checkedCells[neighbor.row.toString() + "," + neighbor.col.toString()]){
                    cellStack.push(neighbor);
                    checkedCells[neighbor.row.toString() + "," + neighbor.col.toString()] = true
                }
            }
        }
        else {
            cell.element.innerHTML = numBorderingMines
        }
    }
    
}

function getNeighbors(row, col) {
    function getNeighbor(r, c) {
        try {
            if(cells[r][c].element && !(row == r && col == c)) {
                return cells[r][c]
            }
            return false
        } catch (error) {
            return false;
        }
    }

    let neighbors = []
    
    for(let i = row - 1; i <= row + 1; i++){
        for(let j = col - 1; j <= col + 1; j++){
            if(getNeighbor(i, j)) {
                neighbors.push(getNeighbor(i, j))
            }
        }
    }
    return neighbors
}

function getNumberOfBorderingMines(row, col) {
    function isMine(r, c) {
        try {
            if(cells[r][c].mine) {
                return true
            }
            return false
        } catch (error) {
            return false;
        }
    }

    let neighbors = 0
    
    for(let i = row - 1; i <= row + 1; i++){
        for(let j = col - 1; j <= col + 1; j++){
            if(isMine(i, j)) {
                neighbors++;
            }
        }
    }
    return neighbors
}

const cellClick = (row, col) => () => {
    if(cells[row][col].mine) {
        lose()
    } else {
        openCell(row, col)
    }
}

const generateGrid = (rows, columns, mines, element) => {
    const cellGrid = createBoard(rows,columns);
    placeMines(rows, columns, mines);
    element.appendChild(cellGrid);
}

const makeCell = (row, col) => {
    const cell = document.createElement("div");
    cell.classList.add("cell")
    eventHandler = cellClick(row, col)
    cell.addEventListener("click", eventHandler)
    return {
        "row": row,
        "col": col,
        "element": cell,
        "mine": false,
        "onClickFunction": eventHandler
    };
}

function createBoard(rows,cols) {
    const container = document.createElement("div");
    for(let row = 0; row < rows; row++) {
        const rowContainer = document.createElement("div");
        rowContainer.classList.add("boardRow")
        cells[row] = []
        for(let col = 0; col < cols; col++) {
            cell = makeCell(row, col)
            cells[row][col] =  cell;
            rowContainer.appendChild(cell.element); 
        }
        container.appendChild(rowContainer);
    }
    return container;
}


function placeMines(rows, cols, mines) {
    const numbers = []
    while(numbers.length < mines){
        const randomnumber = Math.floor(Math.random()*rows*cols);
        if(numbers.indexOf(randomnumber) > -1) continue;
        numbers[numbers.length] = randomnumber;
    }
    for(number of numbers) {
        cells[Math.floor(number / rows)][number % cols].mine = true;
    }
}

const reset = () => {
    board = document.getElementById("board")
    while(board.firstChild) {
        board.removeChild(board.firstChild)
    }
    const inputs = getInputs()
    generateGrid(inputs.rows, inputs.cols, inputs.mines, board)

}

const getInputs = () => { return {
        "rows": parseInt(document.getElementById("rowInput").value),
        "cols": parseInt(document.getElementById("colInput").value),
        "mines": parseInt(document.getElementById("mineInput").value)
}}

document.getElementById("resetButton").addEventListener("click", reset)
const inputs = getInputs();
generateGrid(inputs.rows, inputs.cols, inputs.mines, document.getElementById("board"))
})()
