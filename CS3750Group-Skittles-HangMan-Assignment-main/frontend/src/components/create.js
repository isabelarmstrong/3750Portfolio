import React, { useState } from "react";
import { useNavigate } from "react-router";

export default function Create() {
    const [form, setForm] = useState({
        name: "",
    });

    const navigate = useNavigate();

    function updateForm(jsonObj) {
        return setForm((prevJsonObj) => {
            return { ...prevJsonObj, ...jsonObj};
        });
    }

    async function onSubmit(e) {
        e.preventDefault();

        //check to make sure field is filled
        if ( form.name === ""){
            window.alert(`An error occurred. Please check and ensure all fields are filled.`);
            return;
        }

        //try searching for person first
        const responsePerson = await fetch(`http://localhost:4000/user/${form.name}`, 
        {
            method: "GET",
            credentials: 'include'
        }).catch(error => {
            window.alert(error);
            return;
        });

        const personResponse = await responsePerson.json();

        console.log("Checked for person!");

        //if no person, create a new entry in database
        if (personResponse.length === 0) { 
            console.log("Creating new user");

            const newPerson = { ...form};
            await fetch(`http://localhost:4000/add/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newPerson),
            })
            .catch(error => {
                window.alert(error);
                return;
            });
        }

        console.log("Creating new session!");
        const sessionResponse = await fetch(`http://localhost:4000/session_set/${form.name}`,
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
        console.log("All is good!");
        //Add the new person to the database
        
        setForm({ name: "" });

        navigate("/game");
    }

    return(
        <div>
            <h3>Create Record</h3>
            <form onSubmit={onSubmit}> 
                <div>
                    <label>Name: </label>
                    <input 
                        type="text"
                        id="name"
                        value={form.name}
                        onChange={(e) => updateForm({ name: e.target.value})}
                    />
                </div>
    
                <br/>
                <div>
                    <input
                        type="submit"
                        value="Create Record"
                    />
                </div>
            </form>
        </div>
    );
}