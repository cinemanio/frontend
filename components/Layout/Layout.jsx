// @flow
import React from 'react'
import Helmet from 'react-helmet'
import { Link } from 'react-router-named-routes'
import { PropTypes } from 'prop-types'

import './Layout.scss'

type Props = { children: Object }

export default class Layout extends React.PureComponent<Props> {
  static propTypes = {
    children: PropTypes.node.isRequired
  }

  render() {
    return (
      <div className="container">
        <Helmet
          htmlAttributes={{ lang: 'en' }}
          defaultTitle="cineman.io"
        >
          <script type="text/javascript" src="http://localhost:3001/public/app.bundle.js" async crossOrigin/>
          <link rel="stylesheet" type="text/css" href="http://localhost:3001/public/app.bundle.css"/>
          <link rel="icon" type="image/ico" href="/public/favicon.ico"/>
        </Helmet>
        <header><Link to="index">cineman.io</Link></header>
        <div styleName="container">
          {this.props.children}
        </div>
      </div>
    )
  }
}
