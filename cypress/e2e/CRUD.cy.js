/// <reference types="cypress"/>

const dataJson = require('../e2e/dataUser.json')
const create = dataJson.create
const update = dataJson.update
const post = dataJson.post
const comment = dataJson.comments
const todos = dataJson.todos

describe('Post, Get, Put and Delete User', () => {
  let userId;
  let invalidId = 'xxx'
  let accessToken = 'Bearer 8448492491a1ab6d620b8a2724a26b74518778902acf50366fc3c5cc425def5e';
  let randomString = Math.random().toString(36).substring(2, 8);
  let randomEmail = `${randomString}@example.com`;

  before(() => {
    cy.request({
      method: 'POST',
      url: 'https://gorest.co.in/public/v2/users',
      headers: {
        authorization: accessToken
      },
      body: {
        "name": create.name,
        "email": randomEmail,
        "gender": create.gender,
        "status": create.status
      }
    }).then((response) => {
      expect(response.status).to.eq(201);
      userId = response.body.id;
    });
  });

  it('get users', () => {
    cy.request({
      method: 'GET',
      url: 'https://gorest.co.in/public/v2/users',
      headers: {
        authorization: accessToken
      }

    }).then((res) => {
      const userId = res.body.id
      cy.log("user id is:" + userId)

      expect(res.status).to.eql(200)
      expect(res.body[0]).has.property('id')
      expect(res.body[0]).has.property('name')
      expect(res.body[0]).has.property('email')
      expect(res.body[0]).has.property('gender')
      expect(res.body[0]).has.property('status')
    })
  })

  it('Get User with valid id', () => {
    cy.request({
      method: 'GET',
      url: `https://gorest.co.in/public/v2/users/${userId}`,
      headers: {
        authorization: accessToken
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.id).to.eq(userId);
      expect(response.body).has.property('email', randomEmail)
      expect(response.body).has.property('gender', create.gender)
      expect(response.body).has.property('status', create.status)
    });
  });

  it('get users with invalid', () => {
    cy.request({
      method: 'GET',
      url: `https://gorest.co.in/public/v2/users/${invalidId}`,
      headers: {
        authorization: accessToken
      },
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eql(404)
    })
  })

  it('Update User', () => {
    let randomStringUpdate = Math.random().toString(36).substring(2, 8);
    let randomEmailUpdate = `${randomStringUpdate}@update.com`;

    cy.request({
      method: 'PUT',
      url: `https://gorest.co.in/public/v2/users/${userId}`,
      headers: {
        authorization: accessToken
      },
      body: {
        "name": update.name,
        "email": randomEmailUpdate,
        "gender": update.gender,
        "status": update.status
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.id).to.eq(userId);
      expect(response.body).has.property('email', randomEmailUpdate)
      expect(response.body).has.property('gender', update.gender)
      expect(response.body).has.property('status', update.status)
    })
  })

  it('Create and get post', () => {
    cy.request({
      method: 'POST',
      url: `https://gorest.co.in/public/v2/users/${userId}/posts`,
      headers: {
        authorization: accessToken
      },
      body: {
        "title": post.title,
        "body": post.body
      }
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.title).to.eq(post.title)
      expect(response.body.body).to.eq(post.body)

      cy.request({
        method: 'GET',
        url: `https://gorest.co.in/public/v2/users/${userId}/posts`,
        headers: {
          authorization: accessToken
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body[0]).has.property('title')
        expect(response.body[0]).has.property('body')

      })
    });
  })

  it('Create and get todos', () => {
    cy.request({
      method: 'POST',
      url: `https://gorest.co.in/public/v2/users/${userId}/todos`,
      headers: {
        authorization: accessToken
      },
      body: {
        "title": todos.title,
        "status": todos.status
      }
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.title).to.eq(todos.title)
      expect(response.body.status).to.eq(todos.status)
    })

    it('Delete User with invalid id', () => {
      cy.request({
        method: 'DELETE',
        url: `https://gorest.co.in/public/v2/users/${invalidId}`,
        headers: {
          authorization: accessToken
        },
        failOnStatusCode: false
      }).then((res) => {
        expect(res.status).to.eql(404)
      })
    })

    it('Delete User with Valid Id', () => {
      cy.request({
        method: 'DELETE',
        url: `https://gorest.co.in/public/v2/users/${userId}`,
        headers: {
          authorization: accessToken
        }
      }).then((response) => {
        expect(response.status).to.eq(204);

        cy.request({
          method: 'GET',
          url: `https://gorest.co.in/public/v2/users/${userId}`,
          headers: {
            authorization: accessToken
          },
          failOnStatusCode: false
        }).then((response) => {
          expect(response.status).to.eq(404);
          expect(response.body.message).to.eq('Resource not found')
        })
      });
    })
  })
})
