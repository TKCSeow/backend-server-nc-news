const express = require("express");
const app = express();
const topicsController = require("./controllers/topics.controller.js")
const articlesController = require("./controllers/articles.controller.js")

app.get("/api/topics", topicsController.getTopics)

app.get("/api/articles/:article_id", articlesController.getArticleById)

app.all("*", (req, res) => {
    res.status(404).send({msg: "404 Route Not Found"})
})



module.exports = app