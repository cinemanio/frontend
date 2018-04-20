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
    genres: [...this.state.genres],
    countries: [...this.state.countries]
  })

  renderMovie = ({ movie }) => <MovieLink movie={movie}/>

  renderFilters = (refreshList: Function) => (
    <div>
      <SelectFilter
        code="genres"
        title="Genre"
        list={this.props.genreData.list}
        filters={this.state}
        setFilterState={params => this.setState(params, refreshList)}
        multiple
      />
      <SelectFilter
        code="countries"
        title="Country"
        list={this.props.countryData.list}
        filters={this.state}
        setFilterState={params => this.setState(params, refreshList)}
        multiple
      />
    </div>
  )

  renderActiveFilters = (refreshList: Function) => (
    <span>
      <ActiveFilters
        code="genres"
        list={this.props.genreData.list}
        filters={this.state}
        setFilterState={params => this.setState(params, refreshList)}
        multiple
      />
      <ActiveFilters
        code="countries"
        list={this.props.countryData.list}
        filters={this.state}
        setFilterState={params => this.setState(params, refreshList)}
        multiple
      />
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
