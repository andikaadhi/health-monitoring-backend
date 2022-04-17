const Service = require('../../services/health');

exports.getPatientsHealthUpdate = async (req, res, next) => {
  try {
    const response = await Service.getPatientsHealthUpdate();
    res.send(response);
  } catch (err) {
    next(err);
  }
};

exports.getPatientHealthDetail = async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const response = await Service.getPatientHealthDetail(patientId);
    res.send(response);
  } catch (err) {
    next(err);
  }
};

exports.getPatientHealthHistory = async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const response = await Service.getPatientHealthHistory(patientId);
    res.send(response);
  } catch (err) {
    next(err);
  }
};
