// @flow
import React from 'react'
import { PropTypes } from 'prop-types'
import gql from 'graphql-tag'
import humanizeDuration from 'humanize-duration'
import { translate } from 'react-i18next'
import type { Translator } from 'react-i18next'

import CountryFlag from 'components/CountryFlag/CountryFlag'
import i18n from 'libs/i18n'
import i18nClient from 'libs/i18nClient'

import './MovieInfo.scss'
import { Icon } from 'antd'

type Props = {
  movie: Object,
  year?: boolean,
  genres?: boolean,
  countries?: boolean,
  runtime?: boolean,
  languages?: boolean,
  all?: boolean,
  i18n: Translator,
}

@translate()
export default class MovieInfo extends React.PureComponent<Props> {
  static defaultProps = {
    year: false,
    genres: false,
    countries: false,
    runtime: false,
    languages: false,
    all: false,
    i18n: i18nClient,
  }

  static propTypes = {
    i18n: PropTypes.object,
    movie: PropTypes.object.isRequired,
    year: PropTypes.bool,
    genres: PropTypes.bool,
    countries: PropTypes.bool,
    runtime: PropTypes.bool,
    languages: PropTypes.bool,
    all: PropTypes.bool,
  }

  static fragments = {
    all: gql`
      fragment MovieInfoAll on MovieNode {
        year
        runtime
        genres {
          ${i18n.gql('name')}
        }
        countries {
          ${i18n.gql('name')}
          ...CountryFlag
        }
        languages {
          ${i18n.gql('name')}
        }
      }
      ${CountryFlag.fragments.country}      
    `,
    year: gql`
      fragment MovieInfoYear on MovieNode {
        year
      }
    `,
    genres: gql`
      fragment MovieInfoGenres on MovieNode {
        genres {
          ${i18n.gql('name')}
        }
      }
    `,
    countries: gql`
      fragment MovieInfoCountries on MovieNode {
        countries {
          ${i18n.gql('name')}
          ...CountryFlag
        }
      }
      ${CountryFlag.fragments.country}
    `,
    runtime: gql`
      fragment MovieInfoRuntime on MovieNode {
        runtime
      }
    `,
    languages: gql`
      fragment MovieInfoLanguages on MovieNode {
        languages {
          ${i18n.gql('name')}
        }
      }
    `,
  }

  renderYear() {
    return !this.props.movie.year ? null : <span>{this.props.movie.year}</span>
  }

  renderGenres() {
    return this.props.movie.genres.length === 0 ? null : (
      <span>{this.props.movie.genres.map(item => item[i18n.f('name')]).join(', ')}</span>
    )
  }

  renderCountries() {
    return this.props.movie.countries.length === 0 ? null : (
      <span>
        {this.props.movie.countries.map((item, i) => (
          <span key={item[i18n.f('name')]}>
            {i > 0 ? ', ' : ''}
            <CountryFlag country={item} />
            {item[i18n.f('name')]}
          </span>
        ))}
      </span>
    )
  }

  renderRuntime() {
    return !this.props.movie.runtime ? null : (
      <span>
        <Icon type="clock-circle" />
        {humanizeDuration(this.props.movie.runtime * 60 * 1000, { language: this.props.i18n.language })}
      </span>
    )
  }

  renderLanguages() {
    if (this.props.movie.languages.length === 0) {
      return ''
    }
    const lang = this.props.i18n.t('movie.info.language', { count: this.props.movie.languages.length })
    return <span>{`${this.props.movie.languages.map(item => item[i18n.f('name')]).join(', ')} ${lang}`}</span>
  }

  render() {
    return (
      <div styleName="box">
        {(this.props.year || this.props.all) && this.renderYear()}
        {(this.props.genres || this.props.all) && this.renderGenres()}
        {(this.props.countries || this.props.all) && this.renderCountries()}
        {(this.props.runtime || this.props.all) && this.renderRuntime()}
        {(this.props.languages || this.props.all) && this.renderLanguages()}
      </div>
    )
  }
}
