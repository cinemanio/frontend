// @flow
import React from 'react'
import { withRouter, Link } from 'react-router-dom'
import { inject, observer, Observer, PropTypes as MobxPropTypes } from 'mobx-react'
import { PropTypes } from 'prop-types'
import { ApolloConsumer, Mutation } from 'react-apollo'
import { ApolloClient } from 'apollo-client-preset'
import { Helmet } from 'react-helmet'
import { translate } from 'react-i18next'
import gql from 'graphql-tag'

import ListErrors from 'components/ListErrors/ListErrors'
import routes from 'components/App/routes'

type Props = { auth: Object, token: Object, history: Object, i18n: Object }

@translate()
@inject('auth', 'token')
@withRouter
@observer
export default class SignIn extends React.Component<Props> {
  static propTypes = {
    i18n: PropTypes.object.isRequired,
    auth: MobxPropTypes.observableObject.isRequired,
    token: MobxPropTypes.observableObject.isRequired,
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

  handleUsernameChange = (e: SyntheticEvent<HTMLInputElement>) => this.props.auth.setUsername(e.currentTarget.value)

  handlePasswordChange = (e: SyntheticEvent<HTMLInputElement>) => this.props.auth.setPassword(e.currentTarget.value)

  handleSubmitForm = (signin: Function) => (e: Event) => {
    e.preventDefault()
    return signin({
      variables: {
        username: this.props.auth.values.username,
        password: this.props.auth.values.password,
      },
    })
  }

  updateCache = (client: ApolloClient) => (cache: Object, { data: { tokenAuth: { token } } }: Object) => {
    client.resetStore()
    this.props.token.set(token)
    this.props.history.goBack()
  }

  onError = (errors: Object) => {
    this.props.auth.setErrors(errors.graphQLErrors.map(error => error.message))
  }

  render() {
    return (
      <ApolloConsumer>
        {client => (
          <div className="auth-page">
            <div className="container page">
              <div className="row">
                <div className="col-md-6 offset-md-3 col-xs-12">

                  <h1 className="text-xs-center">{this.props.i18n.t('signin.title')}</h1>
                  <p className="text-xs-center">
                    <Link to={routes.signup}>{this.props.i18n.t('signin.needAccount')}</Link>
                  </p>

                  <Helmet>
                    <title>{this.props.i18n.t('signin.title')}</title>
                  </Helmet>

                  <Mutation mutation={SignIn.fragments.signin} update={this.updateCache(client)} onError={this.onError}>
                    {(signin, { loading }) => (
                      <Observer>
                        {() => (
                          <div>
                            <ListErrors errors={this.props.auth.errors}/>

                            <form onSubmit={this.handleSubmitForm(signin)}>
                              <fieldset>

                                <fieldset className="form-group">
                                  <input
                                    className="form-control form-control-lg"
                                    type="text"
                                    placeholder={this.props.i18n.t('signin.placeholders.username')}
                                    value={this.props.auth.values.username}
                                    onChange={this.handleUsernameChange}
                                  />
                                </fieldset>

                                <fieldset className="form-group">
                                  <input
                                    className="form-control form-control-lg"
                                    type="password"
                                    placeholder={this.props.i18n.t('signin.placeholders.password')}
                                    value={this.props.auth.values.password}
                                    onChange={this.handlePasswordChange}
                                  />
                                </fieldset>

                                <button
                                  className="btn btn-lg btn-primary pull-xs-right"
                                  type="submit"
                                  disabled={this.props.auth.submitDisabled || loading}
                                >
                                  {this.props.i18n.t('signin.submit')}
                                </button>

                              </fieldset>
                            </form>
                          </div>
                        )}
                      </Observer>
                    )}
                  </Mutation>

                </div>
              </div>
            </div>
          </div>
        )}
      </ApolloConsumer>
    )
  }
}
