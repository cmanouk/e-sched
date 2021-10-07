const jwt = require('jsonwebtoken')
const { User } = require('../../database/models/user');
const { Event } = require('../../database/models/event');

const auth = async(req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const { _id } = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id, token })
        if (!user) {
            throw new Error()
        }
        req.token = token;
        req.user = user;
        next();
    } catch(error) {
        res.status(401).send({ error: 'Please authenticate' });
    }
}

const authEventEdits = async(req, res, next) => {
    const { user, params: { id }} = req;
    try {
        const event = await Event.findOne({
          _id: id,
          creator: user._id
        });
        if (!event) throw new Error();
        req.event = event;
        next();
    } catch(e) {
        res.status(401).send({ error: 'Not authorized to edit this event'})
    }
}

module.exports = {
    auth,
    authEventEdits
}