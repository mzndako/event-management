/* eslint-disable arrow-body-style */
const request = require('supertest');
const httpStatus = require('http-status');
const { expect } = require('chai');
const sinon = require('sinon');
const app = require('../../../index');
const User = require('../../models/user.model');

const sandbox = sinon.createSandbox();

describe('Authentication API', () => {
  let dbUser;
  let user;

  beforeEach(async () => {
    dbUser = {
      username: 'johnsmith',
      password: 'mypassword',
      name: 'Bran Stark',
    };

    user = {
      username: 'sousa.dfs',
      password: '123456',
      name: 'Daniel Sousa',
    };

    await User.destroy({ where: {} });
    await User.create(dbUser);
  });

  afterEach(() => sandbox.restore());

  describe('POST /v1/auth/register', () => {
    it('should register a new user when request is ok', () => {
      return request(app)
        .post('/v1/auth/register')
        .send(user)
        .expect(httpStatus.CREATED)
        .then((res) => {
          delete user.password;
          expect(res.body.token).to.have.a.property('accessToken');
          expect(res.body.token).to.have.a.property('expiresIn');
          expect(res.body.user).to.include(user);
        });
    });

    it('should report error when username already exists', () => {
      return request(app)
        .post('/v1/auth/register')
        .send(dbUser)
        .expect(httpStatus.CONFLICT)
        .then((res) => {
          const { field } = res.body.errors[0];
          const { location } = res.body.errors[0];
          const { messages } = res.body.errors[0];
          expect(field).to.be.equal('username');
          expect(location).to.be.equal('body');
          expect(messages).to.include('"username" already exists');
        });
    });

    it('should report error when name, username and password are not provided', () => {
      return request(app)
        .post('/v1/auth/register')
        .send({})
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          const { field } = res.body.errors[0];
          const { location } = res.body.errors[0];
          const { messages } = res.body.errors[0];
          expect(field).to.be.equal('name');
          expect(location).to.be.equal('body');
          expect(messages).to.include('"name" is required');
        });
    });
  });

  describe('POST /v1/auth/login', () => {
    it('should return an accessToken when username and password matches', () => {
      return request(app)
        .post('/v1/auth/login')
        .send(dbUser)
        .expect(httpStatus.OK)
        .then((res) => {
          delete dbUser.password;
          expect(res.body.token).to.have.a.property('accessToken');
          expect(res.body.token).to.have.a.property('expiresIn');
          expect(res.body.user).to.include(dbUser);
        });
    });

    it('should report error when username and password are not provided', () => {
      return request(app)
        .post('/v1/auth/login')
        .send({})
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          const { field } = res.body.errors[0];
          const { location } = res.body.errors[0];
          const { messages } = res.body.errors[0];
          expect(field).to.be.equal('username');
          expect(location).to.be.equal('body');
          expect(messages).to.include('"username" is required');
        });
    });

    it("should report error when username and password don't match", () => {
      dbUser.password = 'xxx';
      return request(app)
        .post('/v1/auth/login')
        .send(dbUser)
        .expect(httpStatus.UNAUTHORIZED)
        .then((res) => {
          const { code } = res.body;
          const { message } = res.body;
          expect(code).to.be.equal(401);
          expect(message).to.be.equal('Incorrect username or password');
        });
    });
  });
});
