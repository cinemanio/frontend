// @flow
import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { inject, observer, PropTypes as MobxPropTypes } from 'mobx-react'
import { ApolloClient } from 'apollo-client-preset'
import { Col, Form, Row } from 'antd'
import { translate } from 'react-i18next'
import { PropTypes } from 'prop-types'
import gql from 'graphql-tag'
import { Helmet } from 'react-helmet'
import { ApolloConsumer, Mutation } from 'react-apollo'

import routes from 'components/App/routes'

import SignUpForm from './SignUpForm/SignUpForm'

type Props = { form: Object, token: Object, history: Object, i18n: Object }

@translate()
@inject('token')
@withRouter
@observer
@Form.create()
export default class SignUp extends React.Component<Props> {
  static propTypes = {
    i18n: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    token: MobxPropTypes.observableObject.isRequired,
    history: PropTypes.object.isRequired,
  }

  static fragments = {
    signup: gql`
      mutation TokenAuth($username: String!, $email: String!, $password: String!) {
        tokenAuth(username: $username, email: $email, password: $password) {
          token
        }
      }
    `,
  }

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
    return (
      <div>
        <Helmet>
          <title>{this.props.i18n.t('signup.title')}</title>
        </Helmet>
        <ApolloConsumer>
          {client => (
            <Mutation mutation={SignUp.fragments.signup} update={this.updateCache(client)} onError={this.onError}>
              {(signup, { loading }) => (
                <Row type="flex" justify="center">
                  <Col span={10}>
                    <h1>{this.props.i18n.t('signup.title')}</h1>
                    <p>
                      <Link to={routes.signin}>{this.props.i18n.t('signup.haveAccount')}</Link>
                    </p>
                    <SignUpForm signup={signup} form={this.props.form} loading={loading} />
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
