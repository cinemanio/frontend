// @flow
import React from 'react'
import { graphql } from 'react-apollo'
import { PropTypes } from 'prop-types'
import gql from 'graphql-tag'

import ObjectPage from 'components/ObjectPage/ObjectPage'
import MovieImage from 'components/MovieImage/MovieImage'
import MovieRelations from 'components/MoviePage/MovieRelations/MovieRelations'
import { getIdFromSlug } from 'components/ObjectLink/ObjectLink'
import i18n from 'libs/i18n'

import MovieInfo from './MovieInfo/MovieInfo'
import MovieCast from './MovieCast/MovieCast'
import MovieSites from './MovieSites/MovieSites'

import './MoviePage.scss'

type Props = { data: Object, t: Function, i18n: Object }

class MoviePage extends React.Component<Props> {
  static propTypes = {
    data: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    i18n: PropTypes.object.isRequired
  }

  isTitlesEqual = (movie: Object) => movie[i18n.f('title')] === movie.title

  renderLayout = (movie: Object) => (
    <div styleName="box">
      <div styleName="relations">
        <MovieRelations counts={{ fav: 1, like: 10, seen: 10, dislike: 10, want: 3, have: 3, ignore: 0 }}/>
      </div>
      <h1>{movie[i18n.f('title')]}</h1>
      <h2>{this.isTitlesEqual(movie) ? '' : movie.title}</h2>
      <MovieInfo movie={movie} t={this.props.t} i18n={this.props.i18n} all/>
      <div className="row">
        <div className="col-lg-2">
          <div styleName="image">
            <MovieImage movie={movie} type="detail"/>
          </div>
          <MovieSites movie={movie} t={this.props.t}/>
        </div>
        <div className="col-lg-10">
          <MovieCast movie={movie} t={this.props.t}/>
        </div>
      </div>
    </div>
  )

  getTitle = (movie: Object) => {
    const parts = []
    parts.push(movie[i18n.f('title')])
    if (!this.isTitlesEqual(movie)) {
      parts.push(movie.title)
    }
    parts.push(movie.year)
    return parts.join(', ')
  }

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
      ${i18n.gql('title')}
      title
      ...MovieImage
      ...MovieInfoAll
      ...MovieSites
      ...MovieCast
    }
  }
  ${MovieInfo.fragments.all}
  ${MovieImage.fragments.movie}
  ${MovieSites.fragments.movie}
  ${MovieCast.fragments.movie}
`

const configObject = {
  options: ({ match: { params: { slug } } }: Object) => ({
    variables: {
      movieId: getIdFromSlug(slug)
    }
  })
}

export default graphql(MovieQuery, configObject)(MoviePage)
