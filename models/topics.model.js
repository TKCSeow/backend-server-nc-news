const db = require("../db/connection.js");
const utils = require("../db/seeds/utils.js");

exports.selectTopics = () => {
    return db.query(`
        SELECT * FROM topics
    `).then(({rows: topics}) => {
        return topics;
    })
}