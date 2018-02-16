// @flow
import React from 'react'
import { Link } from 'react-router'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'


class MoviesPage extends React.Component {
  render() {
    const { data: { movies } } = this.props
    return (
      <div>
        <ul>
          {movies && movies.edges.map(({ movie }) =>
            <li key={movie.id}>
              <Link to={`/movies/${movie.id}`}>{movie.title}</Link>
            </li>
          )}
        </ul>
      </div>
    )
  }
}

const MoviesQuery = gql`
  query Movies {
    movies(first: 100) {
      edges {
        movie: node {
          id
          title
        }
      }
    }
  }
`

export default graphql(MoviesQuery)(MoviesPage)
