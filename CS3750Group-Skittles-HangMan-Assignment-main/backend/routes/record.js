const express = require("express");
 
// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();
 
// This will help us connect to the database
const dbo = require("../db/conn");
//const dbo2 = require("../db/words");
 
// This helps convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;


 
 //DELETE
// This section will help you add a new user
recordRoutes.route("/add").post(async (req, res) => {
    try{
        let db_connect = dbo.getDb();
        let myobj = {
        name: req.body.name,
        score: 0,
        };
        const result = db_connect.collection("users").insertOne(myobj);
        res.json(result);
    } catch(err){
        throw err;
    }
});

//search for a user
recordRoutes.route("/user/:name").get(async (req, res) => {
    try{
        console.log("in get account route");
        let db_connect = dbo.getDb();
        let name = req.params.name

        const result = await db_connect.collection("users").find({name: name}).project({_id: 0}).toArray();
        console.log(result);
        res.json(result);
    } catch(err){
        throw err;
    }
});

//Get the top 10 scores of a word length
recordRoutes.route("/highScore/:wordLength").get(async (req, res) => {
    try{
        console.log("in get top 10 highscore route");
        let db_connect = dbo.getDb();

        let query = {
            wordLength: parseInt(req.params.wordLength)
        };

        const result = await db_connect.collection("highScores").find(query).project({_id: 0}).sort({wordLength: -1}).limit(10).toArray();
        console.log(result);
        res.json(result);
    } catch(err){
        throw err;
    }
});

//Hangman Stuff!!!!!!!!!!
//-------------------------------------------------------------------------------------
// Route that selects a random word
// also returns the number of letters in the word
recordRoutes.route("/randomWord").get(async (req, res) => {
    try {
        let db_connect = dbo.getDb();

        // Find the document that contains the words array
        const wordsDocument = await db_connect.collection("words").findOne({});
        
        // Ensure wordsDocument and its array field exist
        if (!wordsDocument || !wordsDocument.listOfWords || wordsDocument.listOfWords.length === 0) {
            return res.status(404).json({ error: "Words document or listOfWords array not found or empty" });
        }
        
        // Generate a random index within the range of the listOfWords array length
        const randomIndex = Math.floor(Math.random() * wordsDocument.listOfWords.length);
        
        // Select the random word from the array
        const randomWord = wordsDocument.listOfWords[randomIndex];
        
        // Calculate the length of the random word
        const wordLength = randomWord.length;

        res.json({ randomWord, wordLength });

    } catch (err) {
        console.error("Error selecting random word:", err);
        res.status(500).send("Error selecting random word");
    }
});// get a random word

// Route to add a new wrong guess count
recordRoutes.route("/addWrongGuessCount").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        const { count } = req.body;

        if (typeof count !== 'number') {
            return res.status(400).json({ error: "Count must be a number" });
        }

        // Find the document that contains the wrong guess count
        const wrongGuessCountDocument = await db_connect.collection("wrongGuessCount").findOne({});

        if (!wrongGuessCountDocument) {
            // If document doesn't exist, create a new one
            await db_connect.collection("wrongGuessCount").insertOne({ wrongGuessCount: count });
        } else {
            // Update the document with the new count (overwrite existing)
            await db_connect.collection("wrongGuessCount").updateOne(
                {},
                { $set: { wrongGuessCount: count } }
            );
        }

        res.status(200).json({ message: "Count added successfully" });

    } catch (err) {
        console.error("Error adding count:", err);
        res.status(500).send("Error adding count");
    }
});


// Route to get the wrong guess count
recordRoutes.route("/getWrongGuessCount").get(async (req, res) => {
    try {
        let db_connect = dbo.getDb();

        // Find the document that contains the wrong guess count
        const wrongGuessCountDocument = await db_connect.collection("wrongGuessCount").findOne({});

        if (!wrongGuessCountDocument) {
            return res.status(404).json({ error: "Wrong guess count document not found" });
        }

        // Ensure the wrongGuessCount field exists and is a number
        if (typeof wrongGuessCountDocument.wrongGuessCount !== 'number') {
            return res.status(500).json({ error: "Wrong guess count field is missing or not a number" });
        }

        const count = wrongGuessCountDocument.wrongGuessCount;

        res.json({ count });
    } catch (err) {
        console.error("Error fetching wrong guess count:", err);
        res.status(500).send("Error fetching wrong guess count");
    }
});



//gets the stored wrong guess count
recordRoutes.route("/addWrongGuessCount").get(async (req, res) => {
    try {
        let db_connect = dbo.getDb();

        // Find the document that contains the incorrect guesses array
        const wrongGuessCountDocument = await db_connect.collection("wrongGuessCount").findOne({});

         // Ensure wrongGuessesDocument and its array field exist
         if (!wrongGuessCountDocument || !wrongGuessCountDocument.wrongGuessCount) {
            return res.status(404).json({ error: "Wrong guessCount document or wrongGuessCount array not found" });
        }

        // Add the count to the array
        wrongGuessCountDocument.wrongGuessCount.push(req.body.count);

        
        // Update the document with the new array of words
        const result = await db_connect.collection("wrongGuessCount").updateOne(
            {},
            { $set: { wrongGuessCount: wrongGuessCountDocument.wrongGuessCount } }
        );

        res.json(result);

    }catch(err) {
        console.error("Error adding count:", err);
        res.status(500).send("Error adding count");
    }
});

// Route to get the wrong guess count
recordRoutes.route("/getWrongGuessCount").get(async (req, res) => {
    try {
        let db_connect = dbo.getDb();

        // Find the document that contains the wrong guess count
        const wrongGuessCountDocument = await db_connect.collection("wrongGuessCount").findOne({ _id: "wrongGuessCount" });

        // Ensure the document exists
        if (!wrongGuessCountDocument) {
            return res.status(404).json({ error: "Wrong guess count document not found" });
        }

        // Ensure the count field exists and is a number
        if (typeof wrongGuessCountDocument.wrongGuessCount !== 'number') {
            return res.status(500).json({ error: "Wrong guess count field is missing or not a number" });
        }

        const count = wrongGuessCountDocument.wrongGuessCount;

        res.json({ count });
    } catch (err) {
        console.error("Error fetching wrong guess count:", err);
        res.status(500).send("Error fetching wrong guess count");
    }
});




//checks if a letter already exists in the array(user guesses the same WRONG letter)
recordRoutes.route("/wrongLetter/repeatGuess").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();

        // Get the letter from body
        const letter = req.body.letter;

        if (!letter) {
            return res.status(400).json({ error: "Letter is required" });
        }

        // Find the document that contains the incorrect guesses array
        const wrongGuessesDocument = await db_connect.collection("wrongGuesses").findOne({});

        // Ensure wrongGuessesDocument and its array field exist
        if (!wrongGuessesDocument || !wrongGuessesDocument.wrongGuesses) {
            return res.status(404).json({ error: "Wrong guesses document or wrongGuesses array not found" });
        }

        // Check if the letter already exists in the array
        const letterExists = wrongGuessesDocument.wrongGuesses.includes(letter);

        res.json({ letterExists });

    } catch (err) {
        console.error("Error checking for existing wrong guess:", err);
        res.status(500).send("Error checking for existing wrong letter");
    }
});


//checks if a letter already exists in the array(user guesses the same CORRECT letter)
recordRoutes.route("/correctLetter/repeatGuess").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();

        // Get the letter from body
        const letter = req.body.letter;

        if (!letter) {
            return res.status(400).json({ error: "Letter is required" });
        }

        // Find the document that contains the correct guesses array
        const correctGuessesDocument = await db_connect.collection("correctGuesses").findOne({});

        // Ensure correctGuessesDocument and its array field exist
        if (!correctGuessesDocument || !correctGuessesDocument.correctGuesses) {
            return res.status(404).json({ error: "Correct guesse document or correctGuesses array not found" });
        }

        // Check if the letter already exists in the array
        const letterExists = correctGuessesDocument.correctGuesses.includes(letter);

        res.json({ letterExists });

    } catch (err) {
        console.error("Error checking for existing wrong guess:", err);
        res.status(500).send("Error checking for existing wrong letter");
    }
});

//route that takes in wrong guess and stores them in wrongGuesses document
recordRoutes.route("/addWrongGuess").post(async (req, res ) => {
    try {
        let db_connect = dbo.getDb();

        // Find the document that contains the incorrect guesses array
        const wrongGuessesDocument = await db_connect.collection("wrongGuesses").findOne({});

         // Ensure wrongGuessesDocument and its array field exist
         if (!wrongGuessesDocument || !wrongGuessesDocument.wrongGuesses) {
            return res.status(404).json({ error: "Wrong guesses document or wrongGuesses array not found" });
        }

        // Add the new word to the array
        wrongGuessesDocument.wrongGuesses.push(req.body.letter);

        
        // Update the document with the new array of words
        const result = await db_connect.collection("wrongGuesses").updateOne(
            {},
            { $set: { wrongGuesses: wrongGuessesDocument.wrongGuesses } }
        );

        res.json(result);

    }catch(err) {
        console.error("Error adding letter:", err);
        res.status(500).send("Error adding letter");
    }
});

//route that takes in correct guess and stores them in correctGuesses document
recordRoutes.route("/addCorrectGuess").post(async (req, res ) => {
    try {
        let db_connect = dbo.getDb();

        // Find the document that contains the correct guesses array
        const correctGuessesDocument = await db_connect.collection("correctGuesses").findOne({});

         // Ensure correctGuessesDocument and its array field exist
         if (!correctGuessesDocument || !correctGuessesDocument.correctGuesses) {
            return res.status(404).json({ error: "Correct guesses document or correctGuesses array not found" });
        }

        // Add the new word to the array
        correctGuessesDocument.correctGuesses.push(req.body.letter);

        
        // Update the document with the new array of words
        const result = await db_connect.collection("correctGuesses").updateOne(
            {},
            { $set: { correctGuesses: correctGuessesDocument.correctGuesses } }
        );

        res.json(result);

    }catch(err) {
        console.error("Error adding letter:", err);
        res.status(500).send("Error adding letter");
    }
});

//clears the list of Words array
recordRoutes.route("/clearListOfWords").post(async (req, res) => {
    try{
        let db_connect = dbo.getDb();

        // Find and clear the list of words array
        const listOfWordsArray = await db_connect.collection("words").updateOne(
            {},
            { $set: { listOfWords: [] } }
        );

        // Check if the updates were successful
        if (listOfWordsArray.modifiedCount === 0) {
            return res.status(404).json({ error: "No documents found to update" });
        }

        res.json({ message: "List of words array cleared successfully" });
    }catch(err) {
        console.error("Error clearing list of words array:", err);
        res.status(500).send("Error clearing array");
    }
});

//clears the array of correct and incorrect guesses
recordRoutes.route("/clearArray").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();

        // Find and clear the correct guesses array
        const correctGuessesArray = await db_connect.collection("correctGuesses").updateOne(
            {},
            { $set: { correctGuesses: [] } }
        );

        // Find and clear the wrong guesses array
        const wrongGuessesArray = await db_connect.collection("wrongGuesses").updateOne(
            {},
            { $set: { wrongGuesses: [] } }
        );

        // Check if the updates were successful
        if (correctGuessesArray.modifiedCount === 0 && wrongGuessesArray.modifiedCount === 0) {
            return res.status(404).json({ error: "No documents found to update" });
        }

        res.json({ message: "Arrays cleared successfully" });

    } catch (err) {
        console.error("Error clearing arrays:", err);
        res.status(500).send("Error clearing arrays");
    }
});


//displays all the letters in the wrong Guesses array
recordRoutes.route("/displayWrongGuesses").get(async (req, res) => {
    try {
        let db_connect = dbo.getDb();

        // Find the document that contains the incorrect guesses array
        const wrongGuessesDocument = await db_connect.collection("wrongGuesses").findOne({}, {
            projection: {
                wrongGuesses: 1 // Specify to only return the wrongGuesses field
            }
        });

        // Ensure wrongGuessesDocument and its array field exist
        if (!wrongGuessesDocument || !wrongGuessesDocument.wrongGuesses) {
            return res.status(404).json({ error: "Wrong guesses document or wrongGuesses array not found" });
        }

        // Return the wrong guesses array
        res.json(wrongGuessesDocument.wrongGuesses);
    } catch (err) {
        console.error("Error fetching wrong guesses:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});












//not really needed
//displays all the letters in the correct Guesses array
recordRoutes.route("/displayCorrectGuesses").get(async (req, res) => {
    try {
        let db_connect = dbo.getDb();

        // Find the document that contains the correct guesses array
        const correctGuessesDocument = await db_connect.collection("correctGuesses").findOne({}, {
            projection: {
                wrongGuesses: 1 // Specify to only return the wrongGuesses field
            }
        });

        // Ensure correctGuessesDocument and its array field exist
        if (!correctGuessesDocument || !correctGuessesDocument.correctGuesses) {
            return res.status(404).json({ error: "Correct guesses document or correctGuesses array not found" });
        }

        // Return the wrong guesses array
        res.json(correctGuessesDocument.correctGuesses);
    } catch (err) {
        console.error("Error fetching wrong guesses:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

//adds a word to the array of words(already has 1000 words)
// not really necessary to use
recordRoutes.route("/word/add").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();

        // Find the document that contains the words array
        const wordsDocument = await db_connect.collection("words").findOne({});

        // Ensure wordsDocument and its array field exist
        if (!wordsDocument || !wordsDocument.listOfWords) {
            return res.status(404).json({ error: "Words document or listOfWords array not found" });
        }

        // Check if the word already exists in the array
        if (wordsDocument.listOfWords.includes(req.body.word)) {
            return res.json({ error: "Word already exists" });
        }

        // Add the new word to the array
        wordsDocument.listOfWords.push(req.body.word);

        // Update the document with the new array of words
        const result = await db_connect.collection("words").updateOne(
            {},
            { $set: { listOfWords: wordsDocument.listOfWords } }
        );

        res.json(result);
    } catch (err) {
        console.error("Error adding word:", err);
        res.status(500).send("Error adding word");
    }
});

// Add high score
recordRoutes.route("/addHighScore").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        let { name, numberOfGuesses, wordLength } = req.body;

        wordLength = parseInt(wordLength);

        // Insert the high score into the collection
        const result = await db_connect.collection("highScores").insertOne({
            name,
            numberOfGuesses,
            wordLength
        });

        console.log("Inserted high score:", result.ops[0]);

        res.json(result);
    } catch (err) {
        console.error("Error adding high score:", err);
        res.status(500).send("Error adding high score");
    }
});


// Get top 10 high scores for a specific word length
recordRoutes.route("/highScores/:wordLength").get(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        let wordLength = parseInt(req.params.wordLength); // Parse wordLength to integer
        console.log("Word length received:", wordLength); // D

        // Find top 10 high scores sorted by numberOfGuesses ascending
        const topScores = await db_connect.collection("highScores")
            .find({ wordLength }) // Filter by wordLength
            .sort({ numberOfGuesses: 1 })
            .limit(10)
            .toArray();

        console.log("Top scores found:", topScores); // Log the fetched scores
        res.json(topScores);
    } catch (err) {
        console.error("Error fetching top scores:", err);
        res.status(500).send("Error fetching top scores");
    }
});











 
module.exports = recordRoutes;