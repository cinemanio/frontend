// @flow
import React from 'react'
import { PropTypes } from 'prop-types'
import { translate } from 'react-i18next'
import gql from 'graphql-tag'

import PersonLink from 'components/PersonLink/PersonLink'
import PersonImage from 'components/PersonImage/PersonImage'
import PersonInfo from 'components/PersonPage/PersonInfo/PersonInfo'
import PersonRelations from 'components/PersonPage/PersonRelations/PersonRelations'
import i18n from 'libs/i18n'

import './PersonShort.scss'

type Props = { person: Object }

@translate()
export default class PersonShort extends React.PureComponent<Props> {
  static propTypes = {
    person: PropTypes.object.isRequired,
  }

  static fragments = {
    person: gql`
      fragment PersonShort on PersonNode {
        ${i18n.gql('name')}
        nameEn
        ...PersonImage
        ...PersonLink
        ...PersonInfoRoles
        ...PersonRelations
      }
      ${PersonImage.fragments.person}
      ${PersonLink.fragments.person}
      ${PersonInfo.fragments.roles}
      ${PersonRelations.fragments.person}
    `,
  }

  isNamesEqual = (person: Object) => person[i18n.f('name')] === person.nameEn

  render() {
    return (
      <div styleName="box">
        <PersonImage person={this.props.person} type="short_card" />
        <div styleName="right">
          <div styleName="relations">
            <PersonRelations person={this.props.person} displayCounts={false} />
          </div>
          <PersonLink person={this.props.person}>{this.props.person[i18n.f('name')]}</PersonLink>
          <div styleName="subtitle">{this.isNamesEqual(this.props.person) ? null : this.props.person.nameEn}</div>
          <PersonInfo person={this.props.person} roles />
        </div>
      </div>
    )
  }
}
