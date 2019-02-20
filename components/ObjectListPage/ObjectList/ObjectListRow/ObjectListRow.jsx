// @flow
import React from 'react'
import { List } from 'react-virtualized'
import { PropTypes } from 'prop-types'

type Props = {
  renderNoResults: Function,
  renderItem: Function,
  data: Object,
  updatePage: Function,
  onRowsRendered: Function,
  itemCount: number,
}

export default class ObjectListRow extends React.PureComponent<Props> {
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

  onScrollList = (updatePage: Function) => ({ clientHeight, scrollTop }: Object) => {
    const margin = 20
    const page = Math.ceil(scrollTop / this.rowHeight) + Math.floor((clientHeight + margin) / this.rowHeight)
    updatePage(page)
  }

  render() {
    const { itemCount, renderItem, updatePage, data, renderNoResults, ...props } = this.props
    return (
      <List
        noRowsRenderer={renderNoResults}
        onScroll={this.onScrollList(updatePage)}
        rowRenderer={renderItem}
        rowHeight={this.rowHeight}
        rowCount={itemCount}
        overscanRowCount={0}
        _forceUpdateWhenChanged={data} // autoupdate when changing order
        {...props}
      />
    )
  }
}
