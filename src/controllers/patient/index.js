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
    const { name, gender, birthdate } = req.body;
    await Service.addPatient({ name, gender, birthdate });
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};
