require('dotenv').config()
const secret = process.env.JWT_TOKEN

const jwt = require('jsonwebtoken')

const User = require('../models/User')

const WithAuth = (req, res, next) => {
  const token = req.headers['x-access-token'] // token is sent through req headers

  if (!token) {
    res.status(401).json({ error: 'Unauthorized access: no token provided.' })
    return
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      res.status(401).json({ error: 'Unauthorized access: invalid token.' })
      return
    }

    req.email = decoded.email
    User.findOne({ email: decoded.email })
      .then(user => {
        req.user = user
        next()
      })
      .catch(err => {
        res.status(401).json({ error: err })
      })
  })
}

module.exports = WithAuth