// @flow
import React from 'react'
import { graphql } from 'react-apollo'
import { PropTypes } from 'prop-types'
import gql from 'graphql-tag'

import ObjectPage from 'components/ObjectPage/ObjectPage'
import { getIdFromSlug } from 'components/ObjectLink/ObjectLink'

import MovieInfo from './MovieInfo/MovieInfo'
import MovieImage from './MovieImage/MovieImage'
import MovieRelations from './MovieRelations/MovieRelations'
import MovieCast from './MovieCast/MovieCast'
import MovieSites from './MovieSites/MovieSites'

import './MoviePage.scss'

type Props = { data: Object }

export class MoviePage extends React.PureComponent<Props> {
  static propTypes = {
    data: PropTypes.object.isRequired,
  }

  renderLayout(movie: Object) {
    return (
      <div>
        <MovieRelations counts={{ fav: 1, like: 10, seen: 10, dislike: 10, want: 3, have: 3, ignore: 0 }}/>
        <h1>{movie.title}</h1>
        <h2>{movie.title}</h2>
        <MovieInfo movie={movie}/>
        <div className="row">
          <div className="col-lg">
            <MovieImage movie={movie}/>
            <MovieSites movie={movie}/>
          </div>
          <div className="col-lg-7">
            <MovieCast movie={movie}/>
          </div>
          <div className="col-lg-3">&nbsp;
          </div>
        </div>
      </div>
    )
  }

  render() {
    return (<ObjectPage
      object={this.props.data.movie}
      renderLayout={this.renderLayout}
    />)
  }
}

const MovieQuery = gql`
  query Movie($movieId: ID!) {
    movie(id: $movieId) {
      id
      title
      ...MovieSites
      ...MovieInfo
      ...MovieCast
    }
  }
  ${MovieSites.fragments.movie}
  ${MovieCast.fragments.movie}
  ${MovieInfo.fragments.movie}
`

export const configObject = {
  options: ({ match: { params: { slug } } }: Object) => ({
    variables: {
      movieId: getIdFromSlug(slug)
    }
  })
}

export default graphql(MovieQuery, configObject)(MoviePage)
