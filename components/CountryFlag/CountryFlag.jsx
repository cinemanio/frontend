// @flow
import React from 'react'
import { PropTypes } from 'prop-types'
import gql from 'graphql-tag'

import { i18nFields, i18nField } from 'libs/i18n'

import './CountryFlag.scss'

type Props = { country: Object }

export default class CountryFlag extends React.PureComponent<Props> {
  static propTypes = {
    country: PropTypes.object.isRequired
  }

  static fragments = {
    country: gql`
      fragment CountryFlag on CountryNode {
        ${i18nFields('name')}
        code
      }
    `
  }

  render() {
    return this.props.country.code ? (
      <i
        className={`flag flag-${this.props.country.code}`}
        title={this.props.country[i18nField('name')]}
      />
    ) : ''
  }
}
