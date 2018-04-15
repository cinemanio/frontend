// @flow
import React from 'react'
import { PropTypes } from 'prop-types'

type Props = {
  code: string,
  title: string,
  setFilter: Function,
  list: Array<Object>,
  active: Array<string>,
  multiple: boolean,
}

export default class SelectFilter extends React.PureComponent<Props> {
  static defaultProps = {
    list: [],
    multiple: false
  }

  static propTypes = {
    code: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    setFilter: PropTypes.func.isRequired,
    list: PropTypes.array,
    active: PropTypes.array.isRequired,
    multiple: PropTypes.bool
  }

  filterBy = (e: SyntheticEvent<HTMLSelectElement>) => {
    this.props.setFilter(this.props.code, e.currentTarget.value)
    e.currentTarget.value = ''
  }

  renderOption(item: Object) {
    return this.props.active.indexOf(item.id) !== -1 ? ''
      : <option key={item.id} value={item.id}>{item.name}</option>
  }

  render() {
    return (!this.props.multiple && this.props.active.length > 0) ? '' : (
      // eslint-disable-next-line jsx-a11y/no-onchange
      <select name={this.props.code} onChange={this.filterBy}>
        <option value="">{this.props.title}</option>
        {this.props.list.map((item: Object) => this.renderOption(item))}
      </select>
    )
  }
}
