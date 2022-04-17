const router = require('express').Router();
const requireAuth = require('../middlewares/requireAuth');

router.use('/admins', require('./admin'));
router.use('/patients', requireAuth, require('./patient'));
router.use('/health', requireAuth, require('./health'));

module.exports = router;
