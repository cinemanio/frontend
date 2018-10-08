// @flow
import React from 'react'
import { List } from 'react-virtualized'
import { PropTypes } from 'prop-types'
import _ from 'lodash'

type Props = {
  renderNoResults: Function,
  renderItem: Function,
  data: Object,
  updatePage: Function,
  onRowsRendered: Function,
  itemCount: number,
}

export default class ObjectListRow extends React.Component<Props> {
  static propTypes = {
    data: PropTypes.object.isRequired,
    itemCount: PropTypes.number.isRequired,
    onRowsRendered: PropTypes.func.isRequired,
    renderNoResults: PropTypes.func.isRequired,
    renderItem: PropTypes.func.isRequired,
    updatePage: PropTypes.func.isRequired,
  }

  /**
   * Height of small preview
   * @type {number}
   */
  rowHeight: number = 80

  onScrollList = ({ clientHeight, scrollTop }: Object) => {
    const margin = 20
    const page = Math.ceil(scrollTop / this.rowHeight) + Math.floor((clientHeight + margin) / this.rowHeight)
    this.props.updatePage(page)
  }

  render() {
    const props = _.omit(this.props, ['itemCount', 'renderItem', 'updatePage', 'data'])
    return (
      <List
        noRowsRenderer={this.props.renderNoResults}
        onScroll={this.onScrollList}
        rowRenderer={this.props.renderItem}
        rowHeight={this.rowHeight}
        rowCount={this.props.itemCount}
        overscanRowCount={0}
        _forceUpdateWhenChanged={this.props.data} // autoupdate when changing order
        {...props}
      />
    )
  }
}
