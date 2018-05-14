// @flow
import React from 'react'
import { PropTypes } from 'prop-types'
import gql from 'graphql-tag'

import Block from 'components/Block/Block'
import './MovieSites.scss'

type Props = { movie: Object, t: Function }

export default class MovieSites extends React.PureComponent<Props> {
  static propTypes = {
    movie: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired
  }

  static fragments = {
    movie: gql`
      fragment MovieSites on MovieNode {
        imdb {
          url
          rating
        }
        kinopoisk {
          url
          rating
        }
      }
    `
  }

  renderImdb() {
    const site = this.props.movie.imdb
    return !site ? '' : (
      <li>
        <a href={site.url}>IMDb</a>
        {site.rating ? <span title={this.props.t('movie.sites.imdbRating')}>{site.rating}</span> : ''}
      </li>
    )
  }

  renderKinopoisk() {
    const site = this.props.movie.kinopoisk
    return !site ? '' : (
      <li>
        <a href={site.url}>{this.props.t('movie.sites.kinopoisk')}</a>
        {site.rating ? <span title={this.props.t('movie.sites.kinopoiskRating')}>{site.rating}</span> : ''}
      </li>
    )
  }

  render() {
    return (
      <div styleName="box">
        <Block title={this.props.t('movie.sites.title')}>
          <ul>
            {this.renderImdb()}
            {this.renderKinopoisk()}
          </ul>
        </Block>
      </div>
    )
  }
}
