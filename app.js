const express = require("express");
const {getTopics, getArticles, getArticleById} = require("./controllers/controllers");

const app = express();

app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id', getArticleById);

app.all("/*", (req, res) => {
    res.status(404).send({msg: "Bad request!"})
});

app.use((err, req, res, next) => {
    if(err.status && err.msg){
        res.status(err.status).send({msg: err.msg})
    }
})

app.use((err ,req, res, next) => {
    console.log(err);
    res.status(500).send("Server error!")
})
module.exports = app;