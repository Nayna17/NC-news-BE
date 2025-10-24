const db = require("../db/connection");
const { fetchArticleById } = require("./articles.models");


exports.fetchCommentsByArticleId = (article_id) => {
  return fetchArticleById(article_id).then(() => {
    return db
      .query(
        `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,
        [article_id]
      )
      .then(({ rows }) => {
        return rows;
      });
  });
};
