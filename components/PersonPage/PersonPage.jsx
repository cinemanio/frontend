// @flow
import React from 'react'
import { graphql } from 'react-apollo'
import { PropTypes } from 'prop-types'
import gql from 'graphql-tag'

import ObjectPage from 'components/ObjectPage/ObjectPage'
import MovieLink from 'components/MovieLink/MovieLink'
import { getIdFromSlug } from 'components/ObjectLink/ObjectLink'

type Props = { data: Object }

export class PersonPage extends React.Component<Props> {
  static propTypes = {
    data: PropTypes.object.isRequired
  }

  renderLayout(person: Object) {
    return (
      <div>
        <h1>{person.name}</h1>
        <div>{person.country && person.country.name}</div>
        <div>{person.gender}</div>
        <div>{person.dateBirth}</div>
        <div>{person.dateDeath}</div>
        <div>{person.imdb && person.imdb.id}</div>
        {person.career.edges.map(({ node }, i) =>
          (<div key={node.id}>
            <MovieLink movie={node.movie}/> ({node.movie.year})
            ({node.role.name}: {node.name})
          </div>)
        )}
      </div>
    )
  }

  render() {
    return (
      <ObjectPage type="person" object={this.props.data.person} renderLayout={this.renderLayout}/>
    )
  }
}

const PersonQuery = gql`
  query Person($personId: ID!) {
    person(id: $personId) {
      id
      name
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
