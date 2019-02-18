// @flow
import React from 'react'
import { AutoSizer, InfiniteLoader } from 'react-virtualized'
import { PropTypes } from 'prop-types'
import _ from 'lodash'

import './ObjectList.scss'
import ObjectListCell from './ObjectListCell/ObjectListCell'
import ObjectListRow from './ObjectListRow/ObjectListRow'

export type Props = {
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
    return this.props.data.loading ? () => {} : this.props.data.loadNextPage(this.props.getVariables())
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
    const content = this.isItemLoaded({ index }) ? this.props.renderItem(this.list[index]) : 'Loading...'
    return (
      <div key={key} style={style}>
        {content}
      </div>
    )
  }

  renderListItem(itemCount: number, onRowsRendered: Function, registerChild: Function, height: number, width: number) {
    const props = {
      itemCount,
      onRowsRendered,
      renderNoResults: this.renderNoResults,
      ref: registerChild,
      height: height - 30,
      width,
      renderItem: this.renderItem,
      updatePage: this.props.updatePage,
    }
    if (this.props.view === 'image') {
      return <ObjectListCell {...props} />
    } else {
      return <ObjectListRow data={this.props.data} {...props} />
    }
  }

  render() {
    // If there are more items to be loaded then add an extra row to hold a loading indicator.
    const itemCount = this.hasNextPage ? this.list.length + 1 : this.list.length

    return (
      <InfiniteLoader isRowLoaded={this.isItemLoaded} loadMoreRows={this.loadMoreItems} rowCount={itemCount}>
        {({ onRowsRendered, registerChild }) => (
          <AutoSizer defaultHeight={400}>
            {({ height, width }) => this.renderListItem(itemCount, onRowsRendered, registerChild, height, width)}
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
      loadNextPage: (variables: Object) => () =>
        data.fetchMore({
          variables: {
            ...variables,
            after: data.list.pageInfo.endCursor,
          },
          updateQuery: (previousResult, { fetchMoreResult }) => ({
            // By returning `cursor` here, we update the `loadMore` function
            // to the new cursor.
            list: {
              ...fetchMoreResult.list,
              edges: [...previousResult.list.edges, ...fetchMoreResult.list.edges],
            },
          }),
        }),
    }),
  }),
})
