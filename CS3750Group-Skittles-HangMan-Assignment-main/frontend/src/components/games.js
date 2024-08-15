import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Game() {
    const [word, setWordDetails] = useState("");
    const [numberOfLetters, setNumberOfLetters] = useState(0);
    const [totalGuesses, setTotalGuesses] = useState(0);
    const [correctGuesses, setCorrectGuesses] = useState([]);
    const [wrongGuesses, setWrongGuesses] = useState([]);
    const [currentGuess, setCurrentGuess] = useState("");
    const [message, setMessage] = useState("");
    const [guessesLeft, setGuessesLeft] = useState(6);
    const [playerName, setPlayerName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchPlayerName() {
            try {
                const response = await fetch("http://localhost:4000/session_get", {
                    method: "GET",
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch player name");
                }

                const data = await response.json();
                setPlayerName(data.username);
            } catch (error) {
                console.error("Error fetching player name:", error.message);
            }
        }

        fetchPlayerName();
    }, []);

    useEffect(() => {
        async function fetchRandomWord() {
            try {
                const response = await fetch("http://localhost:4000/randomWord", {
                    method: "GET",
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch word information");
                }

                const wordData = await response.json();
                setWordDetails(wordData.randomWord);
                setNumberOfLetters(wordData.wordLength);
                console.log(wordData.randomWord);
            } catch (error) {
                console.error("Error fetching word information:", error.message);
            }
        }

        async function fetchWrongGuesses() {
            try {
                const response = await fetch("http://localhost:4000/displayWrongGuesses", {
                    method: "GET",
                    credentials: "include",
                });

                if (response.ok) {
                    const wrongGuessesData = await response.json();
                    setWrongGuesses(wrongGuessesData);
                } else {
                    console.error("Failed to fetch wrong guesses");
                }
            } catch (error) {
                console.error("Error fetching wrong guesses:", error.message);
            }
        }

        fetchRandomWord();
        fetchWrongGuesses(); // Fetch wrong guesses when the component mounts
    }, [navigate]);

    const handleGuess = async () => {
        const guess = currentGuess.toLowerCase();

        if (!/^[a-z]$/.test(guess)) {
            setMessage("Please enter a single letter.");
            return;
        }

        // Check if the guess is already made (correct or wrong)
        const isRepeatedWrongGuess = await checkRepeatWrongGuess(guess);  
        const isRepeatedCorrectGuess = await checkRepeatCorrectGuess(guess);

        if (isRepeatedWrongGuess || isRepeatedCorrectGuess) {
            setMessage("You already guessed that letter.");
            return;
        }

        setTotalGuesses(totalGuesses + 1);

        // Check if the guess is correct
        if (word.includes(guess)) {
            // Determine number of occurrences of the guess in the word
            const occurrences = countOccurrences(guess);
            console.log(occurrences);

            // Add correct guess to backend and update state
            for (let i = 0; i < occurrences; i++) {
                await addCorrectGuess(guess);
            }

            // Update correct guesses state
            const newCorrectGuesses = [...correctGuesses, ...Array(occurrences).fill(guess)];
            setCorrectGuesses(newCorrectGuesses);
            setMessage("You got one right!");

            // Check if the game is won
            if (newCorrectGuesses.length === numberOfLetters) {
                await clearArrays();
                setMessage("You won!");
                navigate(`/win?letters=${numberOfLetters}&guesses=${totalGuesses}`);
                return; // Exit the function after winning
            }
        } else {
            // Add wrong guess to backend and update state
            await addWrongGuess(guess);
            const newWrongGuesses = [...wrongGuesses, guess];
            setWrongGuesses(newWrongGuesses);
            setGuessesLeft(guessesLeft - 1);
            setMessage("That letter isn't in this word :(");

            // Check if the game is lost
            if (guessesLeft - 1 === 0) {
                await handleGameOver(); // Handle game over scenario
                return; // Exit the function after losing
            }
        }

        setCurrentGuess("");
    };

    const handleGameOver = async () => {
        try {
    
            // Clear arrays and handle game over
            await clearArrays();
            setMessage("You lost!");
            navigate("/lose");
    
        } catch (error) {
            console.error("Error handling game over:", error.message);
        }
    };

    const checkRepeatWrongGuess = async (letter) => {
        try {
            const response = await fetch(`http://localhost:4000/wrongLetter/repeatGuess`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ letter }),
            });

            if (!response.ok) {
                throw new Error("Failed to check repeat wrong guess");
            }

            const data = await response.json();
            return data.letterExists;
        } catch (error) {
            console.error("Error checking repeat wrong guess:", error.message);
            return false; // Default to false if an error occurs
        }
    };

    const checkRepeatCorrectGuess = async (letter) => {
        try {
            const response = await fetch(`http://localhost:4000/correctLetter/repeatGuess`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ letter }),
            });

            if (!response.ok) {
                throw new Error("Failed to check repeat correct guess");
            }

            const data = await response.json();
            return data.letterExists;
        } catch (error) {
            console.error("Error checking repeat correct guess:", error.message);
            return false; // Default to false if an error occurs
        }
    };

    const addCorrectGuess = async (letter) => {
        await fetch(`http://localhost:4000/addCorrectGuess`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ letter }),
        });
    };

    const addWrongGuess = async (letter) => {
        await fetch(`http://localhost:4000/addWrongGuess`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ letter }),
        });
    };

    const clearArrays = async () => {
        await fetch(`http://localhost:4000/clearArray`, {
            method: "POST",
            credentials: "include",
        });
    };

    const countOccurrences = (letter) => {
        return word.split('').filter(char => char === letter).length;
    };

    const addHighScore = async (name, numberOfGuesses, wordLength) => {
        try {
            const response = await fetch("http://localhost:4000/addHighScore", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    numberOfGuesses,
                    wordLength,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to add high score");
            }
        } catch (error) {
            console.error("Error adding high score:", error.message);
        }
    };

    return (
        <div>
            <h1>Hangman Game</h1>
            <h3>Welcome, {playerName}!</h3>
            <p>Number of letters: {numberOfLetters}</p>
            <p>
                {Array.from({ length: numberOfLetters }).map((_, index) =>
                    correctGuesses.includes(word[index]) ? word[index] : "_"
                )}
            </p>
            <p>Guesses left: {guessesLeft}</p>
            <input
                type="text"
                value={currentGuess}
                onChange={(e) => setCurrentGuess(e.target.value.toLowerCase())}
                maxLength="1"
            />
            <button onClick={handleGuess}>Guess</button>
            <p>{message}</p>
            <p>Incorrect guesses: {wrongGuesses.join(", ")}</p>
        </div>
    );
}
