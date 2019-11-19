const Coment = require('../../models/coment');

exports.resister = async (req, res, next) => {
  try {
    const newComent = new Coment(req.body);
    await newComent.save();

    const comentList = await Coment.find({ spot_id: req.params.spot_id }).sort({
      created_at: 'desc'
    });

    res.status(201).json({ result: 'ok', comentList });
  } catch (err) {
    console.log(err);
    next();
    res.status(500).json({ errMessage: 'Error' });
  }
};

exports.getComents = async (req, res, next) => {
  try {
    const coments = await Coment.find({ spot_id: req.params.spot_id }).sort({
      created_at: 'desc'
    });

    res.status(201).json({ result: 'ok', coments });
  } catch (err) {
    next();
    res.status(500).json({ errMessage: 'Error' });
  }
};
