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

describe('GET /api/articles/:article_id - comment_count', () => {
  test("Return status 200 and returns specified article with comment_count", () => {
    return request(app)
    .get("/api/articles/1")  
    .expect(200)
    .then(({body}) => {
      const article = body.article;
      
      expect(article).toEqual(
          expect.objectContaining({
            comment_count: expect.any(Number),         
          })
      )
          
      expect(article.comment_count).toBe(11)
      
    })
  })
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