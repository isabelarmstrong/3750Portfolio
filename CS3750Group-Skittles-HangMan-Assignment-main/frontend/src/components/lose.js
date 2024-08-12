import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// One react component for the entire table (Records)
// another React component for each row of the result set (Record)

export default function Lose() {
    const navigate = useNavigate();

    async function onQuit(e){
        //destroy session
        e.preventDefault(); //Don't do the default reaction of reloading the page

        const sessionResponse = await fetch(`http://localhost:4000/session_delete`,
            {
                method: "GET",
                credentials: 'include'
            }
        ).catch(error => {
            window.alert(error);
            return;
        });

        console.log("Checking response!");

        if (!sessionResponse.ok){
            const message = `An error occurred: ${sessionResponse.statusText}`;
            window.alert(message);
            return;
        }
         
        //navigate to create user
        navigate("/");
    }

    async function onContinue(e){
        e.preventDefault();

        //nav to new game page
        navigate("/game");
    }

    return (
        <div>
            <h3>You Lost!</h3>
            <button onClick={(e) => onQuit(e)}>Quit Game</button>
            <button onClick={(e) => onContinue(e)}>Try again</button>
        </div>
    );
}