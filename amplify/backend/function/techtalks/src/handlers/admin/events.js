const router = require('express').Router({ mergeParams: true });
const { connect, connectPool } = require('../../util/dbUtils');

router.get('/', async (req, res, next) => {
  try {
    const connection = await connect();
    const events = await connection.query(
      `SELECT Arrangement.ArrangementID AS ArrangementID, Arrangement.Dato AS Dato, Arrangement.AntallPlasser AS AntallPlasser, COALESCE(SUM(Paameldt.Verifisert), 0) AS AntallPåmeldte, COUNT(Paameldingshash) AS AntallPåmeldteTotal
        FROM Arrangement LEFT JOIN Paameldt ON Arrangement.ArrangementID=Paameldt.ArrangementID
        GROUP BY Arrangement.ArrangementID
        ORDER BY Arrangement.ArrangementID DESC`
    );
    res.send(events[0]);
  } catch (error) {
    next();
  }
});

router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const pool = connectPool();
    const [sponsorRes, programRes, eventRes, påmeldtRes, deltagereRes] = await Promise.all([
      pool.query(
        'SELECT Bedrift.BedriftID AS BedriftID, Bedrift.Navn AS navn, Bedrift.Logo AS logo, Bedrift.LokaltBilde AS local, Sponsor.SponsorType AS sponsorType FROM Bedrift INNER JOIN Sponsor ON Bedrift.BedriftID=Sponsor.BedriftID WHERE Sponsor.ArrangementID = ?',
        [id]
      ),
      pool.query(
        'SELECT PH.HendelsesID AS id, PH.Navn AS navn, PH.Klokkeslett AS tid, PH.Beskrivelse AS beskrivelse, PH.Varighet AS varighet, PH.Parallell AS parallell, PH.AlleParalleller AS alleParalleller, Rom.Navn AS stedNavn, Rom.MazemapURL AS stedLink, Bedrift.BedriftID AS bedriftID, Bedrift.Navn AS bedriftNavn FROM Rom Inner Join (ProgramHendelse AS PH) ON Rom.RomID=PH.RomID LEFT JOIN Bedrift ON PH.Bedrift=Bedrift.BedriftID WHERE PH.ArrangementID = ? ORDER BY tid ASC, stedNavn ASC',
        [id]
      ),
      pool.query(
        'SELECT Beskrivelse, Dato, AntallPlasser, Link, PaameldingsStart FROM Arrangement WHERE ArrangementID=?',
        [id]
      ),
      pool.query(
        'SELECT COUNT(PaameldingsHash) AS AntallPåmeldte FROM Paameldt WHERE ArrangementID=? AND Verifisert=TRUE',
        [id]
      ),
      pool.query(
        'SELECT PaameldingsHash, Navn, Epost, Linjeforening, Alder, StudieAar, Verifisert, PaameldingsTidspunkt, Allergier FROM Paameldt WHERE ArrangementID=?',
        [id]
      ),
    ]);
    pool.end();
    res.json({
      sponsors: sponsorRes[0],
      program: programRes[0],
      event: { ...eventRes[0][0], AntallPåmeldte: påmeldtRes[0][0] },
      deltagere: deltagereRes[0],
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  const { dato, antallPlasser, beskrivelse, påmeldingsStart } = req.body;
  try {
    const connection = await connect();
    const {
      insertId,
    } = await connection.query(
      'INSERT INTO Arrangement(Dato, AntallPlasser, Beskrivelse, PaameldingsStart) VALUES (?, ?, ?, ?)',
      [dato, antallPlasser, beskrivelse, påmeldingsStart]
    );
    connection.end();
    res.json({
      ArrangementID: insertId,
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/', async (req, res, next) => {
  const { arrangementID, dato, plasser, beskrivelse, link, påmeldingsStart } = req.body;

  try {
    const connection = await connect();
    await connection.query(
      'UPDATE Arrangement SET Dato=?, AntallPlasser=?, Beskrivelse=?, Link=?, PaameldingsStart=? WHERE ArrangementID=?',
      [dato, plasser, beskrivelse, link, påmeldingsStart, arrangementID]
    );
    connection.end();
    res.send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
