const app = require("../app");

const request = require("supertest");

const db = require("../db/connection");

const seed = require("../db/seeds/seed.js");

const data = require("../db/data/test-data/index.js");
const { articleData, commentData, topicData, userData } = data;

beforeEach(() => {
  return seed({ articleData, commentData, topicData, userData });
});

afterAll(() => {
  return db.end();
});

describe("/api/topics", () => {
  test("GET: 200 - serves an array of all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((res) => {
        const { topics } = res.body;
        expect(topics).toBeInstanceOf(Array);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
        expect(topics.length).toBe(3);
      });
  });
  test("GET: 404 - Bad request!", () => {
    return request(app)
      .get("/api/topics/badrequest")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request!");
      });
  });
});

describe("/api/articles", () => {
  test("GET: 200 - serves an array of all articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        const { articles } = res.body;
        expect(articles).toBeInstanceOf(Array);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(Number),
          });
        });
      });
  });

  test("GET: 404 - Bad request!", () => {
    return request(app)
      .get("/api/articlesbadrequest")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request!");
      });
  });

  test("GET: 200 - can sort the articles by the specified sort_by value", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at")
      .expect(200)
      .then((res) => {
        const { articles } = res.body;
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });

  test("GET: 400 - Invalid sort query", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at; DROP TABLE articles")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid sort query!");
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("GET: 200 - get an article from the articles table by a specified article_id", () => {
    const articleID = 2;
    return request(app)
      .get(`/api/articles/${articleID}`)
      .expect(200)
      .then((res) => {
        const { result } = res.body;
        expect(result).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          body: expect.any(String),
          article_id: expect.any(Number),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
        });
      });
  });
  test("GET: 400 - Bad request!", () => {
    return request(app)
      .get("/api/articles/NotAnId")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request!");
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("GET: 200 - responds with an array of comments with the specified article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((res) => {
        expect(res.body.comments).toHaveLength(11);
        res.body.comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            article_id: 1,
            author: expect.any(String),
            votes: expect.any(Number),
            created_at: expect.any(String),
            body: expect.any(String),
          });
        });
      });
  });
  test("GET: 200 - responds with an empty array when article has no comment", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then((res) => {
        expect(res.body.comments).toEqual([]);
      });
  });
  test("GET: 404 - valid but non-existent article_id", () => {
    return request(app)
      .get("/api/articles/1000/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found!");
      });
  });
  test("GET: 400 - Bad request!", () => {
    return request(app)
      .get("/api/articles/NotAnId/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request!");
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("POST: 201 - responds with an object containing the new comment and a username", () => {
    const newComment = {
      username: "lurker",
      body: "This morning, I showered for nine minutes.",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toMatchObject({
          comment_id: expect.any(Number),
          body: expect.any(String),
          article_id: expect.any(Number),
          author: expect.any(String),
          votes: expect.any(Number),
          created_at: expect.any(String),
        });
      });
  });
  test("POST: 400 - Bad request!", () => {
    const newComment = {
      username: "lurker",
      body: "This morning, I showered for nine minutes.",
    };
    return request(app)
      .post("/api/articles/NotAnId/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request!");
      });
  });
    test("POST: 404 - Bad request!", () => {
      const newComment = {
        username: "Joel",
        body: "This morning, I showered for nine minutes.",
      };
      return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("username not found!");
        });
    });
  test("POST: 400 - Bad request!", () => {
    const newComment = {};
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request!");
      });
  });
  test("POST: 404 - Bad request!", () => {
    const newComment = {
      username: "lurker",
      body: "This morning, I showered for nine minutes.",
    };
    return request(app)
      .post("/api/articles/10000/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found!");
      });
  });
});

describe("/api/articles/:article_id", () => {
    test("PATCH - 201: update the corresponding article when passed the article's id", () => {
        const incrementVotes = {inc_votes: 3}
        return request(app)
            .patch("/api/articles/1")
            .send(incrementVotes)
            .expect(201)
            .then(res => {
                const {article} = res.body
                const updateArticle = {
                    article_id: 1,
                    title: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: 103
                }
                expect(article).toMatchObject(updateArticle);
            })
    });
    test("PATCH: 400 - Sending an empty body to the db", () => {
        const incrementVotes = {};
        return request(app)
          .patch("/api/articles/1")
          .send(incrementVotes)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid input");
          });
    });
    test("PATCH: 400 - Sending an invalid type", () => {
        const incrementVotes = {inc_votes: 'three'};
        return request(app)
          .patch("/api/articles/1")
          .send(incrementVotes)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid input");
          });
    });
    test("PATCH: 400 - Invalid input", () => {
      const incrementVotes = { inc_votes: 3};
      return request(app)
        .patch("/api/articles/NotAnId")
        .send(incrementVotes)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input");
        });
    });
    test("PATCH: 404 - Bad request!", () => {
      const incrementVotes = { inc_votes: 3};
      return request(app)
        .patch("/api/articles/10000")
        .send(incrementVotes)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Article not found!");
        });
    });
})
