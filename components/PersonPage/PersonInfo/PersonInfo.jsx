// @flow
import React from 'react'
import { PropTypes } from 'prop-types'
import { translate } from 'react-i18next'
import { Icon } from 'antd'
import type { Translator } from 'react-i18next'
import gql from 'graphql-tag'

import CountryFlag from 'components/CountryFlag/CountryFlag'
import i18n from 'libs/i18n'
import i18nClient from 'libs/i18nClient'
import getFecha from 'libs/fecha'

import './PersonInfo.scss'

type Props = {
  person: Object,
  gender?: boolean,
  roles?: boolean,
  dates?: boolean,
  country?: boolean,
  all?: boolean,
  i18n: Translator,
}

@translate()
export default class PersonInfo extends React.Component<Props> {
  static defaultProps = {
    roles: false,
    dates: false,
    country: false,
    all: false,
    i18n: i18nClient,
  }

  static propTypes = {
    i18n: PropTypes.object,
    person: PropTypes.object.isRequired,
    gender: PropTypes.bool,
    roles: PropTypes.bool,
    dates: PropTypes.bool,
    country: PropTypes.bool,
    all: PropTypes.bool,
  }

  static fragments = {
    all: gql`
      fragment PersonInfoAll on PersonNode {
        gender
        dateBirth
        dateDeath
        roles {
          ${i18n.gql('name')}
        }
        country {
          ${i18n.gql('name')}
          ...CountryFlag
        }
      }
      ${CountryFlag.fragments.country}
    `,
    roles: gql`
      fragment PersonInfoRoles on PersonNode {
        gender
        roles {
          ${i18n.gql('name')}
        }
      }
    `,
    dates: gql`
      fragment PersonInfoDates on PersonNode {
        dateBirth
        dateDeath
      }
    `,
    country: gql`
      fragment PersonInfoCountry on PersonNode {
        country {
          ${i18n.gql('name')}
          ...CountryFlag
        }
      }
      ${CountryFlag.fragments.country}
    `,
  }

  formatDate = (date: string) => {
    const fecha = getFecha(this.props.i18n.language)
    return fecha.format(fecha.parse(date, 'YYYY-MM-DD'), 'mediumDate')
  }

  genderizeRole = (role: string) =>
    this.props.person.gender === 'MALE' ? role : role.replace('Actor', 'Actress').replace('Актер', 'Актриса')

  renderGender() {
    if (!this.props.person.gender) {
      return null
    }
    const gender = {
      male: 'man',
      female: 'woman',
    }
    const icon = gender[this.props.person.gender.toLowerCase()]
    return !icon ? null : <Icon type={icon} />
  }

  renderRoles() {
    return this.props.person.roles.map(item => this.genderizeRole(item[i18n.f('name')])).join(', ')
  }

  renderDates() {
    return !this.props.person.dateBirth ? null : (
      <span>
        <Icon type="calendar" />
        {this.formatDate(this.props.person.dateBirth)}
        {!this.props.person.dateDeath ? null : ` – ${this.formatDate(this.props.person.dateDeath)}`}
      </span>
    )
  }

  renderCountry() {
    return !this.props.person.country ? null : (
      <span>
        <CountryFlag country={this.props.person.country} />
        {this.props.person.country[i18n.f('name')]}
      </span>
    )
  }

  render() {
    return (
      <div styleName="box">
        {(this.props.gender || this.props.all) && this.renderGender()}
        {(this.props.roles || this.props.all) && this.renderRoles()}
        {(this.props.dates || this.props.all) && this.renderDates()}
        {(this.props.country || this.props.all) && this.renderCountry()}
      </div>
    )
  }
}
