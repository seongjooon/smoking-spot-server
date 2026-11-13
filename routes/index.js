const router = require('express').Router();
const { requireAuth } = require('../middlewares/auth');
const spots = require('./controllers/spots.controller');
const coments = require('./controllers/coments.controller');
const users = require('./controllers/users.controller');
const upload = require('./controllers/upload.controller');

router.get('/health', (req, res) => res.json({ ok: true }));

router.post('/users', requireAuth, users.login);

router.get('/spots', requireAuth, spots.getAll);
router.post('/spots/new', requireAuth, spots.create);
router.post('/spots/upload', requireAuth, upload.handle);
router.get('/spots/:spot_id', requireAuth, spots.getOne);

router.get('/coments/:spot_id', requireAuth, coments.getComents);
router.post('/coments/:spot_id', requireAuth, coments.register);

module.exports = router;
