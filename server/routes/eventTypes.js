const router = require('express').Router();
const { list, create, update, remove, getBySlug, getByUsername } = require('../controllers/eventTypeController');
const auth = require('../middleware/auth');

router.get('/', auth, list);
router.post('/', auth, create);
router.put('/:id', auth, update);
router.delete('/:id', auth, remove);
router.get('/public/user/:username', getByUsername);
router.get('/public/:slug', getBySlug);

module.exports = router;
