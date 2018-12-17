// @flow
import React from 'react'
import { Helmet } from 'react-helmet'
import { PropTypes } from 'prop-types'
import { Row, Col } from 'antd'
import _ from 'lodash'

import ObjectList from './ObjectList/ObjectList'
import Pagination from './Pagination/Pagination'

import './ObjectListPage.scss'

type Props = {
  data: Object,
  getVariables: Function,
  renderActiveFilters: Function,
  renderFilters: Function,
  title: string,
}

type State = {
  page: number,
}

export default class ObjectListPage extends React.Component<Props, State> {
  static propTypes = {
    data: PropTypes.object.isRequired,
    getVariables: PropTypes.func.isRequired,
    renderActiveFilters: PropTypes.func.isRequired,
    renderFilters: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
  }

  constructor(props: Object) {
    super(props)
    this.state = {
      page: 0,
    }
  }

  refreshList = () =>
    this.props.data.fetchMore({
      variables: this.props.getVariables(),
      updateQuery: (previousResult, { fetchMoreResult }) => ({
        list: {
          totalCount: fetchMoreResult.list.totalCount,
          edges: fetchMoreResult.list.edges,
          pageInfo: fetchMoreResult.list.pageInfo,
        },
      }),
    })

  updatePage = (page: number) => this.setState({ page })

  render() {
    const props = _.omit(this.props, ['title', 'renderFilters', 'renderActiveFilters', 'setFilterState'])
    return (
      <Row type="flex" styleName="box">
        <Helmet>
          <title>{this.props.title}</title>
          <body className="list" />
        </Helmet>
        <Col sm={16} md={18} lg={20} styleName="list">
          <div styleName="caption">
            <Pagination page={this.state.page} data={this.props.data} />
            {this.props.renderActiveFilters(this.refreshList)}
          </div>
          <ObjectList updatePage={this.updatePage} getVariables={this.props.getVariables} {...props} />
        </Col>
        <Col sm={8} md={6} lg={4} styleName="filters">
          <div>{this.props.renderFilters(this.refreshList)}</div>
        </Col>
      </Row>
    )
  }
}
