// @flow
import React from 'react'
import { Link } from 'react-router'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

class MoviePage extends React.Component {
  renderCast() {
    const { data: { movie } } = this.props
    return movie.cast.edges.map(({ node }) =>
      <div>{node.person.firstName} {node.person.lastName} {node.person.gender} ({node.role.name}: {node.name})</div>
    )
  }

  render() {
    const { data: { movie } } = this.props
    if (!movie) return null
    return (
      <div>
        <div><Link to="/movies/">movies</Link></div>
        <div><h1>{movie.title}</h1></div>
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
            name
            person { firstName, lastName, gender }
            role { name }
          }
        }
      }      
    }
  }
`

export default graphql(MovieQuery, {
  options: ({ params: { movieId } }) => ({ variables: { movieId } }),
})(MoviePage)
