// @flow
import React from 'react'
import { PropTypes } from 'prop-types'
import gql from 'graphql-tag'

import ObjectLink from '../ObjectLink/ObjectLink'

type Props = { person: Object }

export default class PersonLink extends React.PureComponent<Props> {
  static propTypes = {
    person: PropTypes.object.isRequired
  }

  static fragments = {
    person: gql`
      fragment PersonLink on PersonNode {
        id
        firstName
        lastName
        firstNameEn
        lastNameEn
      }
    `
  }

  get parts(): Array<string> {
    return [
      this.props.person.firstNameEn,
      this.props.person.lastNameEn,
      this.props.person.id
    ]
  }

  render() {
    return (
      <ObjectLink to="person.detail" parts={this.parts}>
        {this.props.person.firstName} {this.props.person.lastName}
      </ObjectLink>
    )
  }
}
