// @flow
import 'core-js/es6/map'
import 'core-js/es6/set'
import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import Redbox from 'redbox-react'

import ClientApp from './ClientApp'
import '../images/favicon.ico'

const target = document.getElementById('react-container')
if (target) {
  // $FlowFixMe wait until https://github.com/facebook/flow/issues/5035 resolved
  ReactDOM.hydrate(
    <AppContainer errorReporter={Redbox}>
      <ClientApp/>
    </AppContainer>,
    target
  )
}

// Webpack Hot Module Replacement API
if (module.hot) {
  module.hot.accept()
}
