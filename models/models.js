const { query } = require("../db/connection");
const db = require("../db/connection");

exports.fetchTopics = () => {
    let query = 'SELECT * FROM topics';
    return db.query(query)
        .then((result) => {
            return result.rows;
        });  
};

exports.fetchArticles = () => {
    let queryStr = `
            SELECT articles.*, COUNT(comments.article_id)::INT AS comment_count FROM articles
            LEFT JOIN comments ON comments.article_id = articles.article_id
            GROUP BY comments.article_id, articles.article_id
            ORDER BY created_at DESC;
        `
    return db.query(queryStr)
    .then(results => {
        return results.rows;
    });
};