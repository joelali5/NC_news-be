const app = require("../app");

const request = require("supertest");

const db = require("../db/connection");

const seed = require("../db/seeds/seed.js");

const data = require("../db/data/test-data/index.js");
const {articleData, commentData, topicData, userData} = data

beforeEach(() => {
    return seed({articleData, commentData, topicData, userData});
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
                        description: expect.any(String)
                    });
                });
                expect(topics.length).toBe(3);
            });
    });
    test("GET: 404 - Bad request!", () => {
        return request(app)
            .get("/api/topics/badrequest")
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe("Bad request!");
            });
    });
});