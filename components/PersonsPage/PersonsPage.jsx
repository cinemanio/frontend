// @flow
import React from 'react'
import { graphql, compose } from 'react-apollo'
import { PropTypes } from 'prop-types'
import gql from 'graphql-tag'

import { getConfigObject } from 'components/ObjectListPage/ObjectList/ObjectList'
import ObjectListPage from 'components/ObjectListPage/ObjectListPage'
import ActiveFilters from 'components/ObjectListPage/ActiveFilters/ActiveFilters'
import SelectFilter from 'components/ObjectListPage/SelectFilter/SelectFilter'
import SelectGeneric from 'components/ObjectListPage/SelectGeneric/SelectGeneric'
import i18n from 'libs/i18n'

import PersonShort from './PersonShort/PersonShort'

type Props = {
  data: Object,
  roleData: Object,
  countryData: Object,
}

type State = {
  roles: Set<string>,
  country: string,
  view: 'short' | 'full',
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

  constructor(props: Object) {
    super(props)
    this.state = {
      roles: new Set([]),
      country: '',
      view: 'short',
    }
  }

  rowHeight: number = 80

  getVariables = () => ({
    roles: [...this.state.roles],
    country: this.state.country
  })

  get viewOptions() {
    return [
      { id: 'short', name: this.context.i18n.t('filter.view.short') },
      // { id: 'full', name: this.context.i18n.t('filter.view.full') }
    ]
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
      <SelectGeneric
        code="view"
        list={this.viewOptions}
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
    </div>
  )

  renderActiveFilters = (refreshList: Function) => (
    <span>
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
  query Persons($first: Int!, $after: String, $roles: [ID!], $country: ID) {
    list: persons(first: $first, after: $after, roles: $roles, country: $country) {
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
  graphql(PersonsQuery, getConfigObject())
)(PersonsPage)
