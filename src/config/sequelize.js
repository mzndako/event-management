const { Sequelize } = require('sequelize');
const {
  sequelize: {
    database, username, password, server,
  },
} = require('./vars');

const sequelize = new Sequelize(database, username, password, {
  host: server,
  dialect: 'postgres', /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
});

module.exports = sequelize;
