const mongoose = require('mongoose');

const defaultVals = {
  type: String,
  required: true,
  trim: true
}

const eventSchema = new mongoose.Schema({
  _id: {...defaultVals},
  date_start: {
    type: Number,
    required: true
  },
  date_end: {
    type: Number,
    required: true
  },
  location: {...defaultVals},
  description: {...defaultVals},
  attendees: [String],
  creator: String
})

const Event = mongoose.model('Event', eventSchema);

module.exports = { eventSchema, Event };