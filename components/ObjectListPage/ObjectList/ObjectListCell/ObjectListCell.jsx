// @flow
import React from 'react'
import { Collection } from 'react-virtualized'
import { PropTypes } from 'prop-types'

import './ObjectListCell.scss'

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

  // TODO: change when fixed https://github.com/facebook/react/issues/12553
  collection: { current: any }

  constructor(props: Object) {
    super(props)
    this.collection = React.createRef()
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize)
  }

  iconsInRow: number = 4

  ratio: number = 0.7

  resize = () => this.collection.current.recomputeCellSizesAndPositions()

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
    const { height } = this.iconDimensions
    const page = (Math.ceil(scrollTop / height) + Math.floor(clientHeight / height)) * this.iconsInRow
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
    const x = (index % this.iconsInRow) * width
    const y = Math.floor((index * width) / (this.iconsInRow * width)) * height
    return { height, width, x, y }
  }

  render() {
    const { itemCount, onRowsRendered, renderItem, updatePage, renderNoResults, ...props } = this.props
    return (
      <Collection
        ref={this.collection}
        noContentRenderer={renderNoResults}
        onSectionRendered={this.onSectionRendered(onRowsRendered)}
        onScroll={this.onScrollImage(updatePage)}
        cellRenderer={renderItem}
        cellSizeAndPositionGetter={this.cellSizeAndPositionGetter}
        cellCount={itemCount}
        verticalOverscanSize={10}
        {...props}
      />
    )
  }
}
