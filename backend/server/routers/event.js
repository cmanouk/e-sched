const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { Event } = require('../../database/models/event');
const { auth, authEventEdits } = require('../middleware/auth')

const router = express.Router();

router.get('/', async(req, res) => {
  const events = await Event.find({});
  res.status(200).send(events);
})

router.get('/:id', auth, async(req, res) => {
  const { id } = req.params;
  try {
    const event = await Event.findOne({ _id: id })
    res.status(200).send(event);
  } catch(e) {
    res.status(400).send(e);
  }
})

router.post('/create', auth, async(req, res) => {
  const { body: { eventInfo }, user } = req;
  try {
    const event = new Event({ _id: uuidv4(), ...eventInfo });
    user['events'] = user['events'].concat(event._id);
    await user.save();
    event['attendees'] = event['attendees'].concat(user._id);
    await event.save();
    res.status(200).send({ user, event });
  } catch(e) {
    res.status(400).send(e);
  }
})

router.put('/:id', auth, authEventEdits, async(req, res) => {
  const { body: { updates }, event } = req;
  try {
    for (let key in updates) {
      event[key] = updates[key];
    }
    await event.save();
    res.status(200).send(event);
  } catch (e) {
    res.status(400).send(e);
  }
})

router.delete('/:id', auth, authEventEdits, async(req, res) => {
  const { event } = req;
  try {
    await event.remove();
    res.status(200).send(event);
  } catch(e) {
    res.status(500).send(e);
  }
})

module.exports = router;