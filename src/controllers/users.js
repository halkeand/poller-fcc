const to = require('await-to-js').to,
  User = require('../models/User'),
  {
    json400,
    json403,
    json200,
    allowFields,
    getMessages,
    rejectKeys
  } = require('../utils')

// When we receive a json body, the only fields which can be
// Updated on the User model are the following
const extractFieldsFrom = allowFields([
  'nickname',
  'password',
  'passwordConfirm'
])

module.exports = {
  getAll: async (req, res, next) => {
    ;[e, users] = await to(User.find())
    e || users === null
      ? json400(res, { errror: 'Could not retrieve all users' })
      : json200(res, users.map(u => rejectKeys('password')(u._doc)))
  },

  getOne: async ({ params }, res, next) => {
    const { id } = params
    ;[e, user] = await to(User.findById(id))

    e || user === null
      ? json400(res, { errror: `Could not retrieve user with id : ${id}` })
      : json200(res, rejectKeys('password')(user._doc))
  },

  addOne: async ({ body }, res, next) => {
    console.log(body)

    const data = extractFieldsFrom(body)
    ;[e, user] = await to(new User(data).save())

    e
      ? json400(res, { error: getMessages(e.errors) })
      : json200(res, rejectKeys('password')(user._doc))
  },

  updateOne: async (req, res, next) => {
    const { body, params: { id }, token } = req
    if (token.id !== id) json403(res, { errror: `Operation denied` })
    else {
      const data = extractFieldsFrom(body)
      ;[findError, user] = await to(User.findById(id))

      if (findError || user === null)
        json400(res, { errror: `User ${id} does not exist` })
      else {
        for (let field in data) {
          user[field] = data[field]
        }
        ;[e, updatedUser] = await to(user.save())
        e
          ? json400(res, { error: getMessages(e.errors) })
          : json200(res, updatedUser)
      }
    }
  },

  deleteOne: async (req, res, next) => {
    const { body, params: { id }, token } = req
    if (token.id !== id) json403(res, { error: `Operation denied` })
    else {
      ;[e, user] = await to(User.findById(id).remove())
      e
        ? json400(res, {
            errror: 'An error occured while deleteing your account'
          })
        : user.n === 0
          ? json400(res, `User ${id}, does not exist`)
          : json200(res, `User ${id} deleted`)
    }
  }
}
