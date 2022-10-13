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

describe.only('GET /api/articles/ - More Queries', () => {
  describe('Sort By', () => {
    test("Return 200 and all articles when given non-default sort_by value", () => {
      return request(app)
      .get("/api/articles?sort_by=author")
      .expect(200)
      .then(({body}) => {
        const articles = body.articles;
        expect(articles).toBeSortedBy("author", { descending: true })
      })
    })
    test("Return 200 and all articles when given sort_by value of comment_count", () => {
      return request(app)
      .get("/api/articles?sort_by=comment_count")
      .expect(200)
      .then(({body}) => {
        const articles = body.articles;
        expect(articles).toBeSortedBy("comment_count", { descending: true })
      })
    })
    describe('error handling', () => { 
      test("Return 400 and error message when given non-existent sort_by value", () => {
        return request(app)
        .get("/api/articles?sort_by=non-existent")
        .expect(400)
        .then(({body}) => {
          expect(body.msg).toBe("400 Bad Request - invalid query given")
        })
      })
    })
  })
  describe('Order', () => { 
    test("Return 200 and all articles when given non-default order value", () => {
      return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then(({body}) => {
        const articles = body.articles;
        expect(articles).toBeSortedBy("created_at", { descending: false })
      })
    })
    describe('error handling', () => { 
      test("Return 400 and error message when given invalid order value", () => {
        return request(app)
        .get("/api/articles?order=non-existent")
        .expect(400)
        .then(({body}) => {
          expect(body.msg).toBe(`400 Bad Request - must receive "desc" or "asc"`)
        })
      })
    })
  })
  test("Return 200 and all articles when given both non-default sort_by and order values", () => {
    return request(app)
    .get("/api/articles?sort_by=votes&&order=asc")
    .expect(200)
    .then(({body}) => {
      const articles = body.articles;
      expect(articles).toBeSortedBy("votes", { descending: false })
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

describe('POST /api/articles/:article_id/comment', () => {
  test('Return status 201 and returns posted comment', () => {
    return request(app)
    .post("/api/articles/1/comments")
    .send({username: "icellusedkars", body: "great article!"})
    .expect(201)
    .then(({body}) => {
      expect(body.comment).toEqual(expect.objectContaining({
        comment_id: 19,
        votes: 0,
        body: "great article!",
        author: "icellusedkars",
        article_id: 1,
        created_at: expect.any(String),
      }))
    })
  })

  describe('Endpoint Error Handling', () => {
    test("Returns 400 and an error message when invalid id passed", () => {
      return request(app)
      .post("/api/articles/one/comments")
      .send({username: "icellusedkars", body: "great article!"})
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe("400 Bad Request - Invalid ID")
      })
    })

  test("Returns 404 and an error message when non-existant id given", () => {
      return request(app)
      .post("/api/articles/999/comments")
      .send({username: "icellusedkars", body: "great article!"})
      .expect(404)
      .then(({body}) => {
        expect(body.msg).toBe("404 Article Not Found")
      })
    })
  })

  describe('Request Body Error Handling', () => {
    test("Return 201 and ignores any extra/invalid properties", () => {
      return request(app)
      .post("/api/articles/1/comments")
      .send({username: "icellusedkars", body: "great article!", votes: 64, tag: "funny"})
      .expect(201)
      .then(({body}) => {
        const comment = body.comment;
        expect(comment).toEqual(expect.objectContaining({
          comment_id: 19,
          votes: 0,
          body: "great article!",
          author: "icellusedkars",
          article_id: 1,
          created_at: expect.any(String),
        }))
      })
    })

    test("Return 400 and when given empty/not enough data given", () => {
      return request(app)
      .post("/api/articles/1/comments")
      .send({})
      .expect(400)
      .then(({body}) => {        
        expect(body.msg).toBe("400 Bad Request - not enough data given")
      })
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