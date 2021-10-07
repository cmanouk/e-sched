if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express');
const bp = require('body-parser');
const compression = require('compression');
const cors = require('cors');
const db = require('../database/index');
const users = require('./routers/user');
const events = require('./routers/event');

const { PORT } = process.env;
const app = express();

app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.use(compression());
app.use('/users', users);
app.use('/events', events);

app.listen(PORT, () => {
  console.log(`Port is up on ${PORT}`)
})