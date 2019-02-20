// @flow
import React from 'react'
import { Collection } from 'react-virtualized'
import { PropTypes } from 'prop-types'

type Props = {
  itemCount: number,
  width: number,
  onRowsRendered: Function,
  renderNoResults: Function,
  renderItem: Function,
  updatePage: Function,
}

export default class ObjectListCell extends React.PureComponent<Props> {
  static propTypes = {
    itemCount: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    onRowsRendered: PropTypes.func.isRequired,
    renderNoResults: PropTypes.func.isRequired,
    renderItem: PropTypes.func.isRequired,
    updatePage: PropTypes.func.isRequired,
  }

  /**
   * Dimension of poster of photo in view=icon
   * TODO: calculate it automatically from styles if possible
   * @type {{width: number, height: number}}
   */
  iconDimensions: Object = { width: 180, height: 250 }

  onScrollImage = (updatePage: Function) => ({ clientWidth, clientHeight, scrollTop }: Object) => {
    const margin = 20
    const { width, height } = this.iconDimensions
    const numberInRow = Math.floor(clientWidth / width)
    const page = (Math.ceil(scrollTop / height) + Math.floor((clientHeight + margin) / height)) * numberInRow
    updatePage(page)
  }

  onSectionRendered = (onRowsRendered: Function) => ({ indices }: Object) => {
    onRowsRendered({
      startIndex: indices[0],
      stopIndex: indices[indices.length - 1],
    })
  }

  cellSizeAndPositionGetter = ({ index }: Object) => {
    const { width, height } = this.iconDimensions
    const numberInRow = Math.floor(this.props.width / width)
    const x = (index % numberInRow) * width
    const y = Math.floor((index * width) / (numberInRow * width)) * height
    return { height, width, x, y }
  }

  render() {
    const { itemCount, onRowsRendered, renderItem, updatePage, renderNoResults, ...props } = this.props
    return (
      <Collection
        noContentRenderer={renderNoResults}
        onSectionRendered={this.onSectionRendered(onRowsRendered)}
        onScroll={this.onScrollImage(updatePage)}
        cellRenderer={renderItem}
        cellSizeAndPositionGetter={this.cellSizeAndPositionGetter}
        cellCount={itemCount}
        {...props}
      />
    )
  }
}
