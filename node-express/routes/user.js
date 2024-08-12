const express = require("express");
const fs = require('node:fs');

const router = express.Router();

router.get("/", (req, res) => {
    const firstname = req.query.firstname;
    const lastname = req.query.lastname;
    const favfood = req.query.favfood;
    const content = firstname + " " + lastname + " " + favfood + ", ";

    fs.appendFile('userdata.txt', content, err => {
        if (err) {
            console.error(err);
        }
    })

    //read file content
    const filecontent = fs.readFileSync('userdata.txt').toString();
    //send to page
    res.send(filecontent);
    
});

module.exports = router;