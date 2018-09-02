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
import PersonRelations from 'components/PersonPage/PersonRelations/PersonRelations'
import i18n from 'libs/i18n'

import PersonShort from './PersonShort/PersonShort'

type Props = {
  data: Object,
  roleData: Object,
  countryData: Object,
  i18n: Object,
}

type State = {
  relation: ?string,
  roles: Set<string>,
  country: string,
  view: 'short' | 'full',
  orderBy: string,
}

@translate()
class PersonsPage extends React.Component<Props, State> {
  static propTypes = {
    i18n: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    roleData: PropTypes.object.isRequired,
    countryData: PropTypes.object.isRequired,
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
      { id: 'short', name: this.props.i18n.t('filter.view.short') },
      // { id: 'full', name: this.props.i18n.t('filter.view.full') }
    ]
  }

  get orderByOptions() {
    return [
      { id: 'relations_count__like', name: this.props.i18n.t('filter.orderBy.like') },
      { id: 'relations_count__dislike', name: this.props.i18n.t('filter.orderBy.dislike') },
    ]
  }

  get relationFilterOptions() {
    return PersonRelations.codes.map(code => ({
      id: code,
      [`name${_.capitalize(this.props.i18n.language)}`]: this.props.i18n.t(`filter.relation.${code}`),
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
      <FieldSection title={this.props.i18n.t('filter.view.sectionTitle')}>
        <SelectGeneric
          code="view"
          list={this.viewOptions}
          filters={this.state}
          setFilterState={params => this.setState(params, refreshList)}
        />
      </FieldSection>
      <FieldSection title={this.props.i18n.t('filter.orderBy.sectionTitle')}>
        <SelectGeneric
          code="orderBy"
          list={this.orderByOptions}
          filters={this.state}
          setFilterState={params => this.setState(params, refreshList)}
        />
      </FieldSection>
      <FieldSection title={this.props.i18n.t('filter.sectionTitle')}>
        <SelectFilter
          code="relation"
          title={this.props.i18n.t('filter.relation.sectionTitle')}
          list={this.relationFilterOptions}
          filters={this.state}
          setFilterState={params => this.setState(params, refreshList)}
        />
        <SelectFilter
          code="roles"
          title={this.props.i18n.t('filter.roles')}
          list={this.props.roleData.list}
          filters={this.state}
          setFilterState={params => this.setState(params, refreshList)}
          multiple
        />
        <SelectFilter
          code="country"
          title={this.props.i18n.t('filter.country')}
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
        title={this.props.i18n.t('title.persons')}
        renderFilters={this.renderFilters}
        renderActiveFilters={this.renderActiveFilters}
        noResultsMessage={this.props.i18n.t('nothingFound.persons')}
        renderItem={this.renderPerson}
        getVariables={this.getVariables}
        data={this.props.data}
        rowHeight={this.rowHeight}
      />
    )
  }
}

PersonsPage.queries = {
  persons: gql`
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
  `,
  roles: gql`
    query Roles {
      list: roles {
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
  `
}

const configObject = getConfigObject(PersonsPage.defaults)

PersonsPage.variables = { persons: configObject.options().variables }

export default compose(
  graphql(PersonsPage.queries.roles, { name: 'roleData' }),
  graphql(PersonsPage.queries.countries, { name: 'countryData' }),
  graphql(PersonsPage.queries.persons, configObject),
)(PersonsPage)
