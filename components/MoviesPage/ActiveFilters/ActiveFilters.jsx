// @flow
import React from 'react'
import { PropTypes } from 'prop-types'

import './ActiveFilters.scss'

type Props = {
  code: string,
  removeFilter: Function,
  list: Array<Object>,
  active: Array<string>,
}

export default class ActiveFilters extends React.PureComponent<Props> {
  static defaultProps = {
    list: []
  }

  static propTypes = {
    code: PropTypes.string.isRequired,
    removeFilter: PropTypes.func.isRequired,
    list: PropTypes.array,
    active: PropTypes.array.isRequired
  }

  removeFilter = (value: string) => () => {
    this.props.removeFilter(this.props.code, value)
  }

  getFilterName(filter: string) {
    return this.props.list.filter(item => item.id === filter)[0].name
  }

  render() {
    return this.props.active.map((filter: string) =>
      <span key={filter} styleName="box" onClick={this.removeFilter(filter)}>{this.getFilterName(filter)}<i/></span>)
  }
}

