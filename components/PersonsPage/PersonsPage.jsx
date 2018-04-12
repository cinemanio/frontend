// @flow
import React from 'react'
import { graphql } from 'react-apollo'
import { PropTypes } from 'prop-types'
import gql from 'graphql-tag'

import { configObject } from 'components/ObjectList/ObjectList'
import ObjectsPage from 'components/ObjectsPage/ObjectsPage'
import PersonLink from 'components/PersonLink/PersonLink'

type Props = { data: Object }
type State = {}

class PersonsPage extends React.Component<Props, State> {
  static propTypes = {
    data: PropTypes.object.isRequired
  }

  constructor(props: Object) {
    super(props)
    this.state = {}
  }

  rowHeight: number = 20

  getVariables = () => ({})

  renderPerson = ({ person }) => <PersonLink person={person}/>

  renderFilters = (setFilter: Function) => (<div/>)

  renderActiveFilters = (removeFilter: Function) => (<span/>)

  render() {
    return (
      <ObjectsPage
        title="Persons"
        renderFilters={this.renderFilters}
        renderActiveFilters={this.renderActiveFilters}
        noResultsMessage="There is no such persons. Try to change search parameters."
        renderItem={this.renderPerson}
        getVariables={this.getVariables}
        setFilterState={(params, callback) => this.setState(params, callback)}
        filters={this.state}
        data={this.props.data}
        rowHeight={this.rowHeight}
      />
    )
  }
}

const PersonsQuery = gql`
  query Persons($first: Int!, $after: String){
    list: persons(first: $first, after: $after) {
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

export default graphql(PersonsQuery, configObject)(PersonsPage)
