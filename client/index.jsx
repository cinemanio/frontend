// @flow
import 'core-js/es6/map'
import 'core-js/es6/set'
import React from 'react'
import ReactDOM from 'react-dom'

import ClientApp from './ClientApp'
import '../images/favicon.ico'

const target = document.getElementById('react-container')
if (target) {
  // $FlowFixMe wait until https://github.com/facebook/flow/issues/5035 resolved
  ReactDOM.hydrate(<ClientApp/>, target)
}
