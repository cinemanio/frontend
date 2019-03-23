// @flow
import React from 'react'
import { withRouter } from 'react-router-dom'
import { inject, observer, PropTypes as MobxPropTypes } from 'mobx-react'
import { PropTypes } from 'prop-types'
import { ApolloConsumer, Mutation } from 'react-apollo'
import { ApolloClient } from 'apollo-client-preset'
import { Helmet } from 'react-helmet'
import { translate, type Translator } from 'react-i18next'
import gql from 'graphql-tag'
import { Row, Col, Form } from 'antd'

import routes from 'components/App/routes'
import token from 'stores/Token'

import PasswordResetForm from './PasswordResetForm/PasswordResetForm'

type Props = { form: Object, i18n: Translator, token: typeof token, history: Object, match: Object }
type State = { submitted: boolean }

@withRouter
@translate()
@inject('token')
@observer
@Form.create()
export default class PasswordReset extends React.Component<Props, State> {
  static propTypes = {
    i18n: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    token: MobxPropTypes.observableObject.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
  }

  static fragments = {
    mutation: gql`
      mutation ResetPassword($password: String!, $uid: String!, $token: String!) {
        resetPassword(password: $password, uid: $uid, token: $token) {
          token
        }
      }
    `,
  }

  static i18nPrefix = 'passwordReset'

  updateCache = (client: ApolloClient) => (cache: Object, { data }: Object) => {
    client.resetStore()
    this.props.token.set(data.resetPassword.token)
    this.props.history.push(routes.index)
  }

  onError = (errors: Object) => {
    console.error(errors)
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>{this.props.i18n.t('passwordReset.title')}</title>
        </Helmet>
        <Row type="flex" justify="center">
          <Col span={10}>
            <h1>{this.props.i18n.t('passwordReset.title')}</h1>
            <ApolloConsumer>
              {client => (
                <Mutation
                  mutation={PasswordReset.fragments.mutation}
                  update={this.updateCache(client)}
                  onError={this.onError}
                >
                  {(submit, { loading }) => (
                    <PasswordResetForm
                      submit={submit}
                      form={this.props.form}
                      loading={loading}
                      match={this.props.match}
                    />
                  )}
                </Mutation>
              )}
            </ApolloConsumer>
          </Col>
        </Row>
      </div>
    )
  }
}
