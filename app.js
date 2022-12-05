const express = require("express");
const {getTopics,
    getArticles,
    getArticleById,
    getCommentsByArticleId,
    postComment,
    patchArticle,
    getUsers,
    deleteCommentById
} = require("./controllers/controllers");

const app = express();

app.use(express.json());

const cors = require('cors');

app.use(cors());

app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/articles/:article_id/comments', getCommentsByArticleId);
app.post('/api/articles/:article_id/comments', postComment);
app.patch('/api/articles/:article_id', patchArticle);
app.get('/api/users', getUsers);
app.delete('/api/comments/:comment_id', deleteCommentById);

app.all("/*", (req, res) => {
    res.status(404).send({msg: "Bad request!"})
});

app.use((err, req, res, next) => {
    if(err.status && err.msg){
        res.status(err.status).send({msg: err.msg})
    } else {
        next(err)
    }
});

app.use((err, req, res, next) => {
    if (err.code === '22P02' || err.code === '23502') {
      res.status(400).send({ msg: 'Invalid input' });
    } else next(err);
});

app.use((err ,req, res, next) => {
    console.log(err);
    res.status(500).send("Server error!")
})
module.exports = app;