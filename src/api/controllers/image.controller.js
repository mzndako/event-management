const httpStatus = require('http-status');
const { getImageUrl } = require('../services/image.service');

/**
 * Upload event picture
 * @public
 */
exports.upload = async (req, res, next) => {
  try {
    const { filename } = req.file;
    res.status(httpStatus.CREATED);
    res.json({
      filename,
      url: getImageUrl(filename),
    });
  } catch (error) {
    next(error);
  }
};
