// @flow
import React from 'react'
import Loader from 'react-loader'
import { PropTypes } from 'prop-types'
import _ from 'lodash'

import Error404 from 'components/errors/Error404'

import './ObjectPage.scss'

type Props = {
  object: ?Object,
  renderLayout: Function,
}

export default class ObjectPage extends React.Component<Props> {
  static defaultProps = {
    object: undefined
  }

  static propTypes = {
    object: PropTypes.object,
    renderLayout: PropTypes.func.isRequired,
  }

  render() {
    if (_.isNull(this.props.object)) {
      return <Error404/>
    } else if (_.isUndefined(this.props.object)) {
      return <Loader/>
    } else {
      return this.props.renderLayout(this.props.object)
    }
  }
}
