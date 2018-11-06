// @flow
import React from 'react'
import { PropTypes } from 'prop-types'
import { Alert } from 'antd'

import './AlertTemplate.scss'

type Props = { message: string, options: Object, close: Function }

export default class AlertTemplate extends React.PureComponent<Props> {
  static propTypes = {
    message: PropTypes.string.isRequired,
    options: PropTypes.object.isRequired,
    close: PropTypes.func.isRequired,
  }

  render() {
    return (
      <Alert
        styleName="box"
        type={this.props.options.type}
        message={this.props.message}
        afterClose={this.props.close}
        closable
      />
    )
  }
}
