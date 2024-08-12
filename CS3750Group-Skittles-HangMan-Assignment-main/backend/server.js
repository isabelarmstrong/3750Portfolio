const express = require("express");
const app = express();
const cors = require("cors");

const session = require("express-session");
const MongoStore = require("connect-mongo");

require("dotenv").config({ path: "./config.env" });

const port = process.env.PORT;

app.use(cors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204,
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(session({
    secret: 'keyboard cat',
    saveUninitialized: false, //don't create sessions until something is stored
    resave: false, //dont save session if unmodified
    store: MongoStore.create({
        mongoUrl: process.env.ATLAS_URI
    })
}));

const dbo = require("./db/conn");
app.use(express.json());

app.use(require("./routes/record"));
app.use(require("./routes/session"));

app.get("/", (req, res) => {
    res.send("Hello World!");
});




// Function to create the initial words document
const createInitialWordsDocument = async () => {
    try {
        let db_connect = dbo.getDb();
        const existingDocument = await db_connect.collection("words").findOne({});
        if (!existingDocument) {
            const initialWordsDocument = { listOfWords: [] };
            await db_connect.collection("words").insertOne(initialWordsDocument);
            console.log("Initial words document created.");
        } else {
            console.log("Initial words document already exists.");
        }
    } catch (err) {
        console.error("Error creating initial words document:", err);
    }
};


// Function to create the wrong letters guessed document
const createWrongGuessesDocument = async () => {
    try {
        let db_connect = dbo.getDb();
        const existingDocument = await db_connect.collection("wrongGuesses").findOne({});
        if (!existingDocument) {
            const initialWordsDocument = { wrongGuesses: [] };
            await db_connect.collection("wrongGuesses").insertOne(initialWordsDocument);
            console.log("Wrong Letters Guessed document created.");
        } else {
            console.log("Wrong Letters Guessed document already exists.");
        }
    } catch (err) {
        console.error("Error creating wrong Letters Guessed document:", err);
    }
};

// function to create the correct letters guessed (will become the winning condition)
const createCorrectLetterGuessesDocument = async () => {
    try {
        let db_connect = dbo.getDb();
        const existingDocument = await db_connect.collection("correctGuesses").findOne({});
        if (!existingDocument) {
            const initialWordsDocument = { correctGuesses: [] };
            await db_connect.collection("correctGuesses").insertOne(initialWordsDocument);
            console.log("Correct Letters Guessed document created.");
        } else {
            console.log("Correct Letters Guessed document already exists.");
        }
    } catch (err) {
        console.error("Error creating correct Letters Guessed document:", err);
    }
};

// function to create the correct letters guessed (will become the winning condition)
const createWrongGuessCountDocument = async () => {
    try {
        let db_connect = dbo.getDb();
        const existingDocument = await db_connect.collection("wrongGuessCount").findOne({});
        if (!existingDocument) {
            const initialWordsDocument = { wrongGuessCount: [] };
            await db_connect.collection("wrongGuessCount").insertOne(initialWordsDocument);
            console.log("Wrong guess count document created.");
        } else {
            console.log("Wrong guess count document already exists.");
        }
    } catch (err) {
        console.error("Error creating Wrong guess count document:", err);
    }
};




// Start the server and ensure the initial document is created
app.listen(port, () => {
    dbo.connectToServer(async (err) => {
        if (err) {
            console.error(err);
        } else {
            await createInitialWordsDocument();
            await createWrongGuessesDocument();
            await createCorrectLetterGuessesDocument();
            await createWrongGuessCountDocument();
        }
    });

    console.log(`Server is running on port ${port}`);
});
