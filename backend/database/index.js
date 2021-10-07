if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const mongoose = require('mongoose');

const { MONGO_URI } = process.env;

const db = mongoose.connect(
  MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }
);

db
  .then(() => console.log(`Connected to: ${MONGO_URI}`))
  .catch((err) => console.error(err));

module.exports = db;