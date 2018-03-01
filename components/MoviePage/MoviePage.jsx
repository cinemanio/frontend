// @flow
import React from 'react'
import { graphql } from 'react-apollo'
import { PropTypes } from 'prop-types'
import gql from 'graphql-tag'

import MovieInfo from './MovieInfo/MovieInfo'
import MovieImage from './MovieImage/MovieImage'
import MovieRelations from './MovieRelations/MovieRelations'
import MovieCast from './MovieCast/MovieCast'
import Menu from '../../components/Menu/Menu'
import { getIdFromSlug } from '../../components/ObjectLink/ObjectLink'

import './MoviePage.scss'

type Props = { data: Object }

export class MoviePage extends React.Component<Props> {
  static propTypes = {
    data: PropTypes.object.isRequired
  }

  render() {
    const { movie } = this.props.data
    if (!movie) return null
    return (
      <div>
        <Menu active="movie" link/>
        <MovieRelations counts={{ fav: 1, like: 10, seen: 10, dislike: 10, want: 3, have: 3, ignore: 0 }}/>
        <h1>{movie.title}</h1>
        <h2>{movie.title}</h2>
        <MovieInfo movie={movie}/>
        <div className="row">
          <div className="col-lg">
            <MovieImage movie={movie}/>
            <div>{movie.imdb.id} - {movie.imdb.rating}</div>
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
}

const MovieQuery = gql`
  query Movie($movieId: ID!) {
    movie(id: $movieId) {
      id
      title
      imdb { id, rating }
      ...MovieInfo
      ...MovieCast
    }
  }
  ${MovieCast.fragments.movie}
  ${MovieInfo.fragments.movie}
`

export const configObject = {
  options: ({ params: { slug } }: Object) => ({
    variables: {
      movieId: getIdFromSlug(slug)
    }
  })
}

export default graphql(MovieQuery, configObject)(MoviePage)
