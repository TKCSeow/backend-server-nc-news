const db = require("../db/connection.js");

exports.removeCommentById = (comment_id) => {

    if(isNaN(comment_id) === true) {
        return Promise.reject({status: 400, msg: "400 Bad request - invalid comment id given"})
    }

    return db.query(`
        DELETE FROM comments
        WHERE comment_id = $1
        RETURNING *;
    `, [comment_id])

    .then(({rows: comment}) => {
        if(comment.length === 0) {
            return Promise.reject({status: 404, msg: "404 comment not found"})
        }

        return comment
    })
}   

// DELETE FROM restaurants
// WHERE restaurant_id = $1
// RETURNING *;