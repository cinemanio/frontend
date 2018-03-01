// @flow
import React from 'react'
import { PropTypes } from 'prop-types'

import './Block.scss'

type Props = { title: string, className: string, children: Object }

export default class CountryFlag extends React.PureComponent<Props> {
  static propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    className: PropTypes.string.isRequired,
  }

  render() {
    return (
      <div styleName="container" className={this.props.className}>
        <h3>{this.props.title}</h3>
        {this.props.children}
      </div>
    )
  }
}
