module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable(
        'SubEvent',
        {
          eventId: {
            type: DataTypes.UUID,
            require: true,
          },

          subEventId: {
            type: DataTypes.UUID,
            require: true,
            references: {
              model: 'Event',
              key: 'eventId',
            },
          },

          createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
          },

          updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
          },
        },
      );
    } catch (err) {
      throw err;
    }
  },
  down: async (queryInterface) => {
    await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable('Profits');
    } catch (err) {
      throw err;
    }
  },
};
