// @flow
import React from 'react'
import { AutoSizer, InfiniteLoader, List, Collection } from 'react-virtualized'
import { PropTypes } from 'prop-types'
import _ from 'lodash'

type Props = {
  noResultsMessage: string,
  renderItem: Function,
  getVariables: Function,
  data: Object,
  updatePage: Function,
  view: string,
}

export default class ObjectList extends React.Component<Props> {
  static propTypes = {
    noResultsMessage: PropTypes.string.isRequired,
    renderItem: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    updatePage: PropTypes.func.isRequired,
    view: PropTypes.string.isRequired,
    getVariables: PropTypes.func.isRequired,
  }

  /**
   * Dimension of poster of photo in view=icon
   * TODO: calculate it automatically
   * @type {{width: number, height: number}}
   */
  iconDimensions: Object = { width: 180, height: 280 }

  /**
   * Height of small preview
   * @type {number}
   */
  rowHeight: number = 80

  /**
   * Check if data loaded and populated
   * @returns {boolean}
   */
  get loaded(): boolean {
    return !this.props.data.loading && this.props.data.list
  }

  /**
   * Are there more items to load? (This information comes from the most recent API request.)
   */
  get hasNextPage(): boolean {
    return this.loaded ? this.props.data.list.pageInfo.hasNextPage : true
  }

  /**
   * List of items loaded so far
   */
  get list(): Array<Object> {
    return this.loaded ? this.props.data.list.edges : []
  }

  /**
   * Only load 1 page of items at a time.
   * Pass an empty callback to InfiniteLoader in case it asks us to load more than once.
   */
  get loadMoreItems(): Function {
    return this.props.data.loading
      ? () => {
      }
      : this.props.data.loadNextPage(this.props.getVariables())
  }

  /**
   * Every row is loaded except for our loading indicator row.
   * @param index
   */
  isItemLoaded = ({ index }: Object) => !this.hasNextPage || index < this.list.length

  cellSizeAndPositionGetter = (totalWidth: number) => ({ index }: Object) => {
    const { width, height } = this.iconDimensions
    const numberInRow = Math.floor(totalWidth / width)
    const x = (index % numberInRow) * width
    const y = Math.floor((index * width) / (numberInRow * width)) * height
    return { height, width, x, y }
  }

  onScrollList = ({ clientHeight, scrollTop }: Object) => {
    const margin = 20
    const page = Math.ceil(scrollTop / this.rowHeight) + Math.floor((clientHeight + margin)
      / this.rowHeight)
    this.props.updatePage(page)
  }

  onScrollIcon = ({ clientWidth, clientHeight, scrollTop }: Object) => {
    const margin = 20
    const { width, height } = this.iconDimensions
    const numberInRow = Math.floor(clientWidth / width)
    const page = (Math.ceil(scrollTop / height) + Math.floor((clientHeight + margin) / height)) * numberInRow
    this.props.updatePage(page)
  }

  onSectionRendered = (onRowsRendered: Function) => ({ indices }: Object) => {
    onRowsRendered({
      startIndex: indices[0],
      stopIndex: indices[indices.length - 1],
    })
  }

  renderNoResults = () => <p>{this.props.noResultsMessage}</p>

  /**
   * Render a list item or a loading indicator.
   * @param index
   * @param key
   * @param style
   */
  renderItem = ({ index, key, style }: Object) => {
    const content = this.isItemLoaded({ index })
      ? this.props.renderItem(this.list[index])
      : 'Loading...'
    return (
      <div key={key} style={style}>
        {content}
      </div>
    )
  }

  render() {
    // If there are more items to be loaded then add an extra row to hold a loading indicator.
    const rowCount = this.hasNextPage
      ? this.list.length + 1
      : this.list.length

    return (
      <InfiniteLoader
        isRowLoaded={this.isItemLoaded}
        loadMoreRows={this.loadMoreItems}
        rowCount={rowCount}
      >
        {({ onRowsRendered, registerChild }) => (
          <AutoSizer defaultHeight={400}>
            {({ height, width }) => {
              if (this.props.view === 'icon') {
                return (
                  <Collection
                    ref={registerChild}
                    onSectionRendered={this.onSectionRendered(onRowsRendered)}
                    onScroll={this.onScrollIcon}
                    cellRenderer={this.renderItem}
                    cellSizeAndPositionGetter={this.cellSizeAndPositionGetter(width)}
                    height={height - 30}
                    width={width - 10}
                    cellCount={rowCount}
                  />
                )
              } else {
                return (
                  <List
                    ref={registerChild}
                    onRowsRendered={onRowsRendered}
                    noRowsRenderer={this.renderNoResults}
                    onScroll={this.onScrollList}
                    rowRenderer={this.renderItem}
                    height={height - 30}
                    width={width - 10}
                    rowHeight={this.rowHeight}
                    rowCount={rowCount}
                    overscanRowCount={0}
                    _forceUpdateWhenChanged={this.props.data}
                  />
                )
              }
            }}
          </AutoSizer>
        )}
      </InfiniteLoader>
    )
  }
}

export const getConfigObject = (defaults: ?Object) => ({
  options: () => ({
    variables: {
      first: 100,
      after: '',
      ...defaults,
    },
  }),
  force: true,
  props: ({ ownProps, data }: Object) => ({
    data: _.extend({}, data, {
      loadNextPage: (variables: Object) => () => data.fetchMore({
        variables: {
          ...variables,
          after: data.list.pageInfo.endCursor,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => ({
          // By returning `cursor` here, we update the `loadMore` function
          // to the new cursor.
          list: {
            totalCount: fetchMoreResult.list.totalCount,
            edges: [...previousResult.list.edges, ...fetchMoreResult.list.edges],
            pageInfo: fetchMoreResult.list.pageInfo,
          },
        }),
      }),
    }),
  }),
})
