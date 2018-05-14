// @flow
import React from 'react'
import { PropTypes } from 'prop-types'
import gql from 'graphql-tag'
import fecha from 'fecha'

import CountryFlag from 'components/CountryFlag/CountryFlag'
import i18n from 'libs/i18n'

import './PersonInfo.scss'

type Props = { person: Object }

export default class PersonInfo extends React.Component<Props> {
  static propTypes = {
    person: PropTypes.object.isRequired
  }

  static fragments = {
    person: gql`
      fragment PersonInfo on PersonNode {
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
    `
  }

  formatDate = (date: string) => fecha.format(fecha.parse(date, 'YYYY-MM-DD'), 'mediumDate')

  render() {
    return (
      <div styleName="box">
        <span styleName={`gender-${this.props.person.gender ? 'male' : 'female'}`}>
          <i/>
          {this.props.person.roles.map(item => item[i18n.f('name')]).join(', ')}
        </span>
        {!this.props.person.dateBirth ? '' :
          (<span styleName="date">
            <i/>
            {this.formatDate(this.props.person.dateBirth)}
            {!this.props.person.dateDeath ? '' : ` – ${this.formatDate(this.props.person.dateDeath)}`}
          </span>)
        }
        {!this.props.person.country ? '' :
          (<span styleName="country">
            <CountryFlag country={this.props.person.country}/>
            {this.props.person.country[i18n.f('name')]}
          </span>)
        }
      </div>
    )
  }
}
