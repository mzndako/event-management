const path = require('path');

// import .env variables
require('dotenv-safe').load({
  path: path.join(__dirname, '../../.env'),
  sample: path.join(__dirname, '../../.env.example'),
});

let dbVars = {
  server: process.env.DB_HOST,
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
};

if (process.env.NODE_ENV === 'test') {
  dbVars = {
    server: process.env.DB_TEST_HOST,
    database: process.env.DB_TEST_NAME,
    username: process.env.DB_TEST_USERNAME,
    password: process.env.DB_TEST_PASSWORD,
  };
}

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpirationInterval: Number(process.env.JWT_EXPIRATION_MINUTES),
  sequelize: { ...dbVars },
  logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
};
