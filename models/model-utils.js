const db = require("../db/connection")

exports.getSlugsFromTopicsDatabase = () => {
    return db.query(`SELECT slug FROM topics`)
    .then(({rows}) => {
        return rows.map(topic => topic["slug"])
    })
}

exports.createValidatedQueriesStr = (table, column, validQueriesValues, queryValue) => {

    if (queryValue === undefined) {
        return "";
    } 
    
    if (validQueriesValues.includes(queryValue) === true) {
        return `WHERE ${table}.${column} = '${queryValue}'`;
    } 
    
    if (queryValue === "") {
        return Promise.reject({status: 400, msg: `400 Bad Request - no query value given`})
    }

    return Promise.reject({status: 404, msg: `404 no resources found`})
    
}

exports.getValidArticleColumns = () => {
    return db.query(`
        SELECT *
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_NAME = N'articles'
    `).then(({rows}) => {
        return rows.map(row => row["column_name"])
    })
}
