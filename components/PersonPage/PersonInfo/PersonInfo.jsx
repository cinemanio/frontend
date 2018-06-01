// @flow
import React from 'react'
import { PropTypes } from 'prop-types'
import gql from 'graphql-tag'

import CountryFlag from 'components/CountryFlag/CountryFlag'
import i18n from 'libs/i18n'
import getFecha from 'libs/fecha'

import './PersonInfo.scss'

type Props = {
  person: Object,
  i18n: Object,
  roles: ?boolean,
  dates: ?boolean,
  country: ?boolean,
  all: ?boolean,
}

export default class PersonInfo extends React.Component<Props> {
  static defaultProps = {
    roles: false,
    dates: false,
    country: false,
    all: false,
  }

  static propTypes = {
    person: PropTypes.object.isRequired,
    i18n: PropTypes.object.isRequired,
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

  genderizeRole = (role: string) => (this.props.person.gender === 'MALE' ? role : role
    .replace('Actor', 'Actress')
    .replace('Актер', 'Актриса')
  )

  renderRoles() {
    return (
      <span styleName={`gender-${this.props.person.gender.toLowerCase()}`}>
        <i/>
        {this.props.person.roles.map(item => this.genderizeRole(item[i18n.f('name')])).join(', ')}
      </span>
    )
  }

  renderDates() {
    return !this.props.person.dateBirth ? '' : (
      <span styleName="date">
        <i/>
        {this.formatDate(this.props.person.dateBirth)}
        {!this.props.person.dateDeath ? '' : ` – ${this.formatDate(this.props.person.dateDeath)}`}
      </span>
    )
  }

  renderCountry() {
    return !this.props.person.country ? '' : (
      <span styleName="country">
        <CountryFlag country={this.props.person.country}/>
        {this.props.person.country[i18n.f('name')]}
      </span>
    )
  }

  render() {
    return (
      <div styleName="box">
        {(this.props.roles || this.props.all) && this.renderRoles()}
        {(this.props.dates || this.props.all) && this.renderDates()}
        {(this.props.country || this.props.all) && this.renderCountry()}
      </div>
    )
  }
}
