const db = require("../db/connection");

const checkArticlesExists = (article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id]).then(result => {
        if(result.rows.length === 0){
            return Promise.reject({
                status: 404,
                msg: "articles not found!"
            })
        }
    })
}

module.exports = checkArticlesExists;