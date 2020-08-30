const router = require('express').Router({ mergeParams: true });
const { connect } = require('../../util/dbUtils');

router.post('/', async (req, res, next) => {
  const { arrangementID, bedriftID, sponsorType } = req.body;

  try {
    const connection = await connect();
    await connection.query('INSERT INTO Sponsor(ArrangementID, BedriftID, SponsorType) VALUES (?, ?, ?)', [
      arrangementID,
      bedriftID,
      sponsorType,
    ]);
    connection.end();
    res.send();
  } catch (error) {
    next(error);
  }
});

router.delete('/', async (req, res, next) => {
  const { arrangementID, bedriftID } = req.body;
  try {
    const connection = await connect();
    await connection.query('DELETE FROM Sponsor WHERE ArrangementID=? AND BedriftID=?', [arrangementID, bedriftID]);
    connection.end();
    res.send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
