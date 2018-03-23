import React, { Component, Fragment } from 'react'
import api from '../api'
import ErrorMessage from '../ui/ErrorMessage'
import Loader from '../ui/Loader'
import PollCard from './PollCard'

export default class IndividualPollCard extends Component {
  state = {
    poll: null,
    isLoading: false,
    errors: {
      fetching: null
    }
  }

  componentDidMount = () => {
    this.setState(prevState => ({
      isLoading: true
    }))

    api
      .getOne('polls')(this.props.match.params.id)
      .then(({ data }) => {
        this.setState(prevState => ({
          isLoading: false,
          poll: data
        }))
      })
      .catch(e =>
        this.setState(prevState => ({
          isLoading: false,
          errors: {
            fetching: 'An error occured while fetching this poll'
          }
        }))
      )
  }
  render() {
    const { isLoading, errors, poll } = this.state
    return (
      <Fragment>
        {isLoading && <Loader />}
        {errors && <ErrorMessage errors={errors} type={'error'} />}
        {poll && <PollCard {...poll} />}
      </Fragment>
    )
  }
}
