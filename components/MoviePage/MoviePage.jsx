// @flow
import React from 'react'
import { graphql } from 'react-apollo'
import { PropTypes } from 'prop-types'
import { translate } from 'react-i18next'
import gql from 'graphql-tag'
import { Row, Col } from 'antd'

import ObjectPage from 'components/ObjectPage/ObjectPage'
import MovieImage from 'components/MovieImage/MovieImage'
import MovieRelations from 'components/MoviePage/MovieRelations/MovieRelations'
import ObjectWikipedia from 'components/ObjectWikipedia/ObjectWikipedia'
import ObjectKinopoiskInfo from 'components/ObjectKinopoiskInfo/ObjectKinopoiskInfo'
import { getIdFromSlug } from 'components/ObjectLink/ObjectLink'
import i18n from 'libs/i18n'

import MovieInfo from './MovieInfo/MovieInfo'
import MovieCast from './MovieCast/MovieCast'
import MovieSites from './MovieSites/MovieSites'

import './MoviePage.scss'

type Props = { data: Object }

@translate()
class MoviePage extends React.PureComponent<Props> {
  static propTypes = {
    data: PropTypes.object.isRequired,
  }

  static queries = {
    movie: gql`
      query Movie($movieId: ID!) {
        movie(id: $movieId) {
          ${i18n.gql('title')}
          titleOriginal
          ...MovieImage
          ...MovieInfoAll
          ...MovieSites
          ...MovieCast
          ...MovieRelations
          ...MovieWikipedia
          ...MovieKinopoiskInfo
        }
      }
      ${MovieInfo.fragments.all}
      ${MovieImage.fragments.movie}
      ${MovieSites.fragments.movie}
      ${MovieCast.fragments.movie}
      ${MovieRelations.fragments.movie}
      ${ObjectWikipedia.fragments.movie}
      ${ObjectKinopoiskInfo.fragments.movie}
    `,
  }

  isTitlesEqual = (movie: Object) => movie[i18n.f('title')] === movie.titleOriginal

  getTitle = (movie: Object) => {
    let originalTitle = ''
    if (movie.titleOriginal && !this.isTitlesEqual(movie)) {
      originalTitle = `${movie.titleOriginal} - `
    }
    return `${movie[i18n.f('title')]} (${originalTitle}${movie.year})`
  }

  renderLayout(movie: Object) {
    return (
      <div styleName="box">
        <div styleName="relations">
          <MovieRelations movie={movie} />
        </div>
        <h1>{movie[i18n.f('title')]}</h1>
        <h2>{this.isTitlesEqual(movie) ? null : movie.titleOriginal}</h2>
        <MovieInfo movie={movie} all />
        <Row>
          <Col span={4}>
            <div styleName="image">
              <MovieImage movie={movie} type="detail" />
            </div>
            <MovieSites movie={movie} />
          </Col>
          <Col span={20}>
            <MovieCast movie={movie} />
          </Col>
        </Row>
        <ObjectKinopoiskInfo object={movie} />
        <ObjectWikipedia object={movie} />
      </div>
    )
  }

  render() {
    return (
      <ObjectPage
        getTitle={this.getTitle}
        object={this.props.data.movie}
        renderLayout={movie => this.renderLayout(movie)}
      />
    )
  }
}

const configObject = {
  options: ({
    match: {
      params: { slug },
    },
  }: Object) => ({
    variables: {
      movieId: getIdFromSlug(slug),
    },
  }),
}

export default graphql(MoviePage.queries.movie, configObject)(MoviePage)
