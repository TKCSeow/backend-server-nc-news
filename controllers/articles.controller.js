const articlesModel = require("../models/articles.model.js");


exports.getArticleById = (req, res, next) => {
    const {article_id} = req.params;
    return articlesModel.selectArticleById(article_id).then((article) => {
        return res.status(200).send({article});
    }).catch(err => next(err))
}