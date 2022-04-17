const db = require('../../db');

const getPatients = ({ patientIds } = {}) => {
  const query = db('patient');

  if (patientIds && patientIds.length > 0)
    query
      .whereIn('patient_id', patientIds)
      .orderBy(
        db.raw(`array_position(array[??], patient.patient_id)`, [patientIds])
      );

  return query;
};

const addPatient = ({ name, birthdate, gender }) =>
  db('patient').insert({ name, birthdate, gender });

module.exports = {
  getPatients,
  addPatient,
};
