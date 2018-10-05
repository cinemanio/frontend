// @flow
import React from 'react'
import { PropTypes } from 'prop-types'

import './AlertTemplate.scss'

type Props = { message: string, options: Object, style: Object, close: Function }

export default class AlertTemplate extends React.PureComponent<Props> {
  static propTypes = {
    message: PropTypes.string.isRequired,
    options: PropTypes.object.isRequired,
    style: PropTypes.object.isRequired,
    close: PropTypes.func.isRequired,
  }

  render() {
    return (
      <div style={this.props.style} styleName={this.props.options.type}>
        <button type="button" onClick={this.props.close} styleName="close">
          <i />
        </button>
        <span>{this.props.message}</span>
      </div>
    )
  }
}
