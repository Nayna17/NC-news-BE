const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app");
require("jest-sorted");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET /api/topics", () => {
  test("200: Responds with the requested topics object containing all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const topics = body.topics;
        expect(topics.length > 0).toBe(true);
        topics.forEach((topic) => {
          const { description, slug, img_url } = topic;

          expect(typeof description).toBe("string");
          expect(typeof slug).toBe("string");
          expect(typeof img_url).toBe("string");
        });
      });
  });
});
describe("GET /api/articles", () => {
  test("200: Responds with the requested articles object containing all articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles.length > 0).toBe(true);
        articles.forEach((article) => {
          const {
            title,
            topic,
            author,
            created_at,
            votes,
            article_img_url,
            comment_count,
          } = article;
          expect(typeof title).toBe("string");
          expect(typeof topic).toBe("string");
          expect(typeof author).toBe("string");
          expect(typeof created_at).toBe("string");
          expect(typeof votes).toBe("number");
          expect(typeof article_img_url).toBe("string");
          expect(typeof comment_count).toBe("number");
        });
      });
  });
});
describe("GET /api/users", () => {
  test("200: Responds with the requested users object containing all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const users = body.users;
        expect(users.length > 0).toBe(true);
        users.forEach((user) => {
          const { username, name, avatar_url } = user;
          expect(typeof username).toBe("string");
          expect(typeof name).toBe("string");
          expect(typeof avatar_url).toBe("string");
        });
      });
  });
});
describe("GET /api/articles/:article_id", () => {
  test("200: Responds with the requested article object containing the correct article properties", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const {
          title,
          topic,
          author,
          created_at,
          votes,
          article_img_url,
          article_id,
        } = body.article;
        expect(typeof title).toBe("string");
        expect(typeof topic).toBe("string");
        expect(typeof author).toBe("string");
        expect(typeof created_at).toBe("string");
        expect(typeof votes).toBe("number");
        expect(typeof article_img_url).toBe("string");
        expect(article_id).toBe(1);
      });
  });
  test("404: Responds with an error message when a request is made for an article_id that does not exist", () => {
    return request(app)
      .get("/api/articles/9000")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Request not found");
      });
  });
  test("400: Responds with an error message when a request is made for an article_id that is invalid", () => {
    return request(app)
      .get("/api/articles/not-an-article")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("You've made a Bad Request");
      });
  });
});
describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with array of comment objects for the requested article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        expect(comments).toBeInstanceOf(Array);

        if (comments.length > 0) {
          comments.forEach((comment) => {
            expect(comment).toMatchObject({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              article_id: 1,
            });
          });
        }
        for (let i = 0; i < comments.length - 1; i++) {
          const currentDate = new Date(comments[i].created_at);
          const nextDate = new Date(comments[i + 1].created_at);
          expect(currentDate.getTime()).toBeGreaterThanOrEqual(
            nextDate.getTime()
          );
        }
      });
  });
  test("404: Responds with an error message when a request is made for an article_id that does not exist", () => {
    return request(app)
      .get("/api/articles/9000/comments")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Request not found");
      });
  });
  test("400: Responds with an error message when a request is made for an article_id that is invalid", () => {
    return request(app)
      .get("/api/articles/not-an-article/comments")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("You've made a Bad Request");
      });
  });
  test("200: Responds with an empty array when the requested article exists but there are no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
});
describe("POST /api/articles/:article_id/comments", () => {
  test("201: Responds with the posted comment when valid", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This is a test comment",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toMatchObject({
          author: "butter_bridge",
          body: "This is a test comment",
          article_id: 1,
          votes: 0,
          comment_id: expect.any(Number),
          created_at: expect.any(String),
        });
      });
  });
  test("400: Responds with an error if username or body is missing", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "butter_bridge" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing required fields: username and body");
      });
  });
  test("404: Responds with error if article_id does not exist", () => {
    const newComment = { username: "butter_bridge", body: "Hello!" };
    return request(app)
      .post("/api/articles/9999/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Request not found");
      });
  });
});
describe("PATCH /api/articles/:article_id", () => {
  test("200: Responds with the updated article when given a positive inc_votes", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toHaveProperty("article_id", 1);
        expect(body.article).toHaveProperty("votes", expect.any(Number));
        expect(body.article.votes).toBeGreaterThan(0);
      });
  });
  test("200: Responds with the updated article when given a negative inc_votes", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -20 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article.article_id).toBe(1);
        expect(typeof body.article.votes).toBe("number");
      });
  });
  test("400: Responds with error when inc_votes is missing", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input type for inc_votes");
      });
  });
  test("400: Responds with error when inc_votes is not a number", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "ten" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input type for inc_votes");
      });
  });
});
describe("DELETE /api/comments/:comment_id", () => {
  test("204: Deletes the given comment and responds with no content", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });
  test("404: Responds with an error when the comment does not exist", () => {
    return request(app)
      .delete("/api/comments/9000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comment not found");
      });
  });
  test("400: Responds with an error when there is an invalid comment_id", () => {
    return request(app)
      .delete("/api/comments/not-an-id")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid comment ID");
      });
  });
});
describe("GET /api/articles (sorting queries)", () => {
  test("200: Responds with sorted articles by valid column and defaults to desc order", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("title", { descending: true });
      });
  });
  test("200: Sorts articles by valid column and asc order", () => {
    return request(app)
      .get("/api/articles?sort_by=votes&order=asc")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("votes", { descending: false });
      });
  });
  test("400: Responds with an error for invalid sort_by query", () => {
    return request(app)
      .get("/api/articles?sort_by=not_a_column")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid sort_by query");
      });
  });
  test("400: Responds with an error for invalid order", () => {
    return request(app)
      .get("/api/articles?order=random")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid order query");
      });
  });
});
describe("GET /api/articles (topic queries)", () => {
  test("200: Filters articles by topic", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBeGreaterThan(0);
        articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });
  test("404: Responds with error if topic not found", () => {
    return request(app)
      .get("/api/articles?topic=not_a_topic")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Topic not found");
      });
  });
});
