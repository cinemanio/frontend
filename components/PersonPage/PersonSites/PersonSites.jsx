// @flow
import React from 'react'
import { PropTypes } from 'prop-types'
import gql from 'graphql-tag'

import Block from 'components/Block/Block'
import './PersonSites.scss'

type Props = { person: Object }

export default class PersonSites extends React.PureComponent<Props> {
  static propTypes = {
    person: PropTypes.object.isRequired
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
      }
    `
  }

  renderImdb() {
    const site = this.props.person.imdb
    return !site ? '' : (
      <li>
        <a href={site.url}>IMDb</a>
      </li>
    )
  }

  renderKinopoisk() {
    const site = this.props.person.kinopoisk
    return !site ? '' : (
      <li>
        <a href={site.url}>Кинопоиск</a>
      </li>
    )
  }

  render() {
    return (
      <div styleName="box">
        <Block title="This person on">
          <ul>
            {this.renderImdb()}
            {this.renderKinopoisk()}
          </ul>
        </Block>
      </div>
    )
  }
}
