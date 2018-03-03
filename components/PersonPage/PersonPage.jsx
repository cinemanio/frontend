// @flow
import React from 'react'
import { graphql } from 'react-apollo'
import { PropTypes } from 'prop-types'
import gql from 'graphql-tag'

import Menu from 'components/Menu/Menu'
import MovieLink from 'components/MovieLink/MovieLink'
import { getIdFromSlug } from 'components/ObjectLink/ObjectLink'

type Props = { data: Object }

export class PersonPage extends React.Component<Props> {
  static propTypes = {
    data: PropTypes.object.isRequired
  }

  renderCast() {
    return this.props.data.person.career.edges.map(({ node }, i) =>
      (<div key={node.id}>
        <MovieLink movie={node.movie}/> ({node.movie.year})
        ({node.role.name}: {node.name})
      </div>)
    )
  }

  render() {
    const { person } = this.props.data
    if (!person) return null
    return (
      <div>
        <Menu active="person" link/>
        <h1>{person.firstName} {person.lastName}</h1>
        <div>{person.country && person.country.name}</div>
        <div>{person.gender}</div>
        <div>{person.dateBirth}</div>
        <div>{person.dateDeath}</div>
        <div>{person.imdb && person.imdb.id}</div>
        {this.renderCast()}
      </div>
    )
  }
}

const PersonQuery = gql`
  query Person($personId: ID!) {
    person(id: $personId) {
      id
      firstName
      lastName
      gender
      country { id, name }
      imdb { id }
      career {
        edges {
          node {
            id 
            name
            movie {
              ...MovieLink
              year
            }
            role { name }
          }
        }
      }      
    }
  }
  ${MovieLink.fragments.movie}
`

export const configObject = {
  options: ({ params: { slug } }: Object) => ({
    variables: {
      personId: getIdFromSlug(slug)
    }
  })
}

export default graphql(PersonQuery, configObject)(PersonPage)
