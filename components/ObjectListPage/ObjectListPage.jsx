// @flow
import React from 'react'
import { Helmet } from 'react-helmet'
import { PropTypes } from 'prop-types'
import { Row, Col } from 'antd'

import ObjectList, { type Props as ObjectListProps } from './ObjectList/ObjectList'
import Pagination from './Pagination/Pagination'

import './ObjectListPage.scss'

type ObjectListPageProps = {
  renderActiveFilters: Function,
  renderFilters: Function,
  title: string,
}
type InjectedProps = { updatePage: Function }
type Props = $Diff<ObjectListProps, InjectedProps> & ObjectListPageProps
type State = { page: number }

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
      updateQuery: (previousResult, { fetchMoreResult }) => fetchMoreResult,
    })

  updatePage = (page: number) => this.setState({ page })

  render() {
    const { title, renderFilters, renderActiveFilters, ...props } = this.props
    return (
      <Row type="flex" styleName="box">
        <Helmet>
          <title>{title}</title>
          <body className="list" />
        </Helmet>
        <Col sm={16} md={18} lg={20}>
          <div styleName="caption">
            <Pagination page={this.state.page} data={this.props.data} />
            {renderActiveFilters(this.refreshList)}
          </div>
          <ObjectList updatePage={this.updatePage} {...props} />
        </Col>
        <Col sm={8} md={6} lg={4} styleName="filters">
          <div>{renderFilters(this.refreshList)}</div>
        </Col>
      </Row>
    )
  }
}
