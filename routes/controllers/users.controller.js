const User = require('../../models/user');

exports.login = async (req, res, next) => {
  try {
    const { uid, email, username, photourl } = req.user;
    await User.findOneAndUpdate(
      { uid },
      { uid, email, username, photourl },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json({ result: 'ok', user: { email, username, photourl } });
  } catch (err) {
    next(err);
  }
};
