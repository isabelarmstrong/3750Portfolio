import { useState } from "react";

function Square({value, onSquareClick}){
    /*
    const [value, setValue] = useState(null); //smth like a C++ class. Default state for a square is null
    
    
    function handleClick(){
        setValue("X"); //change the state for the clicked square
    }
    */

    return (
        <button 
        className="square"
        onClick={onSquareClick} //here, renders the passed in funct 
        >{value}</button>

    );
}

export default function Board(){ //default component of App component.
    const [xIsNext, setXIsNext] = useState(true);
    const [squares, setSquares] = useState(Array(9).fill(null)); //state for the board

    function handleClick(i){ //passed in funct
        if (squares[i] || calculateWinner(squares)){ //check if the square clicked is not null.
            return; //if it is, just return.
        }

        //If null, continue
        const nextSquares = squares.slice(); //makes a copy of the arr
        if (xIsNext){
            nextSquares[i] = "X"; //updates the i-th index of the copy to hold X
        } else{
            nextSquares[i] = "O";
        }
        setSquares(nextSquares); //setter says "heres your new 9 element arr to use"
        setXIsNext(!xIsNext); //set the bool to the opposite of itsself
    }
    
    const winner = calculateWinner(squares);
    let status;
    if (winner){
        status = "Winner: " + winner;
    } else {
        status = "Next player: " + (xIsNext ? "X" : "O");
    }

    return ( //This parent component passes in the address of the funct to Square(). () => says that this is not a function we are not calling. It is actually a function we are passing.
    <>
        <div className="status">{status}</div>
        <div className="board-row">
            <Square value={squares[0]} onSquareClick={() => handleClick(0)}/>
            <Square value={squares[1]} onSquareClick={() => handleClick(1)}/>
            <Square value={squares[2]} onSquareClick={() => handleClick(2)}/>
        </div>
        <div className="board-row">
            <Square value={squares[3]} onSquareClick={() => handleClick(3)}/>
            <Square value={squares[4]} onSquareClick={() => handleClick(4)}/>
            <Square value={squares[5]} onSquareClick={() => handleClick(5)}/>
        </div>
        <div className="board-row">
            <Square value={squares[6]} onSquareClick={() => handleClick(6)}/>
            <Square value={squares[7]} onSquareClick={() => handleClick(7)}/>
            <Square value={squares[8]} onSquareClick={() => handleClick(8)}/>
        </div>
    </>
    );
}

function calculateWinner(squares) {
    const lines = [
      [0, 1, 2], //rows
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6], //columns
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8], //diagnol
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) { //loop through each line
      const [a, b, c] = lines[i]; //unpack and grab the individual components for each line
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) { //then check to see that the data at square a is not null, then check to see if the second and third elements match the state of square a
        return squares[a]; //If so, return the winner
      }
    }
    return null; //no winner
  }