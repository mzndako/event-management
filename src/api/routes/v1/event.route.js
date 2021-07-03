const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/event.controller');
const { authorize } = require('../../middlewares/auth');
const {
  listEvents,
  createEvent,
  patchEvent,
} = require('../../validations/event.validation');

const router = express.Router();

router
  .route('/')
  /**
   * @api {get} v1/events List Events
   * @apiDescription Get a list of events
   * @apiVersion 1.0.0
   * @apiName ListEvents
   * @apiGroup Events
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {Number{1-}}          [page=1]     List page
   * @apiParam  {Number{1-100}}       [perPage=1]  Events per page
   *
   * @apiSuccess {Object[]}           List of events.
   *
   * @apiError (Unauthorized 401)     Unauthorized  Only authenticated events can access the data
   */
  .get(authorize(), validate(listEvents), controller.list)
  /**
   * @api {post} v1/events Create Events
   * @apiDescription Create a new events
   * @apiVersion 1.0.0
   * @apiName CreateEvent
   * @apiGroup Event
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String{0..200}}                name        Event's name
   * @apiParam  {String}                        date        Event's date
   * @apiParam  {File}                          picture     Event's picture
   * @apiParam  {Array[String]}  subEvents      Sub Event:  List of Event's id
   *
   * @apiSuccess (Created 201) {String}         eventId      Event's id
   * @apiSuccess (Created 201) {String}         name         Event's name
   * @apiSuccess (Created 201) {String}         date         Event's data
   * @apiSuccess (Created 201) {String}         pictureUrl   Event's image url
   * @apiSuccess (Created 201) {Date}           createdBy    Logged in userId
   * @apiSuccess (Created 201) {Array[String]}  subEvents    Sub Event: List of Event's id
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated events can create the data
   */
  .post(authorize(), validate(createEvent), controller.create);

router
  .route('/:eventId')
  /**
   * @api {patch} v1/events/:id Patch Event
   * @apiDescription Update an event
   * @apiVersion 1.0.0
   * @apiName PatchEvent
   * @apiGroup Event
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiSuccess (Created 201) {String}         eventId      Event's id
   * @apiSuccess (Created 201) {String}         name         Event's name
   * @apiSuccess (Created 201) {String}         date         Event's data
   * @apiSuccess (Created 201) {String}         pictureUrl   Event's image url
   * @apiSuccess (Created 201) {Date}           createdBy    Logged in userId
   * @apiSuccess (Created 201) {Array[String]}  subEvents    Sub Event: List of Event's id
   *
   * @apiError (Unauthorized 401) Unauthorized  Only authenticated users can delete the data
   * @apiError (Forbidden 403)    Forbidden     Only user with same id can delete the data
   * @apiError (Not Found 404)    NotFound      Event does not exist
   */
  .patch(authorize(), validate(patchEvent), controller.patch)
  /**
   * @api {delete} v1/events/:id Delete Event
   * @apiDescription Delete an event
   * @apiVersion 1.0.0
   * @apiName DeleteEvent
   * @apiGroup Event
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized  Only authenticated users can delete the data
   * @apiError (Forbidden 403)    Forbidden     Only user with same id can delete the data
   * @apiError (Not Found 404)    NotFound      Event does not exist
   */
  .delete(authorize(), controller.remove);


module.exports = router;
