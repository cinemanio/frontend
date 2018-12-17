// @flow
import React from 'react'
import { PropTypes } from 'prop-types'

import './FieldSection.scss'

type Props = {
  children: Array<React.Fragment> | React.Fragment,
  title: string,
}

export default class FieldSection extends React.PureComponent<Props> {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.array]).isRequired,
    title: PropTypes.string.isRequired,
  }

  render() {
    return (
      <div styleName="box">
        <div styleName="title">{this.props.title}</div>
        {this.props.children}
      </div>
    )
  }
}
