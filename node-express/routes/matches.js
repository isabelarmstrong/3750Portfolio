const express = require("express");
const fs = require('node:fs');

const router = express.Router();

router.get("/", (req, res) => {
    const favfood = req.query.favfood;

    //read file content
    const filecontent = fs.readFileSync('userdata.txt').toString().split(", ");
    //go through content
    for (i in filecontent){
        if (filecontent[i].includes(favfood)){
            res.send(filecontent[i])
        }
    }
    
});

module.exports = router;