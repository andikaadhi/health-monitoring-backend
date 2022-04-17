const Db = require('../../models/patient');

const getPatients = () => Db.getPatients();

const addPatient = ({ name, gender, birthdate }) => Db.addPatient({ name, gender, birthdate });

module.exports = {
  getPatients,
  addPatient,
};
