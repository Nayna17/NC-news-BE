const db = require("../db/connection");

exports.fetchArticles = () => {
  return db
    .query(
      `SELECT 
    article_id, title, topic, author, created_at, votes, article_img_url 
    FROM articles 
    ORDER BY articles.created_at DESC`
    )
    .then(({ rows }) => {
      return { articles: rows };
    });
};


exports.fetchArticleById = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      const article = rows[0];
      if(!article) {
        return Promise.reject({status: 404, msg: `Request not found`,})
      }
      return article
    });
};


