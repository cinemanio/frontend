// @flow
import React from 'react'
import { withRouter, Link } from 'react-router-dom'
import { inject, observer, PropTypes as MobxPropTypes } from 'mobx-react'
import { PropTypes } from 'prop-types'
import { ApolloConsumer, Mutation } from 'react-apollo'
import { ApolloClient } from 'apollo-client-preset'
import { Helmet } from 'react-helmet'
import { translate } from 'react-i18next'
import Loader from 'react-loader'
import gql from 'graphql-tag'

import routes from 'components/App/routes'

import SignInForm from './SignInForm/SignInForm'

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

  updateCache = (client: ApolloClient) => (
    cache: Object,
    {
      data: {
        tokenAuth: { token },
      },
    }: Object
  ) => {
    client.resetStore()
    this.props.token.set(token)
    this.props.history.goBack()
  }

  onError = (errors: Object) => {
    if (errors.graphQLErrors) {
      this.props.auth.setErrors(errors.graphQLErrors.map(error => error.message))
    } else {
      console.error(errors)
    }
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>{this.props.i18n.t('signin.title')}</title>
        </Helmet>
        <ApolloConsumer>
          {client => (
            <Mutation mutation={SignIn.fragments.signin} update={this.updateCache(client)} onError={this.onError}>
              {(signin, { loading }) =>
                loading ? (
                  <Loader />
                ) : (
                  <div className="container page">
                    <div className="row">
                      <div className="col-md-6 offset-md-3 col-xs-12">
                        <h1 className="text-xs-center">{this.props.i18n.t('signin.title')}</h1>
                        <p className="text-xs-center">
                          <Link to={routes.signup}>{this.props.i18n.t('signin.needAccount')}</Link>
                        </p>

                        <SignInForm signin={signin} />
                      </div>
                    </div>
                  </div>
                )
              }
            </Mutation>
          )}
        </ApolloConsumer>
      </div>
    )
  }
}
