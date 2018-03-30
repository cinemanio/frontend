// @flow
import React from 'react'
import { graphql } from 'react-apollo'
import { PropTypes } from 'prop-types'
import gql from 'graphql-tag'

import ObjectPage from 'components/ObjectPage/ObjectPage'
import PersonImage from 'components/PersonImage/PersonImage'
import { getIdFromSlug } from 'components/ObjectLink/ObjectLink'

import PersonRelations from './PersonRelations/PersonRelations'
import PersonInfo from './PersonInfo/PersonInfo'
import PersonSites from './PersonSites/PersonSites'
import PersonCareer from './PersonCareer/PersonCareer'

import './PersonPage.scss'

type Props = { data: Object }

export class PersonPage extends React.Component<Props> {
  static propTypes = {
    data: PropTypes.object.isRequired,
  }

  renderLayout(person: Object) {
    return (
      <div styleName="box">
        <PersonRelations counts={{ fav: 1, like: 10, familiar: 10, dislike: 10 }}/>
        <h1>{person.name}</h1>
        <h2>{person.name}</h2>
        <PersonInfo person={person}/>
        <div className="row">
          <div className="col-lg">
            <div styleName="image">
              <PersonImage person={person}/>
            </div>
            <PersonSites person={person}/>
          </div>
          <div className="col-lg-10">
            <PersonCareer person={person}/>
          </div>
        </div>
      </div>
    )
  }

  render() {
    return (<ObjectPage
      object={this.props.data.person}
      renderLayout={this.renderLayout}
    />)
  }
}

const PersonQuery = gql`
  query Person($personId: ID!) {
    person(id: $personId) {
      id
      name
      ...PersonInfo
      ...PersonSites
      ...PersonCareer      
    }
  }
  ${PersonInfo.fragments.person}
  ${PersonSites.fragments.person}
  ${PersonCareer.fragments.person}
`

export const configObject = {
  options: ({ match: { params: { slug } } }: Object) => ({
    variables: {
      personId: getIdFromSlug(slug)
    }
  })
}

export default graphql(PersonQuery, configObject)(PersonPage)
