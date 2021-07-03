const httpStatus = require('http-status');
const User = require('../models/user.model');
const moment = require('moment-timezone');
const { jwtExpirationInterval } = require('../../config/vars');

/**
 * Returns a formated object with tokens
 * @private
 */
function generateTokenResponse(accessToken) {
  const tokenType = 'Bearer';
  const expiresIn = moment().add(jwtExpirationInterval, 'minutes');
  return {
    tokenType,
    accessToken,
    expiresIn,
  };
}

/**
 * Returns jwt token if registration was successful
 * @public
 */
exports.register = async (req, res, next) => {
  try {
    const user = await User.create(req.body);

    const token = generateTokenResponse(user.token());

    res.status(httpStatus.CREATED);
    return res.json({ token, user: user.transform() });
  } catch (error) {
    return next(User.checkDuplicateEmail(error));
  }
};

/**
 * Returns jwt token if valid username and password is provided
 * @public
 */
exports.login = async (req, res, next) => {
  try {
    const user = await User.findUser(req.body);
    const token = generateTokenResponse(user.token());
    const userTransformed = user.transform();
    return res.json({ token, user: userTransformed });
  } catch (error) {
    return next(error);
  }
};
