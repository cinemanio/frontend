// @flow
import React from 'react'
import { PropTypes } from 'prop-types'
import { translate } from 'react-i18next'
import type { Translator } from 'react-i18next'
import gql from 'graphql-tag'

import Block from 'components/Block/Block'
import i18nClient from 'libs/i18nClient'

import './MovieSites.scss'

type Props = { movie: Object, i18n: Translator }

@translate()
export default class MovieSites extends React.PureComponent<Props> {
  static defaultProps = {
    i18n: i18nClient,
  }

  static propTypes = {
    i18n: PropTypes.object,
    movie: PropTypes.object.isRequired,
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
        wikipedia {
          edges {
            node {
              url
              lang
            }
          }
        }
      }
    `,
  }

  renderImdb() {
    const site = this.props.movie.imdb
    return !site ? null : (
      <li>
        <a href={site.url}>IMDb</a>
        {site.rating ? <span title={this.props.i18n.t('movie.sites.imdbRating')}>{site.rating}</span> : ''}
      </li>
    )
  }

  renderKinopoisk() {
    const site = this.props.movie.kinopoisk
    return !site ? null : (
      <li>
        <a href={site.url}>{this.props.i18n.t('movie.sites.kinopoisk')}</a>
        {site.rating ? <span title={this.props.i18n.t('movie.sites.kinopoiskRating')}>{site.rating}</span> : ''}
      </li>
    )
  }

  renderWikipedia() {
    const sites = this.props.movie.wikipedia.edges
    return !sites
      ? null
      : sites.map(({ node: site }) => (
          <li key={site.lang}>
            <a href={site.url}>{`${site.lang}.wikipedia.org`}</a>
          </li>
        ))
  }

  render() {
    return (
      <div styleName="box">
        <Block title={this.props.i18n.t('movie.sites.title')}>
          <ul>
            {this.renderImdb()}
            {this.renderKinopoisk()}
            {this.renderWikipedia()}
          </ul>
        </Block>
      </div>
    )
  }
}
