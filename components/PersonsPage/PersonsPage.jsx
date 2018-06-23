// @flow
import React from 'react'
import { graphql, compose } from 'react-apollo'
import { PropTypes } from 'prop-types'
import gql from 'graphql-tag'
import _ from 'lodash'

import { getConfigObject } from 'components/ObjectListPage/ObjectList/ObjectList'
import ObjectListPage from 'components/ObjectListPage/ObjectListPage'
import ActiveFilters from 'components/ObjectListPage/ActiveFilters/ActiveFilters'
import SelectFilter from 'components/ObjectListPage/SelectFilter/SelectFilter'
import SelectGeneric from 'components/ObjectListPage/SelectGeneric/SelectGeneric'
import FieldSection from 'components/ObjectListPage/FieldSection/FieldSection'
import PersonRelations from 'components/PersonPage/PersonRelations/PersonRelations'
import i18n from 'libs/i18n'

import PersonShort from './PersonShort/PersonShort'

type Props = {
  data: Object,
  roleData: Object,
  countryData: Object,
}

type State = {
  relation: ?string,
  roles: Set<string>,
  country: string,
  view: 'short' | 'full',
  orderBy: string,
}

class PersonsPage extends React.Component<Props, State> {
  static propTypes = {
    data: PropTypes.object.isRequired,
    roleData: PropTypes.object.isRequired,
    countryData: PropTypes.object.isRequired,
  }

  static contextTypes = {
    i18n: PropTypes.object.isRequired,
  }

  static defaults = {
    orderBy: 'relations_count__like',
  }

  constructor(props: Object) {
    super(props)
    this.state = {
      relation: null,
      roles: new Set([]),
      country: '',
      view: 'short',
      ...PersonsPage.defaults,
    }
  }

  rowHeight: number = 80

  getVariables = () => ({
    relation: this.state.relation,
    roles: [...this.state.roles],
    country: this.state.country,
    orderBy: this.state.orderBy,
  })

  get viewOptions() {
    return [
      { id: 'short', name: this.context.i18n.t('filter.view.short') },
      // { id: 'full', name: this.context.i18n.t('filter.view.full') }
    ]
  }

  get orderByOptions() {
    return [
      { id: 'relations_count__like', name: this.context.i18n.t('filter.orderBy.like') },
      { id: 'relations_count__dislike', name: this.context.i18n.t('filter.orderBy.dislike') },
    ]
  }

  get relationFilterOptions() {
    return PersonRelations.codes.map(code => ({
      id: code,
      [`name${_.capitalize(this.context.i18n.language)}`]: this.context.i18n.t(`filter.relation.${code}`),
    }))
  }

  renderPerson = ({ person }) => {
    if (this.state.view === 'short') {
      return <PersonShort person={person}/>
    } else if (this.state.view === 'full') {
      return <PersonShort person={person}/>
    } else {
      throw Error('Wrong value of state.view')
    }
  }

  renderFilters = (refreshList: Function) => (
    <div>
      <FieldSection title={this.context.i18n.t('filter.view.sectionTitle')}>
        <SelectGeneric
          code="view"
          list={this.viewOptions}
          filters={this.state}
          setFilterState={params => this.setState(params, refreshList)}
        />
      </FieldSection>
      <FieldSection title={this.context.i18n.t('filter.orderBy.sectionTitle')}>
        <SelectGeneric
          code="orderBy"
          list={this.orderByOptions}
          filters={this.state}
          setFilterState={params => this.setState(params, refreshList)}
        />
      </FieldSection>
      <FieldSection title={this.context.i18n.t('filter.sectionTitle')}>
        <SelectFilter
          code="relation"
          title={this.context.i18n.t('filter.relation.sectionTitle')}
          list={this.relationFilterOptions}
          filters={this.state}
          setFilterState={params => this.setState(params, refreshList)}
        />
        <SelectFilter
          code="roles"
          title={this.context.i18n.t('filter.roles')}
          list={this.props.roleData.list}
          filters={this.state}
          setFilterState={params => this.setState(params, refreshList)}
          multiple
        />
        <SelectFilter
          code="country"
          title={this.context.i18n.t('filter.country')}
          list={this.props.countryData.list}
          filters={this.state}
          setFilterState={params => this.setState(params, refreshList)}
        />
      </FieldSection>
    </div>
  )

  renderActiveFilters = (refreshList: Function) => (
    <span>
      <ActiveFilters
        code="relation"
        list={this.relationFilterOptions}
        filters={this.state}
        setFilterState={params => this.setState(params, refreshList)}
      />
      <ActiveFilters
        code="roles"
        list={this.props.roleData.list}
        filters={this.state}
        setFilterState={params => this.setState(params, refreshList)}
        multiple
      />
      <ActiveFilters
        code="country"
        list={this.props.countryData.list}
        filters={this.state}
        setFilterState={params => this.setState(params, refreshList)}
      />
    </span>
  )

  render() {
    return (
      <ObjectListPage
        title={this.context.i18n.t('title.persons')}
        renderFilters={this.renderFilters}
        renderActiveFilters={this.renderActiveFilters}
        noResultsMessage={this.context.i18n.t('nothingFound.persons')}
        renderItem={this.renderPerson}
        getVariables={this.getVariables}
        data={this.props.data}
        rowHeight={this.rowHeight}
      />
    )
  }
}

export const PersonsQuery = gql`
  query Persons($first: Int!, $after: String, $roles: [ID!], $country: ID, $relation: String, $orderBy: String) {
    list: persons(
      first: $first,
      after: $after,
      roles: $roles,
      country: $country,
      relation: $relation,
      orderBy: $orderBy
    ) {
      totalCount
      edges {
        person: node {
          ...PersonShort
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
  ${PersonShort.fragments.person}
`

export const RolesQuery = gql`
  query Roles {
    list: roles {
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
  graphql(RolesQuery, { name: 'roleData' }),
  graphql(CountryQuery, { name: 'countryData' }),
  graphql(PersonsQuery, getConfigObject(PersonsPage.defaults)),
)(PersonsPage)
