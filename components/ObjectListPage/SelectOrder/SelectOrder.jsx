// @flow
import React from 'react'
import { PropTypes } from 'prop-types'

type Props = {
  list: Array<Object>,
  setFilterState: Function,
  t: Function,
}

export default class SelectOrder extends React.PureComponent<Props> {
  static defaultProps = {
    list: [],
  }

  static propTypes = {
    setFilterState: PropTypes.func.isRequired,
    list: PropTypes.array,
    t: PropTypes.func.isRequired,
  }

  change = (e: SyntheticEvent<HTMLSelectElement>) => {
    this.props.setFilterState({ orderBy: e.currentTarget.value })
  }

  renderOptions() {
    return this.props.list.map(item => <option key={item.id} value={item.id}>{item.name}</option>)
  }

  render() {
    return (
      <div>
        {this.props.t('filter.order.name')}
        {/* eslint-disable-next-line jsx-a11y/no-onchange */}
        <select name="orderBy" onChange={this.change}>
          {this.renderOptions()}
        </select>
      </div>
    )
  }
}
