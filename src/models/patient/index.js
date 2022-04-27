const db = require('../../db');

const getPatients = ({ patientIds, sensorIds } = {}) => {
  const query = db('patient')
    .leftJoin('patient_has_sensor', 'patient.patient_id', 'patient_has_sensor.patient_id')
    .select('patient.*', 'patient_has_sensor.*');

  if (sensorIds && sensorIds.length > 0)
    query
      .whereIn('patient_has_sensor.sensor_id', sensorIds)
      .orderBy(db.raw(`array_position(array[??], patient_has_sensor.sensor_id)`, [sensorIds]));

  if (patientIds && patientIds.length > 0)
    query
      .whereIn('patient_id', patientIds)
      .orderBy(db.raw(`array_position(array[??], patient.patient_id)`, [patientIds]));

  return query;
};

const getPatientSensorId = (patientId) =>
  db('patient_has_sensor').where('patient_id', patientId).select('sensor_id');

const addPatient = ({ name, birthdate, gender }) =>
  db('patient').insert({ name, birthdate, gender });

module.exports = {
  getPatients,
  addPatient,
  getPatientSensorId,
};
