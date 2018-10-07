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
      return this.props.errors.map(error => (
        <div key={error} className="alert alert-danger" role="alert">
          {error}
        </div>
      ))
    } else {
      return null
    }
  }
}
