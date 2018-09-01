// @flow
import React from 'react'
import { Link } from 'react-router-dom'
import { translate } from 'react-i18next'
import { inject, PropTypes as MobxPropTypes } from 'mobx-react'
import { ApolloConsumer } from 'react-apollo'
import { ApolloClient } from 'apollo-client-preset'
import gql from 'graphql-tag'

import InjectedComponent from 'components/InjectedComponent/InjectedComponent'
import routes from 'components/App/routes'
import user from 'stores/User'
import token from 'stores/Token'

import MutationOnMount from './MutationOnMount/MutationOnMount'

type InjectedProps = { user: typeof user, token: typeof token }

@translate()
@inject('user', 'token')
export default class Auth extends InjectedComponent<{}, InjectedProps> {
  static propTypes = {
    user: MobxPropTypes.observableObject.isRequired,
    token: MobxPropTypes.observableObject.isRequired,
  }

  static fragments = {
    verify: gql`
      mutation VerifyToken($token: String!) {
        verifyToken(token: $token) {
          payload
        }
      }      
    `,
  }

  logout = (client: ApolloClient) => () => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm('Are you sure you want to logout?')) {
      this.props.token.set(undefined)
      this.props.user.logout()
      client.resetStore()
    }
  }

  updateCache = (cache: Object, { data: { verifyToken: { payload } } }: Object) => {
    this.props.user.login(payload.username)
  }

  onError(error: Object) {
    // suppress errors, because if token is undefined "Error decoding signature" error will be returned
    // console.log(error)
  }

  render() {
    return (
      <ApolloConsumer>
        {client => (
          <MutationOnMount
            mutation={Auth.fragments.verify}
            variables={{ token: this.props.token.token }}
            update={this.updateCache}
            onError={this.onError}
          >
            {() => (this.props.user.username
              ? <a href="#logout" title="Logout" onClick={this.logout(client)}>{this.props.user.username}</a>
              : <Link to={routes.signin}>{this.props.i18n.t('auth.signin')}</Link>)}
          </MutationOnMount>
        )}
      </ApolloConsumer>
    )
  }
}
