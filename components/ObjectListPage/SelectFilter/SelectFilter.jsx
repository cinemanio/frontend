// @flow
import React from 'react'
import { PropTypes } from 'prop-types'

import i18n from 'libs/i18n'

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
    multiple: false
  }

  static propTypes = {
    code: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    filters: PropTypes.object.isRequired,
    setFilterState: PropTypes.func.isRequired,
    list: PropTypes.array.isRequired,
    multiple: PropTypes.bool
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

  filterBy = (e: SyntheticEvent<HTMLSelectElement>) => {
    this.setFilter(this.props.code, e.currentTarget.value)
    e.currentTarget.value = ''
  }

  renderOption(item: Object) {
    return this.active.indexOf(item.id) !== -1 ? ''
      : <option key={item.id} value={item.id}>{item[i18n.f('name')]}</option>
  }

  render() {
    return (!this.props.multiple && this.active.length > 0) ? '' : (
      // eslint-disable-next-line jsx-a11y/no-onchange
      <select name={this.props.code} onChange={this.filterBy}>
        <option value="">{this.props.title}</option>
        {this.props.list.map((item: Object) => this.renderOption(item))}
      </select>
    )
  }
}
