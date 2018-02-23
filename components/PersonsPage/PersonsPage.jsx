// @flow
import React from 'react'
import { graphql } from 'react-apollo'
import { PropTypes } from 'prop-types'
import gql from 'graphql-tag'

import Menu from '../../components/Menu/Menu'
import ObjectList from '../../components/ObjectList/ObjectList'
import { configObject } from '../../components/ObjectList/ObjectList'
import PersonLink from '../../components/PersonLink/PersonLink'

type Props = { data: Object }

class PersonsPage extends React.PureComponent<Props> {
  static propTypes = {
    data: PropTypes.object.isRequired
  }

  renderPerson = ({ person }) => <PersonLink person={person}/>

  render() {
    return (
      <div>
        <Menu active="person"/>
        <ObjectList
          noResultsMessage="There is no such persons. Try to change search parameters."
          renderItem={this.renderPerson}
          data={this.props.data}
        />
      </div>
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
