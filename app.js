const express = require("express");
const app = express();
const topicsController = require("./controllers/topics.controller.js")


app.get("/api/topics", topicsController.getTopics)

app.all("*", (req, res) => {
    res.status(404).send({msg: "404 Route Not Found"})
})

app.use((err, req, res, next) => {
    if (err.status && err.msg)
    {
        res.status(err.status).send({msg: err.msg})
    }else{
        next(err)
    }
    
})

app.use((err, req, res, next) => {
    res.status(500).send({msg: "500 Bad Server"})  
})

module.exports = app