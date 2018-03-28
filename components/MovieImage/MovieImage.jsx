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
      <div styleName="image">
        <a href="/"><img
          src="http://movister.ru/media/cache/a8/27/a82760e6e94cbb587925585f4cdcc8e1.jpg"
          alt={this.props.movie.title}
          title={this.props.movie.title}
        /></a>
      </div>
    )
  }
}
