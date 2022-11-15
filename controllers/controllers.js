const {fetchTopics, fetchArticles} = require("../models/models");


exports.getTopics = (req, res, next) => {
    fetchTopics().then((result) => {
        res.status(200).send({topics: result });
    })
    .catch((err) => {
        next(err);
    });
};

exports.getArticles = (req, res, next) => {
    fetchArticles().then(result => {
        res.status(200).send({articles: result});
    })
    .catch(err => {
        next(err);
    });
};