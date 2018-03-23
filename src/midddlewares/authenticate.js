const to = require('await-to-js').to,
  jwt = require('jsonwebtoken'),
  { json403 } = require('../utils'),
  { JWT_SECRET } = process.env

const authenticate = async (req, res, next) => {
  const { headers: { authorization } } = req

  if (!authorization)
    json403(res, { error: 'No authorization header provided' })
  else {
    try {
      const decodedToken = jwt.verify(
        authorization.replace('Bearer ', ''),
        JWT_SECRET
      )
      !decodedToken
        ? json403(res, { error: 'Invalid authorization token provided' })
        : (req.token = decodedToken) && next()
    } catch (e) {
      json403(res, { error: `An error occured : ${e.message}` })
    }
  }
}

module.exports = authenticate
