const router = require('express').Router({ mergeParams: true });
const fs = require('fs');
const { connect } = require('../../dbUtils');

const norwegianWords = fs.readFileSync('./ordliste_aspell.txt', 'utf8').split('\n');

router.get('/tokens', async (req, res, next) => {
  try {
    const connection = await connect();
    const tokens = (await connection.query('SELECT * FROM BlipBlopTokens;'))[0];
    connection.end();

    res.json(tokens);
  } catch (error) {
    next(error);
  }
});

router.post('/tokens', async (req, res, next) => {
  const { paralellNo } = req.body;

  try {
    // Make a token
    let newToken = '';
    for (let i = 0; i < 3; i += 1) {
      newToken += ` ${norwegianWords[Math.floor(Math.random() * norwegianWords.length)]}`;
    }
    // eslint-disable-next-line no-control-regex
    newToken = newToken.replace(/[^\x00-\x7F]/g, '').trim();
    const connection = await connect();
    await connection.query('INSERT INTO BlipBlopTokens(`Token`, `Paralell`) VALUES (?, ?);', [newToken, paralellNo]);
    connection.end();

    res.send();
  } catch (error) {
    next(error);
  }
});

router.delete('/tokens/:blippToken', async (req, res, next) => {
  const { blippToken } = req.params;
  try {
    const connection = await connect();
    await connection.query('DELETE FROM BlipBlopTokens WHERE `Token` = ?;', [blippToken]);
    connection.end();

    res.send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
