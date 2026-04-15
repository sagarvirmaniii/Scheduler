const router = require('express').Router();
const { getSlots } = require('../controllers/slotController');

router.get('/', getSlots);

module.exports = router;
