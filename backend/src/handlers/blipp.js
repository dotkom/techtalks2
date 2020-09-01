const router = require('express').Router({ mergeParams: true });
const uuid = require('uuid');
const { connect } = require('../dbUtils');

router.get('/', async (req, res, next) => {
  const token = req.headers['x-blipp-token'];
  if (typeof token === 'undefined') {
    res.status(400).send('No token x-blipp-token header provided');
    return;
  }

  const connection = await connect();
  const tokens = (await connection.query('SELECT Token FROM BlipBlopTokens WHERE Token LIKE ?', [token]))[0];

  if (tokens.length === 0) {
    res.status(404).send('Not found');
    return;
  }

  connection.end();
  next();
});

router.get('/check', async (req, res, next) => {
  const token = req.headers['x-blipp-token'];
  try {
    const connection = await connect();
    const tokens = (
      await connection.query('SELECT Token, parallel FROM BlipBlopTokens WHERE Token LIKE ?', [token])
    )[0];
    connection.end();
    res.json(tokens[0]);
  } catch (error) {
    next(error);
  }
});

router.get('/nfc/:nfcId', async (req, res, next) => {
  const { nfcId } = req.params;
  try {
    const connection = await connect();
    const tokens = (
      await connection.query('SELECT CardID, ParticipantName FROM CardParticipantMapping WHERE CardID LIKE ?', [nfcId])
    )[0];
    res.json(tokens.length === 0 ? { CardID: nfcId } : tokens[0]);
    connection.end();
  } catch (error) {
    next(error);
  }
});

router.post('/nfc/:nfcId', async (req, res, next) => {
  const { nfcId } = req.params;
  const { userName } = req.body;
  try {
    const connection = await connect();
    const tokens = (
      await connection.query('SELECT CardID, ParticipantName FROM CardParticipantMapping WHERE CardID LIKE ?', [nfcId])
    )[0];

    if (tokens.length !== 0) {
      res.status(400).send('Object already exists');
    }

    await connection.query('INSERT INTO CardParticipantMapping(`CardID`, `ParticipantName`) VALUES (?, ?)', [
      nfcId,
      userName,
    ]);

    res.send();
    connection.end();
  } catch (error) {
    next(error);
  }
});

router.post('/passing/:nfcId', async (req, res, next) => {
  const { userName } = req.body;
  try {
    const connection = await connect();

    // We have to get the parallell
    const token = req.headers['x-blipp-token'];
    const parallel = (await connection.query('SELECT parallel FROM BlipBlopTokens WHERE Token LIKE ?', [token]))[0];

    await connection.query(
      'INSERT INTO ParticipantEventMapping(`UUID`, `ParticipantName`, `parallelNo`) VALUES (?, ?, ?)',
      [uuid.v4(), userName, parallel[0].parallel]
    );

    res.send();
    connection.end();
  } catch (error) {
    next(error);
  }
});

// eslint-disable-next-line no-extend-native
Array.prototype.unique = function() {
  const a = this.concat();
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < a.length; ++i) {
    // eslint-disable-next-line no-plusplus
    for (let j = i + 1; j < a.length; ++j) {
      // eslint-disable-next-line no-plusplus
      if (a[i] === a[j]) a.splice(j--, 1);
    }
  }

  return a;
};

router.get('/participants', async (req, res, next) => {
  try {
    const connection = await connect();
    let externalNames = (await connection.query('SELECT Navn FROM ExternalParticipant ;'))[0];
    let internalNames = (await connection.query('SELECT Navn FROM Paameldt WHERE Verifisert=TRUE;'))[0];

    internalNames = internalNames.map((name) => {
      return name.Navn.toLowerCase();
    });

    externalNames = externalNames.map((name) => {
      return name.Navn.toLowerCase();
    });

    const names = externalNames.concat(internalNames).unique();

    res.json(names);
    connection.end();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
