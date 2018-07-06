// @flow
import React from 'react'
import { withRouter, Link } from 'react-router-dom'
import { inject, observer, PropTypes as MobxPropTypes } from 'mobx-react'
import { PropTypes } from 'prop-types'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

import ListErrors from 'components/ListErrors/ListErrors'
import routes from 'components/App/routes'

@inject('auth')
@withRouter
@observer
export default class SignIn extends React.Component<{}> {
  static propTypes = {
    auth: MobxPropTypes.observableObject.isRequired,
    history: PropTypes.object.isRequired,
  }

  static fragments = {
    signin: gql`
      mutation TokenAuth($username: String!, $password: String!) {
        tokenAuth(username: $username, password: $password) {
          token
        }
      }
    `,
  }

  componentWillUnmount() {
    this.props.auth.reset()
  }

  handleUsernameChange = e => this.props.auth.setUsername(e.target.value)

  handlePasswordChange = e => this.props.auth.setPassword(e.target.value)

  handleSubmitForm = (signin: Function) => (e) => {
    e.preventDefault()
    signin({
      variables: {
        username: this.props.auth.values.email,
        password: this.props.auth.values.password,
      },
    })
    this.props.history.replace('/')
    // this.props.auth.login()
    //   .then(() => this.props.history.replace('/'))
  }

  render() {
    return (
      <div className="auth-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">

              <h1 className="text-xs-center">Sign In</h1>
              <p className="text-xs-center">
                <Link to={routes.signup}>Need an account?</Link>
              </p>

              <Mutation mutation={SignIn.fragments.signin}>
                {(signin, { data, loading }) => (
                  <div>
                    <ListErrors errors={this.props.auth.errors}/>

                    <form onSubmit={this.handleSubmitForm(signin)}>
                      <fieldset>

                        <fieldset className="form-group">
                          <input
                            className="form-control form-control-lg"
                            type="username"
                            placeholder="username"
                            value={this.props.auth.values.username}
                            onChange={this.handleUsernameChange}
                          />
                        </fieldset>

                        <fieldset className="form-group">
                          <input
                            className="form-control form-control-lg"
                            type="password"
                            placeholder="Password"
                            value={this.props.auth.values.password}
                            onChange={this.handlePasswordChange}
                          />
                        </fieldset>

                        <button
                          className="btn btn-lg btn-primary pull-xs-right"
                          type="submit"
                          disabled={this.props.auth.inProgress}
                        >
                          Sign in
                        </button>

                      </fieldset>
                    </form>
                  </div>
                )}
              </Mutation>

            </div>
          </div>
        </div>
      </div>
    )
  }
}
