const router = require('express').Router();

const jwt = require('jsonwebtoken');
const path = require('path');
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');

const { verifyToken } = require('./middlewares/authoriztion');
const spotsController = require('./controllers/spots.controller');
const comentsController = require('./controllers/coments.controller');

const User = require('../models/user');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'ap-northeast-2'
});

const s3 = new AWS.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'smokingspot',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read-write',
    key: (req, file, cb) => {
      let extension = path.extname(file.originalname);
      cb(null, Date.now().toString() + extension);
    }
  })
});

router.post('/users', async (req, res, next) => {
  try {
    const user = ({ username, email, photourl } = await User.findOne({
      email: req.body.email
    }));

    if (!user) {
      const newUser = new User(user);
      await newUser.save();
    }

    res.send({
      result: 'ok',
      token: jwt.sign(
        JSON.stringify({ username, email, photourl }),
        process.env.SECRET_KEY
      )
    });
  } catch (err) {
    next(err);
  }
});

router.post('/spots/new', verifyToken, spotsController.create);

router.get('/spots', verifyToken, spotsController.getAll);

router.get('/spots/:spot_id', verifyToken, spotsController.getOne);

router.post('/spots/image', upload.single('file'), (req, res, next) => {
  let imgFile = req.file;
  res.json(imgFile.location);
});

router.get('/coments/:spot_id', verifyToken, comentsController.getComents);

router.post('/coments/:spot_id', verifyToken, comentsController.resister);

module.exports = router;
