const router = require('express').Router({ mergeParams: true });
const md5 = require('md5');
const { connect } = require('../util/dbUtils');
const { sendConfirmation } = require('../util/sendEmail');

router.post('/paamelding', async (req, res, next) => {
  const { navn, epost, linjeforening, alder, studieår, allergier } = req.body;
  // Validere inputs. Enkel epost-validering: sjekk at det bare finnes én @
  if (epost.split('').filter((c) => c === '@').length !== 1) {
    res.status(400).send(
      JSON.stringify({
        error: 'Invalid email',
        status: 'failed',
      })
    );
    return;
  }
  if (alder > 150 || alder < 18) {
    res.status(400).send(
      JSON.stringify({
        error: 'Invalid age',
        status: 'failed',
      })
    );
    return;
  }
  if (studieår > 9 || studieår < 1) {
    res.status(400).send(
      JSON.stringify({
        error: 'Invalid study year',
        status: 'failed',
      })
    );
    return;
  }
  try {
    const connection = await connect();
    // TODO: valider at påmelding har åpnet (og at det fortsatt er igjen flere plasser - although dette får 2. pri, da flere plasser blir validert av )
    const event = (
      await connection.execute(
        'SELECT ArrangementID, Beskrivelse, AntallPlasser, Dato, PaameldingsStart FROM Arrangement ORDER BY Dato DESC LIMIT 1'
      )
    )[0][0];
    const { PaameldingsStart, ArrangementID } = event;
    const start = new Date(PaameldingsStart);
    if (start > new Date()) {
      res.status(400).json({
        status: 'early',
      });
      return;
    }
    const hash = md5(`${ArrangementID}-${navn}-${epost}-${linjeforening}-${alder}-${studieår}-${new Date()}`);
    const response = await connection.query(
      'INSERT INTO Paameldt(PaameldingsHash, Epost, Navn, Linjeforening, Alder, StudieAar, Allergier, ArrangementID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [hash, epost, navn, linjeforening, alder, studieår, allergier, ArrangementID]
    );
    connection.end();
    const { affectedRows } = response[0];
    if (affectedRows === 1) {
      sendConfirmation(epost, hash);
      res.send();
    } else {
      res.status(409).send('You can only sign up once');
    }
  } catch (error) {
    next(error);
  }
});

router.post('/validering', async (req, res, next) => {
  const { hash } = req.body;
  try {
    const connection = await connect();
    const event = await connection.query('SELECT ArrangementID FROM Paameldt WHERE PaameldingsHash=?', [hash]);
    if (event[0].length === 0) {
      res.status(500).send('No matching singup');
      return;
    }
    const { ArrangementID } = event[0][0];
    // check if event is full
    const eventData = await connection.query(
      `SELECT Arrangement.ArrangementID AS ArrangementID, Arrangement.AntallPlasser AS AntallPlasser, COALESCE(SUM(Paameldt.Verifisert), 0) AS AntallVerifiserte
        FROM Arrangement LEFT JOIN Paameldt ON Arrangement.ArrangementID=Paameldt.ArrangementID
        WHERE Arrangement.ArrangementID=?`,
      [ArrangementID]
    );
    const { AntallPlasser, AntallVerifiserte } = eventData[0][0];
    console.log(`${AntallVerifiserte} av ${AntallPlasser} mulige verifisert`);
    if (AntallVerifiserte >= AntallPlasser) {
      res.status(400).json({
        status: 'full',
      });
      return;
    }
    const response = await connection.query('UPDATE Paameldt SET Verifisert=TRUE WHERE PaameldingsHash=?', [hash]);
    connection.end();
    const { changedRows } = response[0];
    if (changedRows === 1) {
      res.send();
    } else {
      res.status(500).send('Something went wrong');
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
