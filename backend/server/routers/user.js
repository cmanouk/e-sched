const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { User } = require('../../database/models/user');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/', async(req, res) => {
  const users = await User.find({});
  res.status(200).send(users);
})

router.get('/me', auth, async(req, res) => {
  const { user } = req;
  res.send(user);
})

router.post('/create', async(req, res) => {
  const { userInfo, memberPassword } = req.body;
  const user = new User({ _id: uuidv4(), ...userInfo });
  try {
    if (!isMember(memberPassword, userInfo)) throw 'Incorrect member password';
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch(e) {
    res.send(e);
  }
})

router.post('/login', async(req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findByCredentials(username, password);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch(e) {
    res.status(400).send(e);
  }
})

router.get('/username', auth, async(req, res) => {
  const { username } = req.params;
  try {
    const user = await User.find({ username })
    res.status(200).send(user);
  } catch(e) {
    res.send(e);
  }
})

router.put('/me', auth, async(req, res) => {
  const { body: { updates }, user} = req;
  try {
    for (let key in updates) {
      user[key] = updates[key];
    }
    console.log(user);
    await user.save();
    res.status(200).send(user);
  } catch(e) {
    res.status(500).send(e);
  }
})

router.delete('/me', auth, async(req, res) => {
  const { user } = req;
  try {
    await user.remove();
    res.status(200).send(user);
  } catch(e) {
    res.status(500).send(e);
  }
})

function isMember(memberPassword, user) {
  if (memberPassword === process.env.MEMBER) {
    user.admin = false;
    return true;
  } else if (memberPassword === process.env.ADMIN) {
    user.admin = true;
    return true;
  } else {
    return false;
  }
}

module.exports = router;