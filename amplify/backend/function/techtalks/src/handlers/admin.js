const router = require('express').Router();
const jwt = require('jsonwebtoken');

const companiesHandler = require('./admin/companies');
const eventsHandler = require('./admin/events');
const participantsHandler = require('./admin/participants');
const programHandler = require('./admin/program');
const roomsHandler = require('./admin/rooms');
const sponsorsHandler = require('./admin/sponsors');
const blippHandler = require('./admin/blipp');

const adminAuth = require('../auth');

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const { TECHTALKS_JWT_KEY, TECHTALKS_ADMIN_NAME, TECHTALKS_ADMIN_PASSWORD } = process.env;

  if (username === TECHTALKS_ADMIN_NAME && password === TECHTALKS_ADMIN_PASSWORD) {
    const token = jwt.sign({ admin: 'true' }, TECHTALKS_JWT_KEY, { expiresIn: '30m' });
    res.json(token);
    console.log(`Admin logged in at ${new Date().toLocaleTimeString()}`);
  } else {
    res.status(401).send();
    console.log('Someone tried to log in with invalid credentials');
  }
});

router.get('/is-logged-in', adminAuth, (req, res) => {
  res.status(200).send();
});

router.use('/blipp', adminAuth, blippHandler);
router.use('/companies', adminAuth, companiesHandler);
router.use('/events', adminAuth, eventsHandler);
router.use('/participants', adminAuth, participantsHandler);
router.use('/program', adminAuth, programHandler);
router.use('/rooms', adminAuth, roomsHandler);
router.use('/sponsors', adminAuth, sponsorsHandler);

module.exports = router;
