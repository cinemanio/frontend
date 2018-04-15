// @flow
import React from 'react'
import { graphql, compose } from 'react-apollo'
import { PropTypes } from 'prop-types'
import gql from 'graphql-tag'

import { configObject } from 'components/ObjectListPage/ObjectList/ObjectList'
import ObjectListPage from 'components/ObjectListPage/ObjectListPage'
import ActiveFilters from 'components/ObjectListPage/ActiveFilters/ActiveFilters'
import SelectFilter from 'components/ObjectListPage/SelectFilter/SelectFilter'
import MovieLink from 'components/MovieLink/MovieLink'

import './MoviesPage.scss'

type Props = {
  data: Object,
  genreData: Object,
  countryData: Object,
}

type State = {
  genres: Set<string>,
  countries: Set<string>,
}

class MoviesPage extends React.Component<Props, State> {
  static propTypes = {
    data: PropTypes.object.isRequired,
    genreData: PropTypes.object.isRequired,
    countryData: PropTypes.object.isRequired
  }

  constructor(props: Object) {
    super(props)
    this.state = {
      genres: new Set([]),
      countries: new Set([])
    }
  }

  rowHeight: number = 20

  getVariables = () => ({
    genres: this.state.genres,
    countries: this.state.countries
  })

  renderMovie = ({ movie }) => <MovieLink movie={movie}/>

  // get filters() {
  //   return {
  //     genres: { title: 'Genre', list: this.props.genreData.list },
  //     countries: { title: 'Country', list: this.props.countryData.list }
  //   }
  // }

  renderFilters = (setFilter: Function) => (
    <div>
      <SelectFilter
        code="genres" title="Genre" list={this.props.genreData.list}
        setFilter={setFilter} active={[...this.state.genres]} multiple/>
      <SelectFilter
        code="countries" title="Country" list={this.props.countryData.list}
        setFilter={setFilter} active={[...this.state.countries]} multiple/>
    </div>
  )

  renderActiveFilters = (removeFilter: Function) => (
    <span>
      <ActiveFilters
        code="genres" list={this.props.genreData.list}
        removeFilter={removeFilter} active={[...this.state.genres]}/>
      <ActiveFilters
        code="countries" list={this.props.countryData.list}
        removeFilter={removeFilter} active={[...this.state.countries]}/>
    </span>
  )

  render() {
    return (
      <ObjectListPage
        title="Movies"
        renderFilters={this.renderFilters}
        renderActiveFilters={this.renderActiveFilters}
        noResultsMessage="There is no such movies. Try to change search parameters."
        renderItem={this.renderMovie}
        getVariables={this.getVariables}
        setFilterState={(params, callback) => this.setState(params, callback)}
        filters={this.state}
        data={this.props.data}
        rowHeight={this.rowHeight}
      />
    )
  }
}

const MoviesQuery = gql`
  query Movies($first: Int!, $after: String, $genres: [ID!], $countries: [ID!]) {
    list: movies(first: $first, after: $after, genres: $genres, countries: $countries) {
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
    list: genres {
      id
      name
    }
  }
`

const CountryQuery = gql`
  query Countries {
    list: countries {
      id
      name
    }
  }
`

export default compose(
  graphql(GenresQuery, { name: 'genreData' }),
  graphql(CountryQuery, { name: 'countryData' }),
  graphql(MoviesQuery, configObject)
)(MoviesPage)
