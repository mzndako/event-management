const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../config/sequelize');

/**
 * Event Schema
 * @private
 */
class SubEventModel extends Model {}

SubEventModel.init({
  eventId: {
    type: DataTypes.UUID,
    require: true,
  },
  subEventId: {
    type: DataTypes.UUID,
    require: true,
  },
}, {
  sequelize,
  modelName: 'SubEvent',
  timestamps: true,
});

module.exports = SubEventModel;
