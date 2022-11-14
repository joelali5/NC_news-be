const express = require("express");
const {getTopics} = require("./controllers/topics.controller");

const app = express();

app.get('/api/topics', getTopics);

app.use("/*", (req, res) => {
    res.status(404).send({msg: "Bad request!"})
});

module.exports = app;