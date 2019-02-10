// @flow
import React from 'react'
import { PropTypes } from 'prop-types'
import gql from 'graphql-tag'
import { translate } from 'react-i18next'

import MovieLink from 'components/MovieLink/MovieLink'
import MovieImage from 'components/MovieImage/MovieImage'
import MovieInfo from 'components/MoviePage/MovieInfo/MovieInfo'
import MovieRelations from 'components/MoviePage/MovieRelations/MovieRelations'
import i18n from 'libs/i18n'

import './MovieShort.scss'

type Props = { movie: Object }

@translate()
export default class MovieShort extends React.Component<Props> {
  static propTypes = {
    movie: PropTypes.object.isRequired,
  }

  static fragments = {
    movie: gql`
      fragment MovieShort on MovieNode {
        ${i18n.gql('title')}
        titleOriginal
        ...MovieImage
        ...MovieLink
        ...MovieInfoYear
        ...MovieInfoGenres
        ...MovieRelations
      }
      ${MovieImage.fragments.movie}
      ${MovieLink.fragments.movie}
      ${MovieInfo.fragments.year}
      ${MovieInfo.fragments.genres}
      ${MovieRelations.fragments.movie}
    `,
  }

  isTitlesEqual = (movie: Object) => movie[i18n.f('title')] === movie.titleOriginal

  render() {
    return (
      <div styleName="box">
        <MovieImage movie={this.props.movie} type="short_card" />
        <div styleName="right">
          <div styleName="relations">
            <MovieRelations movie={this.props.movie} displayCounts={false} />
          </div>
          <MovieLink movie={this.props.movie}>{this.props.movie[i18n.f('title')]}</MovieLink>
          <div styleName="subtitle">{this.isTitlesEqual(this.props.movie) ? null : this.props.movie.titleOriginal}</div>
          <MovieInfo movie={this.props.movie} year genres />
        </div>
      </div>
    )
  }
}
