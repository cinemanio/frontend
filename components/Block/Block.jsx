// @flow
import React from 'react'
import { PropTypes } from 'prop-types'

import './Block.scss'

type Props = { title: string, children: Object }

export default class Block extends React.PureComponent<Props> {
  static propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
  }

  renderTitle() {
    return this.props.title
      ? <h3>{this.props.title}</h3>
      : ''
  }

  render() {
    return (
      <div styleName="box">
        {this.renderTitle()}
        {this.props.children}
      </div>
    )
  }
}
