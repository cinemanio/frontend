// @flow
import React from 'react'
import { PropTypes } from 'prop-types'
import gql from 'graphql-tag'

import ObjectLink from '../ObjectLink/ObjectLink'

type Props = { movie: Object }

export default class MovieLink extends React.PureComponent<Props> {
  static propTypes = {
    movie: PropTypes.object.isRequired
  }

  get parts() {
    return [
      this.props.movie.titleEn,
      this.props.movie.id
    ]
  }

  render() {
    return (
      <ObjectLink to="movie.detail" parts={this.parts}>
        {this.props.movie.title}
      </ObjectLink>
    )
  }
}

MovieLink.fragments = {
  movie: gql`
    fragment MovieLink on MovieNode {
      id
      title
      titleEn
    }
  `
}
