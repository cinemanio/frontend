// @flow
import React from 'react'
import { graphql, compose } from 'react-apollo'
import { translate } from 'react-i18next'
import { PropTypes } from 'prop-types'
import { inject, PropTypes as MobxPropTypes } from 'mobx-react'
import { withAlert } from 'react-alert'
import gql from 'graphql-tag'
import _ from 'lodash'

import { getConfigObject } from 'components/ObjectListPage/ObjectList/ObjectList'
import ObjectListPage from 'components/ObjectListPage/ObjectListPage'
import ActiveFilters from 'components/ObjectListPage/ActiveFilters/ActiveFilters'
import SelectFilter from 'components/ObjectListPage/SelectFilter/SelectFilter'
import SelectGeneric from 'components/ObjectListPage/SelectGeneric/SelectGeneric'
import FieldSection from 'components/ObjectListPage/FieldSection/FieldSection'
import YearsFilter from 'components/ObjectListPage/YearsFilter/YearsFilter'
import type { RangeType } from 'components/ObjectListPage/YearsFilter/YearsFilter'
import MovieRelations from 'components/MoviePage/MovieRelations/MovieRelations'
import i18n from 'libs/i18n'
import User from 'stores/User'

import MovieShort from './MovieShort/MovieShort'
import MovieIcon from './MovieIcon/MovieIcon'
import MovieFull from './MovieFull/MovieFull'

type Props = {
  data: Object,
  genreData: Object,
  countryData: Object,
  i18n: Object,
  alert: Object,
  user: typeof User,
}

type State = {
  relation: ?string,
  genres: Set<string>,
  countries: Set<string>,
  view: 'image' | 'short' | 'full',
  orderBy: string,
  yearsRange: RangeType,
}

@withAlert
@inject('user')
@translate()
class MoviesPage extends React.Component<Props, State> {
  static defaultProps = {
    user: User,
    alert: {},
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    genreData: PropTypes.object.isRequired,
    countryData: PropTypes.object.isRequired,
    user: MobxPropTypes.observableObject,
    alert: PropTypes.object,
  }

  static variables: Object

  static queries: Object

  constructor(props: Object) {
    super(props)
    this.state = this.defaults
  }

  defaults = {
    relation: null,
    genres: new Set([]),
    countries: new Set([]),
    yearsRange: { min: 1900, max: new Date().getFullYear() + 10 },
    view: 'short',
    orderBy: '-relations_count__like',
  }

  getVariables = () => ({
    relation: this.state.relation,
    genres: [...this.state.genres],
    countries: [...this.state.countries],
    orderBy: this.state.orderBy,
    yearMin: this.state.yearsRange.min,
    yearMax: this.state.yearsRange.max,
  })

  getViewOptions = () => [
    { id: 'image', name: this.props.i18n.t('filter.view.poster') },
    { id: 'short', name: this.props.i18n.t('filter.view.short') },
    // { id: 'full', name: this.props.i18n.t('filter.view.full') },
  ]

  getOrderByOptions = () => [
    { id: '-year', name: this.props.i18n.t('filter.orderBy.new') },
    { id: 'year', name: this.props.i18n.t('filter.orderBy.old') },
    { id: '-relations_count__like', name: this.props.i18n.t('filter.orderBy.like') },
    { id: '-relations_count__dislike', name: this.props.i18n.t('filter.orderBy.dislike') },
  ]

  getRelationFilterOptions = () =>
    MovieRelations.codes.map(code => ({
      id: code,
      [`name${_.capitalize(this.props.i18n.language)}`]: this.props.i18n.t(`filter.relations.${code}`),
    }))

  renderMovie = ({ movie }) => {
    if (this.state.view === 'image') {
      return <MovieIcon movie={movie} />
    } else if (this.state.view === 'short') {
      return <MovieShort movie={movie} />
    } else if (this.state.view === 'full') {
      return <MovieFull movie={movie} />
    } else {
      throw Error('Wrong value of state.view')
    }
  }

  setFilterState = refreshList => params => this.setState(params, refreshList)

  renderFilters = (refreshList: Function) => (
    <div>
      <FieldSection title={this.props.i18n.t('filter.view.sectionTitle')}>
        <SelectGeneric
          code="view"
          list={this.getViewOptions()}
          filters={this.state}
          setFilterState={this.setFilterState(refreshList)}
        />
      </FieldSection>
      <FieldSection title={this.props.i18n.t('filter.orderBy.sectionTitle')}>
        <SelectGeneric
          code="orderBy"
          list={this.getOrderByOptions()}
          filters={this.state}
          setFilterState={this.setFilterState(refreshList)}
        />
      </FieldSection>
      <FieldSection title={this.props.i18n.t('filter.sectionTitle')}>
        <SelectFilter
          code="relation"
          title={this.props.i18n.t('filter.relations.sectionTitle')}
          list={this.getRelationFilterOptions()}
          filters={this.state}
          setFilterState={params => {
            if (this.props.user.authenticated) {
              this.setState(params, refreshList)
            } else {
              this.props.alert.error(this.props.i18n.t('filter.relations.authError'))
            }
          }}
        />
        <SelectFilter
          code="genres"
          title={this.props.i18n.t('filter.genres')}
          list={this.props.genreData.list}
          filters={this.state}
          setFilterState={this.setFilterState(refreshList)}
          multiple
        />
        <SelectFilter
          code="countries"
          title={this.props.i18n.t('filter.countries')}
          list={this.props.countryData.list}
          filters={this.state}
          setFilterState={this.setFilterState(refreshList)}
          multiple
        />
        <YearsFilter
          code="yearsRange"
          title={this.props.i18n.t('filter.yearsRange')}
          defaultRange={this.defaults.yearsRange}
          filters={this.state}
          setFilterState={this.setFilterState(refreshList)}
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
        setFilterState={this.setFilterState(refreshList)}
      />
      <ActiveFilters
        code="genres"
        list={this.props.genreData.list}
        filters={this.state}
        setFilterState={this.setFilterState(refreshList)}
        multiple
      />
      <ActiveFilters
        code="countries"
        list={this.props.countryData.list}
        filters={this.state}
        setFilterState={this.setFilterState(refreshList)}
        multiple
      />
      <ActiveFilters
        code="yearsRange"
        filters={this.state}
        default={this.defaults.yearsRange}
        setFilterState={this.setFilterState(refreshList)}
        range
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
        view={this.state.view}
      />
    )
  }
}

// static vars should be defined outside, because of @withAlert decorator
const configObject = getConfigObject({ orderBy: '-relations_count__like' })
MoviesPage.variables = { movies: configObject.options().variables }
MoviesPage.queries = {
  movies: gql`
    query Movies(
      $first: Int!
      $after: String
      $genres: [ID!]
      $countries: [ID!]
      $relation: String
      $orderBy: String
      $yearMin: Float
      $yearMax: Float
    ) {
      list: movies(
        first: $first
        after: $after
        genres: $genres
        countries: $countries
        relation: $relation
        orderBy: $orderBy
        year_Gte: $yearMin
        year_Lte: $yearMax
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
  `,
  genres: gql`
    query Genres {
      list: genres {
        id
        ${i18n.gql('name')}
      }
    }
  `,
  countries: gql`
    query Countries {
      list: countries {
        id
        ${i18n.gql('name')}
      }
    }
  `,
}

export default compose(
  graphql(MoviesPage.queries.genres, { name: 'genreData' }),
  graphql(MoviesPage.queries.countries, { name: 'countryData' }),
  graphql(MoviesPage.queries.movies, configObject)
)(MoviesPage)
