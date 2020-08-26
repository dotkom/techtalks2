const router = require('express').Router({ mergeParams: true });
const { connect } = require('../../dbUtils');

router.get('/', async (req, res, next) => {
  try {
    const connection = await connect();
    const event = await connection.execute(
      'SELECT ArrangementID, Beskrivelse, AntallPlasser, Dato FROM Arrangement ORDER BY Dato DESC LIMIT 1'
    );

    const bedrifter = await connection.query(
      `SELECT Bedrift.BedriftID AS BedriftID, Bedrift.Navn AS Navn, Bedrift.Logo AS Logo, Bedrift.LokaltBilde AS local, Sponsor.SponsorType AS sponsorType
        FROM Bedrift LEFT JOIN Sponsor ON Bedrift.BedriftID=Sponsor.BedriftID
        WHERE Sponsor.ArrangementID=? OR Sponsor.ArrangementID IS NULL
        GROUP BY ArrangementID, Bedrift.BedriftID`,
      [event[0][0].ArrangementID]
    );

    res.json(bedrifter[0]);
    connection.end();
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  const { navn, logo, lokaltBilde, sponsorType } = req.body;
  const isImageLocal = !!lokaltBilde; // force boolean value, also if undefined
  try {
    const connection = await connect();

    const { insertId } = await connection.query('INSERT INTO Bedrift(Navn, Logo, LokaltBilde) VALUES (?, ?, ?)', [
      navn,
      logo,
      isImageLocal,
    ]);

    if (sponsorType) {
      const arrangementId = (
        await connection.execute('SELECT ArrangementID FROM Arrangement ORDER BY Dato DESC LIMIT 1')
      )[0][0].ArrangementID;
      await connection.query('INSERT INTO Sponsor(ArrangementID, BedriftID, SponsorType) VALUES (?, ?, ?)', [
        arrangementId,
        insertId,
        sponsorType,
      ]);
    }

    connection.end();
    res.json();
  } catch (error) {
    next(error);
  }
});

router.patch('/', async (req, res, next) => {
  const { bedriftID, navn, logo, sponsorType, oldSponsorType, lokaltBilde } = req.body;
  const isImageLocal = !!lokaltBilde;
  try {
    const connection = await connect();
    await connection.query('UPDATE Bedrift SET Navn=?, Logo=?, LokaltBilde=? WHERE BedriftID=?', [
      navn,
      logo,
      isImageLocal,
      bedriftID,
    ]);
    const isSponsor = sponsorType > 0;
    const wasSponsor = oldSponsorType > 0;
    const arrangementId = (
      await connection.execute(
        'SELECT ArrangementID, Beskrivelse, AntallPlasser, Dato FROM Arrangement ORDER BY Dato DESC LIMIT 1'
      )
    )[0][0].ArrangementID;

    if (isSponsor !== wasSponsor) {
      if (sponsorType) {
        await connection.query('INSERT INTO Sponsor(BedriftID, ArrangementID, SponsorType) VALUES (?, ?, ?)', [
          bedriftID,
          arrangementId,
          sponsorType,
        ]);
      } else {
        await connection.query('DELETE FROM Sponsor WHERE ArrangementID=? AND BedriftID=?', [arrangementId, bedriftID]);
      }
    } else if (sponsorType !== oldSponsorType) {
      await connection.query('UPDATE Sponsor SET SponsorType=? WHERE ArrangementID=? AND BedriftID=?', [
        sponsorType,
        arrangementId,
        bedriftID,
      ]);
    }
    connection.end();
    res.send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
