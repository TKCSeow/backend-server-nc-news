const articlesModel = require("../models/articles.model.js");

exports.getArticles = (req, res, next) => {
    const { topic, sort_by, order } = req.query;
    return articlesModel.selectArticles(topic, sort_by, order).then((articles) => {
        return res.status(200).send({articles})
    }).catch(err => next(err))
}

exports.getArticleById = (req, res, next) => {
    const {article_id} = req.params;
    return articlesModel.selectArticleById(article_id).then((article) => {
        return res.status(200).send({article});
    }).catch(err => next(err))
}

exports.getCommentsArticleById = (req, res, next) => {
    const {article_id} = req.params;
    return articlesModel.selectCommentsByArticleId(article_id).then((comments) => {
        return res.status(200).send({comments});
    }).catch(err => next(err))
}


exports.postCommentByArticleId = (req, res, next) => {
    const {article_id} = req.params;
    const {username, body} = req.body;
    return articlesModel.insertCommentByArticleId(article_id, username, body).then((comment) => {
        return res.status(201).send({comment})
    }).catch(err => next(err))
}

exports.patchArticleById = (req, res, next) => {
    const {article_id} = req.params;
    const {inc_votes} = req.body;

    return articlesModel.updateArticleById(article_id, inc_votes).then((article) => {
        return res.status(200).send({article});
    }).catch(err => next(err))
}