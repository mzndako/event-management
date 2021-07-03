const EventModel = require('../../models/event.model');

exports.getAllEvents = (searchQuery, req) =>
  EventModel.list({ ...searchQuery, userId: req.user.userId });
