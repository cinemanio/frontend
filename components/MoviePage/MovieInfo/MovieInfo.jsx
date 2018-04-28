// @flow
import React from 'react'
import { PropTypes } from 'prop-types'
import gql from 'graphql-tag'
import humanizeDuration from 'humanize-duration'

import CountryFlag from 'components/CountryFlag/CountryFlag'
import './MovieInfo.scss'

type Props = {
  movie: Object,
  year: ?boolean,
  genres: ?boolean,
  countries: ?boolean,
  runtime: ?boolean,
  languages: ?boolean,
  all: ?boolean,
}

export default class MovieInfo extends React.PureComponent<Props> {
  static defaultProps = {
    year: false,
    genres: false,
    countries: false,
    runtime: false,
    languages: false,
    all: false,
  }

  static propTypes = {
    movie: PropTypes.object.isRequired,
    year: PropTypes.bool,
    genres: PropTypes.bool,
    countries: PropTypes.bool,
    runtime: PropTypes.bool,
    languages: PropTypes.bool,
    all: PropTypes.bool
  }

  static fragments = {
    all: gql`
      fragment MovieInfoAll on MovieNode {
        year
        runtime
        genres {
          name
        }
        countries {
          name
          ...CountryFlag
        }
        languages {
          name
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
          name
        }
      }
    `,
    countries: gql`
      fragment MovieInfoCountries on MovieNode {
        countries {
          name
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
          name
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
        {this.props.movie.genres.map(item => item.name).join(', ')}
      </span>
    )
  }

  renderCountries() {
    return (!this.props.countries && !this.props.all) ? '' : (
      <span styleName="countries">
        {this.props.movie.countries.map((item, i) => (
          <span key={item.name}>
            {i > 0 ? ', ' : ''}
            <CountryFlag country={item}/>
            {item.name}
          </span>
        ))}
      </span>
    )
  }

  renderRuntime() {
    return (!this.props.runtime && !this.props.all) ? '' : (
      <span styleName="runtime">
        <i/>{humanizeDuration(this.props.movie.runtime * 60 * 1000)}
      </span>
    )
  }

  renderLanguages() {
    return (!this.props.languages && !this.props.all) ? '' : (
      <span styleName="languages">
        {this.props.movie.languages.map(item => item.name).join(', ')}
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
