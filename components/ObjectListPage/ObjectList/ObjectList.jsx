// @flow
import React from 'react'
import { AutoSizer, InfiniteLoader, List } from 'react-virtualized'
import { PropTypes } from 'prop-types'
import _ from 'lodash'

type Props = {
  noResultsMessage: string,
  renderItem: Function,
  data: Object,
  onScroll?: Function,
  rowHeight: number,
}

export default class ObjectList extends React.Component<Props> {
  static defaultProps = {
    onScroll: () => {
    }
  }

  static propTypes = {
    noResultsMessage: PropTypes.string.isRequired,
    renderItem: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    onScroll: PropTypes.func,
    rowHeight: PropTypes.number.isRequired
  }

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
      : this.props.data.loadNextPage
  }

  /**
   * Every row is loaded except for our loading indicator row.
   * @param index
   */
  isItemLoaded = ({ index }: Object) => !this.hasNextPage || index < this.list.length

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
            {({ height, width }) => (
              <List
                ref={registerChild}
                onRowsRendered={onRowsRendered}
                noRowsRenderer={this.renderNoResults}
                onScroll={this.props.onScroll}
                rowRenderer={this.renderItem}
                height={height - 30}
                width={width - 10}
                rowHeight={this.props.rowHeight}
                rowCount={rowCount}
                overscanRowCount={0}
                _forceUpdateWhenChanged={this.props.data}
              />
            )}
          </AutoSizer>
        )}
      </InfiniteLoader>
    )
  }
}

export const getConfigObject = (vars: ?Object) => ({
  options: () => ({
    // $FlowFixMe
    variables: {
      first: 100,
      after: '',
      ...vars,
    }
  }),
  force: true,
  props: ({ ownProps, data }: Object) => ({
    data: _.extend({}, data, {
      loadNextPage: () => data.fetchMore({
        variables: {
          after: data.list.pageInfo.endCursor
        },
        updateQuery: (previousResult, { fetchMoreResult }) => ({
          // By returning `cursor` here, we update the `loadMore` function
          // to the new cursor.
          list: {
            totalCount: fetchMoreResult.list.totalCount,
            edges: [...previousResult.list.edges, ...fetchMoreResult.list.edges],
            pageInfo: fetchMoreResult.list.pageInfo
          }
        })
      })
    })
  })
})
