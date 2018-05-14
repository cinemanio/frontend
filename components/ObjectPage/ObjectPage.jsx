// @flow
import React from 'react'
import Loader from 'react-loader'
import { Helmet } from 'react-helmet'
import { PropTypes } from 'prop-types'
import _ from 'lodash'

import Error404 from 'components/errors/Error404'

import './ObjectPage.scss'

type Props = {
  object?: Object,
  renderLayout: Function,
  getTitle?: Function,
}

// eslint-disable-next-line react/prefer-stateless-function
export default class ObjectPage extends React.Component<Props> {
  static defaultProps = {
    object: undefined,
    getTitle: undefined
  }

  static propTypes = {
    object: PropTypes.object,
    getTitle: PropTypes.func,
    renderLayout: PropTypes.func.isRequired
  }

  render() {
    if (_.isNull(this.props.object)) {
      return <Error404/>
    } else if (_.isUndefined(this.props.object)) {
      return <Loader/>
    } else {
      return (
        <div>
          {!this.props.getTitle ? '' : (
            <Helmet>
              <title>{this.props.getTitle(this.props.object)}</title>
            </Helmet>
          )}
          {this.props.renderLayout(this.props.object)}
        </div>
      )
    }
  }
}
