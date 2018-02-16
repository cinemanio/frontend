require('babel-register')({
  presets: ['react'],
})
// require('babel-polyfill')
require('isomorphic-fetch')  // polyfill for apollo
require('./server')
