const Service = require('../../services/patient');

exports.getPatients = async (req, res, next) => {
  try {
    const response = await Service.getPatients();
    res.send(response);
  } catch (err) {
    next(err);
  }
};

exports.addPatient = async (req, res, next) => {
  try {
    const { name, gender, birthdate, sensor_id: sensorId } = req.body;
    await Service.addPatient({ name, gender, birthdate, sensorId });
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};
