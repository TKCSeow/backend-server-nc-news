const express = require("express");
const app = express();
const topicsController = require("./controllers/topics.controller.js")


app.get("/api/topics", topicsController.getTopics)

app.all("*", (req, res) => {
    res.status(404).send({msg: "404 Route Not Found"})
})



module.exports = app