// @flow
import React from 'react'
import { graphql, compose } from 'react-apollo'
import { withTranslation } from 'react-i18next'
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
import PersonRelations from 'components/PersonPage/PersonRelations/PersonRelations'
import i18n from 'libs/i18n'
import User from 'stores/User'

import PersonShort from './PersonShort/PersonShort'

type Props = {
  data: Object,
  roleData: Object,
  countryData: Object,
  i18n: Object,
  alert: Object,
  user: typeof User,
}

type State = {
  relation: ?string,
  roles: Set<string>,
  country: string,
  view: 'short' | 'full',
  orderBy: string,
}

@withAlert
@inject('user')
@withTranslation()
class PersonsPage extends React.Component<Props, State> {
  static defaultProps = {
    user: User,
    alert: {},
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    roleData: PropTypes.object.isRequired,
    countryData: PropTypes.object.isRequired,
    user: MobxPropTypes.observableObject,
    alert: PropTypes.object,
  }

  static variables: Object

  static queries: Object

  state = {
    relation: null,
    roles: new Set([]),
    country: '',
    view: 'short',
    orderBy: '-relations_count__like',
  }

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
      { id: '-relations_count__like', name: this.props.i18n.t('filter.orderBy.like') },
      { id: '-relations_count__dislike', name: this.props.i18n.t('filter.orderBy.dislike') },
    ]
  }

  get relationFilterOptions() {
    return PersonRelations.codes.map(code => ({
      id: code,
      [`name${_.capitalize(this.props.i18n.language)}`]: this.props.i18n.t(`filter.relations.${code}`),
    }))
  }

  renderFilters(refreshList: Function) {
    return (
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
            title={this.props.i18n.t('filter.relations.sectionTitle')}
            list={this.relationFilterOptions}
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
  }

  renderActiveFilters(refreshList: Function) {
    return (
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
  }

  renderPerson(person: Object) {
    if (this.state.view === 'short') {
      return <PersonShort person={person} />
    } else if (this.state.view === 'full') {
      return <PersonShort person={person} />
    } else {
      throw Error('Wrong value of state.view')
    }
  }

  render() {
    return (
      <ObjectListPage
        title={this.props.i18n.t('title.persons')}
        renderFilters={refreshList => this.renderFilters(refreshList)}
        renderActiveFilters={refreshList => this.renderActiveFilters(refreshList)}
        renderItem={({ person }) => this.renderPerson(person)}
        noResultsMessage={this.props.i18n.t('nothingFound.persons')}
        getVariables={this.getVariables}
        data={this.props.data}
        view={this.state.view}
      />
    )
  }
}

// static vars should be defined outside, because of @withAlert decorator
const configObject = getConfigObject({ orderBy: '-relations_count__like' })
PersonsPage.variables = { persons: configObject.options().variables }
PersonsPage.queries = {
  persons: gql`
    query Persons($first: Int!, $after: String, $roles: [ID!], $country: ID, $relation: String, $orderBy: String) {
      list: persons(
        first: $first
        after: $after
        roles: $roles
        country: $country
        relation: $relation
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
  `,
}

export default compose(
  graphql(PersonsPage.queries.roles, { name: 'roleData' }),
  graphql(PersonsPage.queries.countries, { name: 'countryData' }),
  graphql(PersonsPage.queries.persons, configObject)
)(PersonsPage)
