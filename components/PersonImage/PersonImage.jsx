// @flow
import React from 'react'
import { PropTypes } from 'prop-types'
import gql from 'graphql-tag'

import PersonLink from 'components/PersonLink/PersonLink'
import i18n from 'libs/i18n'

import './PersonImage.scss'

type Props = { person: Object, type: string }

export default class PersonImage extends React.PureComponent<Props> {
  static propTypes = {
    person: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired,
  }

  static fragments = {
    person: gql`
      fragment PersonImage on PersonNode {
        ${i18n.gql('name')}
        ...PersonLink
      }
      ${PersonLink.fragments.person}
    `,
  }

  render() {
    return (
      <div>
        <PersonLink person={this.props.person}>
          <img
            src={`/images/person/photo/${this.props.type}/${this.props.person.id}.jpg`}
            alt={this.props.person[i18n.f('name')]}
            title={this.props.person[i18n.f('name')]}
          />
        </PersonLink>
      </div>
    )
  }
}
