// @flow
import React from 'react'
import { PropTypes } from 'prop-types'

type Props = { errors: Object }

export default class ListErrors extends React.PureComponent<Props> {
  static propTypes = {
    errors: PropTypes.object.isRequired,
  }

  render() {
    if (this.props.errors) {
      return (
        <ul className="error-messages">
          {Object.keys(this.props.errors).map(key => <li key={key}>{key} {this.props.errors[key]}</li>)}
        </ul>
      )
    } else {
      return null
    }
  }
}
