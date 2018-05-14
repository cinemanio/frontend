// @flow
import React from 'react'
import { PropTypes } from 'prop-types'
import gql from 'graphql-tag'

import PersonLink from 'components/PersonLink/PersonLink'
import i18n from 'libs/i18n'

import './PersonImage.scss'

type Props = { person: Object }

export default class PersonImage extends React.Component<Props> {
  static propTypes = {
    person: PropTypes.object.isRequired
  }

  static fragments = {
    person: gql`
      fragment PersonImage on PersonNode {
        ${i18n.gql('name')}
        ...PersonLink
      }
      ${PersonLink.fragments.person}
    `
  }

  render() {
    return (
      <div>
        <PersonLink person={this.props.person}>
          <img
            src="https://st.kp.yandex.net/images/actor_iphone/iphone360_2286874.jpg"
            alt={this.props.person[i18n.f('name')]}
            title={this.props.person[i18n.f('name')]}
          />
        </PersonLink>
      </div>
    )
  }
}
