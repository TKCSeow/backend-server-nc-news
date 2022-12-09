const commentsModel = require("../models/comments.model.js")

exports.getComments = (req, res, next) => {
    const {author} = req.query;
    return commentsModel.selectComments(author).then((comments) => {
        res.status(200).send({comments});
    }).catch(err => next(err))
}

exports.deleteCommentById = (req, res, next) => {
    const {comment_id} = req.params;
    return commentsModel.removeCommentById(comment_id).then(() => {
        res.status(204).send();
    }).catch(err => next(err))
}