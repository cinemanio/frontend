// @flow
import React from 'react'
import { Link } from 'react-router-dom'
import { PropTypes } from 'prop-types'
import { ApolloConsumer, Mutation } from 'react-apollo'
import { ApolloClient } from 'apollo-client-preset'
import { Helmet } from 'react-helmet'
import { translate, type Translator } from 'react-i18next'
import gql from 'graphql-tag'
import { Row, Col, Form } from 'antd'

import routes from 'components/App/routes'

import PasswordForgotForm from './PasswordForgotForm/PasswordForgotForm'

type Props = { form: Object, i18n: Translator }
type State = { submitted: boolean }

@translate()
@Form.create()
export default class PasswordForgot extends React.Component<Props, State> {
  static propTypes = {
    i18n: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
  }

  static fragments = {
    mutation: gql`
      mutation ResetPasswordRequest($email: String!) {
        resetPasswordRequest(email: $email) {
          ok
        }
      }
    `,
  }

  static i18nPrefix = 'passwordForgot'

  state = { submitted: false }

  updateCache = (client: ApolloClient) => (cache: Object, { data }: Object) => {
    client.resetStore()
    if (data.resetPasswordRequest.ok) {
      this.setState({ submitted: true })
    }
  }

  onError = (errors: Object) => {
    if (errors.graphQLErrors) {
      this.props.form.setFields({
        email: {
          value: this.props.form.getFieldValue('email'),
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
          <title>{this.props.i18n.t('passwordForgot.title')}</title>
        </Helmet>
        <Row type="flex" justify="center">
          <Col span={10}>
            <h1>{this.props.i18n.t('passwordForgot.title')}</h1>
            {this.state.submitted ? (
              <p>{this.props.i18n.t('passwordForgot.submitted')}</p>
            ) : (
              <div>
                <p>
                  <Link to={routes.signin}>{this.props.i18n.t('passwordForgot.trySignin')}</Link>
                </p>
                <ApolloConsumer>
                  {client => (
                    <Mutation
                      mutation={PasswordForgot.fragments.mutation}
                      update={this.updateCache(client)}
                      onError={this.onError}
                    >
                      {(submit, { loading }) => (
                        <PasswordForgotForm submit={submit} form={this.props.form} loading={loading} />
                      )}
                    </Mutation>
                  )}
                </ApolloConsumer>
              </div>
            )}
          </Col>
        </Row>
      </div>
    )
  }
}
