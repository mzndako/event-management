const express = require('express');
const controller = require('../../controllers/image.controller');
const { upload } = require('../../services/image.service');


const router = express.Router();

/**
 * @api {post} v1/auth/register Register
 * @apiDescription Register a new user
 * @apiVersion 1.0.0
 * @apiName Register
 * @apiGroup Auth
 *
 * @apiParam  {file}            picture   Event's picture
 *
 * @apiSuccess (Created 201) {String}  file       Picture filename
 * @apiSuccess (Created 201) {String}  url        Picture url
 *
 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
 */
router.route('/')
  .post(upload.single('picture'), controller.upload);


module.exports = router;
