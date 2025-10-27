const db = require("../db/connection");

exports.fetchArticles = (sort_by = "created_at", order = "desc") => {
  const validColumns = [
    "article_id",
    "title",
    "topic",
    "author",
    "created_at",
    "votes",
    "article_img_url",
  ];
  const validOrders = ["asc", "desc"];

  if (!validColumns.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid sort_by query" });
  }
  if (!validOrders.includes(order.toLowerCase())) {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
  }

  const query = `SELECT
  article_id, title, topic, author, created_at, votes, article_img_url
  FROM articles
  ORDER BY ${sort_by} ${order.toUpperCase()}`;
  return db.query(query).then(({ rows }) => {
    return { articles: rows };
  });
};

exports.fetchArticleById = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      const article = rows[0];
      if (!article) {
        return Promise.reject({ status: 404, msg: `Request not found` });
      }
      return article;
    });
};

exports.updateArticleVotes = (article_id, inc_votes) => {
  if (typeof inc_votes !== "number") {
    return Promise.reject({
      status: 400,
      msg: "Invalid input type for inc_votes",
    });
  }
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      const article = rows[0];
      if (!article) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return article;
    });
};
