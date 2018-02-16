// @flow
import React from 'react'
import Helmet from 'react-helmet'

// import './Layout.scss';

export default class MainLayout extends React.Component {
  render() {
    const { children } = this.props
    return (
      <div className="container">
        <Helmet
          htmlAttributes={{ lang: 'en' }}
          defaultTitle="cineman.io"
          script={[
            { src: '/public/app.bundle.js', async: true },
          ]}
        />
        {children}
      </div>
    )
  }
}