// @flow
import React from 'react'
import { graphql, compose } from 'react-apollo'
import { PropTypes } from 'prop-types'
import gql from 'graphql-tag'
import _ from 'lodash'

import ObjectList, { configObject } from 'components/ObjectList/ObjectList'
import MovieLink from 'components/MovieLink/MovieLink'

type Props = { data: Object }

class MoviesPage extends React.Component<Props> {
  static propTypes = {
    data: PropTypes.object.isRequired,
    genreData: PropTypes.object.isRequired,
    countryData: PropTypes.object.isRequired
  }

  constructor(props: Object) {
    super(props)
    this.state = {
      genres: new Set([]),
      countries: new Set([]),
      orderBy: ''
    }
  }

  setFilter(name: string, value: string) {
    const filter = this.state[name]
    filter.add(value)
    this.setState({ [name]: filter }, this.refreshList)
  }

  removeFilter(name: string, value: string) {
    const filter = this.state[name]
    filter.delete(value)
    this.setState({ [name]: filter }, this.refreshList)
  }

  getVariables = () => ({
    genres: this.state.genres,
    countries: this.state.countries
  })

  refreshList = () => {
    this.props.data.fetchMore({
      variables: this.getVariables(),
      updateQuery: (previousResult, { fetchMoreResult }) => ({
        list: {
          totalCount: fetchMoreResult.list.totalCount,
          edges: fetchMoreResult.list.edges,
          pageInfo: fetchMoreResult.list.pageInfo
        }
      })
    })
  }

  filterBy = (type: string) => (e: Event) => this.setFilter(type, e.target.value)

  renderMovie = ({ movie }) => <MovieLink movie={movie}/>

  renderFilterGenres() {
    return (
      <select name="genre" onChange={this.filterBy('genres')}>
        <option value="">Genre</option>
        {this.props.genreData.genres.map(genre =>
          <option key={genre.id} value={genre.id}>{genre.name}</option>)}
      </select>
    )
  }

  renderFilterCountries() {
    return (
      <select name="country" onChange={this.filterBy('countries')}>
        <option value="">Country</option>
        {this.props.countryData.countries.map(country =>
          <option key={country.id} value={country.id}>{country.name}</option>)}
      </select>
    )
  }

  renderActiveFilters() {
    const filters = []
    _.each(['genres', 'countries'], (filterName: string) => {
      this.state[filterName].forEach((filter: string) => {
        filters.push((<div
          key={`${filterName}-${filter}`}
          onClick={() => this.removeFilter(filterName, filter)}>{filter}</div>))
      })
    })
    return filters
  }

  render() {
    return (
      <div>
        {this.renderActiveFilters()}
        {this.renderFilterGenres()}
        {this.renderFilterCountries()}
        <div>Results: {this.props.data.list.totalCount}</div>
        <ObjectList
          noResultsMessage="There is no such movies. Try to change search parameters."
          renderItem={this.renderMovie}
          data={this.props.data}
        />
      </div>
    )
  }
}

const MoviesQuery = gql`
  query Movies($first: Int!, $after: String, $genres: [ID!]) {
    list: movies(first: $first, after: $after, genres: $genres) {
      totalCount
      edges {
        movie: node {
          id
          ...MovieLink
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
  ${MovieLink.fragments.movie}
`

const GenresQuery = gql`
  query Genres {
    genres {
      id
      name
    }
  }
`

const CountryQuery = gql`
  query Countries {
    countries {
      id
      name
    }
  }
`

export default compose(
  graphql(MoviesQuery, configObject),
  graphql(GenresQuery, { name: 'genreData' }),
  graphql(CountryQuery, { name: 'countryData' })
)(MoviesPage)
