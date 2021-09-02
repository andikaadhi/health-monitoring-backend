// express
const express = require('express');

// config
const { PORT } = require('./config');

const app = express();

// body parse for http body request
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// cors
// app.use(require('./config/cors'));

// Log request
app.use(require('./middleware/httpLog'));

// Routes
app.use('/', require('./routes'));

// Error Handling
app.use(require('./middleware/errorHandler'));

// LISTEN - start serve
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`SERVER LISTEN ON PORT ${PORT}`);
});
