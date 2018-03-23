import axios from 'axios'
const options = {
  headers: {
    'Content-Type': 'application/json-patch+json'
  }
}

const withAuth = options => {
  try {
    const optionsWithAuth = { ...options }
    optionsWithAuth.headers['Authorization'] = `Bearer ${localStorage.getItem(
      'token'
    )}`
    return optionsWithAuth
  } catch (e) {
    console.log(e)
  }
}
export default {
  addOne: what => data => axios.post(`/api/${what}`, data, withAuth(options)),
  login: what => data => axios.post(`/api/auth/login`, data, options),
  getOne: what => params => axios.get(`/api/${what}/${params}`, options),
  getAll: what => (queryParams = '') =>
    axios.get(`/api/${what}/${queryParams}`, options),
  updateOne: what => (data, params) =>
    axios.patch(`/api/${what}/${params}`, data, withAuth(options)),
  deleteOne: what => params =>
    axios.delete(`/api/${what}/${params}`, withAuth(options)),
  vote: ({ pollId, choiceId }) =>
    axios.post(`/api/polls/vote/${pollId}/${choiceId}`, {}, options)
}
