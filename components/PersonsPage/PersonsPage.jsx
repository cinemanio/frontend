// @flow
import React from 'react'
import { graphql, compose } from 'react-apollo'
import { PropTypes } from 'prop-types'
import gql from 'graphql-tag'

import { configObject } from 'components/ObjectListPage/ObjectList/ObjectList'
import ObjectListPage from 'components/ObjectListPage/ObjectListPage'
import ActiveFilters from 'components/ObjectListPage/ActiveFilters/ActiveFilters'
import SelectFilter from 'components/ObjectListPage/SelectFilter/SelectFilter'
import PersonLink from 'components/PersonLink/PersonLink'

type Props = {
  data: Object,
  roleData: Object,
  countryData: Object,
}

type State = {
  roles: Set<string>,
  country: string,
}

class PersonsPage extends React.Component<Props, State> {
  static propTypes = {
    data: PropTypes.object.isRequired,
    roleData: PropTypes.object.isRequired,
    countryData: PropTypes.object.isRequired
  }

  constructor(props: Object) {
    super(props)
    this.state = {
      roles: new Set([]),
      country: ''
    }
  }

  rowHeight: number = 20

  getVariables = () => ({
    roles: [...this.state.roles],
    country: this.state.country
  })

  renderPerson = ({ person }) => <PersonLink person={person}/>

  renderFilters = (refreshList: Function) => (
    <div>
      <SelectFilter
        code="roles"
        title="Role"
        list={this.props.roleData.list}
        filters={this.state}
        setFilterState={params => this.setState(params, refreshList)}
        multiple
      />
      <SelectFilter
        code="country"
        title="Country"
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
        title="Persons"
        renderFilters={this.renderFilters}
        renderActiveFilters={this.renderActiveFilters}
        noResultsMessage="There is no such persons. Try to change search parameters."
        renderItem={this.renderPerson}
        getVariables={this.getVariables}
        data={this.props.data}
        rowHeight={this.rowHeight}
      />
    )
  }
}

const PersonsQuery = gql`
  query Persons($first: Int!, $after: String, $roles: [ID!], $country: ID) {
    list: persons(first: $first, after: $after, roles: $roles, country: $country) {
      totalCount
      edges {
        person: node {
          id
          ...PersonLink
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
  ${PersonLink.fragments.person}
`

const RolesQuery = gql`
  query Roles {
    list: roles {
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
  graphql(RolesQuery, { name: 'roleData' }),
  graphql(CountryQuery, { name: 'countryData' }),
  graphql(PersonsQuery, configObject)
)(PersonsPage)
