// @flow
import React from 'react'
import { graphql } from 'react-apollo'
import { PropTypes } from 'prop-types'
import { translate } from 'react-i18next'
import gql from 'graphql-tag'

import ObjectPage from 'components/ObjectPage/ObjectPage'
import PersonImage from 'components/PersonImage/PersonImage'
import ObjectWikipedia from 'components/ObjectWikipedia/ObjectWikipedia'
import { getIdFromSlug } from 'components/ObjectLink/ObjectLink'
import i18n from 'libs/i18n'

import PersonRelations from './PersonRelations/PersonRelations'
import PersonInfo from './PersonInfo/PersonInfo'
import PersonSites from './PersonSites/PersonSites'
import PersonCareer from './PersonCareer/PersonCareer'

import './PersonPage.scss'

type Props = { data: Object }

@translate()
class PersonPage extends React.Component<Props> {
  static propTypes = {
    data: PropTypes.object.isRequired,
  }

  isNamesEqual = (person: Object) => person[i18n.f('name')] === person.name

  renderLayout = (person: Object) => (
    <div styleName="box">
      <div styleName="relations">
        <PersonRelations person={person}/>
      </div>
      <h1>{person[i18n.f('name')]}</h1>
      <h2>{this.isNamesEqual(person) ? '' : person.name}</h2>
      <PersonInfo person={person} all/>
      <div className="row">
        <div className="col-lg-2">
          <div styleName="image">
            <PersonImage person={person} type="detail"/>
          </div>
          <PersonSites person={person}/>
        </div>
        <div className="col-lg-10">
          <PersonCareer person={person}/>
        </div>
      </div>
      <ObjectWikipedia object={person}/>
    </div>
  )

  getTitle = (person: Object) => {
    const parts = []
    parts.push(person[i18n.f('name')])
    if (!this.isNamesEqual(person)) {
      parts.push(person.name)
    }
    return parts.concat(person.roles.map(role => role[i18n.f('name')])).join(', ')
  }


  render() {
    return (<ObjectPage
      getTitle={this.getTitle}
      object={this.props.data.person}
      renderLayout={this.renderLayout}
    />)
  }
}

export const PersonQuery = gql`
  query Person($personId: ID!) {
    person(id: $personId) {
      ${i18n.gql('name')}
      name
      roles {
        ${i18n.gql('name')}
      }
      ...PersonImage
      ...PersonInfoAll
      ...PersonSites
      ...PersonCareer
      ...PersonRelations
      ...PersonWikipedia
    }
  }
  ${PersonImage.fragments.person}
  ${PersonInfo.fragments.all}
  ${PersonSites.fragments.person}
  ${PersonCareer.fragments.person}
  ${PersonRelations.fragments.person}
  ${ObjectWikipedia.fragments.person}
`

const configObject = {
  options: ({ match: { params: { slug } } }: Object) => ({
    variables: {
      personId: getIdFromSlug(slug)
    }
  })
}

export default graphql(PersonQuery, configObject)(PersonPage)
