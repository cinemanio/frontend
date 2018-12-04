// @flow
import 'core-js/es6/map'
import 'core-js/es6/set'
import React from 'react'
import ReactDOM from 'react-dom'

import ClientApp from './ClientApp'
import '../images/favicon.ico'

const target = document.getElementById('react-container')
if (target) {
  ReactDOM.hydrate(<ClientApp />, target)
}
