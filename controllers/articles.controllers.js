const {
  fetchArticles,
  fetchArticleById,
  updateArticleVotes,
} = require("../models/articles.models");

exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic } = req.query;
  return fetchArticles(sort_by, order, topic)
    .then(({ articles }) => {
      res.status(200).send({ articles });
    })
    .catch(next);
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
