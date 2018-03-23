import React, { Component } from 'react'
import api from '../api'
import ErrorMessage from '../ui/ErrorMessage'
import Button from '../ui/Button'
import Form from '../ui/Form'
import Input from '../ui/Input'
import CenteredSection from '../ui/CenteredSection'
import Context from '../Context'
import { Subscribe } from 'unstated'
import { withRouter } from 'react-router-dom'

class SignIn extends Component {
  state = {
    nickname: '',
    password: '',
    isActuallyLogin: true,
    errors: null
  }

  onSubmit = e => {
    e.preventDefault()
    const { nickname, password, isActuallyLogin } = this.state
    api[isActuallyLogin ? 'login' : 'addOne']('users')({ nickname, password })
      .then(({ data: { token, user } }) => {
        const { _authenticate, history } = this.props
        if (token) _authenticate(token, history, user)
      })
      .catch(({ response: { data: { error } } }) => {
        const errorObj = typeof error === 'string' ? { error } : { ...error }

        this.setState(prevState => ({
          errors: {
            ...prevState.errors,
            ...errorObj
          }
        }))
      })
  }

  onChange = ({ target: { name, value } }) =>
    this.setState(prevState => ({
      [name]: value
    }))

  toggleFormMode = () =>
    this.setState(prevState => ({
      isActuallyLogin: !prevState.isActuallyLogin,
      errors: null
    }))

  render() {
    const { nickname, password, isActuallyLogin, errors } = this.state
    return (
      <CenteredSection>
        <h1>{isActuallyLogin ? 'Login' : 'Register'}</h1>
        <Form onSubmit={this.onSubmit}>
          <ErrorMessage errors={errors} type={'error'} />

          <label htmlFor="nickname">Nickname</label>
          <Input
            type="text"
            name="nickname"
            value={nickname}
            onChange={this.onChange}
          />
          <ErrorMessage errors={errors} type={'nickname'} />

          <label htmlFor="password">Password</label>
          <Input
            type="password"
            name="password"
            value={password}
            onChange={this.onChange}
          />
          <ErrorMessage errors={errors} type={'password'} />

          <Button type="submit">Submit</Button>
        </Form>
        <Button onClick={this.toggleFormMode}>
          {isActuallyLogin ? 'Or register ?' : 'Or login ?'}
        </Button>
      </CenteredSection>
    )
  }
}

const SignInWithRouter = withRouter(SignIn)

export default () => (
  <Subscribe to={[Context]}>
    {context => <SignInWithRouter {...context} />}
  </Subscribe>
)
