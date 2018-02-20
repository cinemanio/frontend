// @flow
import React from 'react'
import { Link } from 'react-router-named-routes'
import { graphql } from 'react-apollo'
import { PropTypes } from 'prop-types'
import gql from 'graphql-tag'

import PersonLink from '../../components/PersonLink/PersonLink'

type Props = { data: Object }

class PersonsPage extends React.PureComponent<Props> {
  static propTypes = {
    data: PropTypes.object.isRequired
  }

  render() {
    const { persons } = this.props.data
    return (
      <div>
        <ul>
          {persons && persons.edges.map(({ person }) =>
            (<li key={person.id}>
              <PersonLink person={person}/>
            </li>)
          )}
        </ul>
      </div>
    )
  }
}

const PersonsQuery = gql`
  query Persons {
    persons(first: 100) {
      edges {
        person: node {
          id
          ...PersonLink
        }
      }
    }
  }
  ${PersonLink.fragments.person}
`

export default graphql(PersonsQuery)(PersonsPage)
