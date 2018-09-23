// @flow
/* eslint-disable jsx-a11y/no-onchange */
import React from 'react'
import { PropTypes } from 'prop-types'

type Props = {
  list: Array<Object>,
  setFilterState: Function,
  code: string,
}

export default class SelectGeneric extends React.PureComponent<Props> {
  static propTypes = {
    setFilterState: PropTypes.func.isRequired,
    list: PropTypes.array.isRequired,
    code: PropTypes.string.isRequired,
  }

  change = (e: SyntheticEvent<HTMLSelectElement>) => {
    this.props.setFilterState({ [this.props.code]: e.currentTarget.value })
  }

  renderOptions() {
    return this.props.list.map(item => <option key={item.id} value={item.id}>{item.name}</option>)
  }

  render() {
    return (
      <select name={this.props.code} onChange={this.change}>
        {this.renderOptions()}
      </select>
    )
  }
}
