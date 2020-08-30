const router = require('express').Router({ mergeParams: true });
const uuid = require('uuid');
const { connect } = require('../../util/dbUtils');

router.delete('/:hash', async (req, res, next) => {
  const { hash } = req.params;

  try {
    const connection = await connect();
    await connection.query('DELETE FROM Paameldt WHERE PaameldingsHash=?', [hash]);
    connection.end();
    res.send();
  } catch (error) {
    next(error);
  }
});

// External people
router.get('/external', async (req, res, next) => {
  try {
    const connection = await connect();
    const people = (await connection.execute('SELECT UUID, Navn FROM ExternalParticipant'))[0];
    connection.end();

    res.json(people);
  } catch (error) {
    next(error);
  }
});

router.post('/external', async (req, res, next) => {
  const { Navn } = req.body;
  try {
    const connection = await connect();
    const participants = (
      await connection.query('SELECT Navn FROM ExternalParticipant WHERE Navn LIKE ?', [Navn.toLowerCase()])
    )[0];
    if (participants.length !== 0) {
      res.status(409).send();
      return;
    }
    await connection.query('INSERT INTO ExternalParticipant(UUID, Navn) VALUES (?, ?);', [
      uuid.v4(),
      Navn.toLowerCase(),
    ]);
    connection.end();

    res.send();
  } catch (error) {
    next(error);
  }
});

router.delete('/external/:uuidParam', async (req, res, next) => {
  const { uuidParam } = req.params;

  try {
    const connection = await connect();
    await connection.query('DELETE FROM ExternalParticipant WHERE UUID=?', [uuidParam]);
    connection.end();

    res.send();
  } catch (error) {
    next(error);
  }
});

async function getScanStatusByNames(connection, names) {
  const result = [];
  for (let i = 0; i < names.length; i += 1) {
    const checks = connection.query(
      'SELECT UUID, ScanTime, ParalellNo FROM ParticipantEventMapping WHERE ParticipantName = ?;',
      [names[i]]
    )[0];
    result.push({
      name: names[i],
      scans: checks,
    });
  }

  return result;
}

router.get('/scanStatus', async (req, res, next) => {
  try {
    const connection = await connect();

    let externalNames = (await connection.query('SELECT Navn FROM ExternalParticipant;')[0]) || [];
    externalNames = externalNames.map((name) => name.Navn.toLowerCase);

    let internalNames = (await connection.query('SELECT Navn FROM Paameldt WHERE Verifisert=TRUE;')[0]) || [];
    internalNames = internalNames.map((name) => name.Navn.toLowerCase());

    const names = externalNames
      .concat(internalNames)
      .unique()
      .sort();

    const result = await getScanStatusByNames(connect, names);
    connection.end();

    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
