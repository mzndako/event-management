module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable(
        'User',
        {
          userId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
          },

          name: {
            type: DataTypes.STRING(300),
            require: true,
          },
          username: {
            type: DataTypes.STRING(300),
            require: true,
            unique: true,
          },
          password: {
            type: DataTypes.STRING(100),
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
      await queryInterface.dropTable('User');
    } catch (err) {
      throw err;
    }
  },
};
