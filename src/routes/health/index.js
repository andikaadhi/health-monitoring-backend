const router = require('express').Router();
const {
  getPatientsHealthUpdate,
  getPatientHealthDetail,
  getPatientHealthHistory,
} = require('../../controllers/health');

router.get('/quick-update', getPatientsHealthUpdate);
router.get('/patients/:patientId', getPatientHealthDetail);
router.get('/patients/:patientId/history', getPatientHealthHistory);

module.exports = router;
