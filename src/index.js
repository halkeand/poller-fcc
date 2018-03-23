const express = require('express'),
  mongoose = require('mongoose'),
  bodyParser = require('body-parser'),
  morgan = require('morgan'),
  path = require('path'),
  sanitizer = require('express-sanitize-escape'),
  { useAllRoutes, formatMongooseOutput } = require('./utils'),
  User = require('./models/User'),
  helmet = require('helmet'),
  app = express()

require('dotenv').config()
const { PORT = 3000, DB_URL } = process.env
// Middlewares + routes
app.use(helmet())
app.use(express.static(__dirname + '/build'))
sanitizer.sanitizeParams(app, ['id'])
app.use(sanitizer.middleware())
app.use(express.static('build'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({ type: 'application/json-patch+json' }))
app.use(morgan('dev'))

useAllRoutes(app)

// Uncomment on BUILD
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/build/index.html')
})

// Mongoose setup
// mongoose.set('debug', formatMongooseOutput)
mongoose
  .connect(process.env.DB_URL)
  .then(d => console.log('connected to db'))
  .catch(e => console.log(`an error occured in the db: ${e}`))

// Listen
app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`)
})
