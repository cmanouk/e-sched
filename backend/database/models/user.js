if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

const defaultVals = {
  type: String,
  required: true,
  trim: true
}

const userSchema = new mongoose.Schema({
  _id: String,
  name: {...defaultVals},
  lastInitial: {...defaultVals},
  username: {
    ...defaultVals,
    unique: true,
    lowercase: true
  },
  password: {...defaultVals},
  email: {...defaultVals},
  phone: {...defaultVals},
  zipcode: {...defaultVals},
  private: Boolean,
  events: [String],
  admin: Boolean,
  token: String
})

userSchema.methods.generateAuthToken = async function() {
  const user = this;
  const token = jwt.sign({ _id: user._id }, JWT_SECRET);
  user.token = token;
  await user.save();
  return token;
}

userSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.private;
  delete userObject.admin;
  delete userObject.token;
  return userObject;
}

userSchema.statics.findByCredentials = async function(username, password) {
  const user = await User.findOne({ username });
  if (!user) throw new Error('Unable to login with credentials provided');
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Unable to login with credentials provided');
  return user;
}

userSchema.pre('save', async function(next) {
  const user = this;
  if (user.isModified('password')) user.password = await bcrypt.hash(user.password, 8);
  next();
})

const User = mongoose.model('User', userSchema);

module.exports = { userSchema, User };