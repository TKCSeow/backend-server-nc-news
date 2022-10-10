const db = require("../db/connection.js");

exports.selectArticleById = (article_id) => {
    return db.query(`
        SELECT * FROM articles
        WHERE article_id = $1
        ;`, [article_id])
    .then(({rows: article}) => {
        return article[0];
    })
}