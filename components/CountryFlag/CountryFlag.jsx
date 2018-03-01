// @flow
import React from 'react'
import { PropTypes } from 'prop-types'
import gql from 'graphql-tag'

import './CountryFlag.scss'

type Props = { country: Object }

export default class CountryFlag extends React.PureComponent<Props> {
  static propTypes = {
    country: PropTypes.object.isRequired
  }

  static fragments = {
    country: gql`
      fragment CountryFlag on CountryNode {
        name
        code
      }
    `
  }

  render() {
    return this.props.country.code ? (
      <i
        className={`flag flag-${this.props.country.code}`}
        title={this.props.country.name}
      />
    ) : ''
  }
}
