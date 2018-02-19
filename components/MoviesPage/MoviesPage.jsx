// @flow
import React from 'react'
import { Link } from 'react-router-named-routes'
import { graphql } from 'react-apollo'
import { PropTypes } from 'prop-types'
import gql from 'graphql-tag'

type Props = { data: Object }

class MoviesPage extends React.PureComponent<Props> {
  static propTypes = {
    data: PropTypes.object.isRequired
  }

  render() {
    const { movies } = this.props.data
    return (
      <div>
        <ul>
          {movies && movies.edges.map(({ movie }) =>
            (<li key={movie.id}>
              <Link to="movie.detail" params={{ movieId: movie.id }}>{movie.title}</Link>
            </li>)
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
