// @flow
import React from 'react'
import { PropTypes } from 'prop-types'
import gql from 'graphql-tag'

import MovieLink from 'components/MovieLink/MovieLink'
import MovieImage from 'components/MovieImage/MovieImage'
import MovieInfo from 'components/MoviePage/MovieInfo/MovieInfo'
import MovieRelations from 'components/MovieRelations/MovieRelations'
import { i18nFields, i18nField } from 'libs/i18n'

import './MovieShort.scss'

type Props = { movie: Object, t: Function, i18n: Object }

export default class MovieShort extends React.Component<Props> {
  static propTypes = {
    movie: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    i18n: PropTypes.object.isRequired
  }

  static fragments = {
    movie: gql`
      fragment MovieShort on MovieNode {
        ${i18nFields('title')}
        title
        ...MovieImage
        ...MovieLink
        ...MovieInfoYear
        ...MovieInfoGenres
      }
      ${MovieImage.fragments.movie}
      ${MovieLink.fragments.movie}
      ${MovieInfo.fragments.year}
      ${MovieInfo.fragments.genres}
    `
  }

  isTitlesEqual = (movie: Object) => movie[i18nField('title')] === movie.title

  render() {
    return (
      <div styleName="box">
        <MovieImage movie={this.props.movie}/>
        <div styleName="right">
          <div styleName="relations">
            <MovieRelations/>
          </div>
          <MovieLink movie={this.props.movie}>
            {this.props.movie[i18nField('title')]}
          </MovieLink>
          <div styleName="subtitle">{this.isTitlesEqual(this.props.movie) ? '' : this.props.movie.title}</div>
          <MovieInfo movie={this.props.movie} t={this.props.t} i18n={this.props.i18n} year genres/>
        </div>
      </div>
    )
  }
}
