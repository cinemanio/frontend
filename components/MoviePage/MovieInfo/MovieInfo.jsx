// @flow
import React from 'react'
import { PropTypes } from 'prop-types'
import gql from 'graphql-tag'
import humanizeDuration from 'humanize-duration'

import CountryFlag from '../../../components/CountryFlag/CountryFlag'
import './MovieInfo.scss'

type Props = { movie: Object }

export default class MovieInfo extends React.PureComponent<Props> {
  static propTypes = {
    movie: PropTypes.object.isRequired
  }

  static fragments = {
    movie: gql`
      fragment MovieInfo on MovieNode {
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
    `
  }

  render() {
    return (
      <div styleName="info">
        <span styleName="year">
          {this.props.movie.year}
        </span>
        <span styleName="genres">
          {this.props.movie.genres.map(item => item.name).join(', ')}
        </span>
        <span styleName="countries">
          {this.props.movie.countries.map((item, i) => (
            <span key={item.name}>
              {i > 0 ? ', ' : ''}
              <CountryFlag country={item}/>
              {item.name}
            </span>
          ))}
        </span>
        <span styleName="runtime">
          <i/>{humanizeDuration(this.props.movie.runtime * 60 * 1000)}
        </span>
        <span styleName="languages">
          {this.props.movie.languages.map(item => item.name).join(', ')}
        </span>
      </div>
    )
  }
}
