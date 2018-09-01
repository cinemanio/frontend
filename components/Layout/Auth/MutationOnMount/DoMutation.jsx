/**
 * Taken from here https://github.com/apollographql/react-apollo/issues/1939#issuecomment-416131124
 */
import React from 'react'
import { PropTypes } from 'prop-types'

export default class DoMutation extends React.Component<{ mutate: Function }> {
  static propTypes = {
    mutate: PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.props.mutate()
  }

  render() {
    return null
  }
}
