const db = require("../db/connection")
const format = require('pg-format');

exports.getListOfValidQueriesFromDatabase = (column, database) => {
    return db.query(`SELECT ${column} FROM ${database}`)
    .then(({rows}) => {

        const queries = rows.map(value => {
            return value[column]
        });
        
        const uniqueQueries = queries.filter((query, index, arr) => {
            return arr.indexOf(query) === index;
        })

        return uniqueQueries;
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



exports.checkExists = (table, column, value) => {
    const queryStr = format('SELECT * FROM %I WHERE %I = $1;', table, column);
    return db.query(queryStr, [value]).then(()=> {
        if (dbOutput.rows.length === 0) {
            return Promise.reject({ status: 404, msg: `404 no resouces found` });
        }

    })
};