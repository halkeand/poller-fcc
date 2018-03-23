const mongoose = require("mongoose"),
  { Schema } = mongoose,
  { ObjectId } = Schema.Types,
  { stringMinMaxTrimed } = require("./validatorHelpers")

const PollSchema = new Schema({
  question: {
    ...stringMinMaxTrimed,
    required: [true, "Poll question is required"]
  },
  choices: [
    {
      name: {
        ...stringMinMaxTrimed,
        required: [true, "Choice name is required"]
      },
      votes: { type: Number, default: 0 }
    }
  ],
  author: { type: ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now }
})

PollSchema.path("choices").validate(
  arr => arr.length >= 1,
  "At least 2 choices are required"
)

PollSchema.statics.submitVote = function({ pollId, choiceId }, callback) {
  var increment = {
    $inc: {
      "choices.$.votes": 1
    }
  }
  var query = {
    "polls._id": pollId,
    "choices._id": choiceId
  }

  return this.model("Poll").update(query, increment, callback)
}

module.exports = mongoose.model("Poll", PollSchema)
