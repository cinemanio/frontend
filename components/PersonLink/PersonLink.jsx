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
        name
        nameEn
      }
    `
  }

  get parts(): Array<string> {
    return [
      this.props.person.nameEn,
      this.props.person.id
    ]
  }

  render() {
    return (
      <ObjectLink type="person" parts={this.parts}>
        {this.props.person.name}
      </ObjectLink>
    )
  }
}
