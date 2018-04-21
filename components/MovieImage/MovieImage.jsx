// @flow
import React from 'react'
import { PropTypes } from 'prop-types'
import gql from 'graphql-tag'

import './MovieImage.scss'

type Props = { movie: Object }

export default class MovieImage extends React.Component<Props> {
  static propTypes = {
    movie: PropTypes.object.isRequired
  }

  static fragments = {
    movie: gql`
      fragment MovieImage on MovieNode {
        title
      }
    `
  }

  render() {
    return (
      <div>
        <a href="/"><img
          src="https://st.kp.yandex.net/images/film_iphone/iphone360_1100779.jpg"
          alt={this.props.movie.title}
          title={this.props.movie.title}
        /></a>
      </div>
    )
  }
}
