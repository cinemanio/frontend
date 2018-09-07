// @flow
import React from 'react'
import { PropTypes } from 'prop-types'
import gql from 'graphql-tag'

import MovieLink from 'components/MovieLink/MovieLink'
import MovieImage from 'components/MovieImage/MovieImage'
import i18n from 'libs/i18n'

import './MovieIcon.scss'

type Props = { movie: Object }

export default class MovieIcon extends React.Component<Props> {
  static propTypes = {
    movie: PropTypes.object.isRequired,
  }

  static fragments = {
    movie: gql`
      fragment MovieIcon on MovieNode {
        ${i18n.gql('title')}
        title
        year
        ...MovieImage
        ...MovieLink
      }
      ${MovieImage.fragments.movie}
      ${MovieLink.fragments.movie}
    `
  }

  render() {
    return (
      <div styleName="box">
        <MovieImage movie={this.props.movie} type="detail"/>
        <MovieLink movie={this.props.movie}>
          {this.props.movie[i18n.f('title')]} ({this.props.movie.year})
        </MovieLink>
      </div>
    )
  }
}
