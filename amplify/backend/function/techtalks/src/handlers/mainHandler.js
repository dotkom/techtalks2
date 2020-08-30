const router = require('express').Router();
const homeHandler = require('./home');
const adminHandler = require('./admin');
const blippHandler = require('./blipp');
const eventsHandler = require('./events');

router.use('/admin', adminHandler);
router.use('/blipp', blippHandler);
router.use('/events', eventsHandler);
router.use('/home', homeHandler);

module.exports = router;
