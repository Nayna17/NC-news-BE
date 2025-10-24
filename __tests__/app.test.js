const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app");

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
          const { title, topic, author, created_at, votes, article_img_url } =
            article;
          expect(typeof title).toBe("string");
          expect(typeof topic).toBe("string");
          expect(typeof author).toBe("string");
          expect(typeof created_at).toBe("string");
          expect(typeof votes).toBe("number");
          expect(typeof article_img_url).toBe("string");
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
        expect(body.comments).toBeInstanceOf(Array);

        if (body.comments.length > 0) {
          body.comments.forEach((comment) => {
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
      });
  });
});
