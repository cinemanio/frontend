// @flow
import React from 'react'
import { PropTypes } from 'prop-types'
import gql from 'graphql-tag'

import i18n from 'libs/i18n'

import './CountryFlag.scss'

type Props = { country: Object }

export default class CountryFlag extends React.PureComponent<Props> {
  static propTypes = {
    country: PropTypes.object.isRequired,
  }

  static fragments = {
    country: gql`
      fragment CountryFlag on CountryNode {
        ${i18n.gql('name')}
        code
      }
    `,
  }

  render() {
    return this.props.country.code ? (
      <i className={`flag flag-${this.props.country.code}`} title={this.props.country[i18n.f('name')]} />
    ) : null
  }
}
