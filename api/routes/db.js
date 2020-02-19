const express = require('express');
const fs = require('fs');

const router = express.Router();
const mysql = require('mysql2/promise');
const md5 = require('md5');
const jwt = require('jsonwebtoken');

const sendMail = require('./sendEmail.js');

const uuid = require('uuid');

var norwegianWords = fs.readFileSync('./ordliste_aspell.txt', 'utf8').split('\n');

console.log(norwegianWords.length + " words");


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

async function sendConfirmation(email, hash) {
  const mailOptions = {
    to: email, // list of receivers
    subject: 'Bekreftelse av påmelding', // Subject line
    html: `<p>For å validere påmeldingen din, trykk på denne lenken:<br/>
      <a href="http://techtalks.no/validate?ha=${hash}"><b>http://techtalks.no/validate?ha=${hash}</b></a></p>
      <p>Eventuelle spørsmål kan sendes til <a href="mailto:ekskom@online.ntnu.no">ekskom@online.ntnu.no</a></p>` // html body
  };
  sendMail(mailOptions, (response) => {
    const { err } = response; // don't need the message for now
    if (err) {
      console.log(err);
    }
  });
}

router.get('/home', async (_, res) => {
  try {
    const connection = await connect();
    const event =  (await connection.execute(
      'SELECT ArrangementID, Beskrivelse, AntallPlasser, PaameldingsStart, Dato FROM Arrangement ORDER BY Dato DESC LIMIT 1'
    ))[0][0];
    const arrID = event.ArrangementID;;
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
    console.log('Could not fetch homepage');
    console.log(error);
  }
});

router.post('/paamelding', async (req, res) => {
  const { navn, epost, linjeforening, alder, studieår, allergier } = req.body;
  // Validere inputs. Enkel epost-validering: sjekk at det bare finnes én @
  if (epost.split('').filter(c=>c === '@').length != 1) {
    res.status(400).send(JSON.stringify({
      error: 'Invalid email',
      status: 'failed',
    }));
    return;
  } else if (alder > 150 || alder < 18) {
    res.status(400).send(JSON.stringify({
      error: 'Invalid age',
      status: 'failed',
    }));
    return;
  } else if (studieår > 9 || studieår < 1) {
    res.status(400).send(JSON.stringify({
      error: 'Invalid study year',
      status: 'failed',
    }));
    return;
  }
  const connection = await connect();
  // TODO: valider at påmelding har åpnet (og at det fortsatt er igjen flere plasser - although dette får 2. pri, da flere plasser blir validert av )
  const event = (await connection.execute(
    'SELECT ArrangementID, Beskrivelse, AntallPlasser, Dato, PaameldingsStart FROM Arrangement ORDER BY Dato DESC LIMIT 1'
  ))[0][0];
  const { PaameldingsStart, ArrangementID } = event;
  const start = new Date(PaameldingsStart);
  if (start > new Date()) {
    res.status(400).json({
      status: 'early'
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
  const event = await connection.query('SELECT ArrangementID FROM Paameldt WHERE PaameldingsHash=?', [hash]);
  if (event[0].length === 0) {
    res.status(500).json({
      status: 'failed',
    });
    return;
  }
  const { ArrangementID } = event[0][0];
  // check if event is full
  const eventData = await connection.query(
    `SELECT Arrangement.ArrangementID AS ArrangementID, Arrangement.AntallPlasser AS AntallPlasser, COALESCE(SUM(Paameldt.Verifisert), 0) AS AntallVerifiserte
    FROM Arrangement LEFT JOIN Paameldt ON Arrangement.ArrangementID=Paameldt.ArrangementID
    WHERE Arrangement.ArrangementID=?`, [ArrangementID]
  );
  const { AntallPlasser, AntallVerifiserte } = eventData[0][0];
  console.log(`${AntallVerifiserte} av ${AntallPlasser} mulige verifisert`);
  if (AntallVerifiserte >= AntallPlasser) {
    res.status(400).json({
      status: 'full'
    });
    return;
  }
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
    res.status(500).json({
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
      `SELECT Bedrift.BedriftID AS BedriftID, Bedrift.Navn AS Navn, Bedrift.Logo AS Logo, Bedrift.LokaltBilde AS local, Sponsor.SponsorType AS sponsorType
      FROM Bedrift LEFT JOIN Sponsor ON Bedrift.BedriftID=Sponsor.BedriftID
      WHERE Sponsor.ArrangementID=? OR Sponsor.ArrangementID IS NULL
      GROUP BY ArrangementID, Bedrift.BedriftID`,
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
  const { token, navn, logo, lokaltBilde, sponsorType } = req.body;
  const isImageLocal = lokaltBilde ? true : false;  // force boolean value, also if undefined
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
    const response = await connection.query('INSERT INTO Bedrift(Navn, Logo, LokaltBilde) VALUES (?, ?, ?)', [navn, logo, isImageLocal]);
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
  const { token, bedriftID, navn, logo, sponsorType, oldSponsorType, lokaltBilde } = req.body;
  const isImageLocal = lokaltBilde ? true : false;
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
    const response = await connection.query('UPDATE Bedrift SET Navn=?, Logo=?, LokaltBilde=? WHERE BedriftID=?', [
      navn,
      logo,
      isImageLocal,
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
      `SELECT Arrangement.ArrangementID AS ArrangementID, Arrangement.Dato AS Dato, Arrangement.AntallPlasser AS AntallPlasser, COALESCE(SUM(Paameldt.Verifisert), 0) AS AntallPåmeldte, COUNT(Paameldingshash) AS AntallPåmeldteTotal
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
      pool.query('SELECT Bedrift.BedriftID AS BedriftID, Bedrift.Navn AS navn, Bedrift.Logo AS logo, Bedrift.LokaltBilde AS local, Sponsor.SponsorType AS sponsorType FROM Bedrift INNER JOIN Sponsor ON Bedrift.BedriftID=Sponsor.BedriftID WHERE Sponsor.ArrangementID = ?', [id]),
      pool.query('SELECT PH.HendelsesID AS id, PH.Navn AS navn, PH.Klokkeslett AS tid, PH.Beskrivelse AS beskrivelse, PH.Varighet AS varighet, PH.Parallell AS parallell, PH.AlleParalleller AS alleParalleller, Rom.Navn AS stedNavn, Rom.MazemapURL AS stedLink, Bedrift.BedriftID AS bedriftID, Bedrift.Navn AS bedriftNavn FROM Rom Inner Join (ProgramHendelse AS PH) ON Rom.RomID=PH.RomID LEFT JOIN Bedrift ON PH.Bedrift=Bedrift.BedriftID WHERE PH.ArrangementID = ? ORDER BY tid ASC, stedNavn ASC', [id]),
      pool.query('SELECT Beskrivelse, Dato, AntallPlasser, Link, PaameldingsStart FROM Arrangement WHERE ArrangementID=?', [id]),
      pool.query('SELECT COUNT(PaameldingsHash) AS AntallPåmeldte FROM Paameldt WHERE ArrangementID=? AND Verifisert=TRUE', [id]),
      pool.query('SELECT PaameldingsHash, Navn, Epost, Linjeforening, Alder, StudieAar, Verifisert, PaameldingsTidspunkt, Allergier FROM Paameldt WHERE ArrangementID=?', [id])
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
    console.log(error);
  }
})

router.post('/newEvent', async (req, res) => {
  const { token, dato, antallPlasser, beskrivelse, påmeldingsStart } = req.body;
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
      'INSERT INTO Arrangement(Dato, AntallPlasser, Beskrivelse, PaameldingsStart) VALUES (?, ?, ?, ?)',
      [dato, antallPlasser, beskrivelse, påmeldingsStart]
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
  const { token, arrangementID, dato, plasser, beskrivelse, link, påmeldingsStart } = req.body;
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
      'UPDATE Arrangement SET Dato=?, AntallPlasser=?, Beskrivelse=?, Link=?, PaameldingsStart=? WHERE ArrangementID=?',
      [dato, plasser, beskrivelse, link, påmeldingsStart, arrangementID]
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

router.post('/getRooms', async (req, res) => {
  const { token } = req.body;
  try {
    const { JWTKEY } = process.env;
    jwt.verify(token, JWTKEY);
  } catch (err) {
    res.json({
      status: 'denied'
    });
    return
  }

  try {
    const connection = await connect();
    const response = await connection.query('SELECT Navn, Bygning, MazemapURL FROM Rom');
    connection.end();
    const rooms = response[0];
    res.json({
      status: 'succeeded',
      rooms
    });
  } catch (error) {
    res.json({
      status: 'failed'
    });
  }
});

router.post('/newRoom', async (req, res) => {
  const { token, name, building, mazemap } = req.body;
  try {
    const { JWTKEY } = process.env;
    jwt.verify(token, JWTKEY);
  } catch (err) {
    res.json({
      status: 'denied'
    });
    return;
  }

  try {
    const connection = await connect();
    await connection.query('INSERT INTO Rom(Navn, Bygning, MazemapURL) VALUES (?, ?, ?)', [name, building, mazemap]);
    connection.end();
    res.json({
      status: 'succeeded'
    });
  } catch (err) {
    console.log('Failed to create new room')
    console.log(err);
    res.json({
      status: 'failed'
    });
  }
})

router.post('/preCreateProgram', async (req, res) => {
  const { token, arrangementID } = req.body;
  try {
    const { JWTKEY } = process.env;
    jwt.verify(token, JWTKEY);
  } catch (err) {
    res.json({
      status: 'denied'
    });
    return;
  }

  try {
    const pool = await connectPool();
    const [sponsorRes, romRes] = await Promise.all([
      pool.query('SELECT Bedrift.BedriftID AS BedriftID, Bedrift.Navn as navn FROM Bedrift INNER JOIN Sponsor ON Sponsor.BedriftID = Bedrift.BedriftID WHERE Sponsor.ArrangementID = ?', [arrangementID]),
      pool.query('SELECT RomID AS romID, CONCAT(Bygning, \' \', Navn) AS navn FROM Rom')
    ]);
    pool.end();
    const sponsors = sponsorRes[0];
    const rom = romRes[0];
    res.json({
      status: 'succeeded',
      sponsors,
      rom
    });
  } catch (err) {
    res.json({
      status: 'failed'
    });
    console.log(`Failed to fetch rooms and sponsors for event with ID ${arrangementID}:`);
    console.log(err);
  }
});

router.post('/createProgramEvent', async (req, res) => {
  const { token, arrangementID, bedriftID, navn, beskrivelse, romID, klokkeslett, parallell, alleParalleller, varighet } = req.body;
  try {
    const { JWTKEY } = process.env;
    jwt.verify(token, JWTKEY);
  } catch (err) {
    res.json({
      status: 'denied'
    });
    return;
  }

  try {
    // unngå utilsiktet  parallell, i tilfelle 
    const reellParallell = alleParalleller ? 1 : parallell;
    const connection = await connect();
    await connection.query(
      'INSERT INTO ProgramHendelse(ArrangementID, Bedrift, Navn, Beskrivelse, RomID, Klokkeslett, Parallell, AlleParalleller, Varighet) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [arrangementID, bedriftID, navn, beskrivelse, romID, klokkeslett, reellParallell, alleParalleller, varighet]
    );
    res.json({
      status: 'succeeded'
    });
  } catch (err) {
    res.json({status: 'failed'});
    console.log('Failed to create new program event: ');
    console.log(err);
  }
});

router.post('/deleteProgramEvent', async (req, res) => {
  const { token, id } = req.body;
  try {
    const { JWTKEY } = process.env;
    jwt.verify(token, JWTKEY);
  } catch(e) {
    res.status(401).json({status: 'denied'});
  }

  try {
    const connection = await connect();
    await connection.query('DELETE FROM ProgramHendelse WHERE HendelsesID=?', [id]);
    connection.end();
    res.json({status:'ok'});
  } catch (error) {
    res.status(500).json({status: 'failed'});
  }
});

router.post('/addSponsor', async (req, res) => {
  const { token, arrangementID, bedriftID, sponsorType } = req.body;
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
    await connection.query('INSERT INTO Sponsor(ArrangementID, BedriftID, SponsorType) VALUES (?, ?, ?)', [arrangementID, bedriftID, sponsorType]);
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
  const { token, arrangementID, bedriftID } = req.body;
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

//External people
router.post('/externalParticipants', async (req, res) => {
  const { token, arrangementID, bedriftID } = req.body;
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
    const people =  (await connection.execute(
      'SELECT UUID, Navn FROM ExternalParticipant'
    ))[0];
    connection.end();

    res.json(people);
  } catch (error) {
    console.log('Could not fetch homepage');
    console.log(error);
  }
});

router.post('/createExternalParticipants', async (req, res) => {
  const { token, Navn } = req.body;
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
    const participants =  (await connection.query(
      'SELECT Navn FROM ExternalParticipant WHERE Navn LIKE ?', [Navn.toLowerCase()]
    ))[0];
    if(participants.length != 0) {
      res.json({status: "Already exists"});
      return;
    }
    const people =  (await connection.query(
      'INSERT INTO ExternalParticipant(UUID, Navn) VALUES (?, ?);', [uuid.v4(), Navn.toLowerCase()]
    ))[0];
    connection.end();

    res.json({status: "yes"});
  } catch (error) {
    console.log('Could not fetch homepage');
    console.log(error);
  }
});

router.post('/externalParticipants/:uuid', async (req, res) => {
  const { token, arrangementID, bedriftID } = req.body;
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
    const uuid = req.params.uuid;
    const connection = await connect();
    const people =  (await connection.query(
      'DELETE FROM ExternalParticipant WHERE UUID=?', [uuid] 
    ))[0];
    connection.end();

    res.json(people);
  } catch (error) {
    console.log('Could not fetch homepage');
    console.log(error);
  }
});

router.post('/blippTokens', async (req, res) => {
  const { token } = req.body;
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
    const tokens =  (await connection.query(
      'SELECT * FROM BlipBlopTokens;'
    ))[0];
    connection.end();

    res.json(tokens);
  } catch (error) {
    console.log('Could not fetch tokens');
    console.log(error);
  }
});

const adjectives = ["Sur", "Orange", "Gul", "Rød", "Turkis", "Sjalu"];
const nouns = ["Glassmanet", "Potet", "Bil", "Hageslange", "Trimpet", ""]

router.post('/blippTokens/create', async (req, res) => {
  const { token, paralellNo } = req.body;
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
    //Make a token
    let newToken = "";
    for(let i = 0; i < 3; i++) {
      newToken += " "+norwegianWords[Math.floor(Math.random()*norwegianWords.length)];
    }
    newToken = newToken.replace(/[^\x00-\x7F]/g, "").trim();
    const connection = await connect();
    const tokens =  (await connection.query(
      'INSERT INTO BlipBlopTokens(`Token`, `Paralell`) VALUES (?, ?);', [newToken, paralellNo]
    ))[0];
    connection.end();

    res.json({status: "yes"});
  } catch (error) {
    console.log('Could not fetch tokens');
    console.log(error);
  }
});

router.post('/blippTokens/delete', async (req, res) => {
  const { token, blippToken } = req.body;
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
    const participants =  (await connection.query(
      'SELECT Token FROM BlipBlopTokens WHERE Token LIKE ?', [blippToken]
    ))[0];
    if(participants.length == 0) {
      res.json({status: "Doesn't exist"});
      return;
    }

    const tokens =  (await connection.query(
      'DELETE FROM BlipBlopTokens WHERE `Token` = ?;', [blippToken]
    ))[0];
    connection.end();

    res.json({status: "yes"});
  } catch (error) {
    console.log('Could not fetch tokens');
    console.log(error);
  }
});

router.post('/scanStatus', async (req, res) => {
  const { token } = req.body;
  try {
    const { JWTKEY } = process.env;
    jwt.verify(token, JWTKEY);
  } catch (error) {
    res.json({
      status: 'denied'
    });
    return;
  }

  const connection = await connect();
  let externalNames =  (await connection.query(
    'SELECT Navn FROM ExternalParticipant ;'
  ))[0];
  let internalNames =  (await connection.query(
    'SELECT Navn FROM Paameldt WHERE Verifisert=TRUE;'
  ))[0];

  internalNames = internalNames.map((name) => {return name.Navn.toLowerCase()});

  externalNames = externalNames.map((name) => { return name.Navn.toLowerCase()});

  let names = externalNames.concat(internalNames).unique().sort();

  let result = [];

  for(let i = 0; i < names.length; i++) {
    let checks =  (await connection.query(
      'SELECT UUID, ScanTime, ParalellNo FROM ParticipantEventMapping WHERE ParticipantName = ?;', [names[i]]
    ))[0];
    result.push({
      name: names[i],
      scans: checks
    });
  }

  res.json(result);
  connection.end();

});

//Blip blop

const blippRouter = express.Router();

blippRouter.use("/", async (req, res, next) => {
  const token = req.headers["x-blipp-token"];
  if(typeof token === "undefined") {
    res.status(404).send("Not found");
    console.log("No token!");
    return;
  }
  console.log(`Blipp blopp middleware. Token: ${token}`);

  const connection = await connect();
  const tokens =  (await connection.query(
    'SELECT Token FROM BlipBlopTokens WHERE Token LIKE ?', [token]
  ))[0];
  if(tokens.length == 0) {
    res.status(404).send("Not found");
    console.log("Wrong token!");
    return;
  }
  connection.end();
  next();
});


blippRouter.get('/check', async (req, res) => {
  const token = req.headers["x-blipp-token"];
  const connection = await connect();
  const tokens =  (await connection.query(
    'SELECT Token, Paralell FROM BlipBlopTokens WHERE Token LIKE ?', [token]
  ))[0];
  res.json(tokens[0]);
  connection.end();
});

blippRouter.get('/nfc/:nfcId', async (req, res) => {
  const nfcId = req.params.nfcId;
  const connection = await connect();
  const tokens =  (await connection.query(
    'SELECT CardID, ParticipantName FROM CardParticipantMapping WHERE CardID LIKE ?', [nfcId]
  ))[0];
  res.json(tokens.length==0 ? {CardID: nfcId} : tokens[0]);
  connection.end();

});

blippRouter.post('/nfc/:nfcId', async (req, res) => {
  const nfcId = req.params.nfcId;
  const { userName } = req.body;
  const connection = await connect();
  const tokens =  (await connection.query(
    'SELECT CardID, ParticipantName FROM CardParticipantMapping WHERE CardID LIKE ?', [nfcId]
  ))[0];
  
  if(tokens.length != 0) {
    res.status(400).send("Object already exists");
  }

  await connection.query('INSERT INTO CardParticipantMapping(`CardID`, `ParticipantName`) VALUES (?, ?)', [nfcId, userName]);

  res.json({success: true});
  connection.end();

});

blippRouter.post('/passing/:nfcId', async (req, res) => {
  const nfcId = req.params.nfcId;
  const { userName } = req.body;
  const connection = await connect();

  //We have to get the parallell
  const token = req.headers["x-blipp-token"];
  const paralell =  (await connection.query(
    'SELECT Paralell FROM BlipBlopTokens WHERE Token LIKE ?', [token]
  ))[0];

  console.log(paralell);

  await connection.query('INSERT INTO ParticipantEventMapping(`UUID`, `ParticipantName`, `ParalellNo`) VALUES (?, ?, ?)', [uuid.v4(), userName, paralell[0].Paralell]);

  res.json({success: true});
  connection.end();

});

Array.prototype.unique = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};

blippRouter.get('/participants', async (req, res) => {
  const nfcId = req.params.nfcId;
  const connection = await connect();
  let externalNames =  (await connection.query(
    'SELECT Navn FROM ExternalParticipant ;'
  ))[0];
  let internalNames =  (await connection.query(
    'SELECT Navn FROM Paameldt WHERE Verifisert=TRUE;'
  ))[0];

  internalNames = internalNames.map((name) => {return name.Navn.toLowerCase()});

  externalNames = externalNames.map((name) => { return name.Navn.toLowerCase()});

  const names = externalNames.concat(internalNames).unique();

  res.json(names);
  connection.end();

});


router.use('/blipp', blippRouter);

module.exports = router;
