// @flow
import React from 'react'
import { PropTypes } from 'prop-types'
import { Tag } from 'antd'
import _ from 'lodash'

import i18n from 'libs/i18n'
import type { RangeType } from 'components/ObjectListPage/YearsFilter/YearsFilter'

type Props = {
  code: string,
  list: Array<Object>,
  multiple?: boolean,
  range?: boolean,
  default: RangeType,
  filters: Object,
  setFilterState: Function,
}

export default class ActiveFilters extends React.Component<Props> {
  static defaultProps = {
    list: [],
    multiple: false,
    range: false,
    default: { min: 0, max: 0 },
  }

  static propTypes = {
    code: PropTypes.string.isRequired,
    list: PropTypes.array,
    default: PropTypes.object,
    filters: PropTypes.object.isRequired,
    setFilterState: PropTypes.func.isRequired,
    multiple: PropTypes.bool,
    range: PropTypes.bool,
  }

  get value(): any {
    return this.props.filters[this.props.code]
  }

  get active(): Array<string> {
    const active = []
    if (this.props.multiple) {
      return [...this.value]
    } else if (this.props.range) {
      if (this.value.min === this.value.max) {
        active.push(this.value.min)
      } else {
        if (this.value.min !== this.props.default.min) {
          active.push(this.value.min)
        }
        if (this.value.max !== this.props.default.max) {
          active.push(this.value.max)
        }
      }
    } else if (this.value) {
      active.push(this.value)
    }
    return active
  }

  removeFilter = (name: string, value: string) => {
    let filterValue = _.clone(this.value)
    if (this.props.multiple) {
      filterValue.delete(value)
    } else if (this.props.range) {
      if (this.value.min === this.value.max) {
        filterValue = this.props.default
      } else if (this.value.min === value) {
        filterValue.min = this.props.default.min
      } else if (this.value.max === value) {
        filterValue.max = this.props.default.max
      }
    } else {
      filterValue = null
    }
    this.props.setFilterState({ [name]: filterValue })
  }

  notFilterBy = (value: string) => () => this.removeFilter(this.props.code, value)

  getFilterName = (filter: string) => {
    if (this.props.range) {
      if (this.value.min === this.value.max) {
        return filter
      } else if (filter === this.value.min) {
        return `${filter}…`
      } else if (filter === this.value.max) {
        return `…${filter}`
      } else {
        return ''
      }
    } else {
      return this.props.list.filter(item => item.id === filter)[0][i18n.f('name')]
    }
  }

  render(): Array<React.Fragment> {
    return this.active.map(filter => (
      <Tag key={filter} onClose={this.notFilterBy(filter)} onClick={this.notFilterBy(filter)} closable>
        {this.getFilterName(filter)}
      </Tag>
    ))
  }
}
