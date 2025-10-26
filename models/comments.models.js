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

exports.insertCommentByArticleId = (article_id, username, body) => {
  return fetchArticleById(article_id).then(() => {
    return db
      .query(
        `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING comment_id, votes, created_at, author, body, article_id`,
        [username, body, article_id]
      )
      .then(({ rows }) => {
        return rows[0];
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  });
};

exports.removeCommentById = (comment_id) => {
  if (isNaN(comment_id)) {
    return Promise.reject({ status: 400, msg: "Invalid comment ID" });
  }
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [
      comment_id,
    ])
    .then(({ rows }) => {
      if (rows.length > 0) {
        return rows[0];
      } else {
        return null;
      }
    });
};
