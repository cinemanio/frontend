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

export default class ObjectListCell extends React.Component<Props> {
  static propTypes = {
    itemCount: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    onRowsRendered: PropTypes.func.isRequired,
    renderNoResults: PropTypes.func.isRequired,
    renderItem: PropTypes.func.isRequired,
    updatePage: PropTypes.func.isRequired,
  }

  iconsInRow: number = 4

  ratio: float = 0.7

  /**
   * Dimension of poster of photo in view=icon
   * @type {{width: number, height: number}}
   */
  get iconDimensions() {
    const width = Math.floor(this.props.width / this.iconsInRow)
    const height = Math.floor(width / this.ratio)
    return { width, height }
  }

  onScrollImage = (updatePage: Function) => ({ clientWidth, clientHeight, scrollTop }: Object) => {
    const { width, height } = this.iconDimensions
    const numberInRow = Math.floor(clientWidth / width)
    const page = (Math.ceil(scrollTop / height) + Math.floor(clientHeight / height)) * numberInRow
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
