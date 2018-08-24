// @flow
import React from 'react'
import { PropTypes } from 'prop-types'
import gql from 'graphql-tag'

import Block from 'components/Block/Block'
import './PersonSites.scss'

type Props = { person: Object }

export default class PersonSites extends React.Component<Props> {
  static propTypes = {
    person: PropTypes.object.isRequired,
  }

  static contextTypes = {
    i18n: PropTypes.object.isRequired,
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
    `
  }

  renderImdb() {
    const site = this.props.person.imdb
    return !site ? '' : <li><a href={site.url}>IMDb</a></li>
  }

  renderKinopoisk() {
    const site = this.props.person.kinopoisk
    return !site ? '' : <li><a href={site.url}>Кинопоиск</a></li>
  }

  renderWikipedia() {
    const sites = this.props.person.wikipedia.edges
    return !sites ? '' : sites.map(({ node: site }) => (
      <li><a href={site.url}>{`${site.lang}.wikipedia.org`}</a></li>
    ))
  }

  render() {
    return (
      <div styleName="box">
        <Block title={this.context.i18n.t('person.sites.title')}>
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
