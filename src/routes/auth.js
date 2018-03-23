const express = require('express'),
  router = express.Router(),
  to = require('await-to-js').to,
  jwt = require('jsonwebtoken'),
  User = require('../models/User'),
  { json403, json200, rejectKeys } = require('../utils'),
  { JWT_SECRET } = process.env

// Login
router.post('/login', async ({ body: { nickname, password } }, res) => {
  ;[e, user] = await to(User.findOne({ nickname }))
  if (e || !user) json403(res, { error: 'User not found' })
  else {
    ;[err, passwordMatch] = await to(user.checkPassword(password))

    err || !passwordMatch
      ? json403(res, { error: 'Given email and password are not matching' })
      : json200(res, {
          user: rejectKeys('password')(user._doc),
          token: jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '2h' })
        })
  }
})

module.exports = router
