const db = require("../db/connection.js");

exports.selectArticleById = (article_id) => {

    if(isNaN(article_id) === true) {
        return Promise.reject({status: 400, msg: "400 Bad Request - Invalid ID"})
    }

    return db.query(`
        SELECT * FROM articles
        WHERE article_id = $1
        ;`, [article_id])
    .then(({rows: article}) => {
        
        if(article[0] === undefined) {
            return Promise.reject({status: 404, msg: "404 Article Not Found"})
        }

        return article[0];
    })
}

exports.updateArticleById = (article_id, inc_votes) => {     
    return db.query(`
        UPDATE articles 
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *
    ;`, [inc_votes, article_id])
    .then(({rows : article}) => {
        return article[0];
    })
}