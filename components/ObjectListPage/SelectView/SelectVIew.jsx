// @flow
import React from 'react'
import { PropTypes } from 'prop-types'

type Props = {
  list: Array<Object>,
  setFilterState: Function,
}

export default class SelectView extends React.PureComponent<Props> {
  static defaultProps = {
    list: []
  }

  static propTypes = {
    setFilterState: PropTypes.func.isRequired,
    list: PropTypes.array
  }

  change = (e: SyntheticEvent<HTMLSelectElement>) => {
    this.props.setFilterState({ view: e.currentTarget.value })
  }

  renderOptions() {
    return this.props.list.map(item => <option key={item.id} value={item.id}>{item.name}</option>)
  }

  render() {
    return (
      // eslint-disable-next-line jsx-a11y/no-onchange
      <select name="view" onChange={this.change}>
        {this.renderOptions()}
      </select>
    )
  }
}
