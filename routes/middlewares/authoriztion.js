const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers['authorization'].split(' ')[1];
    const user = jwt.verify(token, process.env.SECRET_KEY);

    if (user) {
      next();
    } else {
      throw new Error();
    }
  } catch (err) {
    res.status(401).json({ error: 'unauthorized' });
  }
};

exports.verifyToken = verifyToken;
