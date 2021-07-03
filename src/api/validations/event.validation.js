const Joi = require('joi');

module.exports = {

  // GET /v1/events
  listEvents: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
    },
  },

  // POST /v1/events
  createEvent: {
    body: {
      name: Joi.string().min(8).max(16).required(),
      date: Joi.date().min('now').required(),
      subEvents: Joi.array().items(Joi.string()),
      pictureUrl: Joi.string().required(),
    },
  },

  // POST /v1/events
  patchEvent: {
    body: {
      name: Joi.string().min(8).max(16),
      date: Joi.date().min('now'),
      subEvents: Joi.array().items(Joi.string()),
      pictureUrl: Joi.string().optional(),
    },
  },
};
