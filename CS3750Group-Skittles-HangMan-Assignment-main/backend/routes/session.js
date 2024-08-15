const express = require("express");
const routes = express.Router();

routes.route("/session_set/:name").get(async function (req, res) {
    console.log("in /session_set, session is: " + req.session);
    
    if (!req.session.username){
        console.log("No session found. Creating a new one!");
        req.session.username = req.params.name;
    } else{
        console.log("Session already existed!")
    }

    username = req.session.username;

    console.log("Session username is: " + username);

    const resultObj = { username: username };
    res.json(resultObj);
});


routes.route("/session_get").get(async function (req, res){
    console.log("In /session_get, session in " + req.session);
    
    if (!req.session.username) {
        console.log("No session set.");
    } else {
        console.log("Session username is: " + req.session.username);
    }

    const resultObj = { username: req.session.username };

    res.json(resultObj);
});


routes.route("/session_delete").get(async function (req, res){
    console.log("In /session_delete, session in " + req.session);
    req.session.destroy();

    let status = "No session set";
    
    const resultObj = { status: status };

    res.json(resultObj);
});


module.exports = routes;