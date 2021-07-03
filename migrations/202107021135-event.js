module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable(
        'Event',
        {
          eventId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
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
      await queryInterface.dropTable('Event');
    } catch (err) {
      throw err;
    }
  },
};
