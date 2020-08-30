const router = require('express').Router({ mergeParams: true });
const { connect } = require('../../dbUtils');

router.get('/', async (req, res, next) => {
  try {
    const connection = await connect();
    const rooms = await connection.query('SELECT Navn, Bygning, MazemapURL FROM Rom')[0];
    connection.end();
    res.json(rooms);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  const { name, building, mazemap } = req.body;

  try {
    const connection = await connect();
    await connection.query('INSERT INTO Rom(Navn, Bygning, MazemapURL) VALUES (?, ?, ?)', [name, building, mazemap]);
    connection.end();
    res.send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
