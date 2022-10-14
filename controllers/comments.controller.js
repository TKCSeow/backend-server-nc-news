const commentsModel = require("../models/comments.model.js")

exports.deleteCommentById = (req, res, next) => {
    const {comment_id} = req.params;
    return commentsModel.removeCommentById(comment_id).then(() => {
        res.status(204).send();
    }).catch(err => next(err))
}