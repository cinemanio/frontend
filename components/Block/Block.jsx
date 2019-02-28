// @flow
import * as React from 'react'
import { PropTypes } from 'prop-types'

import './Block.scss'

type Props = { title: string | React.Node, children: React.Node }

export default class Block extends React.PureComponent<Props> {
  static propTypes = {
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
    children: PropTypes.node.isRequired,
  }

  renderTitle() {
    return this.props.title ? <h3>{this.props.title}</h3> : null
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
