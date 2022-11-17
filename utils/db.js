const db = require("../db/connection");

const checkArticlesExists = (article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id]).then(result => {
        if(result.rows.length === 0){
            return Promise.reject({
                status: 404,
                msg: "Article not found!"
            })
        }
    })
}

const checkUserExists = (username) => {
    return db
      .query(`SELECT * FROM users WHERE username = $1;`, [username])
      .then((result) => {
        if (result.rows.length === 0) {
          return Promise.reject({
            status: 404,
            msg: "username not found!",
          });
        }
      });
  };

module.exports = {checkArticlesExists, checkUserExists};