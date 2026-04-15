const router = require('express').Router();
const { list, create, cancel } = require('../controllers/bookingController');
const auth = require('../middleware/auth');

router.get('/', auth, list);
router.post('/', create);          // public — guests book
router.patch('/:id/cancel', auth, cancel);

module.exports = router;
