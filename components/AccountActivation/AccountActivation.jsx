// @flow
import React from 'react'
import { withRouter } from 'react-router-dom'
import { inject, PropTypes as MobxPropTypes } from 'mobx-react'
import { PropTypes } from 'prop-types'
import { ApolloConsumer } from 'react-apollo'
import { ApolloClient } from 'apollo-client-preset'
import { Helmet } from 'react-helmet'
import { translate, type Translator } from 'react-i18next'
import gql from 'graphql-tag'
import { Row, Col, Form } from 'antd'

import MutationOnMount from 'components/MutationOnMount/MutationOnMount'
import token from 'stores/Token'
import user from 'stores/User'
import Loader from 'react-loader'

type Props = { user: typeof user, token: typeof token, i18n: Translator, match: Object }
type State = { error: string }

@translate()
@inject('token', 'user')
@withRouter
@Form.create()
export default class AccountActivation extends React.Component<Props, State> {
  static propTypes = {
    i18n: PropTypes.object.isRequired,
    user: MobxPropTypes.observableObject.isRequired,
    token: MobxPropTypes.observableObject.isRequired,
    match: PropTypes.object.isRequired,
  }

  static fragments = {
    mutation: gql`
      mutation ActivateUser($key: String!) {
        activateUser(key: $key) {
          token
          payload
        }
      }
    `,
  }

  static i18nPrefix = 'activation'

  state = { error: '' }

  updateCache = (client: ApolloClient) => (cache: Object, { data }: Object) => {
    client.resetStore()
    this.props.token.set(data.activateUser.token)
    this.props.user.login(data.activateUser.payload.username)
  }

  onError = (errors: Object) => {
    this.setState({ error: errors.graphQLErrors[0].message })
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>{this.props.i18n.t('activation.title')}</title>
        </Helmet>
        <ApolloConsumer>
          {client => (
            <MutationOnMount
              mutation={AccountActivation.fragments.mutation}
              variables={{ key: this.props.match.params.key }}
              update={this.updateCache(client)}
              onError={this.onError}
            >
              {(submit, { loading }) =>
                loading ? (
                  <Loader />
                ) : (
                  <Row type="flex" justify="center">
                    <Col span={10}>
                      <h1>{this.props.i18n.t('activation.title')}</h1>
                      <p>{this.state.error || this.props.i18n.t('activation.message')}</p>
                    </Col>
                  </Row>
                )
              }
            </MutationOnMount>
          )}
        </ApolloConsumer>
      </div>
    )
  }
}
