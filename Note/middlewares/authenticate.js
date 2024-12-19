const jwt = require ('jsonwebtoken');

const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader)
    return res.status (401).json ({message: 'No token provided'});

  const token = authHeader.split (' ')[1];
  if (!token) return res.status (401).json ({message: 'Invalid token format'});

  jwt.verify (token, process.env.SECRET_KEY, (err, decoded) => {
    if (err)
      return res.status (403).json ({message: 'Failed to authenticate token'});

    req.userId = decoded.id;
    next ();
  });
};

module.exports = {authenticate};
