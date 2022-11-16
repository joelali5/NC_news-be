const { getArticleById } = require("../controllers/controllers");
const { query } = require("../db/connection");
const db = require("../db/connection");

exports.fetchTopics = () => {
    let query = 'SELECT * FROM topics';
    return db.query(query)
        .then((result) => {
            return result.rows;
        });  
};

exports.fetchArticles = (sort_by = "created_at") => {
    const columns = ["created_at"]
    if(!columns.includes(sort_by)){
        return Promise.reject({
            status: 400,
            msg: 'invalid sort query!'
        })
    }
    let queryStr = `
            SELECT articles.*, COUNT(comments.article_id)::INT AS comment_count FROM articles
            LEFT JOIN comments ON comments.article_id = articles.article_id
            GROUP BY comments.article_id, articles.article_id
            ORDER BY ${sort_by} DESC;
        `
    return db.query(queryStr)
    .then(results => {
        return results.rows;
    });
};

exports.fetchArticleById = (article_id) => {
    if(!isNaN(article_id)){
        return db
            .query('SELECT * FROM articles WHERE article_id = $1;', [article_id])
            .then(result => {
                return result.rows[0];
            });
    }
    return Promise.reject({
        status: 400,
        msg: "Bad request!"
    })
    
};