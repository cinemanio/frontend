// @flow
import React from 'react'
import { Link } from 'react-router-dom'
import { inject, observer, PropTypes as MobxPropTypes } from 'mobx-react'
// import { PropTypes } from 'prop-types'

import ListErrors from 'components/ListErrors/ListErrors'
import routes from 'components/App/routes'

type Props = { auth: Object, history: Object }

@inject('auth')
@observer
export default class SignUp extends React.Component<Props> {
  static propTypes = {
    auth: MobxPropTypes.observableObject.isRequired,
    // history: PropTypes.object.isRequired,
  }

  componentWillUnmount() {
    this.props.auth.reset()
  }

  handleUsernameChange = (e: SyntheticEvent<HTMLInputElement>) => this.props.auth.setUsername(e.currentTarget.value)

  handleEmailChange = (e: SyntheticEvent<HTMLInputElement>) => this.props.auth.setEmail(e.currentTarget.value)

  handlePasswordChange = (e: SyntheticEvent<HTMLInputElement>) => this.props.auth.setPassword(e.currentTarget.value)

  handleSubmitForm = (e: Event) => {
    e.preventDefault()
    // this.props.auth.register()
    //   .then(() => this.props.history.replace('/'))
  }

  render() {
    return (
      <div className="auth-page">
        <div className="container page">
          <div className="row">

            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Sign Up</h1>
              <p className="text-xs-center">
                <Link to={routes.signin}>
                  Have an account?
                </Link>
              </p>

              <ListErrors errors={this.props.auth.errors}/>

              <form onSubmit={this.handleSubmitForm}>
                <fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="text"
                      placeholder="Username"
                      value={this.props.auth.values.username}
                      onChange={this.handleUsernameChange}
                    />
                  </fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="email"
                      placeholder="Email"
                      value={this.props.auth.values.email}
                      onChange={this.handleEmailChange}
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
                    Sign up
                  </button>

                </fieldset>
              </form>
            </div>

          </div>
        </div>
      </div>
    )
  }
}
