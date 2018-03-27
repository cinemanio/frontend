// @flow
import React from 'react'
import RedBox from 'redbox-react'
import { Route, Link } from 'react-router-dom'
import { PropTypes } from 'prop-types'

import './Layout.scss'

type Props = { component: Function }
type State = { error: ?Error }

export default class Layout extends React.Component<Props, State> {
  static propTypes = {
    component: PropTypes.func.isRequired
  }

  constructor(props: Object) {
    super(props)
    this.state = { error: null }
  }

  componentDidCatch(error: Error) {
    this.setState({ error })
  }

  render() {
    const { component: Component, ...rest } = this.props
    return (
      <Route {...rest} render={matchProps => (
        <div className="container">
          <header><Link to="/">cineman.io</Link></header>
          <div styleName="container">
            {this.state.error
              ? <RedBox error={this.state.error}/>
              : <Component {...matchProps} />}
          </div>
        </div>
      )}/>
    )
  }
}
