const jwt = require('jsonwebtoken');

function adminAuthentication(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  const { TECHTALKS_JWT_KEY } = process.env;

  jwt.verify(token, TECHTALKS_JWT_KEY, (err, user) => {
    console.log(err);
    if (err) return res.sendStatus(403);
    req.user = user;
    return next();
  });

  return null;
}

module.exports = adminAuthentication;
