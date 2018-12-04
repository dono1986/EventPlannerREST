/**
 * Express Router configuration
 */
const express = require('express');
const router = express.Router();

/* API routes */
router.use('/event', require('./api/eventRoutes'));

module.exports = router;