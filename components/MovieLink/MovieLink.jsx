// @flow
import React from 'react'
import { PropTypes } from 'prop-types'
import gql from 'graphql-tag'

import ObjectLink from '../ObjectLink/ObjectLink'

type Props = { movie: Object, children: Object | string }

export default class MovieLink extends React.PureComponent<Props> {
  static propTypes = {
    movie: PropTypes.object.isRequired,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
  }

  static fragments = {
    movie: gql`
      fragment MovieLink on MovieNode {
        id
        titleEn
        year
      }
    `,
  }

  get parts(): Array<string> {
    return [
      this.props.movie.titleEn,
      String(this.props.movie.year),
      this.props.movie.id,
    ]
  }

  render() {
    return (
      <ObjectLink type="movie" parts={this.parts}>
        {this.props.children}
      </ObjectLink>
    )
  }
}
