// @flow
import React from 'react'
import { PropTypes } from 'prop-types'
import gql from 'graphql-tag'

import PersonLink from 'components/PersonLink/PersonLink'
import i18n from 'libs/i18n'

type Props = { person: Object }

export default class PersonShort extends React.PureComponent<Props> {
  static propTypes = {
    person: PropTypes.object.isRequired
  }

  static fragments = {
    person: gql`
      fragment PersonShort on PersonNode {
        ${i18n.gql('name')}
        name
      }
    `
  }

  render() {
    return (
      <PersonLink person={this.props.person}>{this.props.person[i18n.f('name')]}</PersonLink>
    )
  }
}
