// @flow
import React from 'react'
import { PropTypes } from 'prop-types'
import gql from 'graphql-tag'

import MovieLink from 'components/MovieLink/MovieLink'
import i18n from 'libs/i18n'

import './MovieImage.scss'

type Props = { movie: Object }

export default class MovieImage extends React.Component<Props> {
  static propTypes = {
    movie: PropTypes.object.isRequired
  }

  static fragments = {
    movie: gql`
      fragment MovieImage on MovieNode {
        ${i18n.gql('title')}
        ...MovieLink
      }
      ${MovieLink.fragments.movie}
    `
  }

  render() {
    return (
      <div>
        <MovieLink movie={this.props.movie}>
          <img
            src="https://st.kp.yandex.net/images/film_iphone/iphone360_1100779.jpg"
            alt={this.props.movie[i18n.f('title')]}
            title={this.props.movie[i18n.f('title')]}
          />
        </MovieLink>
      </div>
    )
  }
}
