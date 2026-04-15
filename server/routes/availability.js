const router = require('express').Router();
const { get, upsert, getPublic } = require('../controllers/availabilityController');
const auth = require('../middleware/auth');

router.get('/', auth, get);
router.put('/', auth, upsert);
router.get('/public/:slug', getPublic);

module.exports = router;
