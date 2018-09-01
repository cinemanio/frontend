// @flow
import React from 'react'
import { graphql, compose } from 'react-apollo'
import { translate } from 'react-i18next'
import { PropTypes } from 'prop-types'
import gql from 'graphql-tag'
import _ from 'lodash'

import { getConfigObject } from 'components/ObjectListPage/ObjectList/ObjectList'
import ObjectListPage from 'components/ObjectListPage/ObjectListPage'
import ActiveFilters from 'components/ObjectListPage/ActiveFilters/ActiveFilters'
import SelectFilter from 'components/ObjectListPage/SelectFilter/SelectFilter'
import SelectGeneric from 'components/ObjectListPage/SelectGeneric/SelectGeneric'
import FieldSection from 'components/ObjectListPage/FieldSection/FieldSection'
import MovieRelations from 'components/MoviePage/MovieRelations/MovieRelations'
import i18n from 'libs/i18n'

import MovieShort from './MovieShort/MovieShort'
import MovieFull from './MovieFull/MovieFull'

type Props = {
  data: Object,
  genreData: Object,
  countryData: Object,
  i18n: Object,
}

type State = {
  relation: ?string,
  genres: Set<string>,
  countries: Set<string>,
  view: 'short' | 'full',
  orderBy: string,
}

@translate()
class MoviesPage extends React.Component<Props, State> {
  static propTypes = {
    i18n: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    genreData: PropTypes.object.isRequired,
    countryData: PropTypes.object.isRequired,
  }

  static defaults = {
    orderBy: 'relations_count__like',
  }

  constructor(props: Object) {
    super(props)
    this.state = {
      relation: null,
      genres: new Set([]),
      countries: new Set([]),
      view: 'short',
      ...MoviesPage.defaults,
    }
  }

  rowHeight: number = 80

  getVariables = () => ({
    relation: this.state.relation,
    genres: [...this.state.genres],
    countries: [...this.state.countries],
    orderBy: this.state.orderBy,
  })

  getViewOptions = () => ([
    { id: 'short', name: this.props.i18n.t('filter.view.short') },
    // { id: 'full', name: this.props.i18n.t('filter.view.full') },
  ])

  getOrderByOptions = () => ([
    { id: 'year', name: this.props.i18n.t('filter.orderBy.year') },
    { id: 'relations_count__like', name: this.props.i18n.t('filter.orderBy.like') },
    { id: 'relations_count__dislike', name: this.props.i18n.t('filter.orderBy.dislike') },
  ])

  getRelationFilterOptions = () => MovieRelations.codes.map(code => ({
    id: code,
    [`name${_.capitalize(this.props.i18n.language)}`]: this.props.i18n.t(`filter.relation.${code}`),
  }))

  renderMovie = ({ movie }) => {
    if (this.state.view === 'short') {
      return <MovieShort movie={movie}/>
    } else if (this.state.view === 'full') {
      return <MovieFull movie={movie}/>
    } else {
      throw Error('Wrong value of state.view')
    }
  }

  renderFilters = (refreshList: Function) => (
    <div>
      <FieldSection title={this.props.i18n.t('filter.view.sectionTitle')}>
        <SelectGeneric
          code="view"
          list={this.getViewOptions()}
          filters={this.state}
          setFilterState={params => this.setState(params, refreshList)}
        />
      </FieldSection>
      <FieldSection title={this.props.i18n.t('filter.orderBy.sectionTitle')}>
        <SelectGeneric
          code="orderBy"
          list={this.getOrderByOptions()}
          filters={this.state}
          setFilterState={params => this.setState(params, refreshList)}
        />
      </FieldSection>
      <FieldSection title={this.props.i18n.t('filter.sectionTitle')}>
        <SelectFilter
          code="relation"
          title={this.props.i18n.t('filter.relation.sectionTitle')}
          list={this.getRelationFilterOptions()}
          filters={this.state}
          setFilterState={params => this.setState(params, refreshList)}
        />
        <SelectFilter
          code="genres"
          title={this.props.i18n.t('filter.genres')}
          list={this.props.genreData.list}
          filters={this.state}
          setFilterState={params => this.setState(params, refreshList)}
          multiple
        />
        <SelectFilter
          code="countries"
          title={this.props.i18n.t('filter.countries')}
          list={this.props.countryData.list}
          filters={this.state}
          setFilterState={params => this.setState(params, refreshList)}
          multiple
        />
      </FieldSection>
    </div>
  )

  renderActiveFilters = (refreshList: Function) => (
    <span>
      <ActiveFilters
        code="relation"
        list={this.getRelationFilterOptions()}
        filters={this.state}
        setFilterState={params => this.setState(params, refreshList)}
      />
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
        title={this.props.i18n.t('title.movies')}
        renderFilters={this.renderFilters}
        renderActiveFilters={this.renderActiveFilters}
        noResultsMessage={this.props.i18n.t('nothingFound.movies')}
        renderItem={this.renderMovie}
        getVariables={this.getVariables}
        data={this.props.data}
        rowHeight={this.rowHeight}
      />
    )
  }
}

export const MoviesQuery = gql`
  query Movies($first: Int!, $after: String, $genres: [ID!], $countries: [ID!], $relation: String, $orderBy: String) {
    list: movies(
      first: $first, 
      after: $after,
      genres: $genres,
      countries: $countries,
      relation: $relation,
      orderBy: $orderBy
    ) {
      totalCount
      edges {
        movie: node {
          ...MovieShort
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
  ${MovieShort.fragments.movie}
`

export const GenresQuery = gql`
  query Genres {
    list: genres {
      id
      ${i18n.gql('name')}
    }
  }
`

export const CountryQuery = gql`
  query Countries {
    list: countries {
      id
      ${i18n.gql('name')}
    }
  }
`

export default compose(
  graphql(GenresQuery, { name: 'genreData' }),
  graphql(CountryQuery, { name: 'countryData' }),
  graphql(MoviesQuery, getConfigObject(MoviesPage.defaults)),
)(MoviesPage)
