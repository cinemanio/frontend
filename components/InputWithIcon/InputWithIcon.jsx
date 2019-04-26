// @flow
import React from 'react'
import { PropTypes } from 'prop-types'
import { Icon, Input } from 'antd'

import './InputWithIcon.scss'

type Props = { iconType: string }

export default class InputWithIcon extends React.PureComponent<Props> {
  static propTypes = {
    iconType: PropTypes.string.isRequired,
  }

  render() {
    const { iconType, ...props } = this.props
    return <Input prefix={<Icon type={iconType} styleName="icon" />} {...props} />
  }
}
