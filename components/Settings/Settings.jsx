// @flow
import React from 'react'
import { withRouter } from 'react-router-dom'
import { observer } from 'mobx-react'
import { ApolloClient } from 'apollo-client-preset'
import { Col, Form, Row } from 'antd'
import { translate, type Translator } from 'react-i18next'
import { PropTypes } from 'prop-types'
import { Helmet } from 'react-helmet'
import { ApolloConsumer, Mutation, Query } from 'react-apollo'
import gql from 'graphql-tag'

import SettingsForm from './SettingsForm/SettingsForm'

type Props = { form: Object, history: Object, i18n: Translator }

@translate()
@withRouter
@observer
@Form.create()
export default class Settings extends React.Component<Props> {
  static propTypes = {
    i18n: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  }

  static fragments = {
    mutation: gql`
      mutation UpdateUser($username: String!, $email: String!) {
        updateUser(username: $username, email: $email) {
          user {
            username
            email
          }
        }
      }
    `,
    data: gql`
      query Me {
        me {
          username
          email
        }
      }
    `,
  }

  static i18nPrefix = 'settings'

  updateCache = (client: ApolloClient) => (cache: Object, { data }: Object) => {
    client.resetStore()
    this.props.history.goBack()
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
          <title>{this.props.i18n.t('settings.title')}</title>
        </Helmet>
        <Row type="flex" justify="center">
          <Col span={10}>
            <div>
              <h1>{this.props.i18n.t('settings.title')}</h1>
              <ApolloConsumer>
                {client => (
                  <Query query={Settings.fragments.data}>
                    {({ dataLoading, error, data }) => {
                      if (dataLoading || !data.me) return 'Loading...'
                      if (error) return `Error! ${error.message}`
                      return (
                        <Mutation
                          mutation={Settings.fragments.mutation}
                          update={this.updateCache(client)}
                          onError={this.onError}
                        >
                          {(submit, { loading }) => (
                            <SettingsForm submit={submit} form={this.props.form} loading={loading} data={data.me} />
                          )}
                        </Mutation>
                      )
                    }}
                  </Query>
                )}
              </ApolloConsumer>
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}
