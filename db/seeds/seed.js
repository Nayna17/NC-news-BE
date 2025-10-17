const db = require("../connection");
const {format} = require("node-pg-format");
const {createLookupObj, convertTimestampToDate} = require("../seeds/utils")

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db
    .query(`DROP TABLE IF EXISTS comments`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS articles`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS topics`);
    })
    .then(() => {
      return db.query(`CREATE TABLE topics (
    slug VARCHAR(200) PRIMARY KEY,
    description VARCHAR(200) NOT NULL,
    img_url VARCHAR(1000)
  );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE users (
      username VARCHAR(50) PRIMARY KEY,
      name VARCHAR(50),
      avatar_url VARCHAR(1000)
      );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE articles (
      article_id SERIAL PRIMARY KEY,
      title VARCHAR(100),
      topic VARCHAR REFERENCES topics(slug),
      author VARCHAR(15) REFERENCES users(username),
      body TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      votes INT DEFAULT 0,
      article_img_url VARCHAR(1000)
      );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE comments (
      comment_id SERIAL PRIMARY KEY,
      article_id INT REFERENCES articles(article_id),
      body TEXT,
      votes INT DEFAULT 0,
      author VARCHAR(15) REFERENCES users(username),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`);
    })
    .then(() => {
      const formattedTopics = topicData.map((topic) => {
        return [topic.slug, topic.description, topic.img_url];
      });
      const sqlString = format(`INSERT INTO topics (slug, description, img_url) VALUES %L`, formattedTopics)
    
        return db.query(sqlString);
    }).then(() => {
      const formattedUsers = userData.map((users) => {
        return [users.username, users.name, users.avatar_url];

      });
      const sqlString = format(`INSERT INTO users (username, name, avatar_url) VALUES %L`, formattedUsers)
      return db.query(sqlString)
    }).then(() => {
      const formattedArticles = articleData.map((articles) => {
        return [articles.title, articles.topic, articles.author, articles.body, convertTimestampToDate(articles).created_at, articles.votes, articles.article_img_url];

      });
      const sqlString = format(`INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *`, formattedArticles)
      return db.query(sqlString)
  
    }).then(({rows}) => {
      const lookUp = createLookupObj(rows)   
      const formattedComments = commentData.map((comments) => {
        return [lookUp[comments.article_title], comments.body, comments.votes, comments.author, convertTimestampToDate(comments).created_at]
      })
      const sqlString = format(`INSERT INTO comments (article_id, body, votes, author, created_at) VALUES %L`, formattedComments)
      return db.query(sqlString)
    })
    
   }

module.exports = seed;
