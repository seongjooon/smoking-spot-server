const Spot = require('../../models/spot');

exports.getAll = async (req, res, next) => {
  try {
    const spotList = await Spot.find();

    res.status(201).json({ result: 'ok', spotList });
  } catch (err) {
    next();
    res.status(500).json({ errMessage: 'Internal Server Error' });
  }
};

exports.create = async (req, res, next) => {
  try {
    const newSpot = new Spot(req.body);

    await newSpot.save();

    res.status(201).json({ message: 'Success!' });
  } catch (err) {
    next();
    res.status(400).json({ message: 'Fail' });
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const spotId = req.params.spot_id;
    const spot = await Spot.findById(spotId);

    res.status(201).json({ result: 'ok', spot });
  } catch (err) {
    next();
    res.status(500).json({ errMessage: 'Internal Server Error' });
  }
};
