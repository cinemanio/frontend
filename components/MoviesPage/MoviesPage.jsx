// @flow
import React from 'react'
import { graphql, compose } from 'react-apollo'
import { PropTypes } from 'prop-types'
import gql from 'graphql-tag'

import { configObject } from 'components/ObjectList/ObjectList'
import ObjectsPage from 'components/ObjectsPage/ObjectsPage'
import ActiveFilters from 'components/ObjectsPage/ActiveFilters/ActiveFilters'
import SelectFilter from 'components/ObjectsPage/SelectFilter/SelectFilter'
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
  //     genres: { title: 'Genre', list: this.props.genreData.genres },
  //     countries: { title: 'Country', list: this.props.countryData.countries }
  //   }
  // }

  renderFilters = (setFilter: Function) => (
    <div>
      <SelectFilter
        code="genres" title="Genre" list={this.props.genreData.genres}
        setFilter={setFilter} active={[...this.state.genres]} multiple/>
      <SelectFilter
        code="countries" title="Country" list={this.props.countryData.countries}
        setFilter={setFilter} active={[...this.state.countries]} multiple/>
    </div>
  )

  renderActiveFilters = (removeFilter: Function) => (
    <span>
      <ActiveFilters
        code="genres" list={this.props.genreData.genres}
        removeFilter={removeFilter} active={[...this.state.genres]}/>
      <ActiveFilters
        code="countries" list={this.props.countryData.countries}
        removeFilter={removeFilter} active={[...this.state.countries]}/>
    </span>
  )

  render() {
    return (
      <ObjectsPage
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
  graphql(GenresQuery, { name: 'genreData' }),
  graphql(CountryQuery, { name: 'countryData' }),
  graphql(MoviesQuery, configObject)
)(MoviesPage)
