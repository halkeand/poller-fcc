const mongoose = require("mongoose"),
  { Schema } = mongoose,
  { ObjectId } = Schema.Types,
  { stringMinMaxTrimed } = require("./validatorHelpers"),
  to = require("await-to-js").to,
  bcrypt = require("bcrypt")

const UserSchema = new Schema({
  nickname: {
    ...stringMinMaxTrimed,
    required: [true, "Nickname is required"],
    lowercase: true,
    trim: true
  },
  password: {
    ...stringMinMaxTrimed,
    required: [true, "Password is required"],
    //Override stringMinMaxTrimed
    minlength: [8, "Can not be shorter than 8 characters"],
    trim: false
  },
  polls: [{ type: ObjectId, ref: "Poll" }],
  createdAt: { type: Date, default: Date.now }
})

UserSchema.methods.checkPassword = async function(pwd) {
  ;[e, resp] = await to(bcrypt.compare(pwd, this.password))
  return e ? e : resp
}

// Trouver unse solution pour checker le nickname lors de l'update
UserSchema.methods.isNicknameAvailable = async function(nickname) {
  ;[e, user] = await to(UserModel.findOne({ nickname }))
  return !user || user._id.equals(this._id) ? true : false
}

const notEmpty = obj => (Object.keys(obj).length > 0 ? true : false)

UserSchema.pre("save", async function(next) {
  const sendedErrors = { errors: {} }
  //Check nickname availability
  ;[nicknameError, resp] = await to(this.isNicknameAvailable(this.nickname))
  if (nicknameError || !resp)
    sendedErrors.errors.password = new Error("This nickname is already taken")

  //Check if password modified : hash it !
  if (this.isModified("password")) {
    ;[hashErr, hash] = await to(bcrypt.hash(this.password, 10))
    hashErr
      ? (sendedErrors.errors.password = new Error(
          "An error occured while registering your account"
        ))
      : (this.password = hash)
  }
  notEmpty(sendedErrors.errors) ? next(sendedErrors) : next()
})

const UserModel = mongoose.model("User", UserSchema)

module.exports = UserModel
