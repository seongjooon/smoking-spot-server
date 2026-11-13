const { getAuth } = require('../lib/firebase');

// Authorization: Bearer <Firebase ID token>
exports.requireAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');
    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ error: 'unauthorized' });
    }
    const decoded = await getAuth().verifyIdToken(token);
    if (!decoded.email) {
      return res.status(401).json({ error: 'unauthorized' });
    }
    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      username: decoded.name || decoded.email.split('@')[0],
      photourl: decoded.picture || ''
    };
    next();
  } catch (err) {
    res.status(401).json({ error: 'unauthorized' });
  }
};
