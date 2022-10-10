const express = require("express");
const app = express();
const topicsController = require("./controllers/topics.controller.js")


app.get("/api/topics", topicsController.getTopics)


module.exports = app