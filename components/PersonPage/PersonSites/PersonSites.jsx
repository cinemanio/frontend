// @flow
import React from 'react'
import { PropTypes } from 'prop-types'
import { translate } from 'react-i18next'
import type { Translator } from 'react-i18next'
import gql from 'graphql-tag'

import Block from 'components/Block/Block'
import i18nClient from 'libs/i18nClient'

import './PersonSites.scss'

type Props = { person: Object, i18n: Translator }

@translate()
export default class PersonSites extends React.Component<Props> {
  static defaultProps = {
    i18n: i18nClient,
  }

  static propTypes = {
    i18n: PropTypes.object,
    person: PropTypes.object.isRequired,
  }

  static fragments = {
    person: gql`
      fragment PersonSites on PersonNode {
        imdb {
          url
        }
        kinopoisk {
          url
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
    const site = this.props.person.imdb
    return !site ? null : (
      <li>
        <a href={site.url}>IMDb</a>
      </li>
    )
  }

  renderKinopoisk() {
    const site = this.props.person.kinopoisk
    return !site ? null : (
      <li>
        <a href={site.url}>{this.props.i18n.t('movie.sites.kinopoisk')}</a>
      </li>
    )
  }

  renderWikipedia() {
    const sites = this.props.person.wikipedia.edges
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
        <Block title={this.props.i18n.t('person.sites.title')}>
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
