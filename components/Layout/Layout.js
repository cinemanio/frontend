// @flow
import React from 'react'
import Helmet from 'react-helmet'

export default class MainLayout extends React.Component {
  render() {
    const { children } = this.props
    return (
      <div className="container" styleName="container">
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