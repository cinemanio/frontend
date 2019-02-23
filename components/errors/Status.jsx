// @flow
import React from 'react'
import { PropTypes } from 'prop-types'
import { Route } from 'react-router-dom'

type Props = { code: number, children: Object }

export default class Status extends React.PureComponent<Props> {
  static propTypes = {
    code: PropTypes.number.isRequired,
    children: PropTypes.node.isRequired,
  }

  render() {
    return (
      <Route
        render={({ staticContext }) => {
          if (staticContext) {
            // eslint-disable-next-line no-param-reassign
            staticContext.status = this.props.code
          }
          return this.props.children
        }}
      />
    )
  }
}
