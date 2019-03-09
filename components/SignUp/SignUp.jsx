// @flow
import React from 'react'
import { Link } from 'react-router-dom'
import { observer } from 'mobx-react'
import { ApolloClient } from 'apollo-client-preset'
import { Col, Form, Row } from 'antd'
import { translate, type Translator } from 'react-i18next'
import { PropTypes } from 'prop-types'
import gql from 'graphql-tag'
import { Helmet } from 'react-helmet'
import { ApolloConsumer, Mutation } from 'react-apollo'

import routes from 'components/App/routes'

import SignUpForm from './SignUpForm/SignUpForm'

type Props = { form: Object, i18n: Translator }
type State = { submitted: boolean }

@translate()
@observer
@Form.create()
export default class SignUp extends React.Component<Props, State> {
  static propTypes = {
    i18n: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
  }

  static fragments = {
    mutation: gql`
      mutation RegisterUser($username: String!, $email: String!, $password: String!) {
        registerUser(username: $username, email: $email, password: $password) {
          ok
        }
      }
    `,
  }

  static i18nPrefix = 'signup'

  state = { submitted: false }

  updateCache = (client: ApolloClient) => (cache: Object, { data }: Object) => {
    client.resetStore()
    this.setState({ submitted: data.registerUser.ok })
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
        <Row type="flex" justify="center">
          <Col span={10}>
            {this.state.submitted ? (
              <div>
                <h1>{this.props.i18n.t('signup.done.title')}</h1>
                <p>{this.props.i18n.t('signup.done.message')}</p>
              </div>
            ) : (
              <div>
                <h1>{this.props.i18n.t('signup.title')}</h1>
                <p>
                  <Link to={routes.signin}>{this.props.i18n.t('signup.haveAccount')}</Link>
                </p>
                <ApolloConsumer>
                  {client => (
                    <Mutation
                      mutation={SignUp.fragments.mutation}
                      update={this.updateCache(client)}
                      onError={this.onError}
                    >
                      {(submit, { loading }) => <SignUpForm submit={submit} form={this.props.form} loading={loading} />}
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
