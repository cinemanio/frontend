// @flow
import React from 'react'
import { PropTypes } from 'prop-types'
import gql from 'graphql-tag'
import humanizeDuration from 'humanize-duration'
import i18n from 'i18next'

import CountryFlag from 'components/CountryFlag/CountryFlag'
import { i18nFields, i18nField } from 'libs/i18n'

import './MovieInfo.scss'

type Props = {
  movie: Object,
  year: ?boolean,
  genres: ?boolean,
  countries: ?boolean,
  runtime: ?boolean,
  languages: ?boolean,
  all: ?boolean,
  t: Function,
  i18n: Object,
}

export default class MovieInfo extends React.Component<Props> {
  static defaultProps = {
    year: false,
    genres: false,
    countries: false,
    runtime: false,
    languages: false,
    all: false
  }

  static propTypes = {
    movie: PropTypes.object.isRequired,
    year: PropTypes.bool,
    genres: PropTypes.bool,
    countries: PropTypes.bool,
    runtime: PropTypes.bool,
    languages: PropTypes.bool,
    all: PropTypes.bool,
    t: PropTypes.func.isRequired,
    i18n: PropTypes.object.isRequired
  }

  static fragments = {
    all: gql`
      fragment MovieInfoAll on MovieNode {
        year
        runtime
        genres {
          ${i18nFields('name')}
        }
        countries {
          ${i18nFields('name')}
          ...CountryFlag
        }
        languages {
          ${i18nFields('name')}
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
          ${i18nFields('name')}
        }
      }
    `,
    countries: gql`
      fragment MovieInfoCountries on MovieNode {
        countries {
          ${i18nFields('name')}
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
          ${i18nFields('name')}
        }
      }
    `
  }

  renderYear() {
    return (!this.props.year && !this.props.all) ? '' : (
      <span styleName="year">
        {this.props.movie.year}
      </span>
    )
  }

  renderGenres() {
    return (!this.props.genres && !this.props.all) ? '' : (
      <span styleName="genres">
        {this.props.movie.genres.map(item => item[i18nField('name')]).join(', ')}
      </span>
    )
  }

  renderCountries() {
    return (!this.props.countries && !this.props.all) ? '' : (
      <span styleName="countries">
        {this.props.movie.countries.map((item, i) => (
          <span key={item[i18nField('name')]}>
            {i > 0 ? ', ' : ''}
            <CountryFlag country={item}/>
            {item[i18nField('name')]}
          </span>
        ))}
      </span>
    )
  }

  renderRuntime() {
    return (!this.props.runtime && !this.props.all) ? '' : (
      <span styleName="runtime">
        <i/>{humanizeDuration(this.props.movie.runtime * 60 * 1000, { language: this.props.i18n.language })}
      </span>
    )
  }

  renderLanguages() {
    if (!this.props.movie.languages || (!this.props.languages && !this.props.all)) {
      return ''
    }
    const lang = this.props.t('movie.info.language', { count: this.props.movie.languages.length })
    return (
      <span styleName="languages">
        {`${this.props.movie.languages.map(item => item[i18nField('name')]).join(', ')} ${lang}`}
      </span>
    )
  }

  render() {
    return (
      <div styleName="box">
        {this.renderYear()}
        {this.renderGenres()}
        {this.renderCountries()}
        {this.renderRuntime()}
        {this.renderLanguages()}
      </div>
    )
  }
}
