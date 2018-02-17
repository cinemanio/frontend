/* eslint-disable no-param-reassign */
const path = require('path')
const webpack = require('webpack')
// const BundleTracker = require('webpack-bundle-tracker')

const config = require('./webpack.base.config.js')

// Use webpack dev server
config.entry.app = [
  'webpack/hot/only-dev-server',
  'react-hot-loader/patch',
  path.resolve('client/index.jsx')
]

// override django's STATIC_URL for webpack bundles
// config.output.publicPath = `http://${proxyHost}/assets/bundles/`

// Add HotModuleReplacementPlugin and BundleTracker plugins
config.plugins.push(
  // new BundleTracker({ filename: './webpack-stats.json' }),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoEmitOnErrorsPlugin() // don't reload if there is an error
)

// Configure SCSS: add sourceMap to all loaders
const extractSass = config.plugins[0]
const extractSassConfig = config.module.rules[1].use
extractSassConfig.use.forEach((loader) => {
  if (!loader.options) {
    loader.options = {}
  }
  loader.options.sourceMap = true
})
config.module.rules[1].use = extractSass.extract(extractSassConfig)
config.devtool = 'source-map'

module.exports = config
