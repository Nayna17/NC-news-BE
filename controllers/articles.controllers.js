const {
  fetchArticles,
  fetchArticleById,
  updateArticleVotes,
} = require("../models/articles.models");

exports.getArticles = (req, res) => {
  return fetchArticles().then((articles) => {
    res.status(200).send(articles);
  });
};

exports.getArticleById = (req, res) => {
  const { article_id } = req.params;
  return fetchArticleById(article_id).then((article) => {
    res.status(200).send({ article: article });
  });
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  updateArticleVotes(article_id, inc_votes)
    .then((updatedArticle) => {
      res.status(200).send({ article: updatedArticle });
    })
    .catch(next);
};
