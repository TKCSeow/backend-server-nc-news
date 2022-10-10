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