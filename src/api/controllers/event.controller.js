const httpStatus = require('http-status');
const EventModel = require('../models/event.model');

/**
 * Create Event
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const event = await EventModel.createEvent(req.body, req.user.userId);

    res.status(httpStatus.CREATED);
    res.json(event);
  } catch (error) {
    next(error);
  }
};

/**
 * Update Event
 * @public
 */
exports.patch = async (req, res, next) => {
  const content = req.body;
  const { eventId } = req.params;
  const { userId } = req.user;
  try {
    await EventModel.patchEvent(eventId, userId, content);
    const event = await EventModel.get(userId, eventId);

    res.status(httpStatus.CREATED);
    res.json(event);
  } catch (error) {
    next(error);
  }
};

/**
 * Get Events
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    // eslint-disable-next-line
    const data = await EventModel.list({ ...req.query, userId: req.user.userId });
    res.json(data);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete Event
 * @param id event Id
 * @public
 */
exports.remove = async (req, res, next) => {
  const { eventId } = req.params;

  try {
    await EventModel.delete(eventId, req.user.userId);

    res.status(httpStatus.NO_CONTENT).end();
  } catch (error) {
    next(error);
  }
};
