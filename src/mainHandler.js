const router = require('express').Router();
const homeHandler = require('./handlers/home');
const adminHandler = require('./handlers/admin');
const blippHandler = require('./handlers/blipp');
const eventsHandler = require('./handlers/events');

router.use('/admin', adminHandler);
router.use('/blipp', blippHandler);
router.use('/events', eventsHandler);
router.use('/home', homeHandler);

module.exports = router;
