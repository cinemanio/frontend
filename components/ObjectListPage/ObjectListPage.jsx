// @flow
import React from 'react'
import { Helmet } from 'react-helmet'
import { PropTypes } from 'prop-types'
import _ from 'lodash'

import ObjectList from './ObjectList/ObjectList'
import Pagination from './Pagination/Pagination'

import './ObjectListPage.scss'

type Props = {
  data: Object,
  filters: Object,
  getVariables: Function,
  renderActiveFilters: Function,
  renderFilters: Function,
  setFilterState: Function,
  rowHeight: number,
  title: string,
}

type State = {
  // orderBy: string,
  scrollOffset: number,
}

export default class ObjectListPage extends React.Component<Props, State> {
  static propTypes = {
    data: PropTypes.object.isRequired,
    filters: PropTypes.object.isRequired,
    getVariables: PropTypes.func.isRequired,
    setFilterState: PropTypes.func.isRequired,
    renderActiveFilters: PropTypes.func.isRequired,
    renderFilters: PropTypes.func.isRequired,
    rowHeight: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired
  }

  constructor(props: Object) {
    super(props)
    this.state = {
      scrollOffset: 0
      // orderBy: ''
    }
  }

  setFilter = (name: string, value: string) => {
    const filter = this.props.filters[name]
    filter.add(value)
    this.props.setFilterState({ [name]: filter }, this.refreshList)
  }

  removeFilter = (name: string, value: string) => {
    const filter = this.props.filters[name]
    filter.delete(value)
    this.props.setFilterState({ [name]: filter }, this.refreshList)
  }

  refreshList = () => {
    this.props.data.fetchMore({
      variables: this.props.getVariables(),
      updateQuery: (previousResult, { fetchMoreResult }) => ({
        list: {
          totalCount: fetchMoreResult.list.totalCount,
          edges: fetchMoreResult.list.edges,
          pageInfo: fetchMoreResult.list.pageInfo
        }
      })
    })
  }

  onScroll = ({ clientHeight, scrollTop }: Object) => {
    this.setState({
      scrollOffset: Math.floor(scrollTop / this.props.rowHeight) + Math.floor(clientHeight / this.props.rowHeight)
    })
  }

  render() {
    const props = _.omit(this.props, ['title', 'renderFilters', 'renderActiveFilters', 'setFilterState'])
    return (
      <div styleName="box">
        <Helmet>
          <title>{this.props.title}</title>
          <body className="list"/>
        </Helmet>
        <div styleName="list">
          <div styleName="caption">
            <Pagination page={this.state.scrollOffset} data={this.props.data}/>
            {this.props.renderActiveFilters(this.removeFilter)}
          </div>
          <ObjectList
            onScroll={this.onScroll}
            {...props}
          />
        </div>
        <div styleName="filters">
          <div>
            {this.props.renderFilters(this.setFilter)}
          </div>
        </div>
      </div>
    )
  }
}
