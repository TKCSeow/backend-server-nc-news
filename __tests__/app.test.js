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

describe('GET /api/articles', () => {
  test("Return status 200 and returns all articles with comment_count", () => {
    return request(app)
    .get("/api/articles")  
    .expect(200)
    .then(({body}) => {
      const articles = body.articles;

      expect(articles).toBeInstanceOf(Array);
      expect(articles).toHaveLength(12)

      articles.forEach(article => {
        expect(article).toEqual(
          expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              author: expect.any(String),
              topic: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
        )
      })
    })
  })

  describe('GET /api/articles - SORTING', () => {
    test("Return 200, should have default sorting by date, descending", () => {
      return request(app)
      .get("/api/articles")  
      .expect(200)
      .then(({body}) => {
        const articles = body.articles;
        expect(articles).toBeSortedBy("created_at", { descending: true })

      })
    })
  })

  describe('GET /api/articles - QUERIES', () => {
    test("Return 200, should take a query of topic and filter articles", () => {
      return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({body}) => {
        const articles = body.articles;
  
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toHaveLength(1)

        articles.forEach(article => {
          expect(article.topic).toBe("cats")
        })
      })
    })

    test("Return status 404 and an error message when non-existant query value given", () => {
      return request(app)
      .get("/api/articles?topic=economy")
      .expect(404)
      .then(({body}) => {
        expect(body.msg).toBe("404 no resources found")
      })
    })

    test("Return status 400 and an error message when query value left empty", () => {
      return request(app)
      .get("/api/articles?topic=")
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe("400 Bad Request - no query value given")
      })
    })

    test("Return status 200 and all articles when non-existant query type given", () => {
      return request(app)
      .get("/api/articles?tag=funny")
      .expect(200)
      .then(({body}) => {
        const articles = body.articles; 
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toHaveLength(12)
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

  test("Return status 400 and an error message when invalid id passed", () => {
    return request(app)
    .patch("/api/articles/one")
    .send({inc_votes: 1})
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe("400 Bad Request - Invalid ID")
    })
  })

  test("return status 200 and return article unchanged", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(200)
      .then(({body}) => {
        const article = body.article;
        expect(article.votes).toBe(100)
      })
  });

  
  test("return status 400 when non-integer given", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({inc_votes: 1.5})
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe("400 Bad Request - inc_votes must be an integer")
      })
  });

  test("return status 400 when non-numeric string given", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({inc_votes: "one"})
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe("400 Bad Request - inc_votes must be an integer")
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

describe('GET /api/articles/:article_id/comments', () => {
  test('Return status 200 and return all comments of articles', () => {
    return request(app)
    .get("/api/articles/1/comments")
    .expect(200)
    .then(({body}) => {
      const comments = body.comments;
      expect(comments).toBeInstanceOf(Array)
      expect(comments).toHaveLength(11)
      
      comments.forEach(comment => {
        expect(comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            body: expect.any(String),
            author: expect.any(String),
            votes: expect.any(Number),
            created_at: expect.any(String),
        }))
      })
    })
  })

  test('Return status 200 and empty array when there are no comments on an article', () => {
    return request(app)
    .get("/api/articles/11/comments")
    .expect(200)
    .then(({body}) => {
      const comments = body.comments;
      expect(comments).toEqual([])
    })
  })

  describe('ERROR HANDLING', () => {
    test("Returns 400 and an error message when invalid id passed", () => {
      return request(app)
      .get("/api/articles/one/comments")
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe("400 Bad Request - Invalid ID")
      })
    })

    test("Returns 404 and an error message when non-existant article requested", () => {
      return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then(({body}) => {
        expect(body.msg).toBe("404 Article Not Found")
      })
    })
  })

})

describe.only('DELETE /api/comments/:comment_id', () => {
  test("Return 204 when successful", () => {
    return request(app)
    .delete("/api/comments/1")
    .expect(204);
  })
  test("Return 400 and error message when invalid id provided", () => {
    return request(app)
    .delete("/api/comments/one")
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe("400 Bad request - invalid comment id given")
    })
  })
  test("Return 404 and error message when non-existent id provided", () => {
    return request(app)
    .delete("/api/comments/99999")
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe("404 comment not found")
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