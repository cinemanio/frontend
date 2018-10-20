// @flow
import React from 'react'
import { PropTypes } from 'prop-types'
import { Tag } from 'antd';

import i18n from 'libs/i18n'

type Props = {
  code: string,
  list: Array<Object>,
  multiple?: boolean,
  filters: Object,
  setFilterState: Function,
}

export default class ActiveFilters extends React.Component<Props> {
  static defaultProps = {
    list: [],
    multiple: false,
  }

  static propTypes = {
    code: PropTypes.string.isRequired,
    list: PropTypes.array,
    filters: PropTypes.object.isRequired,
    setFilterState: PropTypes.func.isRequired,
    multiple: PropTypes.bool,
  }

  get active(): Array<string> {
    const value = this.props.filters[this.props.code]
    if (this.props.multiple) {
      return [...value]
    } else if (value) {
      return [value]
    } else {
      return []
    }
  }

  removeFilter = (name: string, value: string) => {
    let filterValue = ''
    if (this.props.multiple) {
      const filter = this.props.filters[name]
      filter.delete(value)
      filterValue = filter
    }
    this.props.setFilterState({ [name]: filterValue })
  }

  notFilterBy = (value: string) => () => this.removeFilter(this.props.code, value)

  getFilterName = (filter: string) => this.props.list.filter(item => item.id === filter)[0][i18n.f('name')]

  render(): Array<React.Fragment> {
    return this.active.map((filter: string) => (
      <Tag key={filter} onClose={this.notFilterBy(filter)} onClick={this.notFilterBy(filter)} closable>
        {this.getFilterName(filter)}
      </Tag>
    ))
  }
}
