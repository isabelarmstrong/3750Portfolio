import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Scores = (props) => (
    <tr>
      <td>{props.topScores.name}</td>
      <td>{props.topScores.numberOfGuesses}</td>
      <td>{props.topScores.wordLength}</td>
    </tr>
   );


const Win = ({ numberOfGuesses, wordLength }) => {
    const [topScores, setTopScores] = useState([]);
    const [playerName, setName] = useState('');
    const navigate = useNavigate();

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const letters = searchParams.get("letters");
    const guesses = searchParams.get("guesses");

    
    

    useEffect(() => {
        async function fetchTopScores() {
            try {
                console.log("Fetching top scores for word length:", letters);
                const response = await fetch(`http://localhost:4000/highScore/${letters}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch top scores");
                }
                const scores = await response.json();
                console.log("Fetched scores:", scores); 
                setTopScores(scores);
            } catch (error) {
                console.error("Error fetching top scores:", error.message);
            }
        }

        async function getName() {
            try {
              const response = await fetch(`http://localhost:4000/session_get/`, {
                method: "GET",
                credentials: 'include'
              });
      
              if (!response.ok) {
                throw new Error("Failed to fetch username");
              }
      
              const sessionResponse = await response.json();
              setName(sessionResponse.username);
            } catch (error) {
              console.error("Error fetching username:", error.message);
            }
        }
      
        getName();
        fetchTopScores();
    }, [wordLength]);

    

    function renderScores() {
        return topScores.map((score) => {
            return (
            <Scores
                topScores={score}
                key={score._id}
            />
            );
        });
    }

    async function onQuit(e){
        e.preventDefault();

        // Destroy session if needed
        const sessionResponse = await fetch(`http://localhost:4000/session_delete`, {
            method: "GET",
            credentials: 'include'
        }).catch(error => {
            window.alert(error);
            return;
        });

        if (!sessionResponse.ok){
            const message = `An error occurred: ${sessionResponse.statusText}`;
            window.alert(message);
            return;
        }
         
        // Navigate to create user or other page as needed
        navigate("/");
    }

    async function onContinue(e){
        e.preventDefault();

        // Navigate to new game page or other page as needed
        navigate("/game");
    }


    return (
        <div>
            <h1>Congratulations, {playerName}!</h1>
            <p>You guessed the word with {guesses} guesses.</p>
            <h2>Top Scores for {letters}-letter words:</h2>
            <table className="table table-striped" style={{ marginTop: 20 }}>
                <thead>
                    <tr>
                    <th>Name</th>
                    <th>Number of Guesses</th>
                    <th>Word Length</th>
                    </tr>
                </thead>
                <tbody>{renderScores()}</tbody>
            </table>
            <button onClick={onContinue}>Try again</button>
            <button onClick={onQuit}>Quit Game</button>
        </div>
    );
};

export default Win;


