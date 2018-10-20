// @flow
import React from 'react'
import { PropTypes } from 'prop-types'
import { Select } from 'antd'

import i18n from 'libs/i18n'

import './SelectFilter.scss'

const { Option } = Select

type Props = {
  code: string,
  title: string,
  list: Array<Object>,
  multiple?: boolean,
  filters: Object,
  setFilterState: Function,
}

export default class SelectFilter extends React.Component<Props> {
  static defaultProps = {
    list: [],
    multiple: false,
  }

  static propTypes = {
    code: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    filters: PropTypes.object.isRequired,
    setFilterState: PropTypes.func.isRequired,
    list: PropTypes.array,
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

  setFilter = (name: string, value: string) => {
    let filterValue = value
    if (this.props.multiple) {
      const filter = this.props.filters[name]
      filter.add(value)
      filterValue = filter
    }
    this.props.setFilterState({ [name]: filterValue })
  }

  filterBy = (value: string) => this.setFilter(this.props.code, value)

  renderOption(item: Object) {
    return this.props.multiple && this.active.indexOf(item.id) !== -1 ? null : (
      <Option key={item.id} value={item.id}>
        {item[i18n.f('name')]}
      </Option>
    )
  }

  render() {
    const value = this.props.multiple ? undefined : this.props.filters[this.props.code] || undefined
    return (
      <Select
        name={this.props.code}
        onChange={this.filterBy}
        value={value}
        defaultValue={value}
        placeholder={this.props.title}
      >
        {this.props.list.map((item: Object) => this.renderOption(item))}
      </Select>
    )
  }
}
