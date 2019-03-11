// @flow
import React from 'react'
import { Icon } from 'antd'
import { PropTypes } from 'prop-types'
import type { Translator } from 'react-i18next'

import InputWithIcon from 'components/InputWithIcon/InputWithIcon'
import i18nClient from 'libs/i18nClient'

import './InputPassword.scss'

type Props = { i18n: Translator }
type State = { masked: boolean }

export default class InputPassword extends React.PureComponent<Props, State> {
  static defaultProps = {
    i18n: i18nClient,
  }

  static propTypes = {
    i18n: PropTypes.object,
  }

  state = { masked: true }

  toggle = () => this.setState(prevState => ({ masked: !prevState.masked }))

  render() {
    const suffix = (
      <Icon
        type={this.state.masked ? 'eye' : 'eye-invisible'}
        styleName="icon"
        onClick={this.toggle}
        title={this.state.masked ? this.props.i18n.t('password.show') : this.props.i18n.t('password.hide')}
      />
    )
    return (
      <InputWithIcon iconType="lock" type={this.state.masked ? 'password' : 'text'} suffix={suffix} {...this.props} />
    )
  }
}
