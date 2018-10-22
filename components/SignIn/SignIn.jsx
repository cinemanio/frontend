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
import { Row, Col } from 'antd'

import routes from 'components/App/routes'

import SignInForm from './SignInForm/SignInForm'

type Props = { //auth: Object,
  token: Object, history: Object, i18n: Object,
}

type State = { errors: Array<string> }

@translate()
@inject('token')
@withRouter
@observer
export default class SignIn extends React.Component<Props, State> {
  static propTypes = {
    i18n: PropTypes.object.isRequired,
    // auth: MobxPropTypes.observableObject.isRequired,
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

  constructor(props: Object) {
    super(props)
    this.state = { errors: [] }
  }

  updateCache = (client: ApolloClient) => (cache: Object, { data }: Object) => {
    client.resetStore()
    this.props.token.set(data.tokenAuth.token)
    this.props.history.goBack()
  }

  onError = (errors: Object) => {
    if (errors.graphQLErrors) {
      this.setState({ errors: errors.graphQLErrors.map(error => error.message) })
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
                  <Loader/>
                ) : (
                  <Row type="flex" justify="center">
                    <Col span={10}>
                      <h1>{this.props.i18n.t('signin.title')}</h1>
                      <p>
                        <Link to={routes.signup}>{this.props.i18n.t('signin.needAccount')}</Link>
                      </p>

                      <SignInForm signin={signin} errors={this.state.errors}/>
                    </Col>
                  </Row>
                )
              }
            </Mutation>
          )}
        </ApolloConsumer>
      </div>
    )
  }
}
