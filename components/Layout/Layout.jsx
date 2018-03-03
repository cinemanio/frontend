// @flow
import React from 'react'
import Helmet from 'react-helmet'
import RedBox from 'redbox-react'
import { Link } from 'react-router-named-routes'
import { PropTypes } from 'prop-types'

import './Layout.scss'

type Props = { children: Object }
type State = { error: ?Error }

export default class Layout extends React.PureComponent<Props, State> {
  static propTypes = {
    children: PropTypes.node.isRequired
  }

  constructor(props: Object) {
    super(props)
    this.state = { error: null }
  }

  componentDidCatch(error: Error) {
    this.setState({ error })
  }

  render() {
    return (
      <div className="container">
        <Helmet
          htmlAttributes={{ lang: 'en' }}
          defaultTitle="cineman.io"
        >
          <script type="text/javascript" src="/public/app.js" async crossOrigin/>
          <link rel="stylesheet" type="text/css" href="/public/app.css"/>
          <link rel="icon" type="image/ico" href="/public/favicon.ico"/>
        </Helmet>
        <header><Link to="index">cineman.io</Link></header>
        <div styleName="container">
          {this.state.error
            ? <RedBox error={this.state.error}/>
            : this.props.children}
        </div>
      </div>
    )
  }
}
