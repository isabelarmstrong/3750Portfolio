import { useState } from "react";

function Square({value, x, y}){
    return (
        <button 
        className="square"
        x={x}
        y={y}
        >{value}</button>
    );
}

export default function Board(){
    let status;
    const [xIsNext, setXIsNext] = useState(true);
    const [squares, setSquares] = useState([
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
    ]);

    function handleClick(e){
        if (winner){
            return;
        }

        const col = e.target.getAttribute('x'); //Get the column number

        //grab the row num
        let row = squares.findIndex((rowArr, idx) => { //find the bottom most square that will be taken in a specific col
            return (rowArr[col] || (idx === squares.length - 1));
            //return true if the square is not taken/if it is the bottom of the board for that col
        });

        //Go up one row if the square at the bottom most spot isn't empty
        if (row != squares.length-1 || squares[row][col] !== null){ row -= 1; }     

        const boardCopy = squares.slice(); //make a copy

        //check to make sure that the row selected is not already taken at the top
        if (boardCopy[row]){
            boardCopy[row][col] = (xIsNext ? "X" : "O"); //add the value to that copy
            setSquares(boardCopy); //return that copy to the setBoard

            setXIsNext(!xIsNext);
        }
    }
    
    //display next player at the top/winner or tie if there is one
    let currPlayer = (!xIsNext ? "X" : "O");
    const winner = calculateWinner(squares, currPlayer);
    if (winner){
        if (winner === "tie"){
            status = "Tie!";
        } else {
            status = "Winner: " + winner;
        }
    } else {
        status = "Next player: " + (xIsNext ? "X" : "O");
    }

    //render squares
    return (
        <>
            <div className="status">{status}</div>

            <div className="board" onClick={handleClick}>
                {squares.map((row, y) => {
                    return row.map((value, x) => {
                       return <Square value={value} y={y} x={x} />
                    });
                })}
            </div>
        </>
    );
}

function calculateWinner(squares, value){
    const rows = 6;
    const cols = 7;
    let count = 0;

    //Horizontal win
    for (let i = 0; i < rows; i++){
        for (let j = 0; j < cols; j++){
            if (squares[i][j] === value){
                count++;
                if (count >= 4){
                    return value;
                }
            } else{
                count = 0;
            }
        }
    }

    //Vertical Win
    for (let i = 0; i < cols; i++){
        for (let j = 0; j < rows; j++){
            if (squares[j][i] === value){
                count++;
                if (count >= 4){
                    return value;
                }
            } else{
                count = 0;
            }
        }
    }

    //Diagonal win
    let lines = [
        [-1, -1],
        [0, -1],
        [1, -1],
        [1, 0],
    ];

    for (let i = 0; i < lines.length; i++){ //for every direction
        let [a, b] = lines[i];

        for (let j = 0; j < rows; j++){ //for every row and col in this direction
            for (let k = 0; k < cols; k++){
                let la = j + 3*a;
                let lb = k + 3*b;

                if (0 <= la && la < rows && 0 <= lb && lb < cols) { //check if the next 3 elements are the same

                    if (squares[j][k] && squares[j][k] === squares[la][lb] && squares[j][k] === squares[j+a][k+b] && squares[j][k] === squares[j+2*a][k+2*b] ) {
                        return value;
                    }
                }
            }
        }
    }

    //Check for tie
    for (let i = 0; i < rows; i++){
        for (let j = 0; j < cols; j++){
            if (squares[i][j] !== null){
                count++;
                if (count >= 42){
                    return "tie";
                }
            } 
        }
    }

    return null;
}