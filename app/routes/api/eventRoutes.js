/* Load Modules */
const express = require('express');
const router = express.Router();

/* Load controller */
const EventController = require('../../controller/eventController');
const eventController = new EventController();

/**
 * Event Entity routes
 */
router.get('/count', function (req, res) {
    eventController.countAll(req, res);
});

router.get('/exists/:id', function (req, res) {
    eventController.exists(req, res);
});

router.get('/:id', function (req, res) {
    eventController.findById(req, res);
});

router.get('/', function (req, res) {
    eventController.findAll(req, res);
});

router.put('/:id', function (req, res) {
    eventController.update(req, res);
});

router.post('/create', function (req, res) {
    eventController.create(req, res);
});

router.delete('/:id', function (req, res) {
    eventController.deleteById(req, res);
});

module.exports = router;