const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const cors = require('cors');
const helmet = require('helmet');
const passport = require('passport');
const routes = require('../api/routes/v1');
const { logs } = require('./vars');
const strategies = require('./passport');
const error = require('../api/middlewares/error');
const { imageDirPath, eventImagesRoute } = require('../api/services/image.service');
const graphql = require('./graphql');
const { authorize } = require('../api/middlewares/auth');

/**
* Express instance
* @public
*/
const app = express();

// set the image folder public
app.use(`/${eventImagesRoute}`, express.static(imageDirPath));

// request logging. dev: console | production: file
app.use(morgan(logs));

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// gzip compression
app.use(compress());

// lets you use HTTP verbs such as PUT or DELETE
// in places where the client doesn't support it
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// enable authentication
app.use(passport.initialize());
passport.use('jwt', strategies.jwt);

// mount api v1 routes
app.use('/v1', routes);

// mount graphql route
app.use('/graphql', authorize(), graphql);

// if error is not an instanceOf APIError, convert it.
app.use(error.converter);

// catch 404 and forward to error handler
app.use(error.notFound);

// error handler, send stacktrace only during development
app.use(error.handler);

module.exports = app;
