const mongoose = require('mongoose');
const Spot = require('../../models/spot');

const isValidId = id => mongoose.Types.ObjectId.isValid(id);

exports.getAll = async (req, res, next) => {
  try {
    const spotList = await Spot.find().limit(1000);
    res.json({ result: 'ok', spotList });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { title, address, photo_url, location } = req.body || {};
    const spot = new Spot({
      email: req.user.email, // 작성자는 검증된 토큰에서만 가져온다
      title,
      address,
      photo_url,
      location
    });
    try {
      await spot.validate();
    } catch (err) {
      return res.status(400).json({ message: 'Invalid spot data' });
    }
    if (!/^https:\/\//.test(photo_url)) {
      return res.status(400).json({ message: 'Invalid photo url' });
    }
    await spot.save();
    res.status(201).json({ message: 'Success!', spot });
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    if (!isValidId(req.params.spot_id)) {
      return res.status(404).json({ message: 'Not found' });
    }
    const spot = await Spot.findById(req.params.spot_id);
    if (!spot) return res.status(404).json({ message: 'Not found' });
    res.json({ result: 'ok', spot });
  } catch (err) {
    next(err);
  }
};
