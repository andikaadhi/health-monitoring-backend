const Service = require('../../services/admin');

exports.createAdmin = async (req, res, next) => {
  try {
    const { email, name, password } = req.body;
    const response = await Service.createAdmin({ email, name, password });
    res.send(response);
  } catch (err) {
    next(err);
  }
};

exports.requestAdminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const response = await Service.createAdminToken(email, password);
    res.send(response);
  } catch (err) {
    next(err);
  }
};
