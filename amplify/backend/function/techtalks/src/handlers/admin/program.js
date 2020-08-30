const router = require('express').Router({ mergeParams: true });
const { connect, connectPool } = require('../../dbUtils');

router.get('/:arrangementID', async (req, res, next) => {
  const { arrangementID } = req.params;

  try {
    const pool = connectPool();
    const [sponsorRes, romRes] = await Promise.all([
      pool.query(
        'SELECT Bedrift.BedriftID AS BedriftID, Bedrift.Navn as navn FROM Bedrift INNER JOIN Sponsor ON Sponsor.BedriftID = Bedrift.BedriftID WHERE Sponsor.ArrangementID = ?',
        [arrangementID]
      ),
      pool.query("SELECT RomID AS romID, CONCAT(Bygning, ' ', Navn) AS navn FROM Rom"),
    ]);
    pool.end();
    const sponsors = sponsorRes[0];
    const rom = romRes[0];
    res.json({
      sponsors,
      rom,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/events', async (req, res, next) => {
  const {
    arrangementID,
    bedriftID,
    navn,
    beskrivelse,
    romID,
    klokkeslett,
    parallell,
    alleParalleller,
    varighet,
  } = req.body;

  try {
    // unngå utilsiktet  parallell, i tilfelle
    const reellParallell = alleParalleller ? 1 : parallell;
    const connection = await connect();
    await connection.query(
      'INSERT INTO ProgramHendelse(ArrangementID, Bedrift, Navn, Beskrivelse, RomID, Klokkeslett, Parallell, AlleParalleller, Varighet) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [arrangementID, bedriftID, navn, beskrivelse, romID, klokkeslett, reellParallell, alleParalleller, varighet]
    );
    res.send();
  } catch (error) {
    next(error);
  }
});

router.delete('/events/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const connection = await connect();
    await connection.query('DELETE FROM ProgramHendelse WHERE HendelsesID=?', [id]);
    connection.end();
    res.send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
