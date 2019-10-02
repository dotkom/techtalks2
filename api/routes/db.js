const express = require('express');

const router = express.Router();
const mysql = require('mysql2/promise');
const md5 = require('md5');
const jwt = require('jsonwebtoken');

function connect() {
  const { DBHOST, DBUSER, DBPASS, DBNAME } = process.env;
  return mysql.createConnection({
    host: DBHOST,
    user: DBUSER,
    password: DBPASS,
    database: DBNAME,
  });
}

function connectPool() {
  const { DBHOST, DBUSER, DBPASS, DBNAME } = process.env;
  return mysql.createPool({
    host: DBHOST,
    user: DBUSER,
    password: DBPASS,
    database: DBNAME,
  });
}

router.get('/home', async (_, res) => {
  try {
    const connection = await connect();
    const event =  (await connection.execute(
      'SELECT ArrangementID, Beskrivelse, AntallPlasser, Dato FROM Arrangement ORDER BY Dato DESC LIMIT 1'
    ))[0][0];
    const arrID = event.ArrangementID;;
    connection.end();
    const pool = connectPool();
    const [partnersResponse, programResponse, paameldteResponse] = await Promise.all([
      pool.query(
        'SELECT Bedrift.Navn AS name, Bedrift.Logo AS url, Sponsor.SponsorType as sponsorType FROM Bedrift INNER JOIN Sponsor ON Bedrift.BedriftID=Sponsor.BedriftID WHERE Sponsor.ArrangementID = ? ORDER BY sponsorType DESC',
        [arrID]
      ),
      pool.query(
        'SELECT PH.Navn AS navn, PH.Klokkeslett AS tid, PH.Beskrivelse AS beskrivelse, Rom.Navn AS stedNavn, Rom.MazemapURL AS stedLink FROM (ProgramHendelse AS PH) INNER JOIN Rom ON PH.RomID=Rom.RomID WHERE PH.ArrangementID = ?',
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
    console.log('Could not fetch homepage');
    console.log(error);
  }
});

router.post('/paamelding', async (req, res) => {
  const { navn, epost, linjeforening, alder, studieår } = req.body;
  const connection = await connect();
  const event = (await connection.execute(
    'SELECT ArrangementID, Beskrivelse, AntallPlasser, Dato FROM Arrangement ORDER BY Dato DESC LIMIT 1'
  ))[0][0];
  const arrID = event.ArrangementID;
  const hash = md5(`${arrID}-${navn}-${epost}-${linjeforening}-${alder}-${studieår}-${new Date()}`);
  const response = await connection.query(
    'INSERT INTO Paameldt(PaameldingsHash, Epost, Navn, Linjeforening, Alder, StudieAar, ArrangementID) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [hash, epost, navn, linjeforening, alder, studieår, arrID]
  );
  connection.end();
  const { affectedRows } = response[0];
  if (affectedRows === 1) {
    res.json({
      status: 'succeeded',
    });
  } else {
    res.json({
      status: 'failed',
    });
  }
});

router.post('/validering', async (req, res) => {
  const { hash } = req.body;
  const connection = await connect();
  const response = await connection.query('UPDATE Paameldt SET Verifisert=TRUE WHERE PaameldingsHash=?', [hash]);
  connection.end();
  const { affectedRows, changedRows } = response[0];
  if (changedRows === 1) {
    res.json({
      status: 'succeeded',
    });
  } else if (affectedRows === 1) {
    res.json({
      status: 'repeat',
    });
  } else {
    res.json({
      status: 'failed',
    });
  }
});

router.post('/adminLogin', (req, res) => {
  const { username, password } = req.body;
  const { AUNAME, APASS } = process.env;
  if (username === AUNAME && password === APASS) {
    const key = process.env.JWTKEY;
    const token = jwt.sign({ foo: 'bar' }, key, { expiresIn: '30m' });
    res.json({
      token,
      status: 'succeeded',
    });
    console.log(`Admin logged in at ${new Date().toLocaleTimeString()}`);
  } else {
    res.json({
      status: 'invalid',
    });
    console.log('Someone tried to log in with invalid credentials');
  }
});

router.post('/isAdminLoggedIn', (req, res) => {
  const { JWTKEY } = process.env;
  try {
    const { token } = req.body;
    jwt.verify(token, JWTKEY);
    res.json({
      loggedIn: 'y',
    });
  } catch (err) {
    res.json({
      loggedIn: 'n',
    });
  }
});

router.post('/allCompanies', async (req, res) => {
  try {
    const { token } = req.body;
    const { JWTKEY } = process.env;
    jwt.verify(token, JWTKEY);
  } catch (err) {
    res.json({
      status: 'denied',
      bedrifter: [],
    });
    return;
  }
  try {
    const connection = await connect();
    const event = (await connection.execute(
      'SELECT ArrangementID, Beskrivelse, AntallPlasser, Dato FROM Arrangement ORDER BY Dato DESC LIMIT 1'
    ))[0][0];
    const arrID = event.ArrangementID;
    const results = await connection.query(
      `SELECT Bedrift.BedriftID AS BedriftID, Bedrift.Navn AS Navn, Bedrift.Logo AS Logo, Sponsor.SponsorType AS sponsorType
      FROM Bedrift LEFT JOIN Sponsor ON Bedrift.BedriftID=Sponsor.BedriftID
      WHERE Sponsor.ArrangementID=? OR Sponsor.ArrangementID IS NULL
      GROUP BY Bedrift.BedriftID`,
      [arrID]
    );
    const bedrifter = results[0];
    res.json({
      bedrifter,
      status: 'succeeded',
    });
    connection.end();
  } catch (error) {
    res.json({
      bedrifter: [],
      status: 'failed',
    });
    console.log('Failed trying to display companies');
    console.log(error);
  }
});

router.post('/newCompany', async (req, res) => {
  const { token, navn, logo, sponsorType } = req.body;
  try {
    const { JWTKEY } = process.env;
    jwt.verify(token, JWTKEY);
  } catch (err) {
    res.json({
      status: 'denied',
    });
    return;
  }
  try {
    const connection = await connect();
    const response = await connection.query('INSERT INTO Bedrift(Navn, Logo) VALUES (?, ?)', [navn, logo]);
    if (sponsorType) {
      const { insertId } = response;
      const arrID =  (await connection.execute('SELECT ArrangementID FROM Arrangement ORDER BY Dato DESC LIMIT 1'))[0][0]
        .ArrangementID;
      await connection.query(
        'INSERT INTO Sponsor(ArrangementID, BedriftID, SponsorType) VALUES (?, ?, ?)',
        [arrID, insertId, sponsorType]
      );
    }
    connection.end();
    res.json({
      status: 'succeeded',
    });
  } catch (error) {
    res.json({
      status: 'failed',
    });
    console.log('Error while creating new company:');
    console.log(error);
  }
});

router.post('/editCompany', async (req, res) => {
  const { token, bedriftID, navn, logo, sponsorType, oldSponsorType } = req.body;
  try {
    const { JWTKEY } = process.env;
    jwt.verify(token, JWTKEY);
  } catch (err) {
    res.json({
      status: 'denied',
    });
    return;
  }
  try {
    const connection = await connect();
    const response = await connection.query('UPDATE Bedrift SET Navn=?, Logo=? WHERE BedriftID=?', [
      navn,
      logo,
      bedriftID
    ]);
    const isSponsor = sponsorType > 0;
    const wasSponsor = oldSponsorType > 0;
    if (isSponsor !== wasSponsor) {
      const event =  (await connection.execute(
        'SELECT ArrangementID, Beskrivelse, AntallPlasser, Dato FROM Arrangement ORDER BY Dato DESC LIMIT 1'
      ))[0][0];
      const arrID = event.ArrangementID;
      if(sponsorType) {
        await connection.query('INSERT INTO Sponsor(BedriftID, ArrangementID, SponsorType) VALUES (?, ?, ?)', [
          bedriftID,
          arrID,
          sponsorType,
        ]);
      } else {
        await connection.query('DELETE FROM Sponsor WHERE ArrangementID=? AND BedriftID=?', [arrID, bedriftID]);
      }
    } else if (sponsorType !== oldSponsorType) {
      const event =  (await connection.execute('SELECT ArrangementID, Beskrivelse, AntallPlasser, Dato FROM Arrangement ORDER BY Dato DESC LIMIT 1'))[0][0];
      const arrID = event.ArrangementID;
      await connection.query(
        'UPDATE Sponsor SET SponsorType=? WHERE ArrangementID=? AND BedriftID=?',
        [sponsorType, arrID, bedriftID]
      );
    }
    connection.end();
    const { affectedRows, changedRows } = response[0];
    if (changedRows === 1) {
      res.json({
        status: 'succeeded',
      });
    } else if (affectedRows === 1) {
      res.json({
        status: 'unchanged',
      });
    } else {
      res.json({
        status: 'failed',
      });
    }
  } catch (error) {
    res.json({
      status: 'failed',
    });
    console.log(`Error while updating company with id ${BedriftID}.`);
    console.log(error);
  }
});

// this one is not tested - not sure if it will be needed

router.post('/lastEvent', async (req, res) => {
  try {
    const { token } = req.body;
    const { JWTKEY } = process.env;
    jwt.verify(token, JWTKEY);
  } catch (err) {
    res.json({
      status: 'denied',
    });
    return;
  }
  try {
    const connection = await connect();
    const response = await connection.query(
      `SELECT Arrangement.ArrangementID AS ArrangementID, Arrangement.Dato AS Dato, Arrangement.AntallPlasser AS AntallPlasser, COUNT(Paameldingshash) AS AntallPåmeldte
      FROM Arrangement LEFT JOIN Paameldt ON Arrangement.ArrangementID=Paameldt.ArrangementID
      GROUP BY Arrangement.ArrangementID
      ORDER BY Arrangement.ArrangementID DESC
      LIMIT 1`
    );
    connection.end();
    const event = response[0][0];
    res.json({
      status: 'succeeded',
      event,
    });
  } catch (err) {
    res.json({
      status: 'failed',
    });
  }
});

router.post('/allEvents', async (req, res) => {
  try {
    const { token } = req.body;
    const { JWTKEY } = process.env;
    jwt.verify(token, JWTKEY);
  } catch (err) {
    res.json({
      status: 'denied',
    });
    return;
  }

  try {
    const connection = await connect();
    const response = await connection.query(
      `SELECT Arrangement.ArrangementID AS ArrangementID, Arrangement.Dato AS Dato, Arrangement.AntallPlasser AS AntallPlasser, SUM(Paameldt.Verifisert) AS AntallPåmeldte, COUNT(Paameldingshash) AS AntallPåmeldteTotal
      FROM Arrangement LEFT JOIN Paameldt ON Arrangement.ArrangementID=Paameldt.ArrangementID
      GROUP BY Arrangement.ArrangementID
      ORDER BY Arrangement.ArrangementID DESC`
    );
    const events = response[0];
    res.send({
      status: 'succeeded',
      events,
    });
  } catch (error) {
    res.send({
      status: 'failed',
      events: [],
    });
    console.log('Error while fetching list of events');
    console.log(error);
  }
});

router.post('/adminEvent', async (req, res) => {
  const { token, id } = req.body;
  try {
    const { JWTKEY } = process.env;
    jwt.verify(token, JWTKEY);
  } catch (error) {
    res.json({
      status: 'denied'
    });
    return;
  }

  try {
    const pool = connectPool();
    const [ sponsorRes, programRes, eventRes, påmeldtRes, deltagereRes ] = await Promise.all([
      pool.query('SELECT Bedrift.BedriftID AS BedriftID, Bedrift.Navn AS navn, Bedrift.Logo AS logo FROM Bedrift INNER JOIN Sponsor ON Bedrift.BedriftID=Sponsor.BedriftID WHERE Sponsor.ArrangementID = ?', [id]),
      pool.query('SELECT PH.Navn AS navn, PH.Klokkeslett AS tid, PH.Beskrivelse AS beskrivelse, Rom.Navn AS stedNavn, Rom.MazemapURL AS stedLink FROM (ProgramHendelse AS PH) INNER JOIN Rom ON PH.RomID=Rom.RomID WHERE PH.ArrangementID = ?', [id]),
      pool.query('SELECT Beskrivelse, Dato, AntallPlasser, Link FROM Arrangement WHERE ArrangementID=?', [id]),
      pool.query('SELECT COUNT(PaameldingsHash) AS AntallPåmeldte FROM Paameldt WHERE ArrangementID=? AND Verifisert=TRUE', [id]),
      pool.query('SELECT PaameldingsHash, Navn, Epost, Linjeforening, Alder, StudieAar, Verifisert, PaameldingsTidspunkt FROM Paameldt WHERE ArrangementID=?', [id])
    ]);
    pool.end();
    const sponsors = sponsorRes[0];
    const program = programRes[0];
    const event = eventRes[0][0];
    const { AntallPåmeldte } = påmeldtRes[0][0];
    event.AntallPåmeldte = AntallPåmeldte;
    const deltagere = deltagereRes[0];
    res.json({
      status: 'succeeded',
      sponsors,
      program,
      event,
      deltagere
    });
  } catch (error) {
    res.json({
      status: 'failed'
    });
  }
})

router.post('/newEvent', async (req, res) => {
  const { token, dato, antallPlasser, beskrivelse } = req.body;
  try {
    const { JWTKEY } = process.env;
    jwt.verify(token, JWTKEY);
  } catch (error) {
    res.json({
      status: 'denied',
    });
    return;
  }
  try {
    const connection = await connect();
    const response = await connection.query(
      'INSERT INTO Arrangement(Dato, AntallPlasser, Beskrivelse) VALUES (?, ?, ?)',
      [dato, antallPlasser, beskrivelse]
    );
    connection.end();
    const { insertId } = response;
    res.json({
      status: 'succeeded',
      ArrangementID: insertId,
    });
  } catch (error) {
    res.json({
      status: 'failed',
    });
    console.log('Something went wrong creating new event:');
    console.log(error);
  }
});

router.post('/editEvent', async (req, res) => {
  const { arrangementID, dato, plasser, beskrivelse } = req.body;
  try {
    const { JWTKEY } = process.env;
    jwt.verify(token, JWTKEY);
  } catch (error) {
    res.json({
      status: 'denied'
    });
    return;
  }

  try {
    const connection = await connect();
    const response = await connection.query(
      'UPDATE Arrangement SET Dato=?, AntallPlasser=?, Beskrivelse=? WHERE ArrangementID=?',
      [dato, plasser, beskrivelse, arrangementID]
    );
    connection.end();
    res.json({
      status: 'succeeded',
    });
  } catch (error) {
    res.json({
      status: 'failed',
    });
    console.log(`Error while editing event with ID ${arrangementID}`);
    console.log(error);
  }
});

router.post('/deleteParticipant', async (req, res) => {
  const { PaameldingsHash, token } = req.body;

  try {
    const { JWTKEY } = process.env;
    jwt.verify(token, JWTKEY);
  } catch (error) {
    res.json({
      status: 'denied'
    });
    return;
  }

  try {
    const connection = await connect();
    await connection.query('DELETE FROM Paameldt WHERE PaameldingsHash=?', [PaameldingsHash]);
    connection.end();
    res.json({
      status: 'succeeded'
    });
  } catch (error) {
    res.json({
      status: 'failed'
    });
  }
})

router.post('/addSponsor', async (req, res) => {
  const { arrangementID, bedriftID } = req.body;
  try {
    const { JWTKEY } = process.env;
    jwt.verify(token, JWTKEY);
  } catch (error) {
    res.json({
      status: 'denied'
    });
    return;
  }
  try {
    const connection = await connect();
    await connection.query('INSERT INTO Sponsor(ArrangementID, BedriftID) VALUES (?, ?)', [arrangementID, bedriftID]);
    connection.end();
    res.json({
      status: 'succeeded',
    });
  } catch (error) {
    res.json({
      status: 'failed',
    });
    console.log('Error while adding sponsor');
    console.log(error);
  }
});

router.post('/removeSponsor', async (req, res) => {
  const { arrangementID, bedriftID } = req.body;
  try {
    const { JWTKEY } = process.env;
    jwt.verify(token, JWTKEY);
  } catch (error) {
    res.json({
      status: 'denied'
    });
    return;
  }
  try {
    const connection = await connect();
    await connection.query('DELETE FROM Sponsor WHERE ArrangementID=? AND BedriftID=?', [arrangementID, bedriftID]);
    connection.end();
    res.json({
      status: 'succeeded',
    });
  } catch (error) {
    res.json({
      status: 'failed',
    });
    console.log('Error while removing sponsor');
    console.log(error);
  }
});

module.exports = router;
