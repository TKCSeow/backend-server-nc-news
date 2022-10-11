const db = require("../db/connection.js");

function selectArticleById (article_id) {

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

function updateArticleById (article_id, inc_votes) {     
    console.log(article_id, inc_votes, "<<<<<< INPUT MODEL")

    return selectArticleById(article_id)
        .then((article)=>{
            console.log(article, "<<<<< INPUT MODEL")

            if (inc_votes === undefined) {
                return Promise.reject({status: 400, msg: "400 Bad Request - inc_votes not given"})
            }

            if ((article.votes + inc_votes) < 0) {
                return db.query(`
                UPDATE articles 
                SET votes = $1
                WHERE article_id = $2
                RETURNING *;`, [0, article_id])
            }

            return db.query(`
            UPDATE articles 
            SET votes = votes + $1
            WHERE article_id = $2
            RETURNING *;`, [inc_votes, article_id])
        })
        .then(({rows : article}) => {
            console.log(article, "<<<<< INPUT OUTPUT")
            return article[0];
        })
}

module.exports = {selectArticleById, updateArticleById}