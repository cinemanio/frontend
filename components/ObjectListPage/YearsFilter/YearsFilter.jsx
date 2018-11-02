// @flow
/* eslint-disable react/no-unused-state */
import React from 'react'
import { PropTypes } from 'prop-types'
import { Slider } from 'antd'

import './YearsFilter.scss'

export type RangeType = { min: number, max: number }

type Props = {
  code: string,
  filters: Object,
  title: string,
  setFilterState: Function,
  defaultRange: RangeType,
}

type State = {
  value: Array<number>,
  moving: boolean,
}

export default class YearsFilter extends React.Component<Props, State> {
  static propTypes = {
    code: PropTypes.string.isRequired,
    filters: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    setFilterState: PropTypes.func.isRequired,
    defaultRange: PropTypes.object.isRequired,
  }

  state = {
    value: [this.props.filters[this.props.code].min, this.props.filters[this.props.code].max],
    moving: false,
  }

  /**
   * Update slider's range, when we remove filtration
   */
  static getDerivedStateFromProps(props: Object, state: Object) {
    const value = props.filters[props.code]
    if (value !== state.value && !state.moving) {
      return { value: [value.min, value.max] }
    } else {
      return null
    }
  }

  onChange = (value: Array<number>) => this.setState({ value, moving: true })

  onAfterChange = (value: Array<number>) => {
    const name = this.props.code
    this.setState({ moving: false })
    this.props.setFilterState({ [name]: { min: value[0], max: value[1] } })
  }

  render() {
    const { min, max } = this.props.defaultRange
    return (
      <div styleName="box">
        <div styleName="title">{this.props.title}</div>
        <Slider
          max={max}
          min={min}
          defaultValue={[min, max]}
          value={this.state.value}
          onChange={this.onChange}
          onAfterChange={this.onAfterChange}
          styleName="slider"
          range
        />
      </div>
    )
  }
}
