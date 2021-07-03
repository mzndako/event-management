const express = require('express');
const authRoutes = require('./auth.route');
const eventRoutes = require('./event.route');
const imageRoutes = require('./image.route');

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

/**
 * GET v1/docs
 */
router.use('/docs', express.static('docs'));

/**
 * GET v1/auth
 */
router.use('/auth', authRoutes);

/**
 * GET v1/events
 */
router.use('/events', eventRoutes);

/**
 * GET v1/image
 */
router.use('/image', imageRoutes);

module.exports = router;
