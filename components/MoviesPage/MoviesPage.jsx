// @flow
import React from 'react'
import { graphql } from 'react-apollo'
import { PropTypes } from 'prop-types'
import gql from 'graphql-tag'

import Menu from '../../components/Menu/Menu'
import ObjectList, { configObject } from '../../components/ObjectList/ObjectList'
import MovieLink from '../../components/MovieLink/MovieLink'

type Props = { data: Object }

class MoviesPage extends React.PureComponent<Props> {
  static propTypes = {
    data: PropTypes.object.isRequired
  }

  renderMovie = ({ movie }) => <MovieLink movie={movie}/>

  render() {
    return (
      <div>
        <Menu active="movie"/>
        <ObjectList
          noResultsMessage="There is no such movies. Try to change search parameters."
          renderItem={this.renderMovie}
          data={this.props.data}
        />
      </div>
    )
  }
}

const MoviesQuery = gql`
  query Movies($first: Int!, $after: String){
    list: movies(first: $first, after: $after) {
      totalCount
      edges {
        movie: node {
          id
          ...MovieLink
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
  ${MovieLink.fragments.movie}
`

export default graphql(MoviesQuery, configObject)(MoviesPage)
