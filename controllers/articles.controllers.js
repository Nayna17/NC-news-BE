const { fetchArticles, fetchArticleById } = require("../models/articles.models")

exports.getArticles = (req, res) => {
    return fetchArticles().then((articles) => {
        res.status(200).send(articles)
    })
}

exports.getArticleById = (req, res) => {
    const { article_id } = req.params
    return fetchArticleById(article_id).then((article) => {
        res.status(200).send({article: article})
    })
}

