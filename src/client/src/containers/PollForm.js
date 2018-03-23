import React, { Component, Fragment } from 'react'
import api from '../api'
import ErrorMessage from '../ui/ErrorMessage'
import Button from '../ui/Button'
import { v4 } from 'uuid'
import Form from '../ui/Form'
import Input from '../ui/Input'
import CenteredSection from '../ui/CenteredSection'
import Context from '../Context'
import { Subscribe } from 'unstated'
import { withRouter } from 'react-router-dom'

class PollForm extends Component {
  state = {
    question: '',
    choices: [{ name: 'truc', id: v4() }],
    errors: null,
    isActuallyCreating: this.props.isActuallyCreating
  }
  componentDidMount = () => {
    if (!this.props.isActuallyCreating) {
      api
        .getOne('polls')(this.props.match.params.id)
        .then(({ data: { question, choices } }) =>
          this.setState(prevState => ({
            question,
            choices: choices.map(({ name, _id }) => ({
              name,
              id: _id
            }))
          }))
        )
        .catch(e => console.log(e))
    }
  }

  onSubmit = e => {
    const { question, choices } = this.state
    const { isActuallyCreating, history } = this.props
    e.preventDefault()
    api[isActuallyCreating ? 'addOne' : 'updateOne']('polls')(
      {
        question,
        choices: choices.map(({ name }) => ({
          name
        }))
      },
      !isActuallyCreating && this.props.match.params.id
    )
      .then(({ data }) => {
        history.push('/mypolls')
      })
      .catch(({ response: { data: { error } } }) => {
        this.setState(prevState => ({
          errors: {
            ...prevState.errors,
            ...error
          }
        }))
      })
  }

  onQuestionInputChange = ({ target: { name, value } }) =>
    this.setState(prevState => ({
      [name]: value
    }))

  // Name is the name attribute containning the input generated id for the choice here
  onChoiceInputChange = ({ target: { name, value } }) =>
    this.setState(prevState => ({
      choices: prevState.choices.map(
        // Name is the text for the choice here ------------->
        choice => (choice.id !== name ? choice : { ...choice, name: value })
      )
    }))

  addChoiceInput = () =>
    this.setState(prevState => ({
      choices: [...prevState.choices, { name: '', id: v4() }]
    }))

  deleteInputChoice = id =>
    this.setState(prevState => ({
      choices: prevState.choices.filter(choice => choice.id !== id)
    }))

  render() {
    const { question, errors, choices } = this.state
    const { isActuallyCreating } = this.props

    return (
      <CenteredSection>
        <h1>{isActuallyCreating ? 'Create a new Poll' : 'Update a poll'}</h1>
        {!isActuallyCreating && (
          <h2>Warning, this will reset votes for this poll</h2>
        )}
        <Form onSubmit={this.onSubmit}>
          <ErrorMessage errors={errors} type={'error'} />

          <ErrorMessage errors={errors} type={'question'} />

          <label htmlFor="question">Question</label>
          <Input
            type="text"
            name="question"
            value={question}
            onChange={this.onQuestionInputChange}
          />

          <ErrorMessage errors={errors} type={'choices'} />

          <label>Choices</label>
          {choices.map(choice => (
            <div key={choice.id}>
              <Input
                type="text"
                name={choice.id}
                value={choice.name}
                onChange={this.onChoiceInputChange}
              />
              <span onClick={() => this.deleteInputChoice(choice.id)}>
                &#x2715;
              </span>
            </div>
          ))}

          <Button type="button" revertColors onClick={this.addChoiceInput}>
            Add a choice
          </Button>

          <Button type="submit">Submit</Button>
        </Form>
      </CenteredSection>
    )
  }
}

const PollFormWithRouter = withRouter(PollForm)

export default props => (
  <Subscribe to={[Context]}>
    {context => <PollFormWithRouter {...context} {...props} />}
  </Subscribe>
)
