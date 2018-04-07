// @flow
import React from 'react'
import { graphql } from 'react-apollo'
import { PropTypes } from 'prop-types'
import gql from 'graphql-tag'

import ObjectPage from 'components/ObjectPage/ObjectPage'
import MovieImage from 'components/MovieImage/MovieImage'
import { getIdFromSlug } from 'components/ObjectLink/ObjectLink'

import MovieInfo from './MovieInfo/MovieInfo'
import MovieRelations from './MovieRelations/MovieRelations'
import MovieCast from './MovieCast/MovieCast'
import MovieSites from './MovieSites/MovieSites'

import './MoviePage.scss'

type Props = { data: Object }

export class MoviePage extends React.PureComponent<Props> {
  static propTypes = {
    data: PropTypes.object.isRequired
  }

  renderLayout(movie: Object) {
    return (
      <div styleName="box">
        <MovieRelations counts={{ fav: 1, like: 10, seen: 10, dislike: 10, want: 3, have: 3, ignore: 0 }}/>
        <h1>{movie.title}</h1>
        <h2>{movie.title}</h2>
        <MovieInfo movie={movie}/>
        <div className="row">
          <div className="col-lg-2">
            <div styleName="image">
              <MovieImage movie={movie}/>
            </div>
            <MovieSites movie={movie}/>
          </div>
          <div className="col-lg-10">
            <MovieCast movie={movie}/>
          </div>
        </div>
      </div>
    )
  }

  getTitle = (movie: Object) => [movie.title, movie.year].join(', ')

  render() {
    return (<ObjectPage
      getTitle={this.getTitle}
      object={this.props.data.movie}
      renderLayout={this.renderLayout}
    />)
  }
}

const MovieQuery = gql`
  query Movie($movieId: ID!) {
    movie(id: $movieId) {
      title
      year
      ...MovieInfo
      ...MovieSites
      ...MovieCast
    }
  }
  ${MovieInfo.fragments.movie}
  ${MovieSites.fragments.movie}
  ${MovieCast.fragments.movie}
`

export const configObject = {
  options: ({ match: { params: { slug } } }: Object) => ({
    variables: {
      movieId: getIdFromSlug(slug)
    }
  })
}

export default graphql(MovieQuery, configObject)(MoviePage)
