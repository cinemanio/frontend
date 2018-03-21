// @flow
import React from 'react'
import Loader from 'react-loader'
import { PropTypes } from 'prop-types'
import _ from 'lodash'

import Menu from 'components/Menu/Menu'
import Error404 from 'components/errors/Error404'

import './ObjectPage.scss'

type Props = {
  object: ?Object,
  renderLayout: Function,
  type: string,
}

export default class ObjectPage extends React.Component<Props> {
  static defaultProps = {
    object: undefined
  }

  static propTypes = {
    object: PropTypes.object,
    renderLayout: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired
  }

  renderContent() {
    if (_.isNull(this.props.object)) {
      if (this.context.router) {
        this.context.router.routes[1].status = 404
      }
      return <Error404/>
    } else if (_.isUndefined(this.props.object)) {
      return <Loader/>
    } else {
      return this.props.renderLayout(this.props.object)
    }
  }

  render() {
    return (
      <div>
        <Menu active={this.props.type} link/>
        {this.renderContent()}
      </div>
    )
  }
}
