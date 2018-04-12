// @flow
import React from 'react'
import { graphql, compose } from 'react-apollo'
import { Helmet } from 'react-helmet'
import { PropTypes } from 'prop-types'
import gql from 'graphql-tag'

import ObjectList, { configObject } from 'components/ObjectList/ObjectList'
import MovieLink from 'components/MovieLink/MovieLink'

import ActiveFilters from './ActiveFilters/ActiveFilters'
import SelectFilter from './SelectFilter/SelectFilter'
import Pagination from './Pagination/Pagination'

import './MoviesPage.scss'

type Props = {
  data: Object,
  genreData: Object,
  countryData: Object,
}

type State = {
  genres: Set<string>,
  countries: Set<string>,
  orderBy: string,
  scrollOffset: number,
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
      scrollOffset: 0,
      genres: new Set([]),
      countries: new Set([]),
      orderBy: ''
    }
  }

  rowHeight: number = 20

  setFilter = (name: string, value: string) => {
    const filter = this.state[name]
    filter.add(value)
    this.setState({ [name]: filter }, this.refreshList)
  }

  removeFilter = (name: string, value: string) => {
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

  renderMovie = ({ movie }) => <MovieLink movie={movie}/>

  get filters() {
    return {
      genres: { title: 'Genre', list: this.props.genreData.genres },
      countries: { title: 'Country', list: this.props.countryData.countries }
    }
  }

  onScroll = ({ clientHeight, scrollTop }) => {
    this.setState({ scrollOffset: Math.floor(scrollTop / this.rowHeight) + (clientHeight / this.rowHeight) })
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>Movies</title>
        </Helmet>
        <div styleName="filters">
          <div>
            <SelectFilter
              code="genres" title="Genre" list={this.props.genreData.genres}
              setFilter={this.setFilter} active={[...this.state.genres]}/>
            <SelectFilter
              code="countries" title="Country" list={this.props.countryData.countries}
              setFilter={this.setFilter} active={[...this.state.countries]}/>
          </div>
        </div>
        <div styleName="caption">
          <Pagination page={this.state.scrollOffset} data={this.props.data}/>
          <ActiveFilters
            code="genres" list={this.props.genreData.genres}
            removeFilter={this.removeFilter} active={[...this.state.genres]}/>
          <ActiveFilters
            code="countries" list={this.props.countryData.countries}
            removeFilter={this.removeFilter} active={[...this.state.countries]}/>
        </div>
        <ObjectList
          noResultsMessage="There is no such movies. Try to change search parameters."
          renderItem={this.renderMovie}
          data={this.props.data}
          rowHeight={this.rowHeight}
          onScroll={this.onScroll}
        />
      </div>
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
