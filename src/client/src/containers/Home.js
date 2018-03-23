import React, { Component } from 'react'
import api from '../api'
import ErrorMessage from '../ui/ErrorMessage'
import List from '../ui/List'
import Loader from '../ui/Loader'
import PollCard from './PollCard'

export default class Home extends Component {
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
      .getAll('polls')()
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
      <List>
        {isLoading && <Loader />}
        {polls &&
          polls.map(p => (
            <PollCard fetchPolls={this.fetchPolls} {...p} key={p._id} />
          ))}
        <ErrorMessage errors={errors} type="fetching" />
      </List>
    )
  }
}
