// @flow
import React from 'react'
import { graphql } from 'react-apollo'
import { Link } from 'react-router-named-routes'
import { PropTypes } from 'prop-types'
import gql from 'graphql-tag'

type Props = { data: Object }

export class MoviePage extends React.Component<Props> {
  static propTypes = {
    data: PropTypes.object.isRequired
  }

  renderCast() {
    return this.props.data.movie.cast.edges.map(({ node }, i) =>
      (<div key={node.id}>
        <Link to="person.detail" params={{ personId: node.person.id }}>
          {node.person.firstName} {node.person.lastName} {node.person.gender}
        </Link>
        ({node.role.name}: {node.name})
      </div>)
    )
  }

  render() {
    const { movie } = this.props.data
    if (!movie) return null
    return (
      <div>
        <div><Link to="movie.list">movies</Link></div>
        <h1>{movie.title}</h1>
        <div>{movie.year}</div>
        <div>{movie.runtime}</div>
        <div>{movie.imdb.id} - {movie.imdb.rating}</div>
        <div>{movie.genres.map(item => item.name).join(', ')}</div>
        <div>{movie.countries.map(item => item.name).join(', ')}</div>
        <div>{movie.languages.map(item => item.name).join(', ')}</div>
        {this.renderCast()}
      </div>
    )
  }
}

const MovieQuery = gql`
  query Movie($movieId: ID!) {
    movie(id: $movieId) {
      id
      title
      year
      runtime
      imdb { id, rating }
      genres { name }
      countries { name }
      languages { name }
      cast {
        edges {
          node {
            id 
            name
            person { id, firstName, lastName, gender }
            role { name }
          }
        }
      }      
    }
  }
`

export default graphql(MovieQuery, {
  options: ({ params: { movieId } }) => ({ variables: { movieId } })
})(MoviePage)
