const { InfluxDB } = require('@influxdata/influxdb-client');

// You can generate a Token from the "Tokens Tab" in the UI
const token =
  '0vPwAephzsp3XbfU4CPAlyqHluPkOa1hjxlrf_XmEjJq0VXpX7vc_5tyGVjeHsPguxx1Vqhbz4b95mpQTj3MkA==';
const org = 'Oximeter Project';
const bucket = 'Oximeter';

const client = new InfluxDB({
  url: 'http://18.141.56.229:8086',
  token,
});

const getPatientsHealthUpdate = ({ onRowData, skip = 0, limit = 10 }) =>
  new Promise((resolve, reject) => {
    const queryApi = client.getQueryApi(org);

    const results = [];
    const query = `
      data_bpm = from(bucket: "${bucket}") 
      |> range(start: -48h) 
      |> filter(fn: (r) => r._field == "bpm")
      |> group(columns: ["sensor_id"])
      |> last()
      |> limit(n: ${limit}, offset: ${skip})

      data_spo2 = from(bucket: "${bucket}") 
      |> range(start: -48h) 
      |> filter(fn: (r) => r._field == "spo2")
      |> group(columns: ["sensor_id"])
      |> last()
      |> limit(n: ${limit}, offset: ${skip})

      join(tables: {bpm: data_bpm, spo2: data_spo2},on: ["sensor_id"],method: "inner")
      |> map(fn: (r) => ({sensor: r.sensor_id, _value_spo2: r._value_spo2, _value_bpm: r._value_bpm, sort_value: r._value_spo2 }))
      |> sort(columns: ["sort_value"])
    `;

    queryApi.queryRows(query, {
      next(row, tableMeta) {
        const o = tableMeta.toObject(row);
        console.log(o);
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

const getPatientLatestHealthUpdate = (sensorId) =>
  new Promise((resolve, reject) => {
    const queryApi = client.getQueryApi(org);

    const results = [];
    const query = `
      data_bpm = from(bucket: "${bucket}") 
      |> range(start: 2000-05-22T23:30:00Z) 
      |> group(columns: ["sensor_id"])
      |> filter(fn: (r) => r._field == "bpm" and r.sensor_id == "${sensorId}")
      |> last()
      |> limit(n: 1, offset: 0)

      data_spo2 = from(bucket: "${bucket}") 
      |> range(start: 2000-05-22T23:30:00Z) 
      |> group(columns: ["sensor_id"])
      |> filter(fn: (r) => r._field == "spo2" and r.sensor_id == "${sensorId}")
      |> last()
      |> limit(n: 1, offset: 0)

      join(
        tables: {bpm: data_bpm, spo2: data_spo2},
        on: ["sensor_id"],
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

const getPatientHealthBpmHistory = (sensorId) =>
  new Promise((resolve, reject) => {
    const queryApi = client.getQueryApi(org);

    const results = [];
    const query = `
    from(bucket: "${bucket}") 
    |> range(start: 2000-05-22T23:30:00Z) 
    |> filter(fn: (r) => r._field == "bpm" and r.sensor_id == "${sensorId}")
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

const getPatientHealthSpO2History = (sensorId) =>
  new Promise((resolve, reject) => {
    const queryApi = client.getQueryApi(org);

    const results = [];
    const query = `
    from(bucket: "${bucket}") 
    |> range(start: 2000-05-22T23:30:00Z) 
    |> filter(fn: (r) => r._field == "spo2" and r.sensor_id == "${sensorId}")
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
