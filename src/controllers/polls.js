const to = require('await-to-js').to,
  Poll = require('../models/Poll'),
  { json400, json200, allowFields, getMessages } = require('../utils')

// When we receive a json body, the only fields which can be
// Updated on the Poll model are the following
const extractFieldsFrom = allowFields(['choices', 'name', 'question'])

module.exports = {
  getAll: async (req, res, next) => {
    ;[e, polls] = await to(Poll.find())
    if (e || polls === null)
      json400(res, { error: 'Could not retrieve all polls' })
    else {
      const returnedPolls = req.query.userid
        ? Object.values(polls).filter(p => p.author.equals(req.query.userid))
        : Object.values(polls)
      json200(res, returnedPolls)
    }
  },

  getOne: async ({ params }, res, next) => {
    const { id } = params
    ;[e, poll] = await to(Poll.findById(id))
    e || poll === null
      ? json400(res, { error: `Could not retrieve poll with id : ${id}` })
      : json200(res, poll._doc)
  },

  addOne: async (req, res, next) => {
    const { body, token } = req

    const data = extractFieldsFrom(body)
    ;[e, poll] = await to(new Poll({ ...data, author: token.id }).save())
    e ? json400(res, { error: getMessages(e.errors) }) : json200(res, poll._doc)
  },

  updateOne: async (req, res, next) => {
    const { token, body, params: { id } } = req
    const data = extractFieldsFrom(body)
    ;[e, poll] = await to(Poll.findById(id))
    if (poll === null || e) json400(res, { error: `Poll ${id} does not exist` })
    else if (poll.author.equals(token.id)) {
      //Warning : this is actually replacing choices id
      for (var field in data) {
        poll[field] = data[field]
      }
      ;[updateError, updatedPoll] = await to(poll.save())

      updateError
        ? json400(res, { error: getMessages(updateError.errors) })
        : json200(res, updatedPoll)
    } else
      json400(res, {
        error: `Not authorized : Poll ${id} does not belong to you`
      })
  },

  deleteOne: async (req, res, next) => {
    const { token, body, params: { id } } = req
    ;[e, poll] = await to(Poll.findById(id))
    if (poll === null || e) json400(res, { error: `Poll ${id} does not exist` })
    else if (poll.author.equals(token.id)) {
      ;[removeError, poll] = await to(poll.remove())
      removeError
        ? json400(res, { error: getMessages(removeError.errors) })
        : json200(res, `Poll ${id} deleted`)
    } else
      json400(res, {
        error: `Not authorized : Poll ${id} does not belong to you`
      })
  },

  vote: async (req, res, next) => {
    const { params: { id, choiceId } } = req
    ;[updateError, update] = await to(Poll.submitVote({ id, choiceId }))
    if (updateError || update.n === 0)
      json400(res, { error: `Could not vote for this poll's choice` })
    else {
      ;[e, poll] = await to(Poll.findById(id))
      e ? json400(res, { error: getMessages(e.errors) }) : json200(res, poll)
    }
  },

  getPollsByUser: async (req, res, next) => {
    const { params: { userId } } = req
  }
}
