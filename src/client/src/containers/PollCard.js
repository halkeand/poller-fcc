import React, { Component } from 'react'
import TimeAgo from 'react-timeago'
import { Subscribe } from 'unstated'
import { withRouter } from 'react-router-dom'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import styled from 'styled-components'

import Button from '../ui/Button'
import api from '../api'
import Context from '../Context'

import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar
} from 'recharts'
import { T } from '../utils'

const Card = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: ${T('padding.medium')};
  margin: ${T('margin.medium')};
  width: 80%;
  max-width: 300px;
  min-height: 400px;

  box-shadow: ${T('boxShadow')};
  border-radius: ${T('borderRadius')};
  border: 1px solid ${T('colors.gray')};
  transition: box-shadow 0.3s ease-in-out;

  &:hover {
    transition: box-shadow 0.3s ease-in-out;
    box-shadow: none;
  }
`

const CenteredTitle = styled.h2`
  text-align: center;
  padding: ${T('padding.medium')};
  margin: 0;
`
const CenteredTimeAgo = styled(TimeAgo)`
  text-align: center;
  border: 1px solid ${T('colors.gray')};
  border-radius: ${T('borderRadius')};
  padding: ${T('padding.small')};
  margin: ${T('margin.small')};
`
const RowSection = styled.section`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: ${T('margin.small')};
`

class Pollcard extends Component {
  state = {
    hasVoted: true,
    currentVoteChoice: this.props.choices[0]._id,
    copied: false
  }
  componentDidMount = () => {
    this.setState(prevState => ({
      hasVoted: this.previousVotesIncludeThisPoll()
    }))
  }

  getPreviousVotes = () =>
    (localStorage.getItem('votes') &&
      JSON.parse(localStorage.getItem('votes')).votes) ||
    []
  previousVotesIncludeThisPoll = () =>
    this.getPreviousVotes().includes(this.props._id)

  vote = () => {
    if (!this.previousVotesIncludeThisPoll()) {
      api
        .vote({
          pollId: this.props._id,
          choiceId: this.state.currentVoteChoice
        })
        .then(data => {
          localStorage.setItem(
            'votes',
            JSON.stringify({
              votes: [...this.getPreviousVotes(), this.props._id]
            })
          )

          this.setState(prevState => ({
            hasVoted: true
          }))
        })
        .catch(e => console.log(e))
    }
  }

  onVoteChoiceChange = e => {
    const currentVoteChoice = e.target.value

    this.setState({
      currentVoteChoice
    })
  }

  deletePoll = () => {
    api
      .deleteOne('polls')(this.props._id)
      .then(this.props.fetchPolls)
      .catch(e => console.log(e.response))
  }

  updatePoll = () => this.props.history.push(`/updatepoll/${this.props._id}`)

  render() {
    const {
      _id,
      question,
      choices,
      createdAt,
      contextUser,
      author
    } = this.props
    const { hasVoted, copied } = this.state

    return (
      <Card>
        <CenteredTitle>{question}</CenteredTitle>
        <CenteredTimeAgo date={createdAt} />
        {/* Chart */}
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={choices} width={700} height={300}>
            <XAxis dataKey="name" />
            <YAxis hide dataKey="votes" />
            <Tooltip />
            <Legend />
            <Bar dataKey="votes" fill="#0097e6" />
          </BarChart>
        </ResponsiveContainer>
        {/* Vote section */}
        {!hasVoted && (
          <RowSection>
            <select name="currentVoteChoice" onChange={this.onVoteChoiceChange}>
              {choices.map(choice => (
                <option key={choice._id} value={choice._id}>
                  {choice.name}
                </option>
              ))}
            </select>
            <Button onClick={this.vote}>Vote</Button>
          </RowSection>
        )}
        {/* Edit delete if user is authorized */}
        {contextUser &&
          contextUser._id === this.props.author && (
            <RowSection>
              <Button warning onClick={this.deletePoll}>
                Delete
              </Button>
              <Button onClick={this.updatePoll}>Update</Button>
            </RowSection>
          )}

        <CopyToClipboard
          text={`https://guarded-depths-41566.herokuapp.com/polls/${_id}`}
          onCopy={() => this.setState({ copied: true })}
        >
          <Button revertColors>
            {copied ? 'Link copied' : 'Get the link'}
          </Button>
        </CopyToClipboard>
      </Card>
    )
  }
}

const PollcardWithRouter = withRouter(Pollcard)
export default props => (
  <Subscribe to={[Context]}>
    {({ state: { user } }) => (
      <PollcardWithRouter contextUser={user} {...props} />
    )}
  </Subscribe>
)
