// @flow
/* eslint-disable react/no-unused-state */
import React from 'react'
import { PropTypes } from 'prop-types'
import { Col, InputNumber, Row, Slider } from 'antd'
import _ from 'lodash'

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
  min: number,
  max: number,
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
    min: this.props.filters[this.props.code].min,
    max: this.props.filters[this.props.code].max,
    moving: false,
  }

  /**
   * Update slider's range, when we remove filtration
   */
  static getDerivedStateFromProps(props: Object, state: Object) {
    const { min, max } = props.filters[props.code]
    if (min !== state.min && !state.moving) {
      return { min }
    } else if (max !== state.max && !state.moving) {
      return { max }
    } else {
      return null
    }
  }

  changeRange = (value: Array<number>) => this.setState({ min: value[0], max: value[1], moving: true })

  changeMin = (value: number) => {
    // eslint-disable-next-line eqeqeq
    if (parseInt(value, 10) == value) {
      this.setState({ min: value, moving: true })
    }
  }

  changeMax = (value: number) => {
    // eslint-disable-next-line eqeqeq
    if (parseInt(value, 10) == value) {
      this.setState({ max: value, moving: true })
    }
  }

  onAfterChange = (value: Array<number>) => {
    const name = this.props.code
    this.setState({ moving: false })
    this.props.setFilterState({ [name]: { min: value[0], max: value[1] } })
  }

  onBlurMin = (e: Event) =>
    this.onAfterChange([parseInt(e.target.value, 10) || this.props.defaultRange.min, this.state.max])

  onBlurMax = (e: Event) =>
    this.onAfterChange([this.state.min, parseInt(e.target.value, 10) || this.props.defaultRange.max])

  render() {
    const { min, max } = this.props.defaultRange
    return (
      <div styleName="box">
        <div styleName="title">{this.props.title}</div>
        <Row styleName="values">
          <Col span={10}>
            <InputNumber
              size="small"
              min={min}
              max={_.min([max, this.props.filters[this.props.code].max])}
              maxLength={4}
              value={this.state.min}
              onChange={this.changeMin}
              onBlur={this.onBlurMin}
            />
          </Col>
          <Col span={4} styleName="dots">
            …
          </Col>
          <Col span={10}>
            <InputNumber
              size="small"
              min={_.max([min, this.props.filters[this.props.code].min])}
              max={max}
              maxLength={4}
              value={this.state.max}
              onChange={this.changeMax}
              onBlur={this.onBlurMax}
            />
          </Col>
        </Row>
        <Slider
          max={max}
          min={min}
          defaultValue={[min, max]}
          value={[this.state.min, this.state.max]}
          onChange={this.changeRange}
          onAfterChange={this.onAfterChange}
          styleName="slider"
          range
        />
      </div>
    )
  }
}
