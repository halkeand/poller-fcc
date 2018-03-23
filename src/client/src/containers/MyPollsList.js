import React, { Component } from 'react'
import { Subscribe } from 'unstated'
import Context from '../Context'

import api from '../api'
import ErrorMessage from '../ui/ErrorMessage'
import List from '../ui/List'
import Loader from '../ui/Loader'
import CenteredSection from '../ui/CenteredSection'
import { ButtonLink } from '../ui/Button'
import PollCard from './PollCard'
import { withRouter } from 'react-router-dom'

class MyPolls extends Component {
  state = {
    polls: null,
    isLoading: false,
    errors: {
      fetching: null
    }
  }

  fetchPolls = () => {
    this.setState(prevState => ({
      isLoading: true
    }))

    api
      .getAll('polls')(`?userid=${this.props.contextUser._id}`)
      .then(({ data }) => {
        this.setState(prevState => ({
          isLoading: false,
          polls: Object.values(data)
        }))
      })
      .catch(e =>
        this.setState(prevState => ({
          isLoading: false,
          error: {
            fetching: 'An error occured while fetching polls'
          }
        }))
      )
  }
  componentDidMount = () => {
    this.fetchPolls()
  }

  render() {
    const { isLoading, errors, polls } = this.state
    return (
      <CenteredSection>
        <ButtonLink to={'/newpoll'}>Create a new poll</ButtonLink>
        {polls && polls.length < 1 && <p>You don't have any polls yet</p>}
        <List>
          {isLoading && <Loader />}
          {polls &&
            polls.map(p => (
              <PollCard fetchPolls={this.fetchPolls} {...p} key={p._id} />
            ))}
          <ErrorMessage errors={errors} type="fetching" />
        </List>
      </CenteredSection>
    )
  }
}

const MyPollsWithRouter = withRouter(MyPolls)
export default props => (
  <Subscribe to={[Context]}>
    {({ state: { user } }) => (
      <MyPollsWithRouter contextUser={user} {...props} />
    )}
  </Subscribe>
)
