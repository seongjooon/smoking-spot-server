const mongoose = require('mongoose');
const Coment = require('../../models/coment');
const Spot = require('../../models/spot');

const list = spotId => Coment.find({ spot_id: spotId }).sort({ created_at: -1 });

exports.getComents = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.spot_id)) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.json({ result: 'ok', coments: await list(req.params.spot_id) });
  } catch (err) {
    next(err);
  }
};

exports.register = async (req, res, next) => {
  try {
    const spotId = req.params.spot_id;
    if (!mongoose.Types.ObjectId.isValid(spotId) || !(await Spot.exists({ _id: spotId }))) {
      return res.status(404).json({ message: 'Not found' });
    }
    const { coment_text, rate } = req.body || {};
    const coment = new Coment({
      spot_id: spotId,
      created_by: req.user.email,
      created_at: new Date(),
      coment_text,
      rate
    });
    try {
      await coment.validate();
    } catch (err) {
      return res.status(400).json({ message: 'Invalid comment data' });
    }
    await coment.save();
    res.status(201).json({ result: 'ok', comentList: await list(spotId) });
  } catch (err) {
    next(err);
  }
};
