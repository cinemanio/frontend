// @flow
import React from 'react'
import { withRouter, Link, Redirect } from 'react-router-dom'
import { inject, PropTypes as MobxPropTypes } from 'mobx-react'
import { PropTypes } from 'prop-types'
import { ApolloConsumer, Mutation } from 'react-apollo'
import { ApolloClient } from 'apollo-client-preset'
import { Helmet } from 'react-helmet'
import { translate, type Translator } from 'react-i18next'
import gql from 'graphql-tag'
import { Row, Col, Form } from 'antd'

import routes from 'components/App/routes'
import token from 'stores/Token'
import user from 'stores/User'

import SignInForm from './SignInForm/SignInForm'

type Props = { form: Object, token: typeof token, user: typeof user, history: Object, i18n: Translator }

@translate()
@inject('token', 'user')
@withRouter
@Form.create()
export default class SignIn extends React.Component<Props> {
  static propTypes = {
    i18n: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    token: MobxPropTypes.observableObject.isRequired,
    user: MobxPropTypes.observableObject.isRequired,
    history: PropTypes.object.isRequired,
  }

  static fragments = {
    mutation: gql`
      mutation TokenAuth($username: String!, $password: String!) {
        tokenAuth(username: $username, password: $password) {
          token
        }
      }
    `,
  }

  static i18nPrefix = 'signin'

  updateCache = (client: ApolloClient) => (cache: Object, { data }: Object) => {
    client.resetStore()
    this.props.token.set(data.tokenAuth.token)
    this.props.history.push(routes.index)
  }

  onError = (errors: Object) => {
    if (errors.graphQLErrors) {
      this.props.form.setFields({
        username: {
          value: this.props.form.getFieldValue('username'),
          errors: errors.graphQLErrors,
        },
      })
    } else {
      console.error(errors)
    }
  }

  render() {
    return this.props.user.authenticated ? <Redirect to={routes.index} /> : (
      <div>
        <Helmet>
          <title>{this.props.i18n.t('signin.title')}</title>
        </Helmet>
        <ApolloConsumer>
          {client => (
            <Mutation mutation={SignIn.fragments.mutation} update={this.updateCache(client)} onError={this.onError}>
              {(submit, { loading }) => (
                <Row type="flex" justify="center">
                  <Col span={10}>
                    <h1>{this.props.i18n.t('signin.title')}</h1>
                    <p>
                      <Link to={routes.signup}>{this.props.i18n.t('signin.needAccount')}</Link>
                    </p>
                    <SignInForm submit={submit} form={this.props.form} loading={loading} />
                  </Col>
                </Row>
              )}
            </Mutation>
          )}
        </ApolloConsumer>
      </div>
    )
  }
}
