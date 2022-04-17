const { InfluxDB, Point } = require('@influxdata/influxdb-client');

// You can generate an API token from the "API Tokens Tab" in the UI
const token =
  'YT_Zo5V-32Xbl5YDZHT1zrDUD34BJVwSB-4452nOERcjYiXfGuXK8MY9iCvieY1TuT_YR6BKG86h06GNTMqJtg==';
const org = 'Oximeter Project';
const bucket = 'Oximeter';

const client = new InfluxDB({
  url: 'http://13.250.103.150:8086',
  token,
});

const getPatientsHealthUpdate = ({ onRowData, skip = 0, limit = 10 }) =>
  new Promise((resolve, reject) => {
    const queryApi = client.getQueryApi(org);

    const results = [];
    const query = `
      data_bpm = from(bucket: "${bucket}") 
      |> range(start: -48h) 
      |> group(columns: ["user_id"])
      |> filter(fn: (r) => r._field == "bpm")
      |> sort(columns: ["_value"])
      |> last()
      |> limit(n: ${limit}, offset: ${skip})

      data_spo2 = from(bucket: "${bucket}") 
      |> range(start: -48h) 
      |> group(columns: ["user_id"])
      |> filter(fn: (r) => r._field == "spo2")
      |> sort(columns: ["_value"])
      |> last()
      |> limit(n: ${limit}, offset: ${skip})

      join(
        tables: {bpm: data_bpm, spo2: data_spo2},
        on: ["user_id"],
        method: "inner",
      )
    `;

    queryApi.queryRows(query, {
      next(row, tableMeta) {
        const o = tableMeta.toObject(row);
        results.push(o);
        onRowData(o);
      },
      error(error) {
        reject(error);
      },
      complete() {
        resolve(results);
      },
    });
  });

const getPatientLatestHealthUpdate = (patientId) =>
  new Promise((resolve, reject) => {
    const queryApi = client.getQueryApi(org);

    const results = [];
    const query = `
      data_bpm = from(bucket: "${bucket}") 
      |> range(start: 2000-05-22T23:30:00Z) 
      |> group(columns: ["user_id"])
      |> filter(fn: (r) => r._field == "bpm" and r.user_id == "${patientId}")
      |> last()
      |> limit(n: 1, offset: 0)

      data_spo2 = from(bucket: "${bucket}") 
      |> range(start: 2000-05-22T23:30:00Z) 
      |> group(columns: ["user_id"])
      |> filter(fn: (r) => r._field == "spo2" and r.user_id == "${patientId}")
      |> last()
      |> limit(n: 1, offset: 0)

      join(
        tables: {bpm: data_bpm, spo2: data_spo2},
        on: ["user_id"],
        method: "inner",
      )
    `;

    queryApi.queryRows(query, {
      next(row, tableMeta) {
        const o = tableMeta.toObject(row);
        results.push(o);
      },
      error(error) {
        reject(error);
      },
      complete() {
        const [patientData] = results;
        resolve(patientData);
      },
    });
  });

const getPatientHealthBpmHistory = (patientId) =>
  new Promise((resolve, reject) => {
    const queryApi = client.getQueryApi(org);

    const results = [];
    const query = `
    from(bucket: "${bucket}") 
    |> range(start: 2000-05-22T23:30:00Z) 
    |> filter(fn: (r) => r._field == "bpm" and r.user_id == "${patientId}")
    |> limit(n: 10, offset: 0)
  `;

    queryApi.queryRows(query, {
      next(row, tableMeta) {
        const o = tableMeta.toObject(row);
        results.push(o);
      },
      error(error) {
        reject(error);
      },
      complete() {
        resolve(results);
      },
    });
  });

const getPatientHealthSpO2History = (patientId) =>
  new Promise((resolve, reject) => {
    const queryApi = client.getQueryApi(org);

    const results = [];
    const query = `
    from(bucket: "${bucket}") 
    |> range(start: 2000-05-22T23:30:00Z) 
    |> filter(fn: (r) => r._field == "spo2" and r.user_id == "${patientId}")
    |> limit(n: 10, offset: 0)
  `;

    queryApi.queryRows(query, {
      next(row, tableMeta) {
        const o = tableMeta.toObject(row);
        results.push(o);
      },
      error(error) {
        reject(error);
      },
      complete() {
        resolve(results);
      },
    });
  });

module.exports = {
  getPatientsHealthUpdate,
  getPatientLatestHealthUpdate,
  getPatientHealthBpmHistory,
  getPatientHealthSpO2History,
};
