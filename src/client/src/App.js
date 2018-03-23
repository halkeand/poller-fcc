import React, { Component, Fragment } from 'react'
import { Switch, Route } from 'react-router-dom'
import { Subscribe } from 'unstated'
import Context from './Context'

// Containers
import Navigation from './containers/Navigation'
import Home from './containers/Home'
import PollForm from './containers/PollForm'
import IndividualPollCard from './containers/IndividualPollCard'
import SignIn from './containers/SignIn'
import MyPollsList from './containers/MyPollsList'

// UI
import Header from './ui/Header'
import Layout from './ui/Layout'

class App extends Component {
  render() {
    return (
      <Subscribe to={[Context]}>
        {({ state: { isAuthenticated } }) => (
          <Layout>
            <Header />
            <Navigation />
            <Switch>
              <Route exact path="/" component={Home} />
              {isAuthenticated && (
                <Fragment>
                  <Route path="/mypolls" component={MyPollsList} />
                  <Route
                    path="/newpoll"
                    component={() => <PollForm isActuallyCreating />}
                  />
                  <Route
                    path="/updatepoll/:id"
                    component={() => <PollForm isActuallyCreating={false} />}
                  />
                </Fragment>
              )}
              <Route path="/signin" component={SignIn} />
              <Route path="/polls/:id" component={IndividualPollCard} />
            </Switch>
          </Layout>
        )}
      </Subscribe>
    )
  }
}

export default App
