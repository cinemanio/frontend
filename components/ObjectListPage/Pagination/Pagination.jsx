// @flow
import React from 'react'
import { PropTypes } from 'prop-types'

import './Pagination.scss'

type Props = {
  data: Object,
  page: number,
}

export default class Pagination extends React.PureComponent<Props> {
  static propTypes = {
    data: PropTypes.object.isRequired,
    page: PropTypes.number.isRequired,
  }

  render() {
    return this.props.data.loading || !this.props.data.list ? null : (
      <span styleName="box">
        {this.props.page} / {this.props.data.list.totalCount}
      </span>
    )
  }
}
