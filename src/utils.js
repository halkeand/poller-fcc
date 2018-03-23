require('colors')
const deepFilter = require('deep-filter')

const useAllRoutes = (app, pathPrefix = '/api') => {
  Object.entries(require(`${process.cwd()}/src/routes`)).forEach(entrie => {
    ;[name, route] = entrie
    app.use(`${pathPrefix}/${name}`, route)
  })
}

// iterate over the fields of an object and get the searched inner key
const onEachFieldGetKey = searchedKey => obj => {
  let output = {}
  for (let field in obj) {
    output[field] = obj[field][searchedKey]
  }
  return output
}

const getMessages = onEachFieldGetKey('message')

const allowFields = allowedFields => objToFilter =>
  deepFilter(
    objToFilter,
    (value, prop, subject) =>
      typeof prop === 'number' ? true : allowedFields.includes(prop)
  )

const json400 = (res, data) =>
  res.status(400).json({
    ...data
  })

const json403 = (res, data) =>
  res.status(403).json({
    ...data
  })

const json200 = (res, data) =>
  res.status(200).json({
    ...data
  })

const formatMongooseOutput = (collectionName, method, query, doc) =>
  console.log(
    'Mongoose: '.cyan +
      collectionName +
      '.' +
      method +
      ' (' +
      JSON.stringify(query, null, 4) +
      ')'
  )
const rejectKeys = (...keys) => obj =>
  Object.keys(obj)
    .filter(k => !keys.includes(k))
    .map(k => Object.assign({}, { [k]: obj[k] }))
    .reduce((res, o) => Object.assign(res, o), {})

module.exports = {
  useAllRoutes,
  json400,
  json403,
  json200,
  getMessages,
  formatMongooseOutput,
  allowFields,
  rejectKeys
}
