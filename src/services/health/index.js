const Db = require('../../models/health');
const PatientDb = require('../../models/patient');

const getPatientsHealthUpdate = async () => {
  const patientIds = [];
  const updates = await Db.getPatientsHealthUpdate({
    onRowData: (data) => patientIds.push(Number(data.user_id)),
  });

  const patients = await PatientDb.getPatients({ patientIds });

  return updates.map((update, index) => ({ ...update, patient_data: patients[index] }));
};

const getPatientHealthDetail = async (patientId) => {
  const [patient] = await PatientDb.getPatients({ patientIds: [Number(patientId)] });
  const healthUpdate = await Db.getPatientLatestHealthUpdate(patientId);

  return {
    ...patient,
    health_update: healthUpdate,
  };
};

const getPatientHealthHistory = async (patientId) => {
  const [bpmData, spo2Data] = await Promise.all([
    Db.getPatientHealthBpmHistory(patientId),
    Db.getPatientHealthSpO2History(patientId),
  ]);

  return { bpm: bpmData, spo2: spo2Data };
};

module.exports = {
  getPatientsHealthUpdate,
  getPatientHealthDetail,
  getPatientHealthHistory,
};
