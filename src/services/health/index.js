const Db = require('../../models/health');
const PatientDb = require('../../models/patient');

const getPatientsHealthUpdate = async () => {
  const sensorIds = [];
  const updates = await Db.getPatientsHealthUpdate({
    onRowData: (data) => sensorIds.push(Number(data.sensor)),
  });

  if (sensorIds.length === 0) return [];

  const patients = await PatientDb.getPatients({ sensorIds });

  return updates.map((update, index) => ({ ...update, patient_data: patients[index] }));
};

const getPatientHealthDetail = async (patientId) => {
  const [patient] = await PatientDb.getPatients({ patientIds: [Number(patientId)] });

  if (!patient) return {};

  const healthUpdate = await Db.getPatientLatestHealthUpdate(patient.sensor_id);

  return {
    ...patient,
    health_update: healthUpdate,
  };
};

const getPatientHealthHistory = async (patientId) => {
  const [patient] = await PatientDb.getPatientSensorId(patientId);

  if (!patient) return {};

  const [bpmData, spo2Data] = await Promise.all([
    Db.getPatientHealthBpmHistory(patient.sensor_id),
    Db.getPatientHealthSpO2History(patient.sensor_id),
  ]);

  return { bpm: bpmData, spo2: spo2Data };
};

module.exports = {
  getPatientsHealthUpdate,
  getPatientHealthDetail,
  getPatientHealthHistory,
};
