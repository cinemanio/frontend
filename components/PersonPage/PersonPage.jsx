// @flow
import React from 'react'
import { graphql } from 'react-apollo'
import { PropTypes } from 'prop-types'
import { withTranslation } from 'react-i18next'
import gql from 'graphql-tag'
import { Row, Col } from 'antd'

import ObjectPage from 'components/ObjectPage/ObjectPage'
import PersonImage from 'components/PersonImage/PersonImage'
import ObjectWikipedia from 'components/ObjectWikipedia/ObjectWikipedia'
import ObjectKinopoiskInfo from 'components/ObjectKinopoiskInfo/ObjectKinopoiskInfo'
import { getIdFromSlug } from 'components/ObjectLink/ObjectLink'
import i18n from 'libs/i18n'

import PersonRelations from './PersonRelations/PersonRelations'
import PersonInfo from './PersonInfo/PersonInfo'
import PersonSites from './PersonSites/PersonSites'
import PersonCareer from './PersonCareer/PersonCareer'

import './PersonPage.scss'

type Props = { data: Object }

@withTranslation()
class PersonPage extends React.PureComponent<Props> {
  static propTypes = {
    data: PropTypes.object.isRequired,
  }

  static queries = {
    person: gql`
      query Person($personId: ID!) {
        person(id: $personId) {
          ${i18n.gql('name')}
          nameEn
          roles {
            ${i18n.gql('name')}
          }
          ...PersonImage
          ...PersonInfoAll
          ...PersonSites
          ...PersonCareer
          ...PersonRelations
          ...PersonWikipedia
          ...PersonKinopoiskInfo          
        }
      }
      ${PersonImage.fragments.person}
      ${PersonInfo.fragments.all}
      ${PersonSites.fragments.person}
      ${PersonCareer.fragments.person}
      ${PersonRelations.fragments.person}
      ${ObjectWikipedia.fragments.person}
      ${ObjectKinopoiskInfo.fragments.person}      
    `,
  }

  isNamesEqual = (person: Object) => person[i18n.f('name')] === person.nameEn

  getTitle = (person: Object) => {
    const parts = []
    parts.push(person[i18n.f('name')])
    if (!this.isNamesEqual(person)) {
      parts.push(person.nameEn)
    }
    return parts.concat(person.roles.map(role => role[i18n.f('name')])).join(', ')
  }

  renderLayout(person: Object) {
    return (
      <div styleName="box">
        <div styleName="relations">
          <PersonRelations person={person} />
        </div>
        <h1>{person[i18n.f('name')]}</h1>
        <h2>{this.isNamesEqual(person) ? null : person.nameEn}</h2>
        <PersonInfo person={person} all />
        <Row>
          <Col span={4}>
            <div styleName="image">
              <PersonImage person={person} type="detail" />
            </div>
            <PersonSites person={person} />
          </Col>
          <Col span={20}>
            <PersonCareer person={person} />
          </Col>
        </Row>
        <ObjectKinopoiskInfo object={person} />
        <ObjectWikipedia object={person} />
      </div>
    )
  }

  render() {
    return (
      <ObjectPage
        getTitle={this.getTitle}
        object={this.props.data.person}
        renderLayout={person => this.renderLayout(person)}
      />
    )
  }
}

const configObject = {
  options: ({
    match: {
      params: { slug },
    },
  }: Object) => ({
    variables: {
      personId: getIdFromSlug(slug),
    },
  }),
}

export default graphql(PersonPage.queries.person, configObject)(PersonPage)
