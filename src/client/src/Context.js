import { Container } from 'unstated'
class Context extends Container {
  state = {
    isAuthenticated: localStorage.getItem('token') ? true : false,
    user: JSON.parse(localStorage.getItem('user'))
  }

  _authenticate = (token, history, user) => {
    try {
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      this.setState({ isAuthenticated: true, user })
      history.push('/mypolls')
    } catch (e) {
      this.setState({ isAuthenticated: false })
    }
  }

  _logout = () => {
    try {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      this.setState({ isAuthenticated: false, user: null })
    } catch (e) {
      console.log(e)
    }
  }
}

export default Context
