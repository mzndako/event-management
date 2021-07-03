/* eslint-disable arrow-body-style */
/* eslint-disable no-unused-expressions */
const request = require('supertest');
const httpStatus = require('http-status');
const { expect } = require('chai');
const app = require('../../../index');
const User = require('../../models/user.model');
const Event = require('../../models/event.model');
const SubEvent = require('../../models/subEvent.model');

const adjustCurrentDate = (adjustDate) => {
  const date = new Date();
  date.setDate(date.getDate() + adjustDate);

  return date.toISOString();
};

describe('Event API', async () => {
  let userAccessToken;
  let dbUsers;
  let user;
  let event;

  const password = '123456';

  beforeEach(async () => {
    dbUsers = {
      branStark: {
        username: 'branstark',
        password,
        name: 'Bran Stark',
      },
      jonSnow: {
        username: 'jonsnow',
        password,
        name: 'Jon Snow',
      },
    };

    user = {
      username: 'sousa.dfs',
      password,
      name: 'Daniel Sousa',
    };

    event = {
      name: 'event 1 title',
      date: adjustCurrentDate(+1),
      pictureUrl: 'http://localhost/image.png',
    };

    await User.destroy({ where: {} });
    await SubEvent.destroy({ where: {} });
    await Event.destroy({ where: {} });

    const branStack = await User.create(dbUsers.branStark);
    user = await User.create(dbUsers.jonSnow);
    await Event.createEvent(event, branStack.userId);
    await Event.createEvent(event, user.userId);

    dbUsers.branStark.password = password;
    dbUsers.jonSnow.password = password;
    userAccessToken = (await User.findUser(dbUsers.jonSnow)).token();
  });

  describe('POST /v1/events', () => {
    it('should create a new event when request is okay', () => {
      return request(app)
        .post('/v1/events')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send(event)
        .expect(httpStatus.CREATED)
        .then((res) => {
          expect(res.body).to.include(event);
        });
    });

    it('should report error when name is less than 8', () => {
      event.name = 'short';
      return request(app)
        .post('/v1/events')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send(event)
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          const { field } = res.body.errors[0];
          const { location } = res.body.errors[0];
          expect(field).to.be.equal('name');
          expect(location).to.be.equal('body');
        });
    });

    it('should report error when name is greather than 16', () => {
      event.name = 'longer test that is greather';
      return request(app)
        .post('/v1/events')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send(event)
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          const { field } = res.body.errors[0];
          const { location } = res.body.errors[0];
          expect(field).to.be.equal('name');
          expect(location).to.be.equal('body');
        });
    });

    it('should report error event date is less than current date', () => {
      event.date = adjustCurrentDate(-1);
      return request(app)
        .post('/v1/events')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send(event)
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          const { field } = res.body.errors[0];
          const { location } = res.body.errors[0];
          expect(field).to.be.equal('date');
          expect(location).to.be.equal('body');
        });
    });
  });

  describe('GET /v1/events', () => {
    it('should get only events created by the user', () => {
      return request(app)
        .get('/v1/events')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(httpStatus.OK)
        .then(async (res) => {
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.lengthOf(1);
        });
    });
  });

  describe('DELETE /v1/events', () => {
    it('should delete event', async () => {
      const { eventId } = (await Event.findOne({ where: { createdBy: user.userId } }));

      let users = await Event.findAll({});
      expect(users).to.have.lengthOf(2);

      return request(app)
        .delete(`/v1/events/${eventId}`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(httpStatus.NO_CONTENT)
        .then(() => request(app)
          .get('/v1/events')
          .set('Authorization', `Bearer ${userAccessToken}`))
        .then(async (res) => {
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.lengthOf(0);

          users = await Event.findAll({});
          expect(users).to.have.lengthOf(1);
        });
    });
  });
});
