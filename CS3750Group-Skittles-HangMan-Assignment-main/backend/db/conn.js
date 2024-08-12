const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.ATLAS_URI;

let _db;

module.exports = {
    connectToServer: function(callback) {
        console.log("Attempting to Connect");

        // Create a MongoClient with a MongoClientOptions object to set the Stable API version
        const client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });

        async function run() {
            try {
                // Connect the client to the server (optional starting in v4.7)
                await client.connect();
                // Send a ping to confirm a successful connection
                await client.db("admin").command({ ping: 1 });
                console.log("Pinged your deployment. You successfully connected to MongoDB!");
                _db = client.db("Hangman");
                console.log("Successfully connected to hangman database");

                // Ensure the words collection is created (if it doesn't already exist)
                await _db.createCollection("words");
                console.log("Words collection created or already exists.");

                 // create the wrong letters guessed collection
                 await _db.createCollection("wrongGuesses");
                 console.log("wrongGuesses collection created or already exists.");

                 // create the correct letters guessed collection
                 await _db.createCollection("correctGuesses");
                 console.log("correctGuesses collection created or already exists.");

                 await _db.createCollection("highScores");
                 console.log("highScores collection created or already exists.");

                 await _db.createCollection("wrongGuessCount");
                 console.log("wrong Guess count collection created or already exists.");



            } catch (err) {
                console.error("Error connecting to MongoDB:", err);
            } finally {
                // Execute callback if provided
                if (callback) callback();
            }
        }

        run().catch(console.dir);
    },

    getDb: function() {
        return _db;
    }
};
