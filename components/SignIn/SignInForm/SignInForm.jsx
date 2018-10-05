// @flow
import React from 'react'
import { inject, observer, PropTypes as MobxPropTypes } from 'mobx-react'
import { PropTypes } from 'prop-types'
import { translate } from 'react-i18next'
import type { Translator } from 'react-i18next'

import ListErrors from 'components/ListErrors/ListErrors'
import i18nClient from 'libs/i18nClient'
import Auth from 'stores/Auth'

type Props = { auth: typeof Auth, i18n: Translator, signin: Function }

@translate()
@inject('auth')
@observer
export default class SignInForm extends React.Component<Props> {
  static defaultProps = {
    i18n: i18nClient,
    auth: Auth,
  }

  static propTypes = {
    i18n: PropTypes.object,
    auth: MobxPropTypes.observableObject,
    signin: PropTypes.func.isRequired,
  }

  componentWillUnmount() {
    this.props.auth.reset()
  }

  handleUsernameChange = (e: SyntheticEvent<HTMLInputElement>) => this.props.auth.setUsername(e.currentTarget.value)

  handlePasswordChange = (e: SyntheticEvent<HTMLInputElement>) => this.props.auth.setPassword(e.currentTarget.value)

  handleSubmitForm = (e: Event) => {
    e.preventDefault()
    return this.props.signin({
      variables: {
        username: this.props.auth.values.username,
        password: this.props.auth.values.password,
      },
    })
  }

  render() {
    return (
      <form onSubmit={this.handleSubmitForm}>
        <ListErrors errors={this.props.auth.errors} />

        <fieldset>
          <fieldset className="form-group">
            <input
              className="form-control form-control-lg"
              type="text"
              placeholder={this.props.i18n.t('signin.placeholders.username')}
              value={this.props.auth.values.username}
              onChange={this.handleUsernameChange}
            />
          </fieldset>

          <fieldset className="form-group">
            <input
              className="form-control form-control-lg"
              type="password"
              placeholder={this.props.i18n.t('signin.placeholders.password')}
              value={this.props.auth.values.password}
              onChange={this.handlePasswordChange}
            />
          </fieldset>

          <button
            className="btn btn-lg btn-primary pull-xs-right"
            type="submit"
            disabled={this.props.auth.submitDisabled}
          >
            {this.props.i18n.t('signin.submit')}
          </button>
        </fieldset>
      </form>
    )
  }
}
