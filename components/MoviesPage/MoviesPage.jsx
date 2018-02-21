// @flow
import React from 'react'
import { graphql } from 'react-apollo'
import { PropTypes } from 'prop-types'
import gql from 'graphql-tag'

import Menu from '../../components/Menu/Menu'
import MovieLink from '../../components/MovieLink/MovieLink'

type Props = { data: Object }

class MoviesPage extends React.PureComponent<Props> {
  static propTypes = {
    data: PropTypes.object.isRequired
  }

  render() {
    const { movies } = this.props.data
    return (
      <div>
        <Menu active="movie"/>
        <ul>
          {movies && movies.edges.map(({ movie }) =>
            (<li key={movie.id}>
              <MovieLink movie={movie}/>
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
          ...MovieLink
        }
      }
    }
  }
  ${MovieLink.fragments.movie}
`

export default graphql(MoviesQuery)(MoviesPage)
