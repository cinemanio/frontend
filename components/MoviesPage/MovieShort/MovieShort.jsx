// @flow
import React from 'react'
import { PropTypes } from 'prop-types'
import gql from 'graphql-tag'

import MovieLink from 'components/MovieLink/MovieLink'
import MovieImage from 'components/MovieImage/MovieImage'
import MovieInfo from 'components/MoviePage/MovieInfo/MovieInfo'
import MovieRelations from 'components/MovieRelations/MovieRelations'

import './MovieShort.scss'

type Props = { movie: Object }

export default class MovieShort extends React.PureComponent<Props> {
  static propTypes = {
    movie: PropTypes.object.isRequired
  }

  static fragments = {
    movie: gql`
      fragment MovieShort on MovieNode {
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

  render() {
    return (
      <div styleName="box">
        <MovieImage movie={this.props.movie}/>
        <div styleName="right">
          <div styleName="relations">
            <MovieRelations/>
          </div>
          <MovieLink movie={this.props.movie}>
            {this.props.movie.title}
          </MovieLink>
          <div styleName="subtitle">{this.props.movie.title}</div>
          <MovieInfo movie={this.props.movie} year genres/>
        </div>
      </div>
    )
  }
}
