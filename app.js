const db = require("./db/connection.js");
const express = require("express");
// const topics = require("./db/data/test-data/topics.js");
// const articles = require("./db/data/test-data/articles.js");
// const users = require("./db/data/test-data/users.js")
const app = express();

app.get("/api/topics", (req, res) => {
  return db.query("SELECT * FROM topics").then(({ rows }) => {
    res.status(200).send({ topics: rows });
  });
});

app.get("/api/articles", (req, res) => {
  return db
    .query(
      `SELECT 
    article_id, title, topic, author, created_at, votes, article_img_url FROM articles ORDER BY articles.created_at DESC`
    )
    .then(({ rows }) => {
      console.log({ articles: rows });
      res.status(200).send({ articles: rows });
    });
});

app.get("/api/users", (req, res) => {
  return db.query(`SELECT * FROM users`).then(({ rows }) => {
    res.status(200).send({ users: rows });
  });
});

module.exports = app;
