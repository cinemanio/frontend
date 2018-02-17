// @flow
import 'core-js/es6/map';
import 'core-js/es6/set';
import React from 'react'
import ReactDOM from 'react-dom'

import ClientApp from './ClientApp'

const target = document.getElementById('react-container')
if (target) {
  // $FlowFixMe until https://github.com/facebook/flow/issues/5035 resoled
  ReactDOM.hydrate(<ClientApp/>, target)
}
