const db = require("../db/connection");

exports.fetchArticles = (sort_by = "created_at", order = "desc", topic) => {
  const validColumns = [
    "article_id",
    "title",
    "topic",
    "author",
    "created_at",
    "votes",
    "article_img_url",
    "comment_count",
  ];
  const validOrders = ["asc", "desc"];

  if (!validColumns.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid sort_by query" });
  }
  if (!validOrders.includes(order.toLowerCase())) {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
  }

  const queryValues = [];
  let queryStr = `SELECT
  articles.article_id, 
  articles.title, 
  articles.topic, 
  articles.author, 
  articles.created_at, 
  articles.votes, 
  articles.article_img_url,
  COUNT (comments.comment_id)::INT AS comment_count
  FROM articles
  LEFT JOIN comments ON comments.article_id = articles.article_id`;

  if (topic) {
    queryStr += ` WHERE topic = $1`;
    queryValues.push(topic);
  }

  queryStr += ` GROUP BY articles.article_id
  ORDER BY ${sort_by} ${order.toUpperCase()}`;

  return db.query(queryStr, queryValues).then(({ rows }) => {
    if (topic && rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Topic not found" });
    }
    return { articles: rows };
  });
};


exports.fetchArticleById = (article_id) => {
  const queryStr = `SELECT
      articles.article_id,
      articles.title,
      articles.topic,
      articles.author,
      articles.body,
      articles.created_at,
      articles.votes,
      articles.article_img_url,
      COUNT(comments.comment_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;
  `;
  return db.query(queryStr, [article_id]).then(({ rows }) => {
    const article = rows[0];
    if (!article) {
      return Promise.reject({ status: 404, msg: "Request not found" });
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
