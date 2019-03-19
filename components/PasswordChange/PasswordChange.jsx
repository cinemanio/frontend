// @flow
import React from 'react'
import { withRouter } from 'react-router-dom'
import { observer } from 'mobx-react'
import { PropTypes } from 'prop-types'
import { ApolloConsumer, Mutation } from 'react-apollo'
import { ApolloClient } from 'apollo-client-preset'
import { Helmet } from 'react-helmet'
import { translate, type Translator } from 'react-i18next'
import gql from 'graphql-tag'
import { Row, Col, Form } from 'antd'

import PasswordChangeForm from './PasswordChangeForm/PasswordChangeForm'

type Props = { form: Object, i18n: Translator, history: Object }
type State = { submitted: boolean }

@withRouter
@translate()
@observer
@Form.create()
export default class PasswordChange extends React.Component<Props, State> {
  static propTypes = {
    i18n: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  }

  static fragments = {
    mutation: gql`
      mutation ChangePassword($oldPassword: String!, $newPassword: String!) {
        changePassword(oldPassword: $oldPassword, newPassword: $newPassword) {
          ok
        }
      }
    `,
  }

  static i18nPrefix = 'passwordChange'

  updateCache = (client: ApolloClient) => (cache: Object, { data }: Object) => {
    client.resetStore()
    this.props.history.goBack()
  }

  onError = (errors: Object) => {
    if (errors.graphQLErrors) {
      this.props.form.setFields({
        oldPassword: {
          value: this.props.form.getFieldValue('oldPassword'),
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
          <title>{this.props.i18n.t('passwordChange.title')}</title>
        </Helmet>
        <Row type="flex" justify="center">
          <Col span={10}>
            <h1>{this.props.i18n.t('passwordChange.title')}</h1>
            <ApolloConsumer>
              {client => (
                <Mutation
                  mutation={PasswordChange.fragments.mutation}
                  update={this.updateCache(client)}
                  onError={this.onError}
                >
                  {(submit, { loading }) => (
                    <PasswordChangeForm submit={submit} form={this.props.form} loading={loading} />
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
