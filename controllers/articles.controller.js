const articlesModel = require("../models/articles.model.js");

exports.getArticles = (req, res, next) => {
    return articlesModel.selectArticles().then((articles) => {
        return res.status(200).send({articles})
    })
}

exports.getArticleById = (req, res, next) => {
    const {article_id} = req.params;
    return articlesModel.selectArticleById(article_id).then((article) => {
        return res.status(200).send({article});
    }).catch(err => next(err))
}

exports.patchArticleById = (req, res, next) => {
    const {article_id} = req.params;
    const {inc_votes} = req.body;

    return articlesModel.updateArticleById(article_id, inc_votes).then((article) => {
        return res.status(200).send({article});
    }).catch(err => next(err))
}