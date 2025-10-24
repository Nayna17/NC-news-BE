const db = require("./db/connection.js");
const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controllers.js");
const {
  getArticles,
  getArticleById,
} = require("./controllers/articles.controllers.js");
const { getUsers } = require("./controllers/users.controllers.js");
const {
  getCommentsByArticleId,
} = require("./controllers/comments.controllers.js");

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/users", getUsers);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    console.log(err);
    res.status(400).send({ msg: "You've made a Bad Request" });
  }
});

module.exports = app;
