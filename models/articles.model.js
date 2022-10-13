const db = require("../db/connection.js");

function selectArticleById (article_id) {

    if(isNaN(article_id) === true) {
        return Promise.reject({status: 400, msg: "400 Bad Request - Invalid ID"})
    }

    return db.query(`
        SELECT articles.*, COUNT(comments.comment_id) ::INT AS comment_count FROM articles
        LEFT JOIN comments
        ON comments.article_id = articles.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.article_id
        ;`, [article_id])
    .then(({rows: article}) => {
        if(article[0] === undefined) {
            return Promise.reject({status: 404, msg: "404 Article Not Found"})
        }

        return article[0];
    })
}

function insertCommentByArticleId(article_id, username, body) {
    return selectArticleById(article_id)
    .then(()=>{

        return db.query(`
            INSERT INTO comments
                (article_id, author, body)
            VALUES
                ($1, $2, $3)
            RETURNING *;
        `, [article_id, username, body])
    })
    .then(({rows : comment}) => {
        return comment[0];
    })
}

function updateArticleById (article_id, inc_votes) {     
    return selectArticleById(article_id)
        .then(()=>{

            if (inc_votes === undefined) {
                inc_votes = 0;
            }
            if(isNaN(inc_votes) === true || inc_votes % 1 !== 0) {
                return Promise.reject({status: 400, msg: "400 Bad Request - inc_votes must be an integer"})
            }
            
            return db.query(`
            UPDATE articles 
            SET votes = votes + $1
            WHERE article_id = $2
            RETURNING *;`, [inc_votes, article_id])
        })
        .then(({rows : article}) => {
            return article[0];
        })
}

module.exports = {selectArticleById, updateArticleById, insertCommentByArticleId}