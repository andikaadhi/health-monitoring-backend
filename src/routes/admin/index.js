const router = require('express').Router();
const { createAdmin, requestAdminLogin } = require('../../controllers/admin');

router.post('/', createAdmin);

router.post('/login', requestAdminLogin);

module.exports = router;
