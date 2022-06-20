const { InfluxDB } = require('@influxdata/influxdb-client');

// You can generate a Token from the "Tokens Tab" in the UI
const token = process.env.INFLUX_DB_TOKEN;
const org = process.env.INFLUX_DB_ORG;
const bucket = process.env.INFLUX_DB_BUCKET;

const client = new InfluxDB({
  url: process.env.INFLUX_DB_HOST,
  token,
});

const getPatientsHealthUpdate = ({ onRowData, skip = 0, limit = 10 }) =>
  new Promise((resolve, reject) => {
    const queryApi = client.getQueryApi(org);

    const results = {};
    const query = `
      data_bpm = from(bucket: "${bucket}") 
      |> range(start: -1w) 
      |> filter(fn: (r) => r._field == "bpm")
      |> group(columns: ["sensor_id"])
      |> last()
      |> tail(n: ${limit}, offset: ${skip})

      data_spo2 = from(bucket: "${bucket}") 
      |> range(start: -1w) 
      |> filter(fn: (r) => r._field == "spo2")
      |> group(columns: ["sensor_id"])
      |> last()
      |> tail(n: ${limit}, offset: ${skip})

      join(tables: {bpm: data_bpm, spo2: data_spo2},on: ["sensor_id"],method: "inner")
      |> map(fn: (r) => ({sensor: r.sensor_id, _value_spo2: r._value_spo2, _value_bpm: r._value_bpm, sort_value: r._value_spo2 }))
      |> sort(columns: ["sort_value"])
    `;

    //   const query = `
    //   from(bucket: "${bucket}")
    //   |> range(start: -48h)
    //   |> filter(fn: (r) => r._field == "spo2")
    //   |> group(columns: ["sensor_id"])
    //   |> last()
    //   |> tail(n: ${limit}, offset: ${skip})
    // `;

    queryApi.queryRows(query, {
      next(row, tableMeta) {
        const o = tableMeta.toObject(row);
        o.is_critical = o._value_spo2 < 90;
        results[o.sensor] = o;
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
      |> range(start: -1w)
      |> group(columns: ["sensor_id"])
      |> filter(fn: (r) => r._field == "bpm" and r.sensor_id == "${sensorId}")
      |> last()
      |> limit(n: 1, offset: 0)

      data_spo2 = from(bucket: "${bucket}") 
      |> range(start: -1w)
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
    |> range(start: -1w) 
    |> filter(fn: (r) => r._field == "bpm" and r.sensor_id == "${sensorId}")
    |> tail(n: 10, offset: 0)
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
    |> range(start: -1w) 
    |> filter(fn: (r) => r._field == "spo2" and r.sensor_id == "${sensorId}")
    |> tail(n: 10, offset: 0)
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
