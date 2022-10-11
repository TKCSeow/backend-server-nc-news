const app = require("../app.js");
const request = require("supertest")
const db = require("../db/connection.js")
const testData = require('../db/data/test-data');
const seed = require('../db/seeds/seed');

afterAll(() => {
    db.end();
  });

beforeEach(() => {
    return seed(testData)
})

describe("ALL *", () => {
    test("Returns 404 and an error message when non existant endpoint requested", () => {
      return request(app)
      .get("/api/nonexistant")
      .expect(404)
      .then(({body}) => {
        expect(body.msg).toBe("404 Route Not Found")
      })
    })
  })

describe('GET /api/topics', () => {
    test("Return status 200 and all topics", () => {
      return request(app)
      .get("/api/topics")  
      .expect(200)
      .then(({body}) => {
        const topics = body.topics;
        expect(topics).toBeInstanceOf(Array)
        expect(topics).toHaveLength(3)
        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              description: expect.any(String),
              slug: expect.any(String),
            })
          )
        })
      })
    })
})

describe('GET /api/articles/:article_id', () => {
    test("Return status 200 and returns data of specified article", () => {
      return request(app)
      .get("/api/articles/1")  
      .expect(200)
      .then(({body}) => {
        const article = body.article;
        expect(article).toEqual(
            expect.objectContaining({
                article_id: expect.any(Number),
                title: expect.any(String),
                author: expect.any(String),
                topic: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
            })
        )
        expect(article).toEqual(  {
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 100,
          });
      })
    })

    test("Returns 400 and an error message when invalid id passed", () => {
        return request(app)
        .get("/api/articles/one")
        .expect(400)
        .then(({body}) => {
          expect(body.msg).toBe("400 Bad Request - Invalid ID")
        })
      })

    test("Returns 404 and an error message when non-existant article requested", () => {
        return request(app)
        .get("/api/articles/999")
        .expect(404)
        .then(({body}) => {
          expect(body.msg).toBe("404 Article Not Found")
        })
      })
})

describe('PATCH /api/articles/:article_id', () => {
  test("Return status 200 and returns the updated article with votes added to", () => {
    return request(app)
    .patch("/api/articles/1")
    .send({inc_votes: 1})  
    .expect(200)
    .then(({body}) => {
      const article = body.article;     
      expect(article.votes).toBe(101)
    })
  })

  test("Return status 200 and returns the updated article with votes deducted", () => {
    return request(app)
    .patch("/api/articles/1")
    .send({inc_votes: -1})  
    .expect(200)
    .then(({body}) => {
      const article = body.article;     
      expect(article.votes).toBe(99)
    })
  })

  test("Return status 200 and returns the updated article with votes = 0 when deducting greater than votes held", () => {
    return request(app)
    .patch("/api/articles/1")
    .send({inc_votes: -101})  
    .expect(200)
    .then(({body}) => {
      const article = body.article;     
      expect(article.votes).toBe(0)
    })
  })

  test("Return status 400 and an error message when invalid id passed", () => {
    return request(app)
    .patch("/api/articles/one")
    .send({inc_votes: 1})
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe("400 Bad Request - Invalid ID")
    })
  })

  test("return status 400 and an error message when an empty object is in the request", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe("400 Bad Request - inc_votes not given")
      })
  });

  test("return status 404 and an error message when the article does not exists", () => {
    return request(app)
      .patch("/api/articles/99999")
      .send({inc_votes: 1})
      .expect(404)
      .then(({body}) => {
        expect(body.msg).toBe("404 Article Not Found")
      })
  });

  test("return status 200 when successful and ignores any extra/invalid keys", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({inc_votes: 1, title: "New Title"})
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article.title).toBe("Living in the shadow of a great man");
      });
  });

})

describe('GET /api/users', () => {
    test("Return status 200 and returns of all users", () => {
      return request(app)
        .get("/api/users")  
        .expect(200)
        .then(({body}) => {
            const users = body.users;
            expect(users).toBeInstanceOf(Array)
            expect(users).toHaveLength(4)
            users.forEach((user) => {
                expect(user).toEqual(
                    expect.objectContaining({
                        username: expect.any(String),
                        name: expect.any(String),
                        avatar_url: expect.any(String),
                    })
                )
            })
        })
    })
})