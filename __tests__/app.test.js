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
          console.log(user);
          expect(typeof username).toBe("string");
          expect(typeof name).toBe("string");
          expect(typeof avatar_url).toBe("string");
        });
      });
  });
});
