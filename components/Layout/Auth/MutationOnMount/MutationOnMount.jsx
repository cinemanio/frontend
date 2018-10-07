/**
 * Taken from here https://github.com/apollographql/react-apollo/issues/1939#issuecomment-416131124
 */
import React from 'react'
import { PropTypes } from 'prop-types'
import { Mutation } from 'react-apollo'

import DoMutation from './DoMutation'

export default class MutationOnMount extends React.PureComponent<{ children: Function }> {
  static propTypes = {
    children: PropTypes.func.isRequired,
  }

  render() {
    const { children, ...other } = this.props
    return (
      <Mutation {...other}>
        {(mutate, feedback) => (
          <React.Fragment>
            <DoMutation mutate={mutate} />
            {children && children(mutate, feedback)}
          </React.Fragment>
        )}
      </Mutation>
    )
  }
}
