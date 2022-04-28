const Db = require('../../models/patient');

const getPatients = () => Db.getPatients();

const addPatient = async ({ name, gender, birthdate, sensorId }) => {
  const patientId = await Db.addPatient({ name, gender, birthdate });

  return Db.addPatientSensorID({ patientId, sensorId });
};

module.exports = {
  getPatients,
  addPatient,
};
