// @flow
import React from 'react'
import { PropTypes } from 'prop-types'

type Props = {
  children: Object,
  title: string,
}

export default class FieldSection extends React.PureComponent<Props> {
  static propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.string.isRequired,
  }

  render() {
    return (
      <div>
        {this.props.title}
        {this.props.children}
      </div>
    )
  }
}
