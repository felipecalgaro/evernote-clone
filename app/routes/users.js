const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const withAuth = require('../middlewares/auth')

require('dotenv').config()
const secret = process.env.JWT_TOKEN

const User = require('../models/User')

router.post('/register', async (req, res,) => {
  const { name, email, password } = req.body
  const user = new User({ name, email, password })

  try {
    await user.save()
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ error: 'Error registering new user.' })
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })

    if (!user) {
      res.status(401).json({ error: 'Incorrect email or password.' })
    } else {
      user.isCorrectPassword(password, function (err, same) {
        if (!same) {
          res.status(401).json({ error: 'Incorrect email or password.' })
        } else {
          const token = jwt.sign({ email }, secret, { expiresIn: '10d' }) // stays logged in for 10 days
          res.json({ user, token })
        }
      })
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal error. Please try again.' })
  }
})

router.put('/', withAuth, async function (req, res) {
  const { name, email } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { _id: req.user._id },
      { $set: { name, email } },
      { upsert: true, 'new': true }
    )

    res.json(user);
  } catch (error) {
    res.status(401).json({ error });
  }
});

router.put('/password', withAuth, async function (req, res) {
  const { password } = req.body;

  try {
    const user = await User.findOne({ _id: req.user._id })
    user.password = password
    await user.save()
    res.json(user);
  } catch (error) {
    res.status(401).json({ error });
  }
});

router.delete('/', withAuth, async function (req, res) {
  try {
    const user = await User.findOne({ _id: req.user._id });
    await user.delete();
    res.json({ message: 'OK' }).status(201);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

module.exports = router;
