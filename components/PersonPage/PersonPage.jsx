// @flow
import React from 'react'
import { graphql } from 'react-apollo'
import { PropTypes } from 'prop-types'
import gql from 'graphql-tag'

import ObjectPage from 'components/ObjectPage/ObjectPage'
import PersonImage from 'components/PersonImage/PersonImage'
import { getIdFromSlug } from 'components/ObjectLink/ObjectLink'
import i18n from 'libs/i18n'

import PersonRelations from './PersonRelations/PersonRelations'
import PersonInfo from './PersonInfo/PersonInfo'
import PersonSites from './PersonSites/PersonSites'
import PersonCareer from './PersonCareer/PersonCareer'

import './PersonPage.scss'

type Props = { data: Object, t: Function, i18n: Object }

class PersonPage extends React.Component<Props> {
  static propTypes = {
    data: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    i18n: PropTypes.object.isRequired
  }

  isNamesEqual = (person: Object) => person[i18n.f('name')] === person.name

  renderLayout = (person: Object) => (
    <div styleName="box">
      <PersonRelations counts={{ fav: 1, like: 10, familiar: 10, dislike: 10 }}/>
      <h1>{person[i18n.f('name')]}</h1>
      <h2>{this.isNamesEqual(person) ? '' : person.name}</h2>
      <PersonInfo person={person} i18n={this.props.i18n}/>
      <div className="row">
        <div className="col-lg-2">
          <div styleName="image">
            <PersonImage person={person}/>
          </div>
          <PersonSites person={person} t={this.props.t}/>
        </div>
        <div className="col-lg-10">
          <PersonCareer person={person} t={this.props.t}/>
        </div>
      </div>
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

const PersonQuery = gql`
  query Person($personId: ID!) {
    person(id: $personId) {
      ${i18n.gql('name')}
      name
      roles {
        ${i18n.gql('name')}
      }
      ...PersonImage
      ...PersonInfo
      ...PersonSites
      ...PersonCareer      
    }
  }
  ${PersonImage.fragments.person}
  ${PersonInfo.fragments.person}
  ${PersonSites.fragments.person}
  ${PersonCareer.fragments.person}
`

const configObject = {
  options: ({ match: { params: { slug } } }: Object) => ({
    variables: {
      personId: getIdFromSlug(slug)
    }
  })
}

export default graphql(PersonQuery, configObject)(PersonPage)
