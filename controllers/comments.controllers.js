const {
  fetchCommentsByArticleId,
  insertCommentByArticleId,
} = require("../models/comments.models");

exports.getCommentsByArticleId = (req, res) => {
  const { article_id } = req.params;
  return fetchCommentsByArticleId(article_id).then((comments) => {
    res.status(200).send({ comments });
  });
};

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  if (!username || !body) {
    return res
      .status(400)
      .send({ msg: "Missing required fields: username and body" });
  }
  insertCommentByArticleId(article_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};
