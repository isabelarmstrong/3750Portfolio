const express = require('express');
const userRoute = require('./routes/user');
const matchesRoute = require('./routes/matches');

//Load express
const app = express();
const port = 3000;

//Routes in /routes/user
//localhost:3000/user_routes
app.use("/user_routes", userRoute); 
app.use("/food_routes", matchesRoute);

//Routes in this file
app.get("/", (req, res) => {
    res.send("Hello, World!");
});

//Normally don't do this, React will be a frontend. But for now...
//Usually a frontend proj manages hosting html pages
app.use(express.static('public')); //Look inside of public folder to see what to host

//Set up server
app.listen(port, () => {
    console.log("Server started on port: " + port);
});
