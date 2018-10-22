// @flow
import React from 'react'
import { PropTypes } from 'prop-types'
import { Select } from 'antd'

const { Option } = Select

type Props = {
  list: Array<Object>,
  setFilterState: Function,
  filters: Object,
  code: string,
}

export default class SelectGeneric extends React.PureComponent<Props> {
  static propTypes = {
    setFilterState: PropTypes.func.isRequired,
    list: PropTypes.array.isRequired,
    filters: PropTypes.object.isRequired,
    code: PropTypes.string.isRequired,
  }

  change = (value: string) => this.props.setFilterState({ [this.props.code]: value })

  renderOptions() {
    return this.props.list.map(item => (
      <Option key={item.id} value={item.id}>
        {item.name}
      </Option>
    ))
  }

  render() {
    return (
      <Select name={this.props.code} onChange={this.change} value={this.props.filters[this.props.code]}>
        {this.renderOptions()}
      </Select>
    )
  }
}
