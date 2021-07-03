const {
  DataTypes, Model, Sequelize, Op,
} = require('sequelize');
const sequelize = require('../../config/sequelize');
const SubEventModel = require('./subEvent.model');

/**
 * Event Schema
 * @private
 */
class EventModel extends Model {}

EventModel.init({
  eventId: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(200),
    require: true,
  },
  pictureUrl: {
    type: DataTypes.STRING(200),
  },
  date: {
    type: DataTypes.DATE,
    require: true,
  },
  createdBy: {
    type: DataTypes.UUID,
    require: true,
  },
}, {
  sequelize,
  modelName: 'Event',
  timestamps: true,
});

EventModel.hasMany(SubEventModel, {
  as: 'subEvents',
  foreignKey: 'eventId',
});

SubEventModel.belongsTo(EventModel, {
  as: 'event',
  foreignKey: 'subEventId',
});

/**
 * Get an event
 * @param {string} userId Retrieve event for the specified user
 * @returns event
 */
EventModel.get = function (userId, eventId) {
  const where = { eventId };
  if (userId) {
    where.createdBy = userId;
  }

  return this.findOne({
    where,
    include: {
      model: SubEventModel,
      as: 'subEvents',
      include: {
        model: EventModel,
        as: 'event',
      },
    },
  });
};

/**
 * Get all the events
 * @param {string} userId Retrieve events for the specified user
 * @param {string} eventName Search by event name
 * @param {number} page Pagination current page number
 * @param {number} perPage Maximum records return
 * @returns List of events
 */
EventModel.list = function ({
  userId, perPage = 10, page = 1, eventName = '',
} = {}) {
  const where = {};
  if (userId) {
    where.createdBy = userId;
  }

  if (eventName) {
    where.name = {
      [Op.iLike]: `%${eventName}%`,
    };
  }

  return this.findAll({
    where,
    include: {
      model: SubEventModel,
      as: 'subEvents',
      include: {
        model: EventModel,
        as: 'event',
      },
    },
    limit: perPage,
    offset: (page - 1) * perPage,
    order: [['createdAt', 'DESC']],
  });
};

/**
 * Create a new event
 * @param {*} content Event details
 * @param {*} userId Current logged-in user Id
 * @returns The newly created event
 */
EventModel.createEvent = async (content, userId) => {
  let event = await EventModel.create({ ...content, createdBy: userId });
  if (content.subEvents) {
    const subEvents = content.subEvents
      .map(subEventId =>
        SubEventModel.create({ eventId: event.eventId, subEventId }));

    await Promise.all(subEvents);
    event = await EventModel.get(userId, event.eventId);
  }
  return event;
};

/**
 * Update an existing record
 * @param {*} eventId The event Id to edit
 * @param {*} userId The current logged-in user Id
 * @param {*} content Event content to update
 */
EventModel.patchEvent = async (eventId, userId, content) => {
  await EventModel.update(
    { ...content },
    {
      where: { eventId, createdBy: userId },
    },
  );

  if (content.subEvents) {
    await SubEventModel.destroy({ where: { eventId } });
    const subEvents = content.subEvents
      .map(subEventId => SubEventModel.create({ eventId, subEventId }));

    await Promise.all(subEvents);
  }
};

/**
 * Delete an existing record
 * @param {string} eventId The event id to delete
 * @param {string} userId Current logged in user
 */
EventModel.delete = async function (eventId, userId) {
  await SubEventModel.destroy({
    where: {
      [Op.or]: [
        {
          eventId,
        },
        {
          subEventId: eventId,
        },
      ],
    },
  });
  await this.destroy({ where: { eventId, createdBy: userId } });
};

module.exports = EventModel;
