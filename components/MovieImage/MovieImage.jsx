// @flow
import React from 'react'
import { PropTypes } from 'prop-types'
import gql from 'graphql-tag'

import MovieLink from 'components/MovieLink/MovieLink'
import i18n from 'libs/i18n'

type Props = { movie: Object, type: string }

export default class MovieImage extends React.PureComponent<Props> {
  static propTypes = {
    movie: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired,
  }

  static fragments = {
    movie: gql`
      fragment MovieImage on MovieNode {
        ${i18n.gql('title')}
        ...MovieLink
      }
      ${MovieLink.fragments.movie}
    `,
  }

  render() {
    return (
      <div>
        <MovieLink movie={this.props.movie}>
          <img
            src={`/images/movie/poster/${this.props.type}/${this.props.movie.id}.jpg`}
            alt={this.props.movie[i18n.f('title')]}
            title={this.props.movie[i18n.f('title')]}
          />
        </MovieLink>
      </div>
    )
  }
}
