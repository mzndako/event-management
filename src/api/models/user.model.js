const { DataTypes, Model, Sequelize } = require('sequelize');
const sequelize = require('../../config/sequelize');
const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');
const jwt = require('jwt-simple');
const APIError = require('../utils/APIError');
const { env, jwtSecret, jwtExpirationInterval } = require('../../config/vars');

/**
 * User Model
 * @private
 */
class UserModel extends Model {
  token() {
    const payload = {
      exp: moment().add(jwtExpirationInterval, 'minutes').unix(),
      iat: moment().unix(),
      sub: this.userId,
    };
    return jwt.encode(payload, jwtSecret);
  }

  transform() {
    const transformed = {};
    const fields = ['userId', 'username', 'password', 'name'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  }

  async passwordMatches(password) {
    return bcrypt.compare(password, this.password);
  }
}
/**
 * Initialize the user schema
 */
UserModel.init({
  userId: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
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
}, {
  sequelize,
  timestamps: true,
  modelName: 'User',
});

sequelize.sync({ alter: true });

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
UserModel.beforeSave(async (user) => {
  if (user.changed('password')) {
    const rounds = env === 'test' ? 1 : 10;
    // eslint-disable-next-line no-param-reassign
    user.password = await bcrypt.hash(user.password, rounds);
  }

  // Convert the username to lowercase as postgres is case sensitive by default
  if (user.changed('username')) {
    // eslint-disable-next-line
    user.username = String(user.username).toLocaleLowerCase();
  }
});

/**
  * Find user by username and password
  *
  * @param {ObjectId} username - The login username.
  * @param {ObjectId} password - The login password.
  * @returns {Promise<User, APIError>}
  */
// eslint-disable-next-line func-names
UserModel.findUser = async function ({ username, password }) {
  const user = await this.findOne({ where: { username } });
  const err = {
    status: httpStatus.UNAUTHORIZED,
    message: 'Incorrect username or password',
  };

  if (user && password) {
    if (await user.passwordMatches(password)) {
      return user;
    }
  }

  throw new APIError(err);
};

/**
 * Check whether the error message is for email already exist.
 * @param {*} error Error message
 * @returns True or false if the email address already exist.
 */
UserModel.checkDuplicateEmail = (error) => {
  if (error.name === 'SequelizeUniqueConstraintError') {
    return new APIError({
      message: 'Username already in use',
      errors: [{
        field: 'username',
        location: 'body',
        messages: ['"username" already exists'],
      }],
      status: httpStatus.CONFLICT,
      isPublic: true,
      stack: error.stack,
    });
  }
  return error;
};

/**
 * @typedef UserModel
 */
module.exports = UserModel;
