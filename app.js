const express = require("express");
const app = express();
const controller = require("./controllers/controller.js")
const topicsController = require("./controllers/topics.controller.js")
const articlesController = require("./controllers/articles.controller.js")
const usersController = require("./controllers/users.controller.js")
const commentsController = require("./controllers/comments.controller.js")
const cors = require('cors');


app.use(cors());
app.use(express.json());

// Endpoints
app.get("/api", controller.getEndpointDocumentation)

app.get("/api/topics", topicsController.getTopics)

app.get("/api/articles", articlesController.getArticles)
app.get("/api/articles/:article_id", articlesController.getArticleById)

app.post("/api/articles/:article_id/comments", articlesController.postCommentByArticleId)

app.get("/api/articles/:article_id/comments", articlesController.getCommentsArticleById)
app.patch("/api/articles/:article_id", articlesController.patchArticleById)
app.delete("/api/comments/:comment_id", commentsController.deleteCommentById)
app.get("/api/users", usersController.getUsers)
app.get("/api/comments", commentsController.getComments)

app.all("*", (req, res) => {
    res.status(404).send({msg: "404 Route Not Found"})
})


// Error Handling
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