const db = require("../db/connection.js");
const modelUtils = require("./model-utils.js")

function selectArticles(topic, sort_by = "created_at", order = "desc") {

    if(topic === undefined && sort_by === "created_at" && order === "desc") {
        return db.query(`
            SELECT 
                articles.*,
                COUNT(comments.comment_id) ::INT AS comment_count
            FROM articles  
            LEFT JOIN comments
            ON comments.article_id = articles.article_id
            GROUP BY articles.article_id   
            ORDER BY created_at DESC
            
        ;`).then(({rows: articles})=> {
            return articles;
        })
    }

    return Promise.all([
        modelUtils.getSlugsFromTopicsDatabase(),
        modelUtils.getValidArticleColumns()
    ])
    .then(([validTopics, validSortByValues]) => {
  
        const validatedTopicQuery = modelUtils.createValidatedQueriesStr("articles","topic", validTopics, topic);

        if(typeof validatedTopicQuery !== "string"){
            return validatedTopicQuery;
        }
        
        validSortByValues.push("comment_count");
        if(validSortByValues.includes(sort_by) === false) {
            return Promise.reject({status: 400, msg: "400 Bad Request - invalid query given"})
        }

        if(order !== "desc" && order !== "asc") {
            return Promise.reject({status: 400, msg: `400 Bad Request - must receive "desc" or "asc"`})
        }
        
        
        return db.query(`
            SELECT 
                articles.*,
                COUNT(comments.comment_id) ::INT AS comment_count
            FROM articles  
            LEFT JOIN comments
            ON comments.article_id = articles.article_id
            ${validatedTopicQuery}
            GROUP BY articles.article_id   
            ORDER BY ${sort_by} ${order.toUpperCase()}
            
        ;`)
    
    })
    .then(({rows: articles})=> {
        return articles;
    })

}

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

    if(username === undefined || body === undefined) {
        return Promise.reject({status: 400, msg: "400 Bad Request - not enough data given"})
    }

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

function selectCommentsByArticleId(article_id) {
    return selectArticleById(article_id)
        .then(()=>{
            
            return db.query(`
            SELECT 
                comment_id, body, author, created_at, votes
            FROM comments
            WHERE article_id = $1
            ;`, [article_id])
        })
        .then(({rows : article}) => {
            return article;
        })
}

module.exports = {selectArticleById, updateArticleById, selectArticles, selectCommentsByArticleId, insertCommentByArticleId}