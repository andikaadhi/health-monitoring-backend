const router = require('express').Router();
const { getPatients, addPatient } = require('../../controllers/patient');

router.get('/', getPatients);

router.post('/', addPatient);

module.exports = router;
