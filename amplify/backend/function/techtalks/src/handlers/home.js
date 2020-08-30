const router = require('express').Router({ mergeParams: true });
const { connect, connectPool } = require('../util/dbUtils');

router.get('/', async (_, res, next) => {
  try {
    const connection = await connect();
    const event = (
      await connection.execute(
        'SELECT ArrangementID, Beskrivelse, AntallPlasser, PaameldingsStart, Dato FROM Arrangement ORDER BY Dato DESC LIMIT 1'
      )
    )[0][0];
    const arrID = event.ArrangementID;
    connection.end();
    const pool = connectPool();
    const [partnersResponse, programResponse, paameldteResponse] = await Promise.all([
      pool.query(
        'SELECT Bedrift.Navn AS name, Bedrift.Logo AS url, Bedrift.LokaltBilde AS local, Sponsor.SponsorType as sponsorType FROM Bedrift INNER JOIN Sponsor ON Bedrift.BedriftID=Sponsor.BedriftID WHERE Sponsor.ArrangementID = ? ORDER BY sponsorType DESC',
        [arrID]
      ),
      pool.query(
        'SELECT PH.Navn AS navn, PH.Klokkeslett AS tid, PH.Beskrivelse AS beskrivelse, PH.Varighet AS varighet, PH.Parallell AS parallell, PH.alleParalleller AS alleParalleller, Rom.Navn AS stedNavn, Rom.MazemapURL AS stedLink, Bedrift.Navn AS bedrift FROM (Bedrift RIGHT JOIN (ProgramHendelse AS PH) ON Bedrift.BedriftID=PH.Bedrift) INNER JOIN Rom ON PH.RomID=Rom.RomID WHERE PH.ArrangementID = ? ORDER BY tid ASC',
        [arrID]
      ),
      pool.query(
        'SELECT COUNT(PaameldingsHash) AS AntallPåmeldte FROM Paameldt WHERE ArrangementID=? AND Verifisert=TRUE',
        [arrID]
      ),
    ]);
    pool.end();
    const partners = partnersResponse[0];
    const program = programResponse[0];
    event.AntallPåmeldte = paameldteResponse[0][0].AntallPåmeldte;
    res.json({
      partners,
      program,
      event,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
